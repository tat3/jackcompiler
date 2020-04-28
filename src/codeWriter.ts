import { CstNode } from 'chevrotain'
import { Parser } from './parser'
import { SymbolTable, Symbol } from './symbolTable'
const parser = new Parser()
const BaseJackVisitor = parser.getBaseCstVisitorConstructorWithDefaults()

const idName = (ctx: any) => ctx.Identifier[0].image as string

const attr2seg = (attribute: string) => {
  return ({
    field: 'this',
    static: 'static',
    local: 'local',
    argument: 'argument'
  } as { [key: string]: string })[attribute]
}

class JackVisitor extends BaseJackVisitor {
  _className = ''
  table = new SymbolTable()
  classVarTable = new SymbolTable()
  codes: string[] = []
  ifIndex = 0
  whileIndex = 0
  nFields = 0

  constructor() {
    super()
    this.validateVisitor()
  }

  $p = (code: string) => {
    this.codes.push(code)
  }

  classDec = (ctx: any) => {
    this._className = this.visit(ctx.className)

    ctx.classVarDec?.forEach((varDec: any) => this.visit(varDec))
    ctx.subroutineDec?.forEach((sub: any) => this.visit(sub))
  }

  classVarDec = (ctx: any) => {
    const names = ctx.varName.map((varName: any) => this.visit(varName)) as string[]
    const type = this.visit(ctx.typeName) as string
    const attribute = (ctx.Field || ctx.Static)[0].image as string
    names.forEach((name) => {
      this.classVarTable.addSymbol(name, type, attribute)
    })
    if (ctx.Field) {
      this.nFields += names.length
    }
  }

  subroutineDec = (ctx: any) => {
    this.table = this.classVarTable.clone()
    this.ifIndex = 0
    const nLocals = ctx.subroutineBody[0].children.varDec?.length || 0
    this.$p(`function ${this._className}.${this.visit(ctx.subroutineName)} ${nLocals}`)
    if (ctx.Constructor) {
      this.$p(`push constant ${this.nFields}`)
      this.$p(`call Memory.alloc 1`)
      this.$p(`pop pointer 0`)
    }
    if (ctx.Method) {
      this.$p(`push argument 0`)
      this.$p(`pop pointer 0`)
    }
    this.visit(ctx.parameterList)
    this.visit(ctx.subroutineBody)
  }

  subroutineBody = (ctx: any) => {
    (ctx.varDec || []).forEach((varDec: any) => this.visit(varDec))
    this.visit(ctx.statements)
  }

  statements = (ctx: any) => {
    ctx.statement.forEach((statement: any) => this.visit(statement))
  }

  statement = (ctx: any) => {
    const name = Object.keys(ctx)[0]
    this.visit(ctx[name])
  }

  letStatement = (ctx: any) => {
    this.visit(ctx.expression)
    const name = this.visit(ctx.varName)
    const attribute = this.table.getSymbolAttribute(name)
    if (!attribute) {
      throw new Error(`symbol ${name} is not declared`)
    }
    const segment = attr2seg(attribute)
    const symbolId = this.table.getSymbolIndex(name)
    this.$p(`pop ${segment} ${symbolId}`)
  }

  ifStatement = (ctx: any) => {
    this.visit(ctx.expression)
    this.$p(`if-goto IF_TRUE${this.ifIndex}`)
    this.$p(`goto IF_FALSE${this.ifIndex}`)
    this.$p(`label IF_TRUE${this.ifIndex}`)
    this.visit(ctx.statements[0])
    if (ctx.Else) {
      this.$p(`goto IF_END${this.ifIndex}`)
    }
    this.$p(`label IF_FALSE${this.ifIndex}`)
    if (ctx.Else) {
      this.visit(ctx.statements[1])
      this.$p(`label IF_END${this.ifIndex}`)
    }
    this.ifIndex++
  }

  whileStatement = (ctx: any) => {
    const index = this.whileIndex
    this.whileIndex++
    this.$p(`label WHILE_EXP${index}`)
    this.visit(ctx.expression)
    this.$p(`not`)
    this.$p(`if-goto WHILE_END${index}`)
    this.visit(ctx.statements)
    this.$p(`goto WHILE_EXP${index}`)
    this.$p(`label WHILE_END${index}`)
  }

  doStatement = (ctx: any) => {
    this.visit(ctx.subroutineCall)
    this.$p(`pop temp 0`)
  }

  returnStatement = (ctx: any) => {
    if (ctx.expression) {
      this.visit(ctx.expression)
    } else {
      this.$p(`push constant 0`)
    }
    this.$p(`return`)
  }

  typeName = (ctx: any) => {
    return ctx.className ?
      this.visit(ctx.className) :
      ctx[Object.keys(ctx)[0]].image
  }

