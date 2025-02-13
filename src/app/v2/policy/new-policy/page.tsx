import CreatePolicyForm from "@/components/policy/create-policy-form";

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Create New Policy</h1>
      </div>

      <CreatePolicyForm onSubmit={async () => {}} />
    </div>
  );
}
