import { expect } from 'chai';
import Node from '../lib/Node';
import Trie from '../lib/Trie';

import fs from 'fs';

const text = "/usr/share/dict/words"
const dictionary = fs.readFileSync(text).toString().trim().split('\n')


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

  describe('Suggest', () => {
    it('should suggest a word based on a prefix', () => {
      trie.insert('doggo');
      let suggestions = trie.suggest('do');
      expect(suggestions).to.eql(['doggo'])
    })
    it('should suggest multiple words', () => {
      trie.insert('doggo');
      trie.insert('dog');
      trie.insert('doggy');
      trie.insert('piano');
      trie.insert('pizza');
      trie.insert('doggoneprefixtries');
      trie.insert('piazza');
      trie.insert('tomato');
      let suggestions = trie.suggest('do');
      expect(suggestions.some(current => current === 'doggo')).to.be.true
      expect(suggestions.some(current => current === 'dog')).to.be.true
      expect(suggestions.some(current => current === 'doggy')).to.be.true
      expect(suggestions.some(current => current === 'doggoneprefixtries')).to.be.true 
      let options = trie.suggest('pi');
      expect(options.some(current => current === 'pizza')).to.be.true
      expect(options.some(current => current === 'piazza')).to.be.true
      expect(options.some(current => current === 'piano')).to.be.true
      let tWord = trie.suggest('to');
      expect(tWord.some(current => current === 'tomato')).to.be.true
    });
  });
  describe('Populate', () => {
    it('should Populate a dictionary', () => {
      expect(trie.count).to.equal(0);

      trie.populate(dictionary);

      expect(trie.count).to.equal(235886);
    });

    it('should suggest words from the dictionary', () => {
      trie.populate(dictionary);

      expect(trie.suggest('piz')).to.deep.equal([ 'pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle' ]);
    });
  });
  describe('select', () => {
    it('should prioritize ', () => {
      trie.populate(dictionary);

      expect(trie.suggest('piz')).to.deep.equal([ 'pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle' ]);
      trie.select('pizzeria');

      expect(trie.suggest('piz')).to.deep.equal([ 'pizzeria', 'pize', 'pizza', 'pizzicato', 'pizzle' ]);
    });
  });
  describe('delete', () => {
    it('should delete the word ', () => {
      trie.populate(dictionary);


      expect(trie.suggest('piz')).to.deep.equal([ 'pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle' ]);
      
      trie.delete('pizzeria');


      expect(trie.suggest('piz')).to.deep.equal([ 'pize', 'pizza', 'pizzicato', 'pizzle' ]);
    });
  });
});