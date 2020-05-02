export interface Note {
  stereotype: 'Note';
  id: string;
  type: 'info' | 'todo';
  context: string;
  text: string;
  color?: string;
  keepOpen?: boolean;
}
