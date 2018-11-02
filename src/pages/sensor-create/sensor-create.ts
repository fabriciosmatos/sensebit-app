
import { StorageService } from './../../providers/storage/storageService';
import { Component, ViewChild } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController, ToastController, LoadingController, DateTime } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AlertController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { Wifi } from '../../models/wifi';
import { Sensores } from './../../providers/sensores/sensores';
import { Sensor } from './../../models/sensor';
import { areIterablesEqual } from '@angular/core/src/change_detection/change_detection_util';

@IonicPage()
@Component({
  selector: 'page-sensor-create',
  templateUrl: 'sensor-create.html'
})
export class SensorCreatePage {

  @ViewChild('fileInput') fileInput;
  isReadyToSave: boolean;
  unpairedDevices: any;
  gettingDevices: Boolean = false;
  eventoRecebe: Subscription;
  recebido: string = "";
  //recebidoDoSensor: string = '{"wifi":[ {"nome":"Fabricio", "seguranca":"aberta", "sinal":-90 }, {"nome":"Mably", "seguranca":"fechada", "sinal":-70 }, {"nome":"Larissa", "seguranca":"texto_seguranca3", "sinal":-40 } ] } ';
  wifiList: object;
  timerRecebe: number = 0;
  currentWifis: Wifi[]= [];
  sensor: Sensor = new Sensor();
  loading: any = null;


  constructor(public navCtrl: NavController
                , public viewCtrl: ViewController
                , public camera: Camera
                , public barcodeScanner: BarcodeScanner
                , private bluetoothSerial: BluetoothSerial
                , private alertCtrl: AlertController
                , public sensores: Sensores
                , public storage: StorageService
                , public toastCtrl: ToastController
                , public loadingCtrl: LoadingController) {
    this.storage.get('usuario').then(user => {
      this.sensor.usuarioId = user.userId;
    });

    this.loading = this.loadingCtrl.create({
      content: 'Conectando ao sensor ...'
    });
  }

  ionViewDidLoad() {
  }

