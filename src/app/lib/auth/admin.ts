type ClaimsWithRole = {
  role?: unknown;
  org_role?: unknown;
  metadata?: { role?: unknown };
  public_metadata?: { role?: unknown };
  unsafe_metadata?: { role?: unknown };
};

function normalizeRole(value: unknown): string {
  return typeof value === "string" ? value.toLowerCase() : "";
}

function isAdminRole(role: string): boolean {
  return role === "admin" || role === "org:admin" || role === "org:owner" || role === "owner";
}

export function hasAdminAccess(input: {
  orgRole?: string | null;
  sessionClaims?: unknown;
}): boolean {
  const orgRole = normalizeRole(input.orgRole);
  if (isAdminRole(orgRole)) {
    return true;
  }

  const claims = (input.sessionClaims ?? {}) as ClaimsWithRole;
  const candidateRoles = [
    normalizeRole(claims.role),
    normalizeRole(claims.org_role),
    normalizeRole(claims.metadata?.role),
    normalizeRole(claims.public_metadata?.role),
    normalizeRole(claims.unsafe_metadata?.role),
  ];

  return candidateRoles.some(isAdminRole);
}
