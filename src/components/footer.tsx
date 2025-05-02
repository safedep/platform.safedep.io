export default function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="flex flex-col items-center justify-center gap-4 px-4 md:flex-row md:justify-between">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} SafeDep. All rights reserved.
        </p>
        <nav className="flex gap-4">
          <a
            href="https://safedep.io/terms"
            className="text-muted-foreground text-sm hover:underline"
          >
            Terms of Service
          </a>
          <a
            href="https://safedep.io/privacy"
            className="text-muted-foreground text-sm hover:underline"
          >
            Privacy Policy
          </a>
        </nav>
      </div>
    </footer>
  );
}
