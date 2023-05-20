import _ from 'lodash-contrib';
import { SyntaxKind, SyntaxToken } from './SyntaxToken.js';

interface LexarInt {
  nextToken(): void;
}
export class Lexar implements LexarInt {
  private readonly _text: string;
  private _position: number;
  public words: any[];

  constructor(text) {
    this._text = text;
    this._position = 0;
  }
  private get current() {
    if (this._position >= this._text.length) {
      return '\0';
    }
    return this._text[this._position];
  }

  public isNumeric(value: any) {
    return _.isNumeric(value);
  }
  public isWhiteSpace(value: any) {
    return value == ' ';
  }

  public nextToken(): SyntaxToken {
    // <number>
    // <operator>
    // <whitespace>
    if (this.isNumeric(this.current)) {
      return this.captureGroupe(this.isNumeric, SyntaxKind.numberToken);
    }
    if (this.isWhiteSpace(this.current)) {
      return this.captureGroupe(this.isWhiteSpace, SyntaxKind.whiteSpaceToken);
    }
    return undefined;
  }

  private captureGroupe(onCondition: Function, syntaxKind: SyntaxKind) {
    const start = this._position;
    while (onCondition(this.current)) {
      this._position++;
    }
    const end = this._position;
    const extract = this._text.slice(start, end);
    return new SyntaxToken(syntaxKind, start, extract);
  }
}
