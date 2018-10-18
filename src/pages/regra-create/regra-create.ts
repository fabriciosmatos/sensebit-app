import { FormGroup} from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { Sensor } from './../../models/sensor';
import { Regra } from './../../models/regra';
import { Sensores } from './../../providers/sensores/sensores';

@IonicPage()
@Component({
  selector: 'page-regra-create',
  templateUrl: 'regra-create.html',
})
export class RegraCreatePage {
  isReadyToSave: boolean;
  form: FormGroup;
  currentSensor: Sensor[];
  regra: Regra;

  constructor(public navCtrl: NavController
                , public navParams: NavParams
                , public viewCtrl: ViewController
                , public sensores: Sensores) {
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
    if (!this.form.valid) { return; }
    this.viewCtrl.dismiss(this.form.value);
  }

}
