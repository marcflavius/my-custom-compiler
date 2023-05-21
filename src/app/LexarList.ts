/* eslint-disable no-constant-condition */
import { SyntaxToken, SyntaxKind } from './SyntaxToken.js';

export interface BinarySplit {
  left: LexarList;
  right: LexarList;
  current: SyntaxToken;
}
export class LexarList {
  public cursorBackToStart(): void {
    this.position = 0;
  }

  list: SyntaxToken[] = [];
  position = 0;
  constructor(tokenList: SyntaxToken[]) {
    this.list = tokenList;
    if (this.list.length === 0) {
      this.appendEndOfExpression();
      return;
    }
    if (this.list[this.list.length - 1].kind !== SyntaxKind.endOfExpression) {
      this.appendEndOfExpression();
    }
  }
  private appendEndOfExpression(): void {
    this.list.push(
      new SyntaxToken(SyntaxKind.endOfExpression, this.list.length, ''),
    );
  }

  public next(): BinarySplit {
    if (this.position >= this.list.length) {
      return {
        left: new LexarList(this.list.slice(0, this.position)),
        right: new LexarList(this.list.slice(this.position, this.list.length)),
        current: new SyntaxToken(SyntaxKind.endOfExpression, this.position, ''),
      };
    }
    const current = this.list[this.position];
    const position = this.position;
    this.position++;
    return {
      left: new LexarList(this.list.slice(0, position)),
      right: new LexarList(this.list.slice(position + 1, this.list.length)),
      current: current,
    };
  }
}
