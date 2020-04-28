export const range = (a: number) => Array.from({ length: a }, (k, i) => i)

export const last = <T>(array: T[]) => array.slice(-1)[0]
