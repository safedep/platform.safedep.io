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
import { IconType } from "react-icons";
import { SiHomebrew } from "react-icons/si";

export function getEcosystemIconByEcosystem(ecosystem: Ecosystem): IconType {
  switch (ecosystem) {
    case Ecosystem.NPM:
      return FaNpm;
    case Ecosystem.RUBYGEMS:
      return SiRubygems;
    case Ecosystem.GO:
      return SiGo;
    case Ecosystem.MAVEN:
      return SiApachemaven;
    case Ecosystem.PYPI:
      return FaPython;
    case Ecosystem.PACKAGIST:
      return SiPackagist;
    case Ecosystem.NUGET:
      return SiNuget;
    case Ecosystem.CARGO:
      return SiRust;
    case Ecosystem.TERRAFORM:
    case Ecosystem.TERRAFORM_MODULE:
    case Ecosystem.TERRAFORM_PROVIDER:
      return SiTerraform;
    case Ecosystem.VSCODE:
    case Ecosystem.OPENVSX:
      return VscVscode;
    case Ecosystem.GITHUB_ACTIONS:
    case Ecosystem.GITHUB_REPOSITORY:
      return SiGithub;
    case Ecosystem.HOMEBREW:
      return SiHomebrew;
    case Ecosystem.UNSPECIFIED:
      return FaQuestion;
    default:
      // type exhaustive check
      const exhaustiveCheck: never = ecosystem;
      throw new Error(`Unsupported ecosystem: ${exhaustiveCheck}`);
  }
}
