

import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';

import { Regra } from '../../models/regra';
import { Regras } from './../../providers/regras/regras';
import { Sensores } from './../../providers/sensores/sensores';

@IonicPage()
@Component({
  selector: 'page-list-regra',
  templateUrl: 'list-regra.html',
})
export class ListRegraPage {
  currentRegras: Regra[];
  comunicaListaVazia: boolean = false;

  constructor(public navCtrl: NavController, 
                public navParams: NavParams, 
                public regras: Regras, 
                public sensores: Sensores, 
                public modalCtrl: ModalController) {
    this.sensores.getAllSensores((resp) => {
      this.regras.getAllRegras((resp2) => {        
        if(resp2.length>0){
          this.comunicaListaVazia = true;
          this.currentRegras = resp2;
        }
      },resp);          
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SrcPagesAlertasPage');
  }

  addRegra() {
    let addModal = this.modalCtrl.create('RegraCreatePage');
    addModal.onDidDismiss(regra => {
      if (regra) {
        this.currentRegras.push(regra);
        this.comunicaListaVazia = true;
      }
    })
    addModal.present();
  }


  deleteRegra(regra) {
    this.regras.delete(regra);
  }

  openRegra(regra: Regra) {
    // this.navCtrl.push('RegraDetailPage', {
    //   regra: regra
    // });
  }

  getSensores(ev) {
    let val = ev.target.value;
    if (!val || !val.trim()) {
      this.currentRegras = this.regras.query();
      return;
    }
    this.currentRegras = this.regras.query({
      descricao: val
    });
  }



}
