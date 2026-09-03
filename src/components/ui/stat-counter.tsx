export function StatCounter({ value }: { value: string }) {
  return <span aria-label={value}>{value}</span>;
}
