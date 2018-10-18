import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ListRegraPage } from './list-regra';

@NgModule({
  declarations: [
    ListRegraPage,
  ],
  imports: [
    IonicPageModule.forChild(ListRegraPage),
  ],
  exports: [
    ListRegraPage
  ]
})
export class SrcPagesListRegraPageModule {}
