export interface DocumentDefinition {
  name: string;
  path: string;
  last_edited: Date;
  content?: string;
}

export const LAST_DOCUMENT_KEY = 'writerey_last_opened_document';
