export class Symbol {
  constructor(
    public name: string, public type: string,
    public attribute: string, public index: number) {}
}

export class SymbolTable {
  table: {[key: string]: Symbol} = {}
  indexTable: {[key: string]: number} = {
    field: -1,
    static: -1,
    local: -1,
    argument: -1,
  }

  addSymbol(name: string, type: string, attribute: string) {
    if (name in this.table) {
      throw new Error(`symbol ${name} is already declared`)
    }
    if (!(attribute in this.indexTable)) {
      throw new Error(`invalid attribute name ${attribute}`)
    }
    this.indexTable[attribute]++
    this.table[name] = new Symbol(name, type, attribute, this.indexTable[attribute])
  }

  getSymbol(name: string) {
    return this.table[name] || null
  }

  getSymbolType(name: string) {
    return this.table[name]?.type || null
  }

  getSymbolAttribute(name: string) {
    return this.table[name]?.attribute || null
  }

  getSymbolIndex(name: string) {
    return this.table[name] ? this.table[name].index : null
  }
}
