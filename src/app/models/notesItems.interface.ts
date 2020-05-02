export enum NoteItemStereotypes {
  NOTE = 'Note',
  LINK = 'Link',
}

export interface Note {
  stereotype: NoteItemStereotypes.NOTE;
  id: string;
  type: 'info' | 'todo';
  context: string;
  text: string;
  color?: string;
  keepOpen?: boolean;
}

export interface Link {
  stereotype: NoteItemStereotypes.LINK;
  id: string;
  linkId: string;
  context: string;
  text: string;
  keepOpen?: boolean;
}

export interface DocumentLink {
  linkId: string;
  path: string;
  name: string;
}
