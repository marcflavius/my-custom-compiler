/*eslint space-before-blocks: "error"*/
import _ from 'lodash-contrib';
import { chars } from './constants/chars.js';
import { SyntaxKind, SyntaxToken } from './SyntaxToken.js';
enum MathOperator {
  multiply = '*',
  addition = '+',
  subtract = '-',
  divide = '/',
}

type MakeIsOperator = (operator: MathOperator) => boolean;
type OnCondition = (value: string) => boolean;
interface LexarContract {
  nextToken(): void;
}
export class Lexar implements LexarContract {
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
    this._text = `${text}${chars.endOfLine}`;
    this._position = 0;
    this._operatorTokenMap = {
      [MathOperator.multiply]: SyntaxKind.multiplyToken,
      [MathOperator.addition]: SyntaxKind.additionToken,
      [MathOperator.subtract]: SyntaxKind.subtractToken,
      [MathOperator.divide]: SyntaxKind.divideToken,
    };
  }
  private get _current(): string {
    if (this._position >= this._text.length) {
      return chars.endOfLine;
    }
    return this._text[this._position];
  }

  private _isNumeric(value: string): boolean {
    return _.isNumeric(value);
  }
  private _isWhiteSpace(value: string): boolean {
    return value == ' ';
  }
  private _isOperator(value: string): boolean {
    return Object.keys(this._operatorTokenMap).includes(value);
  }
  private _makeIsOperator(operator: MathOperator): MakeIsOperator {
    return (value: string): boolean => value === operator;
  }
  private _makeSyntaxKind(operator: MathOperator): SyntaxKind {
    return SyntaxKind[this._operatorTokenMap[operator]];
  }
  private _captureGroupe(
    onCondition: OnCondition,
    syntaxKind: SyntaxKind,
    options = {
      maxTokenLength: -1,
    },
  ): SyntaxToken {
    const start = this._position;
    if (options.maxTokenLength === this._position) {
      this._position++;
      const end = this._position;
      const extract = this._text.slice(start, end);
      return new SyntaxToken(syntaxKind, start, extract);
    }
    while (onCondition(this._current)) {
      this._position++;
    }
    const end = this._position;
    const extract = this._text.slice(start, end);
    return new SyntaxToken(syntaxKind, start, extract);
  }
  public nextToken(): SyntaxToken {
    if (this._isNumeric(this._current)) {
      return this._captureGroupe(this._isNumeric, SyntaxKind.numberToken);
    }
    if (this._isWhiteSpace(this._current)) {
      return this._captureGroupe(
        this._isWhiteSpace,
        SyntaxKind.whiteSpaceToken,
      );
    }
    if (this._isOperator(this._current)) {
      return this._captureGroupe(
        this._makeIsOperator(this._current as MathOperator),
        this._makeSyntaxKind(this._current as MathOperator),
      );
    }
    return new SyntaxToken(SyntaxKind.badToken, this._position, this._current);
  }
}
