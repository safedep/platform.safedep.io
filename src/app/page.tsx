import { UserIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSessionOrRedirectTo, getUserInfo } from "./actions";
import { sessionSetTenant } from "@/lib/session/session";

export default async function Home() {
  const session = await getSessionOrRedirectTo("/auth");
  const userInfo = await getUserInfo();

  // if the user has no tenant, go to the onboarding page and make them create
  // one
  if (userInfo.access.length === 0) {
    return redirect("/onboard");
  }

  async function setTenantAndRedirect(tenant: string) {
    "use server";
    await sessionSetTenant(tenant);
    return redirect("/v2/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center space-x-2 py-2">
        <UserIcon size={18} />
        <span className="text-sm">Welcome {session?.user?.email}</span>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Select Tenant</CardTitle>
          <CardDescription>
            Select the tenant for use with the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Tenant</Label>
                <Select name="tenant" onValueChange={setTenantAndRedirect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenant to continue ..." />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {userInfo?.access.map((access) => (
                      <SelectItem
                        key={access?.tenant?.domain}
                        value={access?.tenant?.domain ?? ""}
                      >
                        {access.tenant?.domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <a href="/auth/logout?returnTo=/">Logout</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
