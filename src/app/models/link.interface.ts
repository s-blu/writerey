export interface Link {
  stereotype: 'Link';
  id: string;
  linkId: string;
  context: string;
  text: string;
  keepOpen?: boolean;
}
