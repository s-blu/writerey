/**
 * This module
 * - should consist entirely of declarations, most of them exported.
 * - may re-export other widget modules, such as CommonModule, FormsModule, and NgModules with the UI controls that you use most widely.
 * - should not have providers for reasons explained previously. Nor should any of its imported or re-exported modules have providers.
 * https://angular.io/guide/ngmodule-faq#sharedmodule
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StripFileEndingPipe } from './pipes/stripFileEnding.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [StripFileEndingPipe],
  exports: [StripFileEndingPipe],
  // FIXME need to provide that to be able to use it in services. Clashes with Best Practices from Angular. Help.
  providers: [StripFileEndingPipe],
})
export class SharedModule {}
