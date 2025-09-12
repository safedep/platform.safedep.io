import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";

export default function LicenseStatsCard({ licenses }: { licenses: string[] }) {
  const primaryLicense = licenses.at(0);
  const additionalLicensesCount = licenses.length - 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>License</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex justify-center">
          {primaryLicense ? (
            <span className="text-3xl font-bold">{primaryLicense}</span>
          ) : (
            <span className="text-3xl font-bold">Unknown</span>
          )}
        </div>
      </CardContent>

      {additionalLicensesCount > 0 && (
        <CardFooter className="text-muted-foreground justify-center text-sm">
          <span>and +{additionalLicensesCount} more</span>
        </CardFooter>
      )}
    </Card>
  );
}
