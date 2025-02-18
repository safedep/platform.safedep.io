"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PolicyForm, { PolicyFormValues } from "@/components/policy/policy-form";
import { useQuery } from "@tanstack/react-query";
import { getPolicy } from "./actions";
import router from "next/router";
import { PolicyVersion } from "@buf/safedep_api.bufbuild_es/safedep/messages/policy/v1/policy_pb";
import { PolicyTarget } from "@buf/safedep_api.bufbuild_es/safedep/messages/policy/v1/policy_pb";
import { PolicyType } from "@buf/safedep_api.bufbuild_es/safedep/messages/policy/v1/policy_pb";

// Mock data for demonstration
// const mockPolicyData: PolicyFormValues = {
//   name: "Sample Policy",
//   version: "v2",
//   target: "Vet",
//   policyType: true,
//   labels: ["security", "compliance"],
//   rules: [
//     {
//       name: "License Check",
//       description: "Checks for compatible licenses",
//       check: "License",
//       value: "MIT",
//       references: [{ url: "https://opensource.org/licenses/MIT" }],
//       labels: ["license", "legal"],
//     },
//     {
//       name: "Vulnerability Check",
//       description: "Checks for known vulnerabilities",
//       check: "Vulnerability",
//       value: "HIGH",
//       references: [],
//       labels: ["security"],
//     },
//   ],
// };

export default function EditPolicyPage() {
  const { policyId } = useParams<{ policyId: string }>();

  const {
    data: policy,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["policy", policyId],
    queryFn: () => getPolicy(policyId),
  });

  if (isLoading) {
    // TODO: Show loading spinner
    return <div>Loading...</div>;
  }
  if (error) {
    // TODO: Show error message
    return <div>Error: {error.message}</div>;
  }
  if (!policy) {
    // TODO: show error message
    return <div>Policy not found</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Policy</h1>
          <p className="text-muted-foreground">Policy ID: {policyId}</p>
        </div>
        <Button variant="secondary" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>

      <PolicyForm
        defaultValues={policy}
        mode="update"
        onSubmit={async () => {}}
      />
    </div>
  );
}

// export default function EditPolicyPage() {
//   const { policyId } = useParams<{ policyId: string }>();
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(true);
//   const [policyData, setPolicyData] = useState<PolicyFormValues | null>(null);

//   useEffect(() => {
//     // Simulate API call to fetch policy data
//     async function fetchPolicyData() {
//       try {
//         // TODO: Replace with actual API call
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//         setPolicyData(mockPolicyData);
//       } catch (error) {
//         console.error("Failed to fetch policy data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     fetchPolicyData();
//   }, [policyId]);

//   async function handleSubmit(values: PolicyFormValues) {
//     // TODO: Replace with actual API call
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     console.log("Updating policy:", policyId, values);
//     // After successful update, you might want to:
//     // 1. Show a success message
//     // 2. Redirect back to the policies list
//     // 3. Refresh the data
//     // router.back();
//   }

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!policyData) {
//     return <div>Policy not found</div>;
//   }

//   return (
//     <div className="flex flex-col gap-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Edit Policy</h1>
//           <p className="text-muted-foreground">Policy ID: {policyId}</p>
//         </div>
//         <Button variant="secondary" onClick={() => router.back()}>
//           Go Back
//         </Button>
//       </div>

//       <PolicyForm
//         defaultValues={policyData}
//         mode="update"
//         onSubmit={handleSubmit}
//       />
//     </div>
//   );
// }
