import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StripFileEndingPipe} from './pipes/stripFileEnding.pipe';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [StripFileEndingPipe],
  exports: [StripFileEndingPipe],
  providers: [
    StripFileEndingPipe]
})
export class SharedModule {
}
