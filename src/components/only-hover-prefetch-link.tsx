import { Route } from "next";
import Link from "next/link";
import { useState } from "react";

/**
 * Rationale: We render a "View Version" button for each version in the versions
 * table. Since there are just too many versions in the versions table (hence
 * too many links), this will quickly eat up Vercel's serverless function quota.
 * To prevent that from happening while also retaining the ability to prefetch
 * the link when the user hovers over the link, we use this component.
 *
 * And guess what? Vercel intentionally provides no support for something like
 * `prefetch="onHover"`. If `prefetch={null}` or `prefetch={true}`, the link
 * will always be prefetched no matter what. But if `prefetch={false}`, the link
 * will not be prefetched **at all!**, NOT even on hover.
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/components/link#scrolling-to-an-id}
 * @see {@link https://github.com/vercel/next.js/discussions/11793#discussioncomment-10226034}
 */
export function OnlyHoverPrefetchLink({
  href,
  children,
  ...props
}: {
  href: Route;
  children: React.ReactNode;
} & React.ComponentProps<typeof Link>) {
  const [active, setActive] = useState(false);

  return (
    <Link
      href={href}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
      onFocus={() => setActive(true)}
      {...props}
    >
      {children}
    </Link>
  );
}
