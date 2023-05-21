/* eslint-disable no-constant-condition */
import { LexarList } from './LexarList.js';
import { SyntaxKind, SyntaxToken } from './SyntaxToken.js';
import { SyntaxNode } from './SyntaxNode.js';

export class BinaryExpressionSyntax {
  public left: SyntaxNode[];
  public right: SyntaxNode[];
  public value: SyntaxNode;
  constructor(config: { left: any; right: any; value: any }) {
    config.left = this.left;
    config.right = this.right;
    config.value = this.value;
  }
}

export class Parse {
  private operationPriority: SyntaxKind[][] = [
    [SyntaxKind.multiplyToken, SyntaxKind.divideToken],
    [SyntaxKind.additionToken, SyntaxKind.subtractToken],
    [SyntaxKind.numberToken],
  ];
  public tree: SyntaxNode;
  position = 0;
  currentSyntaxToken: SyntaxToken;

  public parseBinaryExpression(lexarList: LexarList): any {
    // console.info('^^lexarList', lexarList);
    let priorityIndex = 0;
    const root = new BinaryExpressionSyntax({
      left: null,
      right: null,
      value: 1,
    });
    while (true) {
      const priority = this.operationPriority[priorityIndex];
      const currentBinarySplit = lexarList.next();
      // console.info('^^priorityIndex', priorityIndex);
      // console.info('^^priority', priority);

      if (priority.includes(currentBinarySplit.current.kind)) {
        root.left = this.parseBinaryExpression(currentBinarySplit.left);
        root.right = this.parseBinaryExpression(currentBinarySplit.right);
        root.value = currentBinarySplit.current;
        // console.log(root);
      }

      if (currentBinarySplit.current.kind === SyntaxKind.endOfExpression) {
        // console.info('^^ rootvalue priorityIndex', root.value, priorityIndex);
        if (
          root.value === undefined &&
          priorityIndex + 1 < this.operationPriority.length
        ) {
          // console.log('in');
          lexarList.cursorBackToStart();
          priorityIndex++;
          continue;
        }
        return root;
      }
    }
  }
}
