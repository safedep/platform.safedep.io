import { apiErrorHandler } from "@/lib/api/error";
import { createMalwareAnalysisServiceClient } from "@/lib/rpc/client";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

type MockReportType = {
  package_version: {
    package: {
      ecosystem: string;
      name: string;
    };
    version: string;
  };
  target: {
    origin: string;
    sha256?: string;
  };
  file_system: {
    files: Array<{
      key: string;
      origin: string;
      derived_extension?: string;
      mime_type?: string;
      size?: string;
    }>;
  };
  file_evidences: Array<{
    file_key: string;
    evidence: {
      title: string;
      behavior: string;
      details: string;
      confidence: string;
      source: string;
    };
  }>;
  project_evidences: Array<{
    evidence: {
      title: string;
      behavior: string;
      details: string;
      confidence: string;
      source: string;
    };
  }>;
  warnings: Array<{
    message: string;
  }>;
  analyzed_at: string;
  inference: {
    confidence: string;
    is_malware?: boolean;
    details: string;
  };
};

// Mock data for the malware report
const mockReport: MockReportType = {
  package_version: {
    package: {
      ecosystem: "ECOSYSTEM_NPM",
      name: "@rolldown/binding-linux-x64-musl",
    },
    version: "1.0.0-beta.1-commit.3a0e84b",
  },
  project_evidences: [],
  target: {
    origin:
      "https://registry.npmjs.org/@rolldown/binding-linux-x64-musl/-/binding-linux-x64-musl-1.0.0-beta.1-commit.3a0e84b.tgz",
    sha256: "4e76216829fb4eb8d057f003c0c3a477a45fdd539a48da0e657aa54dc694273e",
  },
  file_system: {
    files: [
      {
        key: "package/package.json",
        origin:
          "https://registry.npmjs.org/@rolldown/binding-linux-x64-musl/-/binding-linux-x64-musl-1.0.0-beta.1-commit.3a0e84b.tgz",
        derived_extension: "unknown",
        size: "772",
      },
      {
        key: "package/README.md",
        origin:
          "https://registry.npmjs.org/@rolldown/binding-linux-x64-musl/-/binding-linux-x64-musl-1.0.0-beta.1-commit.3a0e84b.tgz",
        derived_extension: "unknown",
        size: "111",
      },
      {
        key: "package/rolldown-binding.linux-x64-musl.node",
        origin:
          "https://registry.npmjs.org/@rolldown/binding-linux-x64-musl/-/binding-linux-x64-musl-1.0.0-beta.1-commit.3a0e84b.tgz",
        mime_type: "application/x-executable",
        derived_extension: "elf",
        size: "10485760",
      },
      {
        key: "package/LICENSE",
        origin:
          "https://registry.npmjs.org/@rolldown/binding-linux-x64-musl/-/binding-linux-x64-musl-1.0.0-beta.1-commit.3a0e84b.tgz",
        derived_extension: "unknown",
        size: "1302",
      },
    ],
  },
  file_evidences: [
    {
      file_key: "package/rolldown-binding.linux-x64-musl.node",
      evidence: {
        title: "YARA rule 'ip_port_mention' matched file",
        behavior:
          "YARA rules deletected the following behavior in the file: \n\n- mentions an IP and port\n",
        details:
          "YARA rules detected multiple potential malware behaviors in the file.\nThe following strings were matched: \n\n- `$camelPort`\n\n```\nPort\n```\n\n- `$camelIP`\n\n```\nIp\n```\n\n- `$wordPort`\n\n```\nPort\n```\n\n- `$wordIP`\n\n```\nIP\n```\n\n",
        confidence: "CONFIDENCE_MEDIUM",
        source: "YARA Analyzer",
      },
    },
    {
      file_key: "package/rolldown-binding.linux-x64-musl.node",
      evidence: {
        title: "YARA rule 'tls_get_addr' matched file",
        behavior:
          "YARA rules deletected the following behavior in the file: \n\n- looks up thread private variables, may be used for loaded library discovery\n",
        details:
          "YARA rules detected multiple potential malware behaviors in the file.\nThe following strings were matched: \n\n- `$val`\n\n```\n__tls_get_addr\n```\n\n",
        confidence: "CONFIDENCE_MEDIUM",
        source: "YARA Analyzer",
      },
    },
    {
      file_key: "package/rolldown-binding.linux-x64-musl.node",
      evidence: {
        title: "YARA rule 'static_hidden_path' matched file",
        behavior:
          "YARA rules deletected the following behavior in the file: \n\n- possible hidden file path\n",
        details:
          "YARA rules detected multiple potential malware behaviors in the file.\nThe following strings were matched: \n\n- `$ref`\n\n```\n/home/runner/.cargo\n```\n\n",
        confidence: "CONFIDENCE_MEDIUM",
        source: "YARA Analyzer",
      },
    },
    {
      file_key: "package/rolldown-binding.linux-x64-musl.node",
      evidence: {
        title: "YARA rule 'execall' matched file",
        behavior:
          "YARA rules deletected the following behavior in the file: \n\n- executes external programs\n",
        details:
          "YARA rules detected multiple potential malware behaviors in the file. The following system calls were detected: \n\n- execve\n\nThe following strings were matched: \n\n- `$execvp`\n\n```\nexecvp\n```\n\n",
        confidence: "CONFIDENCE_MEDIUM",
        source: "YARA Analyzer",
      },
    },
    {
      file_key: "package/rolldown-binding.linux-x64-musl.node",
      evidence: {
        title: "YARA rule 'posix_spawn' matched file",
        behavior:
          "YARA rules deletected the following behavior in the file: \n\n- spawn a process\n",
        details:
          "YARA rules detected multiple potential malware behaviors in the file. The following system calls were detected: \n\n- posix_spawn\n\nThe following strings were matched: \n\n- `$ref`\n\n```\nposix_spawn\n```\n\n",
        confidence: "CONFIDENCE_MEDIUM",
        source: "YARA Analyzer",
      },
    },
    {
      file_key: "package/rolldown-binding.linux-x64-musl.node",
      evidence: {
        title: "YARA rule 'pid_self_cgroup' matched file",
        behavior:
          "YARA rules deletected the following behavior in the file: \n\n- accesses /proc files within own cgroup\n",
        details:
          "YARA rules detected multiple potential malware behaviors in the file.\nThe following strings were matched: \n\n- `$val`\n\n```\n/proc/self/cgroup/sys/fs/cgroupcgroup\n```\n\n",
        confidence: "CONFIDENCE_MEDIUM",
        source: "YARA Analyzer",
      },
    },
    {
      file_key: "package/rolldown-binding.linux-x64-musl.node",
      evidence: {
        title: "YARA rule 'proc_self_exe' matched file",
        behavior:
          "YARA rules deletected the following behavior in the file: \n\n- gets executable associated to this process\n",
        details:
          "YARA rules detected multiple potential malware behaviors in the file.\nThe following strings were matched: \n\n- `$ref`\n\n```\n/proc/self/exe\n```\n\n",
        confidence: "CONFIDENCE_MEDIUM",
        source: "YARA Analyzer",
      },
    },
    {
      file_key: "package/rolldown-binding.linux-x64-musl.node",
      evidence: {
        title: "YARA rule 'proc_self_mountinfo' matched file",
        behavior:
          "YARA rules deletected the following behavior in the file: \n\n- gets mount info associated to this process\n",
        details:
          "YARA rules detected multiple potential malware behaviors in the file.\nThe following strings were matched: \n\n- `$ref`\n\n```\n/proc/self/mountinfo\n```\n\n",
        confidence: "CONFIDENCE_MEDIUM",
        source: "YARA Analyzer",
      },
    },
    {
      file_key: "package/rolldown-binding.linux-x64-musl.node",
      evidence: {
        title: "YARA rule 'agent' matched file",
        behavior:
          "YARA rules deletected the following behavior in the file: \n\n- references an 'agent'\n",
        details:
          "YARA rules detected multiple potential malware behaviors in the file.\nThe following strings were matched: \n\n- `$ref`\n\n```\n_http_agent\n```\n\n",
        confidence: "CONFIDENCE_MEDIUM",
        source: "YARA Analyzer",
      },
    },
    {
      file_key: "package/rolldown-binding.linux-x64-musl.node",
      evidence: {
        title: "YARA rule 'download' matched file",
        behavior:
          "YARA rules deletected the following behavior in the file: \n\n- download files\n",
        details:
          "YARA rules detected multiple potential malware behaviors in the file.\nThe following strings were matched: \n\n- `$ref`\n\n```\npathdatalistdownloadOverride\n```\n\n",
        confidence: "CONFIDENCE_MEDIUM",
        source: "YARA Analyzer",
      },
    },
    {
      file_key: "package/rolldown-binding.linux-x64-musl.node",
      evidence: {
        title: "YARA rule 'hostname_port' matched file",
        behavior:
          "YARA rules deletected the following behavior in the file: \n\n- connects to an arbitrary hostname:port\n",
        details:
          "YARA rules detected multiple potential malware behaviors in the file.\nThe following strings were matched: \n\n- `$hostname`\n\n```\nhostname\n```\n\n- `$port`\n\n```\nport\n```\n\n",
        confidence: "CONFIDENCE_MEDIUM",
        source: "YARA Analyzer",
      },
    },
    {
      file_key: "package/rolldown-binding.linux-x64-musl.node",
      evidence: {
        title: "YARA rule 'socket_pair' matched file",
        behavior:
          "YARA rules deletected the following behavior in the file: \n\n- create a pair of connected sockets\n",
        details:
          "YARA rules detected multiple potential malware behaviors in the file.\nThe following strings were matched: \n\n- `$socket`\n\n```\nsocketpair\n```\n\n",
        confidence: "CONFIDENCE_MEDIUM",
        source: "YARA Analyzer",
      },
    },
    {
      file_key: "package/rolldown-binding.linux-x64-musl.node",
      evidence: {
        title: "YARA rule 'webrtc_peer' matched file",
        behavior:
          "YARA rules deletected the following behavior in the file: \n\n- makes outgoing WebRTC connections\n",
        details:
          "YARA rules detected multiple potential malware behaviors in the file.\nThe following strings were matched: \n\n- `$ref`\n\n```\nRTCPeerConnection\n```\n\n",
        confidence: "CONFIDENCE_MEDIUM",
        source: "YARA Analyzer",
      },
    },
    {
      file_key: "package/rolldown-binding.linux-x64-musl.node",
      evidence: {
        title: "YARA rule 'one_three_three_seven' matched file",
        behavior:
          "YARA rules deletected the following behavior in the file: \n\n- References 1337 terminology'\n",
        details:
          "YARA rules detected multiple potential malware behaviors in the file.\nThe following strings were matched: \n\n- `$`\n\n```\n1337\n```\n\n",
        confidence: "CONFIDENCE_MEDIUM",
        source: "YARA Analyzer",
      },
    },
    {
      file_key: "package/rolldown-binding.linux-x64-musl.node",
      evidence: {
        title: "Extension Mismatch",
        behavior: "The file extension does not match the file name",
        details:
          "The file extension `.node` observed in `package/rolldown-binding.linux-x64-musl.node` does not match the detected extension `elf` identified through file content analysis",
        confidence: "CONFIDENCE_LOW",
        source: "File Meta Analyzer",
      },
    },
  ],
  warnings: [
    {
      message:
        "Limit read for package file: package/rolldown-binding.linux-x64-musl.node due to large size: 15637424",
    },
  ],
  analyzed_at: "2024-12-30T16:37:02.748594Z",
  inference: {
    confidence: "CONFIDENCE_MEDIUM",
    details: "TEST",
  },
};

export async function GET(
  _req: NextApiRequest,
  { params }: { params: Promise<{ analysisId: string }> },
) {
  const analysisId = (await params).analysisId;
  if (!analysisId) {
    throw new Error("Analysis ID is required");
  }

  const communityTenantId = process.env.COMMUNITY_API_TENANT_ID as string;
  const communityApiKey = process.env.COMMUNITY_API_KEY as string;

  if (!communityTenantId || !communityApiKey) {
    throw new Error("Community API credentials are required");
  }

  const client = createMalwareAnalysisServiceClient(
    communityTenantId,
    communityApiKey,
  );
  const report = await client.getAnalysisReport({
    analysisId: analysisId,
  });

  return NextResponse.json({ ...report, id: analysisId });
}

//export const GET = apiErrorHandler(handleGET);
