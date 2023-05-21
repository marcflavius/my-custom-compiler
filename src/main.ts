/* eslint-disable no-constant-condition */
/**
 * main
*/
import _ from 'lodash';
import promptSync from 'prompt-sync';
import { Lexar } from './app/Lexar.js';
import { LexarList } from './app/LexarList.js';
import { Parse } from './app/Parse.js';
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
    const tokenList = new Lexar(line).getList();
    const lexarList = new LexarList(tokenList);
    const parser = new Parse();
    const root = parser.parseBinaryExpression(lexarList);
    console.info('^^root', root);
  }
}

main();
