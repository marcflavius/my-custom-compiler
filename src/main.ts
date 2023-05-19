/**
 * main
 */
import _ from 'lodash';
import promptSync from 'prompt-sync'
import { Lexar } from './app/Lexar.js';
let list = [];
const prompt = promptSync({ sigint: true });

function main() {
  while (true) {
    console.log('> ');
    const line = prompt('');
    if (_.isEmpty(line.trim())) {
      return;
    }
    const lexar = new Lexar(line);
    while (true) {
      const item = lexar.nextToken();
      if (item == undefined) {
        break;
      }
      list.push(item);
    }
    console.log(list);
    list = [];
  }
}

main()
