function extractSqlErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  if ("code" in error && typeof (error as { code?: string }).code === "string") {
    return (error as { code: string }).code;
  }

  if ("cause" in error) {
    return extractSqlErrorCode((error as { cause?: unknown }).cause);
  }

  return undefined;
}

export function isUniqueViolation(error: unknown): boolean {
  return extractSqlErrorCode(error) === "23505";
}
