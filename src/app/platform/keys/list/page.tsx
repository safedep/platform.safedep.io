"use client";

import { useEffect, useState, useCallback } from "react";
import { KeyIcon, MoreVertical } from "lucide-react";
import MainHeader from "../../components/header";
import Sidebar from "../../components/sidebar";
import { ApiKeyNavigations } from "../navigations";


interface ApiKey {
  id: string;
  name: string;
  description: string;
  expiry: string | null;
}

const Page = () => {
  const [dropdownStates, setDropdownStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.dropdown-container')) {
        closeAllDropdowns();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (id: string) => {
    setDropdownStates((prevState) => {
      const newState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as { [key: string]: boolean });
      return {
        ...newState,
        [id]: !prevState[id],
      };
    });
  };

  const closeAllDropdowns = () => {
    setDropdownStates({});
  };
  const [selectedDescription, setSelectedDescription] = useState<string>("");
  const [selectedID, setSelectedID] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [showIDModal, setShowIDModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKeys = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/platform/keys", {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch API keys.");
        }
        const data = await response.json();
        setApiKeys(data.keys);
      } catch (err) {
        setError((err as Error).message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchApiKeys();
  }, []);

  const truncateDescription = (text: string) => {
    const words = text.split(" ").slice(0, 4).join(" ");
    return text.length > words.length ? `${words}...` : text;
  };

  const truncateId = (id: string) => {
    return id.length > 6 ? `${id.slice(0, 4)}...` : id;
  };

  const handleDelete = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/platform/keys", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete API key.");
      }

      setApiKeys((prevKeys) => prevKeys.filter((key) => key.id !== id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loading) {
    }
  }, [loading]);

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
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && (
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Options
                  </th>
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
                      {key.expiry ? new Date(key.expiry).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="relative dropdown-container">
                        <button
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(key.id);
                          }}
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>

                        <div
                          className={`absolute right-0 mt-0 w-48 bg-white rounded-md shadow-lg z-10 ${
                            dropdownStates[key.id] ? "block" : "hidden"
                          }`}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedID(key.id);
                              setShowDeleteModal(true);
                              closeAllDropdowns();
                            }}
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
          )}
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full">
              <h3 className="text-lg font-medium mb-4">Description</h3>
              <p className="text-gray-600">{selectedDescription}</p>
              <button
                onClick={() => setShowModal(false)}
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
              <p className="text-gray-600">{selectedID}</p>
              <button
                onClick={() => setShowIDModal(false)}
                className="mt-4 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full">
              <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
              <p className="text-gray-600">Are you sure you want to delete this API key?</p>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(selectedID)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
