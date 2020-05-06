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
