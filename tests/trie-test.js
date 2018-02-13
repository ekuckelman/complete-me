import { expect } from 'chai';
import Node from '../lib/Node';
import Trie from '../lib/Trie';


describe('Trie', () => {
  let trie;

  beforeEach(() => {
    trie = new Trie();
  });

  it('should instantiate our good friend trie', () =>{
    expect(trie).to.exist;
  })

  it('should track the number of words', () => {
    expect(trie.count).to.equal(0);
  });

  it('should store child nodes', () => { 
    expect(trie.children).to.deep.equal({});
  });

  describe('Insert', () => {
    it('should increment the number of words', () => {
      trie.insert('tacocat');
      expect(trie.count).to.equal(1);
    });

    it('should create keys in children object of first letter', () => {
      trie.insert('tacocat');
      trie.insert('pizza');
      trie.insert('cat');
      expect(Object.keys(trie.children)).to.deep.equal(['t', 'p', 'c'])
    });

    it('should be able to take in more than one word starting w/ the same letter', () =>{
      trie.insert('tacocat');
      trie.insert('pizza');
      trie.insert('cat');
      trie.insert('piano');
      trie.insert('dog');
      trie.insert('catalog');
      expect(Object.keys(trie.children)).to.deep.equal(['t', 'p', 'c', 'd']);
      expect(trie.count).to.equal(6);
    });
  });

  describe('suggest', () => {
    it('should return an array of suggested words', () => {
      let results = trie.suggest('pi');
      let check1 = results.some(result => result === 'pizza');
      let check2 = results.some(result => result === 'pizzas');
      let check3 = results.some(result => result === 'piano');
      let check4 = results.some(result => result === 'dog');
    });
  });
});