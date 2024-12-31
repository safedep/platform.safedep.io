import React from "react";

type FileType = {
  key: string;
  origin: string;
  derived_extension?: string;
  mime_type?: string;
};

export function FileSystem({ files }: { files: FileType[] }) {
  return (
    <div className="overflow-x-auto bg-gray-50 rounded-xl border-2 border-gray-200">
      <table className="min-w-full divide-y-2 divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              File
            </th>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Origin
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
                {file.origin}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {file.mime_type || file.derived_extension || "unknown"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
