import { Report_File } from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/report_pb";
import React from "react";

export function FileSystem({ files }: { files: Report_File[] }) {
  return (
    <div className="overflow-x-auto bg-gray-50 rounded-xl border-2 border-gray-200">
      <table className="min-w-full divide-y-2 divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              File
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Size
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Type
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {files.map((file, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 transition duration-150"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="font-medium text-gray-900">{file.key}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {file.size.toString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {file.mimeType || file.derivedExtension || "unknown"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
