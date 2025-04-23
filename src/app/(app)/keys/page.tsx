"use client";

import ApiKeyList from "@/components/api-key-list";
import TenantSwitcher from "@/components/tenant-switcher";
import UserInfo from "@/components/user-info";

export default function KeysPage() {
  return (
    <div className="container mx-auto flex grow items-center justify-center px-4 py-8 lg:px-0">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex flex-col gap-4">
          <TenantSwitcher />

          <UserInfo
            userData={{
              name: "Arunanshu Biswas",
              email: "arunanshu.biswas@safedep.io",
              tenant: "default-team.safedep-io.safedep.io",
              avatar: "https://github.com/arunanshub.png",
            }}
          />
        </div>

        {/* API Keys List */}
        <ApiKeyList
          apiKeys={Array.from({ length: 10 }, (_, index) => ({
            id: `key-${index + 1}`,
            name: `API Key ${index + 1}`,
            description: `API Key ${index + 1} Description`,
            expiresAt: `2025-01-01`,
          }))}
          onCreateKey={() => {}}
          onCopyKeyId={() => {}}
          onEditKey={() => {}}
          onRevokeKey={() => {}}
        />
      </div>
    </div>
  );
}
