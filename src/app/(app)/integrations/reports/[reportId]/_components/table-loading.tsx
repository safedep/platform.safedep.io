import { Item, ItemContent, ItemMedia } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";

export default function TableLoading() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Item key={index} variant="muted" size="sm">
          <ItemMedia>
            <Spinner className="size-5" />
          </ItemMedia>
          <ItemContent>
            <div className="bg-muted-foreground/20 h-4 w-3/4 animate-pulse rounded" />
            <div className="bg-muted-foreground/10 h-3 w-1/2 animate-pulse rounded" />
          </ItemContent>
        </Item>
      ))}
    </div>
  );
}
