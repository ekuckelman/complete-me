import Node from './Node';

export default class Trie {
  constructor () {
    this.wordCounter = 0;
    this.children = {}; 
  }

  insert(word) {
    this.wordCounter++;
    let letters = word.split('');
    let currentNode = this.children;
    while (letters.length) {
      let currentLetter = letters.shift();
      if (!currentNode[currentLetter]) {
        currentNode[currentLetter] = new Node(currentLetter);
      } 
      
      if (!letters.length) {
        currentNode[currentLetter].completeWord = word
      }
      
      currentNode = currentNode[currentLetter].children;
    }
  }

  findNode(word) {
    let lettersArray = word.split('');
    let currentNode = this.children;
     while(lettersArray.length) { 
      let currentLetter = lettersArray.shift();
      if(Object.keys(currentNode).find(letter => letter === currentLetter)) {
        currentNode = currentNode[currentLetter].children;
      } }
    return currentNode;
  }

  suggest(word) {
    const currentNode = this.findNode(word);
   
    let suggestionsArray = [];
    let nodeKeys = Object.keys(currentNode);
    const searchWords = (array, level) => {
      array.forEach(letter => {
        let nodeLevel = level;
        if (nodeLevel[letter].completeWord) {
          if (nodeLevel[letter].popularity === 0) {
            suggestionsArray.push(nodeLevel[letter].completeWord);
          } else {
            suggestionsArray.unshift(nodeLevel[letter].completeWord);
          } 
        }
        if (Object.keys(nodeLevel[letter].children).length) {
          nodeLevel = nodeLevel[letter].children;
          searchWords(Object.keys(nodeLevel), nodeLevel);
        }
      });
    }
    searchWords(nodeKeys, currentNode);
    return suggestionsArray;
  }

  populate(array) {
    array.forEach(word => {
      this.insert(word)
    })
  }

  transverseDown(currentNode, lettersArray) {
    while (lettersArray.length > 1) { 
      let currentLetter = lettersArray.shift();
      
      if (Object.keys(currentNode).find(letter => letter === currentLetter)) {
        currentNode = currentNode[currentLetter].children;
      }
    }
    return currentNode;
  }

  select(word) {
    let lettersArray = word.split('');
    let currentNode = this.children;
   
    this.transverseDown(currentNode, lettersArray)[lettersArray[0]].popularity++;
  }

  delete(word) {
    let lettersArray = word.split('');
    let currentNode = this.children;
    
    this.transverseDown(currentNode,lettersArray)[lettersArray[0]].completeWord = false;
  }
}