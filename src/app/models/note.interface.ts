export interface Note {
  id: string;
  type: 'info' | 'todo';
  context: string;
  text: string;
  color?: string;
  keepOpen?: boolean;
}
