import { AccessLevel } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/access_pb";

interface AccessInfo {
  // The label to display in the UI
  label: string;

  // The key to use when sending the access level to the server
  key: string;
}

const roleMap: Record<AccessLevel, AccessInfo> = {
  [AccessLevel.OWNER]: {
    label: "Owner",
    key: "owner",
  },
  [AccessLevel.ADMIN]: {
    label: "Admin",
    key: "admin",
  },
  [AccessLevel.MEMBER]: {
    label: "Member",
    key: "member",
  },
  [AccessLevel.READ_ONLY]: {
    label: "Read-only",
    key: "readonly",
  },
  [AccessLevel.NO_ACCESS]: {
    label: "No access",
    key: "noaccess",
  },
  [AccessLevel.TOOL_USER]: {
    label: "Tool user",
    key: "tooluser",
  },
  [AccessLevel.UNSPECIFIED]: {
    label: "Unspecified",
    key: "unspecified",
  },
};

export const accessKeyToLevel = (key: string): AccessLevel => {
  for (const level in roleMap) {
    if (roleMap[level as unknown as AccessLevel].key === key) {
      return parseInt(level) as AccessLevel;
    }
  }

  throw new Error("Invalid access role");
};

export const accessLevelToKey = (level: AccessLevel): string => {
  const key = roleMap[level]?.key;
  if (!key) {
    throw new Error("Invalid access level");
  }

  return key;
};

export const accessLevelToLabel = (level: AccessLevel): string => {
  const label = roleMap[level]?.label;
  if (!label) {
    throw new Error("Invalid access level");
  }

  return label;
};
