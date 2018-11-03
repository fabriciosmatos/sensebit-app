import { Wifi } from './wifi';


export class Sensor {
  tipo: number;
  tipoNome: string;
  nome: string;
  guid: string;
  status: number;
  usuarioId: number;
  id: number;
  sensorId: number;
  imagem: string;
  unidade: string;
  wifis: Wifi[] = [new Wifi('','','')]; 

  constructor(){}

  static preencheAtributos(sensor: Sensor){
    if(sensor.tipo == 1){
      sensor.imagem = 'assets/img/sensor-energia.jpg';
      sensor.tipoNome = 'Sensor de Energia';
      sensor.unidade = 'Wh';
    }else if(sensor.tipo == 2){
      sensor.imagem = 'assets/img/sensor-temperatura.jpg';
      sensor.tipoNome = 'Sensor de Temperatura';
      sensor.unidade = '°C';
    }else if(sensor.tipo == 3){
      sensor.imagem = 'assets/img/sensor-pressao.jpg';
      sensor.tipoNome = 'Sensor de Pressão';
      sensor.unidade = 'hPa';
    }else if(sensor.tipo == 4){
      sensor.imagem = 'assets/img/sensor-movimento.jpg';
      sensor.tipoNome = 'Sensor de Movimento';
      sensor.unidade = '';
    }
    return sensor;
  }
}