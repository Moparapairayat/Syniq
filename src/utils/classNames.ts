export type ClassNameValue = false | null | string | undefined

export function cn(...classNames: readonly ClassNameValue[]) {
  return classNames.filter(Boolean).join(' ')
}
