

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

  // constructor(fields: any) {
  //   // Quick and dirty extend/assign fields to this model
  //   for (const f in fields) {
  //     // @ts-ignore
  //     this[f] = fields[f];
  //   }
  // }  

  constructor(tipo: number
              , nome: string
              , guid: string
              , status: number
              , usuarioId: number
              , id: number
              , sensorId: number) {
    this.tipo = tipo;
    this.nome = nome;
    this.guid = guid;
    this.status = status;
    this.usuarioId = usuarioId;
    this.id = id;
    this.sensorId = sensorId;
    if(tipo == 1){
      this.imagem = 'assets/img/sensor-energia.jpg';
      this.tipoNome = 'Sensor de Energia';
    }else if(tipo == 2){
      this.imagem = 'assets/img/sensor-temperatura.jpg';
      this.tipoNome = 'Sensor de Temperatura';
    }else if(tipo == 4){
      this.imagem = 'assets/img/sensor-movimento.jpg';
      this.tipoNome = 'Sensor de Movimento';
    }
  }
}

// export interface Sensor {
//   [prop: string]: any;
// }
