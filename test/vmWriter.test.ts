import chai from 'chai'
import fs from 'fs'

import { Tokenizer } from '../src/tokenizer'
import { Parser } from '../src/parser'
import { CodeWriter } from '../src/codeWriter'

const expect = chai.expect

describe('code writer test', () => {
  let cw: CodeWriter
  beforeEach(() => {
    cw = new CodeWriter()
  })

  it('can be initiated', () => {
    expect(cw).not.to.be.null
  })

  it('compile jack script to vm code', () => {
    const testDir = 'test/data/Square'
    const tests = [
      { file: 'Main' },
      { file: 'Square' },
      { file: 'SquareGame' },
    ]

    tests.forEach(test => {
      const jack = fs.readFileSync(`${testDir}/${test.file}.jack`, { encoding: 'utf8' })
      const vm = fs.readFileSync(`${testDir}/${test.file}.vm`, { encoding: 'utf8' })
      const t = new Tokenizer()
      const p = new Parser()
      const tokenized = t.tokenize(jack)

      expect(tokenized.errors).to.have.length(0)
      const node = p.parse(tokenized.tokens)
      expect(p.errors).to.have.length(0)

      expect(cw.build(node)).to.equal(vm)
    })

  }) 
})
