/** Display aid only. Full UUID remains the identity for storage, lookup and copying. */
export function leadReference(leadId: string): string {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(leadId)
    ? `NORA-${leadId.replaceAll("-", "").slice(0, 10).toUpperCase()}`
    : leadId;
}
