export const ROUTES = {
  HOME: "/",
  CLANS: "/clans",
  VANSH: (slug: string) => `/vansh/${slug}`,
  CLAN_DETAILS: (slug: string) => `/clans/${slug}`,
};