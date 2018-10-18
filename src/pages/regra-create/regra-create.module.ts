import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegraCreatePage } from './regra-create';

@NgModule({
  declarations: [
    RegraCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(RegraCreatePage),
    TranslateModule.forChild(),
  ],
  exports: [
    RegraCreatePage
  ]
})
export class SrcPagesRegraCreatePageModule {}
