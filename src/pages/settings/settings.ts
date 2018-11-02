
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { User } from './../../providers/user/user';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { StorageService } from './../../providers/storage/storageService';
import { Settings } from '../../providers';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  account: { id: number,
      nome: string,
      telefone: string, 
      login: string, 
      email: string,
      password: string, 
      emailVerified: boolean } = {
  id: null ,
  nome: '',
  telefone: '',
  login: '',
  email: '',
  password: '',
  emailVerified: true
  };

  constructor(public navCtrl: NavController,
    public settings: Settings,
    public navParams: NavParams,
    public translate: TranslateService,    
    public user: User,
    public toastCtrl: ToastController,
    public storage: StorageService) {

    this.storage.get('usuario').then(user => {
      console.log(user);
      this.account.id = user.userId;
      this.account.nome = user.nome;
      this.account.telefone = user.telefone;
      this.account.login = user.login;
      this.account.email = user.email;
      this.account.password = user.password;
      this.account.emailVerified = user.emailVerified;
    });
  }

  salvarAlterações() {
    this.user.signup(this.account).subscribe((resp) => {

    }, (err) => {

      let toast = this.toastCtrl.create({
        message: 'Erro ao editar o usuario',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
}
