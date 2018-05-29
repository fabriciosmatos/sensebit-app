import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { SensorCreatePage } from './sensor-create';

@NgModule({
  declarations: [
    SensorCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(SensorCreatePage),
    TranslateModule.forChild()
  ],
  exports: [
    SensorCreatePage
  ]
})
export class SensorCreatePageModule { }
