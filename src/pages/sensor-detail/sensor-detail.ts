
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';

import { LogSensor } from './../../models/logSensor';
import { Sensores } from './../../providers/sensores/sensores';

@IonicPage()
@Component({
  selector: 'page-sensor-detail',
  templateUrl: 'sensor-detail.html'
})
export class SensorDetailPage {
  sensor: any;
  currentLogSensor: LogSensor[];
  timerAtualiza: number = 0;

  constructor(public navCtrl: NavController, navParams: NavParams, public sensores: Sensores) {
    this.sensor = navParams.get('sensor');
    sensores.getLastLogs(this.sensor, (resp)=>{
      this.currentLogSensor = resp;
    });
    this.timerAtualiza = setInterval(() => {
      sensores.getLastLogs(this.sensor, (resp)=>{
        this.currentLogSensor = resp;
      });
    },10000);
  }

  ionViewWillLeave(){
    clearInterval(this.timerAtualiza);
  }

  resetSensor(){
    this.sensores.resetSensor(this.sensor);
  }
}
