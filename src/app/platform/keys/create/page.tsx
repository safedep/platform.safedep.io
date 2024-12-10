"use client";
import { useState } from "react";
import { KeyIcon, ClipboardCopyIcon, CheckIcon } from "lucide-react";
import MainHeader from "../../components/header";
import Sidebar from "../../components/sidebar";
import { ApiKeyNavigations } from "../navigations";
const Page = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [expiry, setExpiry] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [notification, setNotification] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await new Promise<{ apiKey: string }>((resolve) =>
        setTimeout(() => resolve({ apiKey: "12345-ABCDE" }), 1000)
      );
      setApiKey(response.apiKey);
      setNotification("success");
    } catch {
      setNotification("error");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar items={ApiKeyNavigations} />
      <div className="flex-grow p-8 max-w-4xl mx-auto">
        <MainHeader>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <KeyIcon className="h-8 w-8 text-blue-600" />
            </div>
            <span className="ml-4 text-2xl font-bold text-gray-900">Create New API Key</span>
          </div>
        </MainHeader>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="e.g. API Key"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="What will this API key be used for?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Period</label>
              <select
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              >
                <option value="">Select duration</option>
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
                <option value="never">Never expires</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="w-full px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition duration-200 flex items-center justify-center space-x-2"
            >
              <KeyIcon className="h-5 w-5" />
              <span>Generate API Key</span>
            </button>
          </div>
        </form>

        {notification === "success" && (
          <div className="mt-6 p-6 rounded-xl bg-green-50 border border-green-200">
            <h3 className="text-sm font-medium text-green-800 mb-3">API Key Generated Successfully</h3>
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-green-200">
              <code className="text-sm text-gray-800 font-mono">{apiKey}</code>
              <button
                onClick={handleCopy}
                className="ml-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-200 flex items-center space-x-2"
              >
                {copied ? (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <ClipboardCopyIcon className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="mt-3 text-sm text-green-700">
              Make sure to copy your API key now. You wont be able to see it again!
            </p>
          </div>
        )}

        {notification === "error" && (
          <div className="mt-6 p-6 rounded-xl bg-red-50 border border-red-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-xl">!</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800">Error Creating API Key</h3>
                <p className="mt-1 text-sm text-red-700">
                  Something went wrong. Please try again or contact support if the problem persists.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;