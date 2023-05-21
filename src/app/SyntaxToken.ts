import { SyntaxNode } from "./SyntaxNode.js";


export enum SyntaxKind {
  numberToken = 'numberToken',
  stringToken = 'stringToken',
  whiteSpaceToken = 'whiteSpaceToken',
  multiplyToken = 'multiplyToken',
  additionToken = 'additionToken',
  subtractToken = 'subtractToken',
  divideToken = 'divideToken',
  equalToken = 'equalToken',
  endOfLineToken = "endOfLineToken",
  badToken = "badToken",
  endOfExpression = "endOfExpression"
}
export class SyntaxToken implements SyntaxNode {
  public kind: SyntaxKind;
  public position: number;
  public text: string;
  constructor(kind: SyntaxKind, position: number, text: string) {
    this.kind = kind;
    this.position = position;
    this.text = text;
  }
}