  // ************* Capturar imagem 
  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        // this.form.patchValue({ 'imagem': 'data:image/jpg;base64,' + data });
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      // this.form.patchValue({ 'imagem': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    // return 'url(' + this.form.controls['imagem'].value + ')'
  }

  /**
   * O usuário cancelou, então descartamos sem enviar os dados de volta.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * O usuário está pronto e quer criar o item, então devolva-o ao apresentador.
   */
  done() {
    this.viewCtrl.dismiss();
  }

  /**
   * Le QRCODE
   */
  scanCode(){
    // this.gettingDevices = true; 
    this.barcodeScanner.scan().then(barcodeData => {
      this.bluetoothSerial.enable();
      this.conectaBluetooth(barcodeData.text);
      // this.gettingDevices = false;      
     }).catch(err => {
         console.log('Error', err);
     });
  }
  
  /**
   * Chama a função de conectar no sensor com o QRCODE
   */
  createSensor(){
    alert('passo0'); 
    let obj: {parametro: string, operacao:string, conteudo:any };

    this.sensores.add(this.sensor).subscribe((resp) => {
      alert('passo1');                         // ################## DEBUG ##################
      this.sensor.guid = resp['status']['guid'];
      //this.viewCtrl.dismiss(this.sensor); 
      alert('passo2');      
      obj = {parametro:"configuracao",operacao:"definicao",conteudo: { guid: this.sensor.guid}}; 
      this.enviaMensagem(JSON.stringify(obj)).then((resp) =>{
          alert('passo3');                  //  ################## DEBUG ##################
          obj = { parametro: "wifi", operacao: "definicao", conteudo: { redes: this.sensor.wifis }};
          alert(JSON.stringify(obj));
          this.enviaMensagem(JSON.stringify(obj)).then((resp) => {});
            // alert('passo4');                      ################## DEBUG ##################
            const toast = this.toastCtrl.create({
              message: 'Sensor cadastrado com sucesso!',
              duration: 3000
            });
            toast.present();
            this.desconectaBluetooth();
            this.viewCtrl.dismiss(this.sensor);
          });
      }, 
      (err) => {
        alert('erro: ' + err);
      });
  }
  
  fail = (error) => alert('falhou: '+error);
  success = (data) => alert('sucesso: ' +data);

  /**
   * Conectar ao bluetooth
   * @param address mac do bluettoth do sensor
   * Cso sucesso chama a função send() que envia mensagem para o sensor
   */
  conectaBluetooth(address: any) {
    let alerta = this.alertCtrl.create({
      title: 'Conectar',
      message: 'Você quer se conectar ao Sensor?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancelar',
          handler: () => {
            console.log('Cancelar clicado');
          }
        },
        {
          text: 'Conectar',
          handler: () => {
            this.loading.present();
            setTimeout(() => {
              this.loading.dismiss();
            }, 10000);
            this.bluetoothSerial.connect(address).subscribe(() => {
              this.enviaMensagem('{"parametro": "wifi","operacao": "pergunta"}').then((data : string) => {
                alert('ok1');
                this.currentWifis = this.toWifis(data);
                alert('ok2');
                // alert(JSON.stringify(this.currentWifis));

                this.enviaMensagem('{"parametro": "configuracao","operacao": "pergunta"}').then((data : string) => {
                  alert('ok3');
                  let jsonData = JSON.parse(data);
                  alert("resposta: "+ data);
                  this.sensor.tipo = jsonData['conteudo']['tipo'];
                  alert("tipo: " + this.sensor.tipo);
                  this.defineImagem();
                  this.loading.dismiss();
                });
              });
            }, 
            this.fail);
          }
        }
      ]
    });
    alerta.present();
  }

  /**
   * disconecta do bluettoth
   */
  desconectaBluetooth() {
    let alerta = this.alertCtrl.create({
      title: 'Disconnect?',
      message: 'Do you want to Disconnect?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Disconnect',
          handler: () => {
            this.bluetoothSerial.disconnect();
          }
        }
      ]
    });
    alerta.present();
  }

  /**
   * envia mensagem para o bluetooth
   * @param texto é o que será enviado
   * @param funcao 
   */
  enviaMensagem(texto:string) {
    return new Promise((resolve, reject) => {
      //let timeout = setTimeout(() => {
        //reject('timeout ao receber inicio');
      //},10000);
      //this.bluetoothSerial.subscribe('\x02').subscribe((data : string) => {
          //clearTimeout(timeout);
          this.bluetoothSerial.subscribe('\x03').subscribe((data) => {
            resolve(data.slice(1,-1));
          });
      //});
      this.bluetoothSerial.write('\x02' + texto + '\x03');
    });
  }

  isEmpty(obj: object){
    for (var i in obj) {
      if(obj.hasOwnProperty(i)) {
          return false;
      }
    }
    return true;
  }

  toWifis(data: string){
    let jsonData = JSON.parse(data); 
    let conteudo = jsonData['conteudo'];
    let currentWifis: Wifi[] = [];
    for (let key in conteudo) {  
      for (let i=0; i< conteudo[key].length ; i=i+1){
        let potenciaSinal: string = '';
        if(conteudo[key][i].sinal > -60){
          potenciaSinal = ' (Forte)';
        }else if (conteudo[key][i].sinal <= -60
                    && conteudo[key][i].sinal > -85){
          potenciaSinal = ' (Medio)';
        }else if (conteudo[key][i].sinal <= -85){
          potenciaSinal = ' (Fraco)';
        }  
        let wifi: Wifi = new Wifi(conteudo[key][i].nome
                                    ,conteudo[key][i].senha
                                    , potenciaSinal);
        currentWifis.push(wifi);
      }
    }
    return currentWifis;
  }

  defineImagem(){
    if(this.sensor.tipo == 1){
      this. sensor.imagem = 'assets/img/sensor-energia.jpg';
      this.sensor.tipoNome = 'Sensor de Energia';
    }else if(this.sensor.tipo == 2){
      this.sensor.imagem = 'assets/img/sensor-temperatura.jpg';
      this.sensor.tipoNome = 'Sensor de Temperatura';
    }else if(this.sensor.tipo == 3){
      this.sensor.imagem = 'assets/img/sensor-pressao.jpg';
      this.sensor.tipoNome = 'Sensor de Pressão';
    }else if(this.sensor.tipo == 4){
      this.sensor.imagem = 'assets/img/sensor-movimento.jpg';
      this.sensor.tipoNome = 'Sensor de Movimento';
    }
  }

}
