// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

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
import { AddClassesForDistractionStatesDirective } from './directives/addClassesForDistractionStates.directive';
import { TranslocoRootModule } from '../transloco-root.module';

@NgModule({
  imports: [CommonModule, TranslocoRootModule],
  declarations: [StripFileEndingPipe, AddClassesForDistractionStatesDirective],
  exports: [TranslocoRootModule, StripFileEndingPipe, AddClassesForDistractionStatesDirective],
  // FIXME need to provide that to be able to use it in services. Clashes with Best Practices from Angular. Help.
  providers: [StripFileEndingPipe],
})
export class SharedModule {}
