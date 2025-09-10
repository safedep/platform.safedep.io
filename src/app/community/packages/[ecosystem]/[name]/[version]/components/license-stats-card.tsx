import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { LicenseMetaList } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/license_meta_pb";

interface LicenseStatsCardProps {
  licenses?: LicenseMetaList;
}

export default function LicenseStatsCard({ licenses }: LicenseStatsCardProps) {
  const licenseList = licenses?.licenses || [];

  if (licenseList.length === 0) {
    return (
      <Card className="border-gray-200 bg-gray-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-gray-500" />
            License
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-500">Unknown</div>
            <p className="text-muted-foreground text-sm">
              No license information available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const primaryLicense = licenseList[0];
  const additionalLicenses = licenseList.length - 1;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-blue-600" />
          License
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">
            {primaryLicense.licenseId}
          </div>
          <p className="text-muted-foreground text-sm">{primaryLicense.name}</p>
          {additionalLicenses > 0 && (
            <p className="text-muted-foreground mt-1 text-xs">
              +{additionalLicenses} more
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
