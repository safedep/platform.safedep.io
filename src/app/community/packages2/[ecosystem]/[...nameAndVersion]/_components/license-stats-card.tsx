import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";

export default function LicenseStatsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>License</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex justify-center">
          <span className="text-3xl font-bold">MIT</span>
        </div>
      </CardContent>
      <CardFooter className="text-muted-foreground justify-center text-sm">
        <span>and +20 more</span>
      </CardFooter>
    </Card>
  );
}
