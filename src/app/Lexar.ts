/* eslint-disable no-constant-condition */
/*eslint space-before-blocks: "error"*/
import _ from 'lodash-contrib';
import { chars } from './constants/chars.js';
import { SyntaxKind, SyntaxToken } from './SyntaxToken.js';
import { MathOperator } from './Utils.js';

type MakeIsOperator = (operator: MathOperator) => boolean;
type OnCondition = (value: string) => boolean;

interface LexarContract {
  nextToken(): void;
}

export class Lexar implements LexarContract {
  /**
   * The given text in process
   *
   * @private
   * @type {string}
   * @memberof Lexar
   */
  private readonly _text: string;

  /**
   * Track the lexar pointer position.
   * Zero base index
   *
   * @private
   * @type {number}
   * @memberof Lexar
   */
  private _position: number;

  /**
   * A map between math operator and lexar syntaxKind
   *
   * @private
   * @type {{
   *     '*': SyntaxKind;
   *     '+': SyntaxKind;
   *     '-': SyntaxKind;
   *     '/': SyntaxKind;
   *   }}
   * @memberof Lexar
   */
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

  /**
   * The current token
   *
   * @readonly
   * @private
   * @memberof Lexar
   */
  private get _current(): string {
    if (this._position >= this._text.length) {
      return chars.endOfLine;
    }
    return this._text[this._position];
  }

  /**
   * Is Numeric check
   *
   */
  private _isNumeric(value: string): boolean {
    return _.isNumeric(value);
  }

  /**
   * Is Whitespace check
   *
   * @private
   * @param {string} value
   * @return {*}  {boolean}
   * @memberof Lexar
   */
  private _isWhiteSpace(value: string): boolean {
    return value == ' ';
  }

  /**
   * Check if lexar pointer on text last character
   *
   * @private
   * @return {*}  {boolean}
   * @memberof Lexar
   */
  private _isEndOfLine(): boolean {
    return this._position + 1 === this._text.length;
  }

  /**
   * Is Operator check
   *
   * @private
   * @param {string} value
   * @return {*}  {boolean}
   * @memberof Lexar
   */
  private _isOperator(value: string): boolean {
    return Object.keys(this._operatorTokenMap).includes(value);
  }

  /**
   * Make IsOperator
   *
   * @private
   * @param {MathOperator} operator
   * @return {*}  {MakeIsOperator}
   * @memberof Lexar
   */
  private _makeIsOperator(operator: MathOperator): MakeIsOperator {
    return (value: string): boolean => value === operator;
  }

  /**
   * Make SyntaxKind
   *
   * @private
   * @param {MathOperator} operator
   * @return {*}  {SyntaxKind}
   * @memberof Lexar
   */
  private _makeSyntaxKind(operator: MathOperator): SyntaxKind {
    return SyntaxKind[this._operatorTokenMap[operator]];
  }

  /**
   * Capture the current token
   *
   * @private
   * @param {OnCondition} greedinessCallback
   * @param {SyntaxKind} syntaxKind
   * @param {*} [options={
   *       maxTokenLength: -1,
   *     }]
   * @return {*}  {SyntaxToken}
   * @memberof Lexar
   */
  private _captureGroupe(
    greedinessCallback: OnCondition,
    syntaxKind: SyntaxKind,
  ): SyntaxToken {
    const start = this._position;

    do {
      this._position++;
    } while (greedinessCallback(this._current));

    const end = this._position;
    const extract = this._text.slice(start, end);
    return new SyntaxToken(syntaxKind, start, extract);
  }

  /**
   * Increment the lexar pointer and return the current token
   *
   * @return {SyntaxToken}  {SyntaxToken}
   * @memberof Lexar
   */
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
    if (!this._isEndOfLine()) {
      return this._captureGroupe(this._firstChar, SyntaxKind.badToken);
    }
    return new SyntaxToken(
      SyntaxKind.endOfLineToken,
      this._position,
      this._current,
    );
  }

  private _firstChar(): boolean {
    return false;
  }

  getList(): SyntaxToken[] {
    const list: SyntaxToken[] = [];
    let current: SyntaxToken;
    while (true) {
      current = this.nextToken();
      if (this.isValidNode(current)) {
        list.push(current);
      }
      if (current.kind === SyntaxKind.endOfLineToken) {
        return list;
      }
    }
  }

  private isValidNode(current: SyntaxToken): boolean {
    return (
      current.kind !== SyntaxKind.badToken &&
      current.kind !== SyntaxKind.whiteSpaceToken &&
      current.kind !== SyntaxKind.endOfLineToken
    );
  }
}
