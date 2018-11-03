import { Injectable } from '@angular/core';

import { Api } from '../api/api';
import { StorageService } from './../storage/storageService';
import { Sensor } from '../../models/sensor';
import { LogSensor } from './../../models/logSensor';

@Injectable()
export class Sensores {
  usuarioLogado: any;
  sensorList: Sensor[] = new Array<Sensor>();
  logSensorList: LogSensor[] = new Array<LogSensor>();

  constructor(public api: Api
              , public storage: StorageService) {
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
    this.storage.get('usuario').then(user => {
      let seq = this.api.get('sensores', 
      {filter: '{"where":{"usuarioId":'+user.userId+'}}'}).share();
      seq.subscribe((res: any) => {
        let novoSensorList: Sensor[] = new Array<Sensor>();
        res.forEach(sensor => {
          sensor = Sensor.preencheAtributos(sensor);
          novoSensorList.push(sensor);
        });
        this.sensorList = novoSensorList;
        funcao(this.sensorList);
      }, err => {
        console.error('ERROR', err);
      });
    });
  }

  add(sensor: Sensor) {
    sensor.status = 0;
    let obj: {data: Sensor} = {data: sensor};
    return this.api.post('sensores/registerSensor', obj);    
  }

  delete(sensor: Sensor) {
  }

  getLastLogs(sensor: Sensor, funcao: any){
    let seq = this.api.get('logsensores/getlastlogs', {guid: sensor.guid}).share();
    this.sensorList.length = 0;
    seq.subscribe((res: any)=>{
      res['data'].forEach(logSensor => {
        this.logSensorList.push(logSensor);
      });
      funcao(this.logSensorList);
    });
  }

}
