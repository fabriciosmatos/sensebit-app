import { Injectable } from '@angular/core';

import { Regra } from '../../models/regra';
import { Api } from '../api/api';
import { User } from '../user/user';
import { StorageService } from './../storage/storageService';

@Injectable()
export class Regras {
  usuarioLogado: any;
  regraList: Regra[] = new Array<Regra>();

  constructor(public api: Api, 
                public user: User, 
                public storage: StorageService) {
  }

  query(params?: any) {
    if (!params) {
      return this.regraList;
    }

    return this.regraList.filter((regra) => {
      for (let key in params) {
        let field = regra[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return regra;
        } else if (field == params[key]) {
          return regra;
        }
      }
      return null;
    });
  }

  getAllRegras(funcao: any, sensores: any){
    this.regraList.length = 0;
    sensores.forEach(sensor => {
      let seq = this.api.get('parametros', 
      {filter: '{"where":{"sensorId":'+sensor.id+'}}'}).share();
      seq.subscribe((res: any) => {
        res.forEach(regra => {
          regra.sensor = sensor;
          this.regraList.push(regra);
        });
        funcao(this.regraList);
      }, err => {
        console.error('ERROR_REGRA', err);
      });
    });
  }

  add(regra: Regra) {
    return this.api.post('parametros', regra);
  }

  delete(regra: Regra) {
  }

}
