// Copyright (c) 2020 s-blu
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

export enum NoteItemStereotypes {
  NOTE = 'Note',
  LINK = 'Link',
  LABEL = 'LabelInfo',
}

interface NotesItem {
  stereotype: NoteItemStereotypes;
  id: string;
  context: string;
  keepOpen?: boolean;
}

export interface Note extends NotesItem {
  stereotype: NoteItemStereotypes.NOTE;
  type: 'info' | 'todo' | 'label';
  text: string;
  color?: string;
}

export interface LabelInfo extends NotesItem {
  stereotype: NoteItemStereotypes.LABEL;
  text: string;
  color?: string;
  type?: string; // quick and dirty fix, the type check annoys me
}

export interface Link extends NotesItem {
  stereotype: NoteItemStereotypes.LINK;
  linkId: string;
  text: string;
}

export interface DocumentLink {
  linkId: string;
  path: string;
  name: string;
}
