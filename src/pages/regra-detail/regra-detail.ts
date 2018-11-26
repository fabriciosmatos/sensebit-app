import { Sensores } from './../../providers/sensores/sensores';
import { Regras } from './../../providers/regras/regras';
import { Regra } from './../../models/regra';
import { Component } from '@angular/core';
import { Tab2Root } from '../';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-regra-detail',
  templateUrl: 'regra-detail.html',
})
export class RegraDetailPage {
  regra: Regra;

  constructor(public navCtrl: NavController
        , public navParams: NavParams
        , public viewCtrl: ViewController
        , public regras: Regras
        , public sensores: Sensores) {
    this.regra = navParams.get('regra');
    // console.log(this.regra.sensorId);
    this.sensores.buscaPorId(this.regra.sensorId , (resp) => {      
      this.regra.sensor = resp[0];
    });
  }

  ionViewDidLoad() {
  }

  update() {
    this.regras.update(this.regra).subscribe((resp) => {
      this.navCtrl.push(Tab2Root);
    }, (err) => {
      console.log(err);
    });
  }

}
