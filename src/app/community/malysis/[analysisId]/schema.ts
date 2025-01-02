export type MalwareAnalysisReport = {
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
