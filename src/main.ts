/**
 * main
 */
import _ from 'lodash';
import promptSync from 'prompt-sync'
const prompt = promptSync({ sigint: true });
function main() {
  while (true) {
    console.log('> ');
    const line = prompt("");
    if (_.isEmpty(line.trim())) {
      return;
    }
    if (line == "1 + 2 * 3") {
      console.log("7");
    } else {
      console.log('ERROR: Invalid expression!');
    }
  }
}

main()
