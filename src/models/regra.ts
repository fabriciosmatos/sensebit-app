import { Sensor } from "./sensor";


export class Regra {
    id: number;
    sensorId: number;
    sensor: Sensor;
    acaoId: number;
    descricao: string;
    periodo: number;
    operadorMinimo: string;
    valorMinimo: number;
    operadormaximo: number;
    valorMaximo: number;

    constructor(){

    }
    
    // constructor(id: number,
    //     sensorId: number,
    //     acaoId: number,
    //     descricao: string,
    //     periodo: number,
    //     operadorMinimo: string,
    //     valorMinimo: number,
    //     operadormaximo: number,
    //     valorMaximo: number) {
    //   this.id = id;
    //   this.sensorId = sensorId;
    //   this.acaoId = acaoId;
    //   this.descricao = descricao;
    //   this.periodo = periodo;
    //   this.operadorMinimo = operadorMinimo;
    //   this.valorMinimo = valorMinimo;
    //   this.operadormaximo = operadormaximo;
    //   this.valorMaximo = valorMaximo;
    // }
  }
  
  