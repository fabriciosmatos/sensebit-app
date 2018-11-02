import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Sensores } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-sensor-detail',
  templateUrl: 'sensor-detail.html'
})
export class SensorDetailPage {
  sensor: any;

  constructor(public navCtrl: NavController, navParams: NavParams, sensores: Sensores) {
    this.sensor = navParams.get('sensor');
    console.log(this.sensor);
  }

  

}
