export enum SyntaxKind {
  numberToken = 'numberToken',
  stringToken = 'stringToken',
  whiteSpaceToken = 'whiteSpaceToken',
  multiplyToken = 'multiplyToken',
  additionToken = 'additionToken',
  subtractToken = 'subtractToken',
  divideToken = 'divideToken',
  equalToken = 'equalToken',
}
export class SyntaxToken {
  kind: SyntaxKind;
  position: number;
  text: string;
  constructor(kind: SyntaxKind, position: number, text: string) {
    this.kind = kind;
    this.position = position;
    this.text = text;
  }
}
