"use client";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyContent,
} from "@/components/ui/empty";
import { IconLock } from "@tabler/icons-react";
import { usePathname, useSearchParams } from "next/navigation";

function useReturnTo() {
  const tenant = useSearchParams().get("tenant");
  const pathname = usePathname();

  if (!tenant) {
    return "/";
  }

  return `${pathname}?tenant=${tenant}`;
}

export default function Forbidden() {
  const returnTo = useReturnTo();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <IconLock className="size-8" />
        </EmptyMedia>
        <EmptyTitle>Forbidden</EmptyTitle>
        <EmptyDescription>
          You are not authorized to access this report.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <a href={`/auth/login?returnTo=${encodeURIComponent(returnTo)}`}>
            Log in with a different account
          </a>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
