import { createToken, Lexer } from 'chevrotain'

export const Identifier = createToken({ name: 'Identifier', pattern: /[a-zA-Z_][\w]*/})

// keyword
export const Class = createToken({ name: 'Class', pattern: /class/, longer_alt: Identifier })
export const Constructor = createToken({ name: 'Constructor', pattern: /constructor/, longer_alt: Identifier })
export const Function = createToken({ name: 'Function', pattern: /function/, longer_alt: Identifier })
export const Method = createToken({ name: 'Method', pattern: /method/, longer_alt: Identifier })
export const Field = createToken({ name: 'Field', pattern: /field/, longer_alt: Identifier })
export const Static = createToken({ name: 'Static', pattern: /static/, longer_alt: Identifier })
export const Var = createToken({ name: 'Var', pattern: /var/, longer_alt: Identifier })
export const Int = createToken({ name: 'Int', pattern: /int/, longer_alt: Identifier })
export const Char = createToken({ name: 'Char', pattern: /char/, longer_alt: Identifier })
export const Boolean = createToken({ name: 'Boolean', pattern: /boolean/, longer_alt: Identifier })
export const Void = createToken({ name: 'Void', pattern: /void/, longer_alt: Identifier })
export const True = createToken({ name: 'True', pattern: /true/, longer_alt: Identifier })
export const False = createToken({ name: 'False', pattern: /false/, longer_alt: Identifier })
export const Null = createToken({ name: 'Null', pattern: /null/, longer_alt: Identifier })
export const This = createToken({ name: 'This', pattern: /this/, longer_alt: Identifier })
export const Let = createToken({ name: 'Let', pattern: /let/, longer_alt: Identifier })
export const Do = createToken({ name: 'Do', pattern: /do/, longer_alt: Identifier })
export const If = createToken({ name: 'If', pattern: /if/, longer_alt: Identifier })
export const Else = createToken({ name: 'Else', pattern: /else/, longer_alt: Identifier })
export const While = createToken({ name: 'While', pattern: /while/, longer_alt: Identifier })
export const Return = createToken({ name: 'Return', pattern: /return/, longer_alt: Identifier })

// symbol
export const LCurly = createToken({ name: 'LCurly', pattern: /\{/ })
export const RCurly = createToken({ name: 'RCurly', pattern: /\}/ })
export const LRound = createToken({ name: 'LRound', pattern: /\(/ })
export const RRound = createToken({ name: 'RRound', pattern: /\)/ })
export const LSquare = createToken({ name: 'LSquare', pattern: /\[/ })
export const RSquare = createToken({ name: 'RSquare', pattern: /\]/ })
export const Dot = createToken({ name: 'Dot', pattern: /\./ })
export const Comma = createToken({ name: 'Comma', pattern: /,/ })
export const Semicolon = createToken({ name: 'Semicolon', pattern: /;/ })
export const Plus = createToken({ name: 'Plus', pattern: /\+/ })
export const Minus = createToken({ name: 'Minus', pattern: /-/ })
export const Asterisk = createToken({ name: 'Asterisk', pattern: /\*/ })
export const Slash = createToken({ name: 'Slash', pattern: /\// })
export const Ampersand = createToken({ name: 'Ampersand', pattern: /&/ })
export const Bar = createToken({ name: 'Bar', pattern: /\|/ })
export const LT = createToken({ name: 'LT', pattern: /</ })
export const GT = createToken({ name: 'GT', pattern: />/ })
export const Equal = createToken({ name: 'Equal', pattern: /=/ })
export const Tilde = createToken({ name: 'Tilde', pattern: /~/ })

export const IntegerLiteral = createToken({ name: 'IntegerLiteral', pattern: /0|([1-9]\d*)/})
export const StringLiteral = createToken({ name: 'StringLiteral', pattern: /"[^"\n]*"/})

export const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED
})


export const Comment = createToken({
  name: 'Comment',
  pattern: /\/\/[^\n]*/,
  group: Lexer.SKIPPED
})

export const MultiComment = createToken({
  name: 'MultiComment',
  pattern: /\/\*([^*]|\*[^/])*\*\//,
  group: Lexer.SKIPPED
})

export const allTokens = [
  // ignored tokens
  WhiteSpace,
  MultiComment,
  Comment,

  Class,
  Constructor,
  Function,
  Method,
  Field,
  Static,
  Var,
  Int,
  Char,
  Boolean,
  Void,
  True,
  False,
  Null,
  This,
  Let,
  Do,
  If,
  Else,
  While,
  Return,
  LCurly,
  RCurly,
  LRound,
  RRound,
  LSquare,
  RSquare,
  Dot,
  Comma,
  Semicolon,
  Plus,
  Minus,
  Asterisk,
  Slash,
  Ampersand,
  Bar,
  LT,
  GT,
  Equal,
  Tilde,
  IntegerLiteral,
  Identifier,
  StringLiteral,
]
