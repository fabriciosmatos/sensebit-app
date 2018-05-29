import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { SensorDetailPage } from './sensor-detail';

@NgModule({
  declarations: [
    SensorDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SensorDetailPage),
    TranslateModule.forChild()
  ],
  exports: [
    SensorDetailPage
  ]
})
export class SensorDetailPageModule { }
