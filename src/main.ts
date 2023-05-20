/* eslint-disable no-constant-condition */
/**
 * main
*/
import _ from 'lodash';
import promptSync from 'prompt-sync';
import { Lexar } from './app/Lexar.js';
import { SyntaxKind, SyntaxToken } from './app/SyntaxToken.js';
let list: SyntaxToken[] = [];
const prompt = promptSync({ sigint: true });

/**
 * Application entry point
 *
 * @return {*}  {void}
 */
function main(): void {
  while (true) {
    console.log('> ');
    const line = prompt('');
    if (_.isEmpty(line)) {
      return;
    }
    const lexar = new Lexar(line);
    while (true) {
      const token: SyntaxToken = lexar.nextToken();
      if (token.kind == SyntaxKind.endOfLineToken) {
        list.push(token);
        break;
      }
      list.push(token);
    }
    console.log(list);
    list = [];
  }
}

main();
