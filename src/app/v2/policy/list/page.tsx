import { getPolicies } from "./actions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import PolicyListClient from "./client";

export default async function PolicyListPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["policies"],
    queryFn: () => getPolicies(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PolicyListClient />
    </HydrationBoundary>
  );
}
