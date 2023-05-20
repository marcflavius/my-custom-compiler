import _ from 'lodash-contrib';
import { SyntaxKind, SyntaxToken } from './SyntaxToken.js';
enum MathOperator {
  multiply = '*',
  addition = '+',
  subtract = '-',
  divide = '/',
}
interface LexarInt {
  nextToken(): void;
}
export class Lexar implements LexarInt {
  private readonly _text: string;
  private _position: number;
  public words: any[];
  private _operatorTokenMap: {
    '*': SyntaxKind;
    '+': SyntaxKind;
    '-': SyntaxKind;
    '/': SyntaxKind;
  };

  constructor(text) {
    this._text = text;
    this._position = 0;
    this._operatorTokenMap = {
      [MathOperator.multiply]: SyntaxKind.multiplyToken,
      [MathOperator.addition]: SyntaxKind.additionToken,
      [MathOperator.subtract]: SyntaxKind.subtractToken,
      [MathOperator.divide]: SyntaxKind.divideToken,
    };
  }
  private get current() {
    if (this._position >= this._text.length) {
      return '\0';
    }
    return this._text[this._position];
  }

  private isNumeric(value: any) {
    return _.isNumeric(value);
  }
  private isWhiteSpace(value: any) {
    return value == ' ';
  }
  public isOperator(value: any) {
    return Object.keys(this._operatorTokenMap).includes(value);
  }
  private makeIsOperator(operator: any) {
    return (value: any) => value === operator;
  }
  private makeSyntaxKind(operator: any) {
    return SyntaxKind[this._operatorTokenMap[operator]];
  }
  public nextToken(): SyntaxToken {
    if (this.isNumeric(this.current)) {
      return this.captureGroupe(this.isNumeric, SyntaxKind.numberToken);
    }
    if (this.isWhiteSpace(this.current)) {
      return this.captureGroupe(this.isWhiteSpace, SyntaxKind.whiteSpaceToken);
    }
    if (this.isOperator(this.current)) {
      return this.captureGroupe(
        this.makeIsOperator(this.current),
        this.makeSyntaxKind(this.current),
      );
    }
    return undefined;
  }

  private captureGroupe(
    onCondition: Function,
    syntaxKind: SyntaxKind,
    options = {
      maxTokenLength: -1,
    },
  ) {
    const start = this._position;
    while (
      onCondition(this.current || options.maxTokenLength === this._position)
    ) {
      this._position++;
    }
    const end = this._position;
    const extract = this._text.slice(start, end);
    return new SyntaxToken(syntaxKind, start, extract);
  }
}
