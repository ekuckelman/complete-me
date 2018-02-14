export default class Node {
  constructor(data, completeWord = false) {
    this.data = data;
    this.completeWord = completeWord;
    this.children = {};
    this.popularity = 0;
  }
  
}

