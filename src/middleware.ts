import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "ka"],
  defaultLocale: "en",
  localePrefix: "never"
});

export const config = {
  matcher: ["/", "/(ka|en)/:path*"],
};
