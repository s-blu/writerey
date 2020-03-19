export interface Note {
    type: 'info' | 'todo';
    color?: string;
    context: string;
    text: string;
}
