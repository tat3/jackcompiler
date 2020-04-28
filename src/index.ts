import fs from 'fs'

import { JackCompiler } from './jackCompoler'

const jackCompiler = (jackPath: string) => {
  const script = fs.readFileSync(jackPath, { encoding: 'utf8' })
  const compiler = new JackCompiler()
  console.log(compiler.compile(script))
}

jackCompiler(process.argv[2])
