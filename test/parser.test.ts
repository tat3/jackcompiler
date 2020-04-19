import chai from 'chai'
import fs from 'fs'

import { Tokenizer } from '../src/tokenizer'
import { Parser } from '../src/parser'

const expect = chai.expect

describe('parser test', () => {
  let p: Parser
  beforeEach(() => {
    p = new Parser()
  })

  it('can be initiated', () => {
    expect(p).not.to.be.null
  })

  it('parse jack script', () => {
    const testDir = 'test/data/Square'
    const tests = [
      { file: 'Main.jack', n: 40 },
      { file: 'Square.jack', n: 559 },
      { file: 'SquareGame.jack', n: 313 },
    ]
    tests.forEach(test => {
      const script = fs.readFileSync(`${testDir}/${test.file}`, { encoding: 'utf8' })
      const t = new Tokenizer()
      const tokenized = t.tokenize(script)

      expect(tokenized.errors).to.have.length(0)
      expect(tokenized.tokens).to.have.length(test.n)

      p.parse(tokenized.tokens)
      p.errors.forEach(console.log)
      expect(p.errors).to.have.length(0)
    })
  })
})
