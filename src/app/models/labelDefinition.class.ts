import * as uuid from 'uuid';

export enum LabelTypes {
  NUMERIC = 'numeric',
  TEXT = 'text',
}

interface LabelValue {
  id: string;
  name: string;
}
export class LabelDefinition {
  id: string;
  name: string;
  type: LabelTypes;
  index: number;
  values: Array<LabelValue>;
  start: number;
  end: number;
  interval: number;
  template: string;

  constructor(name: string, type: LabelTypes) {
    this.id = uuid.v4();
    this.name = name;
    this.type = type;
    this.values = [];
  }
}
