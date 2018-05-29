import { Injectable } from '@angular/core';

import { Sensor } from '../../models/sensor';
import { Api } from '../api/api';

@Injectable()
export class Sensores {

  constructor(public api: Api) { }

  query(params?: any) {
    return this.api.get('/sensores', params);
  }

  add(sensor: Sensor) {
  }

  delete(sensor: Sensor) {
  }

}
