export function isUniqueViolation(error: unknown): boolean {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof (error as { code?: string }).code === "string"
  ) {
    return (error as { code: string }).code === "23505";
  }

  return false;
}
