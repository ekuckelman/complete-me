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
  it('Should exist', () => {
    expect(trie).to.exist;
  });
  
  it('Should track the number of words', () => {
    expect(trie.wordCounter).to.equal(0)
  });
  it('Should be able to store child nodes', () => {
    expect(trie.children).to.deep.equal({});
  })
  describe('Insert', () => {
    it('Should be able to increment the wordCounter', () => {
      expect(trie.wordCounter).to.equal(0)
      
      trie.insert('pizza');
      expect(trie.wordCounter).to.equal(1)
    })
    it('Should create keys in the children object of the frist letter', () => {
       trie.insert('pizza');
       trie.insert('monkey');
       trie.insert('ballons');
       expect(Object.keys(trie.children)).to.deep.equal(['p', 'm', 'b'])
    })
    it('Should be able to take in more than one word starting with the same letter', () => {
      trie.insert('tacocat');
      trie.insert('pizza');
      trie.insert('cat');
      trie.insert('zam');
      trie.insert('dog');
      trie.insert('catalog');
      expect(Object.keys(trie.children)).to.deep.equal(['t', 'p', 'c', 'z', 'd' ])
      expect(trie.wordCounter).to.equal(6)
    })   
  })
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
   })
 })
  describe('POPULATE', () => {
    it('should Populate a dictionary', () => {
      expect(trie.wordCounter).to.equal(0);
      trie.populate(dictionary);
      expect(trie.wordCounter).to.equal(235886)
    })
    it('Should suggest words from the dictionary', () =>{
      trie.populate(dictionary);
      expect(trie.suggest('piz')).to.deep.equal(['pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle'])
    })
  })
  describe('Select', () => {
    it('Should should increase its popularity when it is selected', function() {
      trie.populate(dictionary);
      expect(trie.suggest('piz')).to.deep.equal(['pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle']);
      trie.select('pizzeria');
       expect(trie.suggest('piz')).to.deep.equal(['pizzeria', 'pize', 'pizza', 'pizzicato', 'pizzle'])
      
    })
  })
  describe('delete', () => {
    it('Should should increase its popularity when it is delete', function(){
      trie.populate(dictionary);
      expect(trie.suggest('piz')).to.deep.equal(['pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle']);
      trie.delete('pizzeria');
       expect(trie.suggest('piz')).to.deep.equal(['pize', 'pizza', 'pizzicato', 'pizzle'])
      
    })
  })
})