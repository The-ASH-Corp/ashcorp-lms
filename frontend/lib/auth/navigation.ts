export type AuthRole = "admin" | "user";

export const getDashboardPath = (role?: string | null) => {
  return role === "admin" ? "/admin" : "/";
};
