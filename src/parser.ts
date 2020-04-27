import { CstParser, IToken, CstNode } from 'chevrotain'

import * as Tokens from './tokens'

export class Parser extends CstParser {
  constructor() {
    super(Tokens.allTokens)

    const $ = this as any

    // block
    $.RULE('classDec', () => {
      $.CONSUME(Tokens.Class)
      $.SUBRULE($.className)
      $.CONSUME(Tokens.LCurly)

      $.MANY1(() => {
        $.SUBRULE($.classVarDec)
      })

      $.MANY2(() => {
        $.SUBRULE($.subroutineDec)
      })

      $.CONSUME(Tokens.RCurly)
    })

    $.RULE('classVarDec', () => {
      $.OR([
        { ALT: () => $.CONSUME(Tokens.Static)},
        { ALT: () => $.CONSUME(Tokens.Field)},
      ])

      $.SUBRULE($.typeName)
      $.MANY_SEP({
        SEP: Tokens.Comma,
        DEF: () => {
          $.SUBRULE($.varName)
        }
      })

      $.CONSUME(Tokens.Semicolon)
    })

    $.RULE('typeName', () => {
      $.OR([
        { ALT: () => $.CONSUME(Tokens.Int)},
        { ALT: () => $.CONSUME(Tokens.Char)},
        { ALT: () => $.CONSUME(Tokens.Boolean)},
        { ALT: () => $.SUBRULE($.className)},
      ])
    })

    $.RULE('subroutineDec', () => {
      $.OR1([
        { ALT: () => $.CONSUME(Tokens.Constructor)},
        { ALT: () => $.CONSUME(Tokens.Function)},
        { ALT: () => $.CONSUME(Tokens.Method)},
      ])
      $.OR2([
        { ALT: () => $.CONSUME(Tokens.Void)},
        { ALT: () => $.SUBRULE($.typeName)},
      ])
      $.SUBRULE($.subroutineName)
      $.CONSUME(Tokens.LRound)
      $.SUBRULE($.parameterList)
      $.CONSUME(Tokens.RRound)

      $.SUBRULE($.subroutineBody)
    })

    $.RULE('parameterList', () => {
      $.MANY_SEP({
        SEP: Tokens.Comma,
        DEF: () => {
          $.SUBRULE($.typeName)
          $.SUBRULE($.varName)
        }
      })
    })

    $.RULE('subroutineBody', () => {
      $.CONSUME(Tokens.LCurly)
      $.MANY(() => {
        $.SUBRULE($.varDec)
      })
      $.SUBRULE($.statements)
      $.CONSUME(Tokens.RCurly)
    })

    $.RULE('varDec', () => {
      $.CONSUME(Tokens.Var)
      $.SUBRULE($.typeName)
      $.MANY_SEP({
        SEP: Tokens.Comma,
        DEF: () => {
          $.SUBRULE($.varName)
        }
      })
      $.CONSUME(Tokens.Semicolon)
    })

    $.RULE('className', () => {
      $.CONSUME(Tokens.Identifier)
    })

    $.RULE('subroutineName', () => {
      $.CONSUME(Tokens.Identifier)
    })

    $.RULE('varName', () => {
      $.CONSUME(Tokens.Identifier)
    })

    // statement
    $.RULE('statements', () => {
      $.MANY(() => {
        $.SUBRULE($.statement)
      })
    })

    $.RULE('statement', () => {
      $.OR([
        { ALT: () => $.SUBRULE($.letStatement)},
        { ALT: () => $.SUBRULE($.ifStatement)},
        { ALT: () => $.SUBRULE($.whileStatement)},
        { ALT: () => $.SUBRULE($.doStatement)},
        { ALT: () => $.SUBRULE($.returnStatement)},
      ])
    })

    $.RULE('letStatement', () => {
      $.CONSUME(Tokens.Let)
      $.SUBRULE($.varName)
      $.OPTION(() => {
        $.CONSUME(Tokens.LSquare)
        $.SUBRULE($.expression)
        $.CONSUME(Tokens.RSquare)
      })
      $.CONSUME(Tokens.Equal)
      $.SUBRULE1($.expression)
      $.CONSUME(Tokens.Semicolon)
    })

    $.RULE('ifStatement', () => {
      $.CONSUME(Tokens.If)
      $.CONSUME(Tokens.LRound)
      $.SUBRULE($.expression)
      $.CONSUME(Tokens.RRound)
      $.CONSUME(Tokens.LCurly)
      $.SUBRULE($.statements)
      $.CONSUME(Tokens.RCurly)

      $.OPTION(() => {
        $.CONSUME(Tokens.Else)
        $.CONSUME1(Tokens.LCurly)
        $.SUBRULE1($.statements)
        $.CONSUME1(Tokens.RCurly)
      })
    })

    $.RULE('whileStatement', () => {
      $.CONSUME(Tokens.While)
      $.CONSUME(Tokens.LRound)
      $.SUBRULE($.expression)
      $.CONSUME(Tokens.RRound)
      $.CONSUME(Tokens.LCurly)
      $.SUBRULE($.statements)
      $.CONSUME(Tokens.RCurly)
    })

    $.RULE('doStatement', () => {
      $.CONSUME(Tokens.Do)
      $.SUBRULE($.subroutineCall)
      $.CONSUME(Tokens.Semicolon)
    })

    $.RULE('returnStatement', () => {
      $.CONSUME(Tokens.Return)
      $.OPTION(() => {
        $.SUBRULE($.expression)
      })
      $.CONSUME(Tokens.Semicolon)
    })

    // expression
    $.RULE('expression', () => {
     $.SUBRULE($.termExpression)
      $.MANY(() => {
        $.SUBRULE($.op)
        $.SUBRULE1($.termExpression)
      })
    })

    $.RULE('termExpression', () => {
      $.OR([
        { ALT: () => {
          $.SUBRULE($.unaryOp)
          $.SUBRULE($.termExpression)
        }},
        { ALT: () => $.SUBRULE($.integerConstant)},
        { ALT: () => $.SUBRULE($.stringConstant)},
        { ALT: () => $.SUBRULE($.keywordConstant)},
        { ALT: () => {
          $.SUBRULE1($.varName)
          $.CONSUME(Tokens.LSquare)
          $.SUBRULE($.expression)
          $.CONSUME(Tokens.RSquare)
        }},
        { ALT: () => $.SUBRULE($.subroutineCall)},
        { ALT: () => $.SUBRULE($.varName)},
        { ALT: () => {
          $.CONSUME(Tokens.LRound)
          $.SUBRULE1($.expression)
          $.CONSUME(Tokens.RRound)
        }},
      ])
    })

    $.RULE('subroutineCall', () => {
      $.OR([
        { ALT: () => {
          $.SUBRULE($.subroutineName)
          $.CONSUME(Tokens.LRound)
          $.SUBRULE($.expressionList)
          $.CONSUME(Tokens.RRound)
        }},
        { ALT: () => {
          $.CONSUME(Tokens.Identifier)
          $.CONSUME(Tokens.Dot)
          $.SUBRULE1($.subroutineName)
          $.CONSUME1(Tokens.LRound)
          $.SUBRULE1($.expressionList)
          $.CONSUME1(Tokens.RRound)
        }},
      ])
    })

    $.RULE('expressionList', () => {
      $.MANY_SEP({
        SEP: Tokens.Comma,
        DEF: () => {
          $.SUBRULE($.expression)
        }
      })
    })

    $.RULE('op', () => {
      $.OR([
        { ALT: () => $.CONSUME(Tokens.Plus) },
        { ALT: () => $.CONSUME(Tokens.Minus) },
        { ALT: () => $.CONSUME(Tokens.Asterisk) },
        { ALT: () => $.CONSUME(Tokens.Slash) },
        { ALT: () => $.CONSUME(Tokens.Ampersand) },
        { ALT: () => $.CONSUME(Tokens.Bar) },
        { ALT: () => $.CONSUME(Tokens.LT) },
        { ALT: () => $.CONSUME(Tokens.GT) },
        { ALT: () => $.CONSUME(Tokens.Equal) },
      ])
    })

    $.RULE('unaryOp', () => {
      $.OR([
        { ALT: () => $.CONSUME(Tokens.Minus) },
        { ALT: () => $.CONSUME(Tokens.Tilde) },
      ])
    })

    $.RULE('keywordConstant', () => {
      $.OR([
        { ALT: () => $.CONSUME(Tokens.True) },
        { ALT: () => $.CONSUME(Tokens.False) },
        { ALT: () => $.CONSUME(Tokens.Null) },
        { ALT: () => $.CONSUME(Tokens.This) },
      ])
    })

    $.RULE('integerConstant', () => $.CONSUME(Tokens.IntegerLiteral))

    $.RULE('stringConstant', () => $.CONSUME(Tokens.StringLiteral))

    this.performSelfAnalysis()
  }

  parse = (tokens: IToken[]) => {
    this.input = tokens
    return (this as any).classDec() as CstNode
  }
}
