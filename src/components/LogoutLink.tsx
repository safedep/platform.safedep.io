export interface LogoutLinkProps {
  className?: string;
  children?: React.ReactNode;
}

export function LogoutLink(props: LogoutLinkProps) {
  return (
    // We must use <a> tag for logout link to prevent Next.js from prefetching the page
    // https://github.com/auth0/nextjs-auth0/issues/757
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a href="/auth/logout" className={props.className}>
      {props.children}
    </a>
  );
}
