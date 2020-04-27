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
    st.addSymbol('nAccounts', 'int', 'static')
    expect(st.table).to.deep.equal({
      'nAccounts': symbol,
    })

    const symbol2 = new Symbol('id', 'int', 'field', 0)
    st.addSymbol('id', 'int', 'field')

    expect(st.table).to.deep.equal({
      'nAccounts': symbol,
      'id': symbol2,
    })

    expect(() => st.addSymbol('id', 'boolean', 'static')).to.throw()
  })

  it('get symbol from table', () => {
    const symbol = new Symbol('nAccounts', 'int', 'static', 0)
    st.addSymbol('nAccounts', 'int', 'static')
    expect(st.getSymbol('nAccounts')).to.deep.equal(symbol)
    expect(st.getSymbol('id')).to.equal(null)
  })

  it('get symbol properties from table', () => {
    st.addSymbol('nAccounts', 'int', 'static')
    expect(st.getSymbolType('nAccounts')).to.equal('int')
    expect(st.getSymbolType('id')).to.equal(null)

    expect(st.getSymbolAttribute('nAccounts')).to.equal('static')
    expect(st.getSymbolIndex('nAccounts')).to.equal(0)
  })
})