  parameterList = (ctx: any) => {
    ctx.varName?.forEach((varName: any, i: number) => {
      const typeName = ctx.typeName[i]
      this.table.addSymbol(this.visit(varName), this.visit(typeName), 'argument')
    })
  }

  varDec = (ctx: any) => {
    const names = ctx.varName.map((varName: any) => this.visit(varName)) as string[]
    const type = this.visit(ctx.typeName) as string
    names.forEach((name) => {
      this.table.addSymbol(name, type, 'local')
    })
  }

  className = (ctx: any) => {
    return ctx.Identifier[0].image
  }

  subroutineName = (ctx: any) => {
    return ctx.Identifier[0].image
  }

  varName = (ctx: any) => {
    return ctx.Identifier[0].image
  }

  expression = (ctx: any) => {
    let opIndex = 0
    this.visit(ctx.termExpression[0])
    ctx.termExpression.slice(1).forEach((term: any) => {
      this.visit(term)
      this.visit(ctx.op[opIndex])
      opIndex++
    })
  }

  termExpression = (ctx: any) => {
    const name = Object.keys(ctx)[0]
    switch (name) {
      case 'LRound':
        this.visit(ctx.expression)
        break
      case 'keywordConstant':
        this.visit(ctx[name])
        break
      case 'integerConstant':
        this.visit(ctx[name])
        break
      case 'subroutineCall':
        this.visit(ctx[name])
        break
      case 'varName':
        const vn = this.visit(ctx[name])
        const attribute = this.table.getSymbolAttribute(vn)
        if (!attribute) {
          throw new Error(`symbol ${vn} is not declared`)
        }
        const index = this.table.getSymbolIndex(vn)
        this.$p(`push ${attr2seg(attribute)} ${index}`)
        break
      case 'unaryOp':
        this.visit(ctx.termExpression)
        this.visit(ctx.unaryOp)
        break

      default:
        console.log(name)
        throw new Error(`invalid term name ${name}`)
    }
  }

  subroutineCall = (ctx: any) => {
    const nArgs = ctx.expressionList[0].children.expression?.length || 0
    const subroutineName = this.visit(ctx.subroutineName)
    if (ctx.Identifier) {
      const symbol = this.table.getSymbol(idName(ctx))
      const symbolType = symbol?.type
      const index = symbol?.index
      const attribute = symbol?.attribute
      if (symbol) {

        const segment = attr2seg(symbol.attribute)
        this.$p(`push ${segment} ${index}`)
        this.visit(ctx.expressionList)
        this.$p(`call ${symbolType}.${subroutineName} ${nArgs + 1}`)
      } else {
        this.visit(ctx.expressionList)
        this.$p(`call ${idName(ctx)}.${subroutineName} ${nArgs}`)
      }
    } else {
      this.$p(`push pointer 0`)
      this.visit(ctx.expressionList)
      this.$p(`call ${this._className}.${subroutineName} ${nArgs + 1}`)
    }
  }

  expressionList = (ctx: any) => {
    (ctx.expression || []).forEach((expression: any) => this.visit(expression))
  }

  op = (ctx: any) => {
    const cmd = ctx.Plus ? 'add'
      : ctx.Minus ? 'sub'
      : ctx.LT ? 'lt'
      : ctx.GT ? 'gt'
      : ctx.Equal ? 'eq'
      : ctx.Ampersand ? 'and'
      : ctx.Bar ? 'or'
      : undefined
    if (!cmd) {
      throw new Error(`invalid operator ${JSON.stringify(ctx, null, 2)}`)
    }
    this.$p(cmd)
  }

  unaryOp = (ctx: any) => {
    if (ctx.Minus) {
      this.$p(`neg`)
    } else if (ctx.Tilde) {
      this.$p(`not`)
    } else {
      throw new Error(`invalid unaryOp ${ctx}`)
    }
  }

  keywordConstant = (ctx: any) => {
    if (ctx.True) {
      this.$p(`push constant 0`)
      this.$p(`not`)
    } else if (ctx.False) {
      this.$p(`push constant 0`)
    } else if (ctx.Null) {
      this.$p(`push constant 0`)
    } else if (ctx.This) {
      this.$p(`push pointer 0`)
    } else {
      throw new Error(`invalid keyword ${ctx}`)
    }
  }

  integerConstant = (ctx: any) => {
    const name = ctx.IntegerLiteral[0].image
    this.$p(`push constant ${name}`)
  }
  stringConstant = (ctx: any) => ctx.IntegerLiteral[0].image
}

export class CodeWriter {
  build = (node: CstNode) => {
    const jackVisitor = new JackVisitor()
    jackVisitor.visit(node)
    return jackVisitor.codes.map(code => code + '\n').join('')
  }
}
