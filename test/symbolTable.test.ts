import chai from 'chai'

import { SymbolTable, Symbol } from '../src/symbolTable'

const expect = chai.expect

describe('symbol test', () => {
  it('contain properties', () => {
    const symbol = new Symbol('nAccounts', 'int', 'static', 0)
    expect(symbol).to.deep.equal({
      name: 'nAccounts',
      type: 'int',
      attribute: 'static',
      index: 0,
    })
  })
}) 

describe('symbol table test', () => {
  let st: SymbolTable
  beforeEach(() => {
    st = new SymbolTable()
  })

  it('can be initiated', () => {
    expect(st).not.to.be.null
    expect(st.table).to.deep.equal({})
  })

  it('add symbol to table', () => {
    const symbol = new Symbol('nAccounts', 'int', 'static', 0)
    st.addSymbol(symbol)
    expect(st.table).to.deep.equal({
      'nAccounts': symbol,
    })

    const symbol2 = new Symbol('id', 'int', 'field', 0)
    st.addSymbol(symbol2)

    expect(st.table).to.deep.equal({
      'nAccounts': symbol,
      'id': symbol2,
    })

    const symbol3 = new Symbol('id', 'boolean', 'static', 1)
    expect(() => st.addSymbol(symbol)).to.throw()
  })

  it('get symbol from table', () => {
    const symbol = new Symbol('nAccounts', 'int', 'static', 0)
    st.addSymbol(symbol)
    expect(st.getSymbol('nAccounts')).to.deep.equal(symbol)
    expect(st.getSymbol('id')).to.equal(null)
  })

  it('get symbol from table', () => {
    const symbol = new Symbol('nAccounts', 'int', 'static', 0)
    st.addSymbol(symbol)
    expect(st.getSymbolType('nAccounts')).to.deep.equal('int')
    expect(st.getSymbolType('id')).to.equal(null)
  })
})
