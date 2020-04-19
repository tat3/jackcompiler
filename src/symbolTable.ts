export class Symbol {
  constructor(
    public name: string, public type: string,
    public attribute: string, public index: number) {}
}

export class SymbolTable {
  table: {[key: string]: Symbol} = {}

  addSymbol(symbol: Symbol) {
    if (symbol.name in this.table) {
      throw new Error(`symbol ${symbol.name} is already declared`)
    }
    this.table[symbol.name] = symbol
  }

  getSymbol(name: string) {
    return this.table[name] || null
  }

  getSymbolType(name: string) {
    return this.table[name]?.type || null
  }
}
