"use client";

import { useState } from "react";
import { KeyIcon, MoreVertical } from "lucide-react";
import MainHeader from "../../components/header";
import Sidebar from "../../components/sidebar";
import { ApiKeyNavigations } from "../navigations";

interface ApiKey {
  id: string;
  name: string;
  description: string;
}

const Page = () => {
  const [selectedDescription, setSelectedDescription] = useState<string>("");
  const [SelectedID, setSelectedID] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [showIDModal, setShowIDModal] = useState(false);
  const [apiKeys] = useState<ApiKey[]>([
    {
      id: "a1b2",
      name: "Production API Key",
      description: "This key is used for production environment with full access to all endpoints and services. Handle with care."
    },
    {
      id: "h8g7f6ueiiweuwoefgfeogeuwofwfc9efcefeifc",
      name: "Development API Key",
      description: "Development environment key."
    }
  ]);

  const truncateDescription = (text: string) => {
    const words = text.split(' ').slice(0, 4).join(' ');
    return text.length > words.length ? `${words}...` : text;
  };

  const truncateId = (id: string) => {
    return id.length > 6 ? `${id.slice(0, 4)}...` : id;
  };

  const handleDelete = (id: string) => {
    console.log("Deleting key:", id);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar items={ApiKeyNavigations} />
      <div className="flex-grow px-6">
        <MainHeader>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <KeyIcon className="h-8 w-8 text-blue-600" />
            </div>
            <span className="ml-4 text-2xl font-bold text-gray-900">API Keys</span>
          </div>
        </MainHeader>
        
        <div className="mt-6">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {apiKeys.map((key) => (
                <tr key={key.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                    <button
                      onClick={() => {
                        setSelectedID(key.id);
                        setShowIDModal(true);
                      }}
                      className="hover:text-blue-600"
                    >
                    {truncateId(key.id)}
                    </button>
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{key.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <button
                      onClick={() => {
                        setSelectedDescription(key.description);
                        setShowModal(true);
                      }}
                      className="hover:text-blue-600"
                    >
                      {truncateDescription(key.description)}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="relative group">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                        <button
                          onClick={() => handleDelete(key.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full">
              <h3 className="text-lg font-medium mb-4">Description</h3>
              <p className="text-gray-600">{selectedDescription}</p>
              <button
                onClick={() => setShowIDModal(false)}
                className="mt-4 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
          {showIDModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full">
              <h3 className="text-lg font-medium mb-4">ID</h3>
              <p className="text-gray-600">{SelectedID}</p>
              <button
                onClick={() => setShowIDModal(false)}
                className="mt-4 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;