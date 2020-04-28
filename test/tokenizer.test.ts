import chai from 'chai'
import fs from 'fs'
import { Tokenizer } from '../src/tokenizer'

const expect = chai.expect

describe('tokenizer test', () => {
  let t: Tokenizer
  beforeEach(() => {
    t = new Tokenizer()
  })

  it('can be initiated', () => {
    expect(t).not.to.be.null
    expect(t.vmLexer).not.to.be.null
  })

  it('tokenize jack script', () => {
    const testDir = 'test/data/Square'
    const tests = [
      { file: 'Main.jack', n: 40 },
      { file: 'Square.jack', n: 559 },
      { file: 'SquareGame.jack', n: 313 },
    ]
    tests.forEach(test => {
      const script = fs.readFileSync(`${testDir}/${test.file}`, { encoding: 'utf8' })
      const tokenized = t.tokenize(script)

      tokenized.errors.forEach(console.log)
      expect(tokenized.errors).to.have.length(0)
      expect(tokenized.tokens).to.have.length(test.n)
    })
  })

  it('tokenize identifier rather than keyword', () => {
    const script = 'double'
    const tokenized = t.tokenize(script)

      tokenized.errors.forEach(console.log)
      expect(tokenized.errors).to.have.length(0)
      expect(tokenized.tokens).to.have.length(1)
      expect(tokenized.tokens[0].image).not.to.equal('do')
      expect(tokenized.tokens[0].image).to.equal('double')
  })
})
