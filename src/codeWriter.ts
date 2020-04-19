import { CstNode } from 'chevrotain'
import { Parser } from './parser'
import { SymbolTable, Symbol } from './symbolTable'
const parser = new Parser()
const BaseJackVisitor = parser.getBaseCstVisitorConstructorWithDefaults()

const idName = (ctx: any) => ctx.Identifier[0].image as string

class JackVisitor extends BaseJackVisitor {
  _className = ''
  table = new SymbolTable()
  codes: string[] = []

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
    const attribute = (ctx.Field || ctx.Static).image as string
    names.forEach((name, i) => {
      const symbol = new Symbol(name, type, attribute, i)
      this.table.addSymbol(symbol)
    })
  }

  subroutineDec = (ctx: any) => {
    const nLocals = ctx.subroutineBody[0].children.varDec?.length || 0
    this.$p(`function ${this._className}.${this.visit(ctx.subroutineName)} ${nLocals}`)
    this.visit(ctx.subroutineBody)
  }

  subroutineBody = (ctx: any) => {
    this.visit(ctx.varDec)
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
    const symbolId = 0
    this.$p(`pop local ${symbolId}`)
  }

  ifStatement = (ctx: any) => {}

  whileStatement = (ctx: any) => {}

  doStatement = (ctx: any) => {
    const symbolId = 0
    this.$p(`push local ${symbolId}`)
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
    if (ctx.className) {
      return this.visit(ctx.className)
    } else {
      const name = Object.keys(ctx)[0]
      return ctx[name].image
    }
  }

  parameterList = (ctx: any) => {}

  varDec = (ctx: any) => {
    const names = ctx.varName.map((varName: any) => this.visit(varName)) as string[]
    const type = this.visit(ctx.typeName) as string
    names.forEach((name, i) => {
      const symbol = new Symbol(name, type, 'local', i)
      this.table.addSymbol(symbol)
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
    ctx.termExpression.forEach((term: any) => this.visit(term))
  }

  termExpression = (ctx: any) => {
    const name = Object.keys(ctx)[0]
    this.visit(ctx[name])
  }

  subroutineCall = (ctx: any) => {
    const nArgs = ctx.expressionList[0].children.expression?.length || 0
    const subroutineName = this.visit(ctx.subroutineName)
    if (ctx.Identifier) {
      const symbolType = this.table.getSymbolType(idName(ctx))
      if (symbolType) {
        this.$p(`call ${symbolType}.${subroutineName} ${nArgs + 1}`)
      } else {
        this.$p(`call ${idName(ctx)}.${subroutineName} ${nArgs}`)
      }
    } else {
      this.$p(`call ${this._className}.${subroutineName} ${nArgs}`)
    }
  }

  expressionList = (ctx: any) => {}

  op = (ctx: any) => {}

  unaryOp = (ctx: any) => {}

  keywordConstant = (ctx: any) => {}
}

export class CodeWriter {
  build = (node: CstNode) => {
    const jackVisitor = new JackVisitor()
    jackVisitor.visit(node)
    return jackVisitor.codes.map(code => code + '\n').join('')
  }
}
