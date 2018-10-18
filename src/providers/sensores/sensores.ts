import { Injectable } from '@angular/core';

import { Sensor } from '../../models/sensor';
import { Api } from '../api/api';
import { User } from '../user/user';
import { StorageService } from './../storage/storageService';

@Injectable()
export class Sensores {
  usuarioLogado: any;
  sensorList: Sensor[] = new Array<Sensor>();

  constructor(public api: Api, public user: User, public storage: StorageService) {
  }

  query(params?: any) {
    if (!params) {
      return this.sensorList;
    }

    return this.sensorList.filter((sensor) => {
      for (let key in params) {
        let field = sensor[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return sensor;
        } else if (field == params[key]) {
          return sensor;
        }
      }
      return null;
    });
  }

  getAllSensores(funcao: any){
    let evento = this.storage.get('usuario').then(user => {
      let seq = this.api.get('sensores', 
      {filter: '{"where":{"usuarioId":'+user.userId+'}}'}).share();
      seq.subscribe((res: any) => {
        this.sensorList.length = 0;
        res.forEach(sensor => {
          if(sensor.tipo == 1){
            sensor.imagem = 'assets/img/sensor-energia.jpg';
            sensor.tipoNome = 'Sensor de Energia';
          }else if(sensor.tipo == 2){
            sensor.imagem = 'assets/img/sensor-temperatura.jpg';
            sensor.tipoNome = 'Sensor de Temperatura';
          }else if(sensor.tipo == 3){
            sensor.imagem = 'assets/img/sensor-pressao.jpg';
            sensor.tipoNome = 'Sensor de Pressão';
          }else if(sensor.tipo == 4){
            sensor.imagem = 'assets/img/sensor-movimento.jpg';
            sensor.tipoNome = 'Sensor de Movimento';
          }
          this.sensorList.push(sensor);
        });
        funcao(this.sensorList);
      }, err => {
        console.error('ERROR', err);
      });
    });
  }

  add(sensor: Sensor) {
    return this.api.post('sensores', sensor);
  }

  delete(sensor: Sensor) {
  }

}
