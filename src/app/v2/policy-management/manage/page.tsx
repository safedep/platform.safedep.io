import { getPolicyGroups } from "./actions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import PolicyManagementClient from "./client";

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["policy-groups"],
    queryFn: () => getPolicyGroups(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PolicyManagementClient />
    </HydrationBoundary>
  );
}
