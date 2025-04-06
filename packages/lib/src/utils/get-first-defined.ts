export const getFirstDefined = <T>(...args: T[]): T | undefined => {
  return args.find((arg) => arg !== undefined)
}
