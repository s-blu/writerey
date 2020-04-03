import * as uuid from 'uuid';

export enum MarkerTypes {
  NUMERIC = 'numeric',
  TEXT = 'text'
}

interface MarkerValue {
  id: string;
  name: string;
}
export class MarkerDefinition {
  id: string;
  name: string;
  type: MarkerTypes;
  values: Array<MarkerValue>;

  constructor(name: string, type: MarkerTypes) {
    this.id = uuid.v4();
    this.name = name;
    this.type = type;
    this.values = [];
  }
}
