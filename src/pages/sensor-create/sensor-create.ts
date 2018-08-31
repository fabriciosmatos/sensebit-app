import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
// import { QRScanner, QRScannerStatus  } from '@ionic-native/qr-scanner';
import { IonicPage, NavController, ViewController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AlertController } from 'ionic-angular';

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
  gettingDevices: Boolean;

  form: FormGroup;

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

    bluetoothSerial.enable();
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
  
  success = (data) => alert(data);
  fail = (error) => alert(error);

  scanCode(){
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData.text;
      this.startScanning('DESKTOP-IJ7FBK4');
     }).catch(err => {
         console.log('Error', err);
     });
  }

  startScanning( nomeBluetooth:string ) {
    this.unpairedDevices = null;
    this.gettingDevices = true;
    this.bluetoothSerial.discoverUnpaired().then((success) => {
      this.unpairedDevices = success;
      this.gettingDevices = false;
      success.forEach(element => {
        // alert(element.name);
        if(element.name == nomeBluetooth){
          this.selectDevice(element.address);
        }
      });
    },
      (err) => {
        console.log(err);
      })
  }

  selectDevice(address: any) {
    let alert = this.alertCtrl.create({
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
            this.bluetoothSerial.connect(address).subscribe(this.success, this.fail);
          }
        }
      ]
    });
    alert.present();
  }
}
