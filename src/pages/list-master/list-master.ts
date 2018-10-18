
import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';

import { Sensor } from '../../models/sensor';
import { Sensores } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentSensores: Sensor[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public sensores: Sensores, public modalCtrl: ModalController) {
    this.sensores.getAllSensores((resp) => {
      this.currentSensores = resp;
    });
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addSensor() {
    let addModal = this.modalCtrl.create('SensorCreatePage');
    addModal.onDidDismiss(sensor => {
      if (sensor) {
        this.sensores.add(sensor);
      }
    })
    addModal.present();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteSensor(sensor) {
    this.sensores.delete(sensor);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openSensor(sensor: Sensor) {
    this.navCtrl.push('SensorDetailPage', {
      sensor: sensor
    });
  }

    /**
   * Perform a service for the proper items.
   */
  getSensores(ev) {
    let val = ev.target.value;
    if (!val || !val.trim()) {
      this.currentSensores = this.sensores.query();
      return;
    }
    this.currentSensores = this.sensores.query({
      tipoNome: val
    });
  }

}
