import type { ComponentWithAttributes } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/project_pb";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Ecosystem } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/ecosystem_pb";
import { Classification } from "@buf/safedep_api.bufbuild_es/safedep/messages/bom/v1/cdx_pb";
import { timestampDate } from "@bufbuild/protobuf/wkt";

function ecosystemName(ecosystem: Ecosystem) {
  switch (ecosystem) {
    case Ecosystem.UNSPECIFIED:
      return "Unspecified";
    case Ecosystem.MAVEN:
      return "Maven";
    case Ecosystem.NPM:
      return "NPM";
    case Ecosystem.PYPI:
      return "PyPI";
    case Ecosystem.RUBYGEMS:
      return "RubyGems";
    case Ecosystem.NUGET:
      return "NuGet";
    case Ecosystem.CARGO:
      return "Cargo";
    case Ecosystem.GO:
      return "Go";
    case Ecosystem.GITHUB_ACTIONS:
      return "GitHub Actions";
    case Ecosystem.PACKAGIST:
      return "Packagist";
    case Ecosystem.TERRAFORM:
      return "Terraform";
    case Ecosystem.TERRAFORM_MODULE:
      return "Terraform Module";
    case Ecosystem.TERRAFORM_PROVIDER:
      return "Terraform Provider";
  }
}

function classificationName(classification: Classification) {
  switch (classification) {
    case Classification.NULL:
      return "N/A";
    case Classification.APPLICATION:
      return "Application";
    case Classification.FRAMEWORK:
      return "Framework";
    case Classification.LIBRARY:
      return "Library";
    case Classification.OPERATING_SYSTEM:
      return "Operating System";
    case Classification.DEVICE:
      return "Device";
    case Classification.FILE:
      return "File";
    case Classification.CONTAINER:
      return "Container";
    case Classification.FIRMWARE:
      return "Firmware";
    case Classification.DEVICE_DRIVER:
      return "Device Driver";
    case Classification.PLATFORM:
      return "Platform";
    case Classification.MACHINE_LEARNING_MODEL:
      return "Machine Learning Model";
    case Classification.DATA:
      return "Data";
    case Classification.CRYPTOGRAPHIC_ASSET:
      return "Cryptographic Asset";
  }
}

export default function ComponentsTable({
  components,
}: {
  components: ComponentWithAttributes[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Classification</TableHead>
          <TableHead>Version</TableHead>
          <TableHead>Ecosystem</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Updated At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {components.map(({ component }) => (
          <TableRow key={component?.componentId}>
            <TableCell className="font-medium">{component?.name}</TableCell>
            <TableCell>
              {classificationName(
                component?.classification ?? Classification.NULL,
              )}
            </TableCell>
            <TableCell>{component?.version}</TableCell>
            <TableCell>
              {ecosystemName(component?.ecosystem ?? Ecosystem.UNSPECIFIED)}
            </TableCell>
            <TableCell>
              {component?.createdAt
                ? timestampDate(component.createdAt).toLocaleDateString()
                : new Date().toLocaleDateString()}
            </TableCell>
            <TableCell>
              {component?.updatedAt
                ? timestampDate(component.updatedAt).toLocaleDateString()
                : new Date().toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
