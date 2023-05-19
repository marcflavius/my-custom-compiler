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

  public nextToken(): SyntaxToken {
    // <number>
    // <operator>
    // <whitespace>
    if (_.isNumeric(this.current)) {
      return this.captureNumericGroupe();
    }
    return undefined;
  }

  private captureNumericGroupe() {
    const tokenStart = this._position;
    while (_.isNumeric(this.current)) {
      this._position++;
    }
    const tokenLength = this._position - tokenStart;
    const extract = this._text.substring(tokenStart, tokenLength);
    return new SyntaxToken(SyntaxKind.numberToken, tokenStart, extract);
  }
}
