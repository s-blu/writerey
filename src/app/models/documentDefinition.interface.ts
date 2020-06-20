// Copyright (c) 2020 s-blu
// 
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

export interface DocumentDefinition {
  name: string;
  path: string;
  last_edited: Date;
  content?: string;
}

export const LAST_DOCUMENT_KEY = 'writerey_last_opened_document';
