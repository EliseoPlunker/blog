import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SwiperDirective } from './swiper.directive';

@NgModule({
  imports: [BrowserModule],
  declarations: [SwiperDirective],
  exports: [SwiperDirective],
})
export class UtilsModule {}
