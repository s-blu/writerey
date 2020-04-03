export interface Note {
  id: string;
  type: 'info' | 'todo';
  color?: string;
  context: string;
  text: string;
}
