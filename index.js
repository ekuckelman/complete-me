class Node {
  constructor(data, completeWord = false) {
    this.data = data;
    this.completeWord = completeWord;
    this.children = {};
    this.popularity = 0;
  }
}

class Trie {
  constructor () {
    this.wordCounter = 0;
    this.children = {}; 
  }

  insert(word) {
     let lettersArray = word.split('');
     let currentNode = this.children;

     while(lettersArray.length) {
      let firstLetter = lettersArray.shift();
      if(!currentNode[firstLetter]){
        currentNode[firstLetter] = new Node(firstLetter);
      } if(!lettersArray.length && currentNode[firstLetter].completeWord === false) {
        this.wordCounter++;
        currentNode[firstLetter].completeWord = word;
      }
      currentNode = currentNode[firstLetter].children;
     }  
  }

  findNode(word) {
    let lettersArray = word.split('');
    let currentNode = this.children;

    while (lettersArray.length) { 
      let firstLetter = lettersArray.shift();

      if (Object.keys(currentNode).find(letter => letter === firstLetter)) {
        currentNode = currentNode[firstLetter].children;
      } 
    }
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
    };
    searchWords(nodeKeys, currentNode);
    return suggestionsArray;
  }

  populate(array) {
    array.forEach(word => {
      this.insert(word);
    });
  }

  transverseDown(lettersArray) {
    let currentNode = this.children;

    while (lettersArray.length > 1) { 
      let firstLetter = lettersArray.shift();

      if (Object.keys(currentNode).find(letter => letter === firstLetter)) {
        currentNode = currentNode[firstLetter].children;
      }
    }
    return currentNode;
  }

  select(word) {
    let lettersArray = word.split('');
    let lastNode = this.transverseDown(lettersArray);
   
    lastNode[lettersArray].popularity++;
  }

  delete(word) {
    let lettersArray = word.split('');
    let lastNode = this.transverseDown(lettersArray);

    lastNode[lettersArray].completeWord = false;
    this.wordCounter--;
  }
}

module.exports = {Node, Trie};
