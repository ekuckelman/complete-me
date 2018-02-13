import Node from './Node';

export default class Trie {
  constructor() {
    this.count = 0;
    this.children = {}; //will be a-z
  }

  insert(data) {
    this.count++;
    let splitData = data.split('');
    let currentNode = this.children;

    while(splitData.length) {
      let firstLetter = splitData.shift();
      if(!currentNode[firstLetter]) {
        currentNode[firstLetter] = new Node();
      }
      if(!splitData.length) {
        currentNode[firstLetter].completeWord = true
      }
      currentNode = currentNode[firstLetter].children;
    }
  }

  suggest(prefix) {
    let suggestions = [];
    let letters = prefix.split('');
    let currentLevel = this.children;
    let firstLetter;

    while(letters.length) {
      firstLetter = letters.shift();

      if(currentLevel[firstLetter]) {
        currentLevel = currentLevel[firstLetter].children;
      }
    }
    let lettersBelow = Object.keys(currentLevel);
    lettersBelow.forEach(letter => {
      while(currentLevel[letter]) {
        currentLevel = currentLevel[letter].children;
      }
    })
    return suggestions;
  }
}