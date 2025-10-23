export function formatDate(dateString?: string | null) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString();
}