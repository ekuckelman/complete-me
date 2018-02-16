import Node from './Node';

export default class Trie {
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
    const currentNode = this.findNode(word); //assign the word found in findNode() to currentNode
    let suggestionsArray = []; // set up an array to catch possible suggestions
    let nodeKeys = Object.keys(currentNode); // grab to keys of the currentNode

    const searchWords = (array, level) => { //recursive function that runs down all branches of each key
      array.forEach(letter => { //iterate over each letter of the current node
        let nodeLevel = level; //variable to change what level we are on

        if (nodeLevel[letter].completeWord) { //check each level for words with a value of completeWord
          if (nodeLevel[letter].popularity === 0) { //check if the popularity value equals 0
            suggestionsArray.push(nodeLevel[letter].completeWord); // if it is set to 0, then put it at the end of the array
          } else {
            suggestionsArray.unshift(nodeLevel[letter].completeWord);//if it's not 0, then put it at the beginning of the array
          } 
        }
        if (Object.keys(nodeLevel[letter].children).length) { // traverse down the tree to check if that node level has any children
          nodeLevel = nodeLevel[letter].children; //if it does, then reassign that as the new level
          searchWords(Object.keys(nodeLevel), nodeLevel); // keep searching for child keys
        }
      });
    };
    searchWords(nodeKeys, currentNode); //travels down the tree
    return suggestionsArray; //returns the array
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