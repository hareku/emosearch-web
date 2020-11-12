interface Label {
  Value: string
}

export const LABELS: Label[] = [
  { Value: "ALL" },
  { Value: "POSITIVE" },
  { Value: "NEGATIVE" },
]

export function queryToLabel(
  query: string | string[] | undefined | null
): string {
  return typeof query === "string" ? query : "ALL"
}

export function labelToQuery(label: string): string | null {
  return label === "ALL" ? null : label
}
