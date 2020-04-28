import { CodeWriter } from './codeWriter'
import { Tokenizer } from '../src/tokenizer'
import { Parser } from '../src/parser'

export class JackCompiler {
  compile = (script: string) => {
    const t = new Tokenizer()
    const p = new Parser()
    const c = new CodeWriter()

    const tokenized = t.tokenize(script)
    const node = p.parse(tokenized.tokens)
    return c.build(node)
  }
}
