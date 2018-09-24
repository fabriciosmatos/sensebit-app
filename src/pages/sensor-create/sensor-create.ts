import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-sensor-create',
  templateUrl: 'sensor-create.html'
})
export class SensorCreatePage {

    @ViewChild('fileInput') fileInput;
  isReadyToSave: boolean;
  scannedCode = null;
  unpairedDevices: any;
  gettingDevices: Boolean = false;
  texto: string;
  recebido: string = "";
  eventoRecebe: Subscription;
  recebidoDoSensor: string = ' { "wifi":[ {"nome":"Fabricio", "seguranca":"aberta", "sinal":-90 }, {"nome":"Mably", "seguranca":"fechada", "sinal":-70 }, {"nome":"Larissa", "seguranca":"texto_seguranca3", "sinal":-40 } ] } ';
  wifiList: object;
  form: FormGroup;
  timerRecebe: number = 0;

  constructor(public navCtrl: NavController
                , public viewCtrl: ViewController
                , formBuilder: FormBuilder
                , public camera: Camera
                , public barcodeScanner: BarcodeScanner
                , private bluetoothSerial: BluetoothSerial
                , private alertCtrl: AlertController) {
    this.form = formBuilder.group({
      imagem: [''],
      tipo: ['', Validators.required],
      guid: ['']
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
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
        this.form.patchValue({ 'imagem': 'data:image/jpg;base64,' + data });
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
      this.form.patchValue({ 'imagem': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['imagem'].value + ')'
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
    if (!this.form.valid) { return; }
    this.viewCtrl.dismiss(this.form.value);
  }

  /**
   * Le QRCODE
   */
  scanCode(){
    this.gettingDevices = true; 
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData.text;
      this.gettingDevices = false;      
     }).catch(err => {
         console.log('Error', err);
     });
  }
  
  /**
   * Chama a função de conectar no sensor com o QRCODE
   */
  createSensor(){
    this.bluetoothSerial.enable();
    // this.selectDevice(this.scannedCode);  # Atualizar para produção
    this.conectaBluetooth('90:32:4B:98:6F:70');
    // this.selectDevice('30:AE:A4:8D:96:E2');
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
            this.bluetoothSerial.connect(address).subscribe(() => {              
              this.enviaMensagem('{"parametro":"wifi","operacao":"?"}',(data: string) => {
                alert(data);
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
  enviaMensagem(texto:string, funcao:any) {        
    let concatenaNome: string = "";
    alert('Envia mensagem: '+this.texto);

    this.eventoRecebe = this.bluetoothSerial.subscribeRawData().subscribe((data) => { 
      this.bluetoothSerial.read().then((data) => {
        this.recebido += data;
        if(this.timerRecebe != 0){
          clearTimeout(this.timerRecebe);
          this.timerRecebe = 0;
        }
        this.timerRecebe = setTimeout(() => { 
          funcao(this.recebido);
          this.eventoRecebe.unsubscribe();
        }, 200);  
      });
    });

  
    alert('OK');

    this.bluetoothSerial.write(this.texto);
  }

  apresentaListaWifi() {
    this.wifiList = JSON.parse(this.recebidoDoSensor);
    let potenciaSinal: string;
    let alerta = this.alertCtrl.create();
    alerta.setTitle('Lista de Wi-Fi disponiveis');

    for (let key in this.wifiList) {  
      for (let i=0; i< this.wifiList[key].length ; i=i+1){
        if(this.wifiList[key][i].sinal > -60){
          potenciaSinal = ' (Forte)';
        }else if (this.wifiList[key][i].sinal <= -60
                    && this.wifiList[key][i].sinal > -85){
          potenciaSinal = ' (Medio)';
        }else if (this.wifiList[key][i].sinal <= -85){
          potenciaSinal = ' (Fraco)';
        }  

        alerta.addInput({
          type: 'radio',
          label: this.wifiList[key][i].nome + potenciaSinal,
          value: this.wifiList[key][i].nome,
          checked: i==0?true:false
        });
      }    
    }
    alerta.addButton('Cancel');
    alerta.addButton({
      text: 'OK',
      handler: data => {
        this.showConfirm(data);
      }
    });
    alerta.present();
  }

  showConfirm(nomeWifi:string) {
    const confirm = this.alertCtrl.create({
      title: 'Senha Wifi',
      message: 'Porgentileza informe a senha do Wi-Fi "' + nomeWifi + '"',
      inputs: [
        {
          name: 'senha',
          placeholder: 'senha'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Salvar',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }

}
