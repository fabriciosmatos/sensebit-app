
import { FormGroup} from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { Sensor } from './../../models/sensor';
import { Regra } from './../../models/regra';
import { Sensores } from './../../providers/sensores/sensores';
import { Regras } from './../../providers/regras/regras';

@IonicPage()
@Component({
  selector: 'page-regra-create',
  templateUrl: 'regra-create.html',
})
export class RegraCreatePage {
  isReadyToSave: boolean;
  form: FormGroup;
  currentSensor: Sensor[];
  regra: Regra = new Regra();

  constructor(public navCtrl: NavController
                , public navParams: NavParams
                , public viewCtrl: ViewController
                , public sensores: Sensores
                , public regras: Regras) {
    this.sensores.getAllSensores((resp) => {
      this.currentSensor = resp;
    });
  }

  ionViewDidLoad() {
  }

  inverteBoolean(variavel: string){
    if(variavel = ''){

    }
  }

    /**
   * O usuário cancelou, então descartamos sem enviar os dados de volta.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * O usuário está pronto e quer criar o item, então devolva-o ao apresentador.
   */
  done() {
    this.navCtrl.pop();
  }

  add() {
    this.regra.sensorId = this.regra.sensor.id;
    this.regras.add(this.regra).subscribe((resp) => {
      this.viewCtrl.dismiss(this.regra);
    }, (err) => {
      console.log(err);
    });
  }
}
