import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegraDetailPage } from './regra-detail';

@NgModule({
  declarations: [
    RegraDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(RegraDetailPage),
  ],
})
export class RegraDetailPageModule {}
