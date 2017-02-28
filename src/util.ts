export function normalizeName(name: any): string {
  if (typeof name !== "string") {
    name = String(name)
  }
  if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
    throw new TypeError("Invalid character in header field name")
  }
  return name.toLowerCase()
}

export function normalizeValue(value: any): string {
  if (typeof value !== "string") {
    value = String(value)
  }
  return value
}
