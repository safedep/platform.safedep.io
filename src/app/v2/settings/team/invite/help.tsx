import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AccessRoleHelp() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>What are roles?</CardTitle>
        <CardDescription>Learn more about access roles</CardDescription>
      </CardHeader>
      <CardContent>
        <p>There are three roles in the system:</p>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>Admin</li>
          <li>Member</li>
          <li>Read-only</li>
        </ul>
        <div className="pb-4">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Admin
          </h4>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            An administrator can perform all actions within a team except for
            inviting new members and tenant management related activities.
          </p>
        </div>
        <div className="pb-4">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Member
          </h4>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            A member can perform all non-administrative actions within a team.
          </p>
        </div>
        <div>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Read-only
          </h4>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            A read-only user can only view data within a team.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
