import { Injectable } from '@angular/core';

import { Sensor } from '../../models/sensor';

@Injectable()
export class Sensores {
  sensores: Sensor[] = [];

  defaultSensor: any = {
    "sensorId": "1",
    "tipo": "Sensor de Energia",
    "guid": "111",
    "status": "1",
    "usuarioId":"1",
    "imagem":"assets/img/sensor-energia.jpg" 
  };


  constructor() {
    let sensores = [
      {
        "sensorId": "1",
        "tipo": "Sensor de Energia",
        "guid": "111",
        "status": "1",
        "usuarioId":"1",
        "imagem":"assets/img/sensor-energia.jpg" 
      },
      {
        "sensorId": "1",
        "tipo": "Sensor de movimento",
        "guid": "222",
        "status": "1",
        "usuarioId":"1",
        "imagem":"assets/img/sensor-movimento.jpg"
      },
      {
        "sensorId": "1",
        "tipo": "Sensor de Temperatura",
        "guid": "333",
        "status": "1",
        "usuarioId":"1",
        "imagem":"assets/img/sensor-temperatura.jpg"
      }
    ];

    for (let sensor of sensores) {
      this.sensores.push(new Sensor(sensor));
    }
  }

  query(params?: any) {
    if (!params) {
      return this.sensores;
    }

    return this.sensores.filter((sensor) => {
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

  add(sensor: Sensor) {
    this.sensores.push(sensor);
  }

  delete(sensor: Sensor) {
    this.sensores.splice(this.sensores.indexOf(sensor), 1);
  }
}
