export const wait = (ms: number) =>
  new Promise<boolean>((resolve) => setTimeout(() => resolve(true), ms))
