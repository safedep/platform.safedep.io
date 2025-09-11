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

/**
 * Parse the ecosystem name to the corresponding enum value.
 *
 * @param {string} ecosystem - The ecosystem name
 * @returns {Ecosystem} The corresponding enum value
 */
export function parseEcosystem(ecosystem: string): Ecosystem {
  switch (ecosystem.toLowerCase()) {
    case "npm":
      return Ecosystem.NPM;
    case "rubygems":
      return Ecosystem.RUBYGEMS;
    case "rubygem":
      return Ecosystem.RUBYGEMS;
    case "go":
      return Ecosystem.GO;
    case "maven":
      return Ecosystem.MAVEN;
    case "pypi":
      return Ecosystem.PYPI;
    case "packagist":
      return Ecosystem.PACKAGIST;
    default:
      throw new Error(`Unsupported ecosystem: ${ecosystem}`);
  }
}

/**
 * Get the icon component for a given ecosystem.
 *
 * @param {string} ecosystem - The ecosystem name
 * @returns {IconType} The corresponding React icon component
 */
export function getEcosystemIcon(ecosystem: string): IconType {
  switch (ecosystem.toLowerCase()) {
    case "npm":
      return FaNpm;
    case "rubygems":
    case "rubygem":
      return SiRubygems;
    case "go":
      return SiGo;
    case "maven":
      return SiApachemaven;
    case "pypi":
      return FaPython;
    case "packagist":
      return SiPackagist;
    case "nuget":
      return SiNuget;
    case "cargo":
    case "rust":
      return SiRust;
    case "terraform":
    case "terraform_module":
    case "terraform_provider":
      return SiTerraform;
    case "vscode":
    case "openvsx":
      return VscVscode;
    case "github_actions":
    case "github_repository":
      return SiGithub;
    default:
      return FaQuestion;
  }
}
