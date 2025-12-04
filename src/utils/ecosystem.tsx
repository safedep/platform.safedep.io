import { Ecosystem } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/ecosystem_pb";
import { FaNpm, FaQuestion, FaPython } from "react-icons/fa";
import {
  SiApachemaven,
  SiGithub,
  SiGo,
  SiNuget,
  SiPackagist,
  SiRubygems,
  SiRust,
  SiTerraform,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { SiHomebrew } from "react-icons/si";

export function EcosystemIcon({
  ecosystem,
  className,
}: {
  ecosystem: Ecosystem;
  className?: string;
}) {
  switch (ecosystem) {
    case Ecosystem.NPM:
      return <FaNpm className={className} />;
    case Ecosystem.RUBYGEMS:
      return <SiRubygems className={className} />;
    case Ecosystem.GO:
      return <SiGo className={className} />;
    case Ecosystem.MAVEN:
      return <SiApachemaven className={className} />;
    case Ecosystem.PYPI:
      return <FaPython className={className} />;
    case Ecosystem.PACKAGIST:
      return <SiPackagist className={className} />;
    case Ecosystem.NUGET:
      return <SiNuget className={className} />;
    case Ecosystem.CARGO:
      return <SiRust className={className} />;
    case Ecosystem.TERRAFORM:
    case Ecosystem.TERRAFORM_MODULE:
    case Ecosystem.TERRAFORM_PROVIDER:
      return <SiTerraform className={className} />;
    case Ecosystem.VSCODE:
    case Ecosystem.OPENVSX:
      return <VscVscode className={className} />;
    case Ecosystem.GITHUB_ACTIONS:
    case Ecosystem.GITHUB_REPOSITORY:
      return <SiGithub className={className} />;
    case Ecosystem.HOMEBREW:
      return <SiHomebrew className={className} />;
    case Ecosystem.UNSPECIFIED:
      return <FaQuestion className={className} />;
    default:
      // type exhaustive check
      const exhaustiveCheck: never = ecosystem;
      throw new Error(`Unsupported ecosystem: ${exhaustiveCheck}`);
  }
}
