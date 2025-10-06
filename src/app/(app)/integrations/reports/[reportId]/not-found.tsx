import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IconFileUnknown } from "@tabler/icons-react";

export default function NotFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <IconFileUnknown className="size-8" />
        </EmptyMedia>
        <EmptyTitle>Report Not Found</EmptyTitle>
        <EmptyDescription>
          The report you are looking for does not exist.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
