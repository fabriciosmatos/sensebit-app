import { Component } from '@angular/core';
import { IonicPage, MenuController, NavController, Platform } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

export interface Slide {
  title: string;
  description: string;
  image: string;
}

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
  slides: Slide[];
  showSkip = true;
  dir: string = 'ltr';

  constructor(public navCtrl: NavController, public menu: MenuController, translate: TranslateService, public platform: Platform) {
    this.dir = platform.dir();
    this.slides = [
      {
        title: 'Bem-vindo ao SenseBit',
        description: `O <b>SenseBit</b> é o futuro da automação`,
        image: 'assets/img/ica-slidebox-img-1.png',
      },
      {
        title: `Como utilizar o SenseBit`,
        description: `Cadastre o sensor, regra e ação. O SenseBit fará o resto para você`,
        image: 'assets/img/ica-slidebox-img-2.png',
      },
      {
        title: `Iniciando com o SenseBit`,
        description: `Precisa de ajuda? Dê uma olhada no HELP do Sensebit para um tutorial completo`,
        image: 'assets/img/ica-slidebox-img-3.png',
      }
    ];
  }

  startApp() {
    this.navCtrl.setRoot('WelcomePage', {}, {
      animate: true,
      direction: 'forward'
    });
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

}
