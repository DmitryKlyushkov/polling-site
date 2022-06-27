import { withTRPC } from "@trpc/next";
import { AppType } from "next/dist/shared/lib/utils";
import { AppRouter } from "../backend/router";
import "../styles/globals.css";

import superjson from "superjson";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.browser) return ""; // Browser should use correct path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use Vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      headers() {
        return {
          cookie: ctx?.req?.headers.cookie,
        };
      },
      url,
      transformer: superjson,
    };
  },
  ssr: true,
})(MyApp);
