import { LicenseMeta } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/license_meta_pb";

export default async function LicensesTab({
  licenses: licensesPromise,
}: {
  licenses: Promise<LicenseMeta[]>;
}) {
  const licenses = await licensesPromise;
  return <div>LicensesTab: {licenses.length}</div>;
}
