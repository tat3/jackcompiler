import { Lexer } from 'chevrotain'

import { allTokens } from './tokens'

export class Tokenizer {
  vmLexer = new Lexer(allTokens)

  tokenize = (script: string) => {
    return this.vmLexer.tokenize(script)
  }
}
