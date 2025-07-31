import { Auth0Provider } from "@auth0/nextjs-auth0";
import TanstackQueryProvider from "./tanstack-query-provider";
import PostHogProvider from "./posthog-provider";

/**
 * Consolidates all providers into a single component.
 *
 * This is useful for avoiding the need to import and wrap each provider
 * in every file that needs them.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider>
      <TanstackQueryProvider>
        <PostHogProvider>{children}</PostHogProvider>
      </TanstackQueryProvider>
    </Auth0Provider>
  );
}
