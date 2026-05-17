export const ROUTES = {
  HOME: "/",
  CLANS: "/clans",
  GROUP: "/group",
  VANSH: (slug: string) => `/vansh/${slug}`,
  CLAN_DETAILS: (slug: string) => `/clans/${slug}`,
};