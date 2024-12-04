"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useForm, SubmitHandler } from "react-hook-form";
import Badge from "../../components/Badge";
import { UserIcon } from "lucide-react";

type FormData = {
  name: string;
  organizationName: string;
  organizationDomain: string;
};

const Onboard: React.FC = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await fetch("/api/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Successfully onboarded:", response); 
      } else {
        const errorText = await response.text();
        console.error("Failed to onboard:", errorText);
      }
    } catch (error) {
      console.error("Error during onboarding:", error);
    }
  };

  if (!isLoading && !user) {
    router.push("/");
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-lg w-full p-6 bg-white shadow-xl rounded-lg space-y-8">
        <div className="flex justify-center items-center">
          <Badge
            icon={UserIcon}
            text={`Welcome, ${user?.name || "User"}! Please fill in the details to onboard.`}
            bgColor="bg-blue-100"
            textColor="text-blue-700"
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h1 className="text-2xl font-semibold text-center text-gray-800">
            Create Your Organization
          </h1>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Organization Name
            </label>
            <input
              type="text"
              {...register("organizationName", { required: "Organization name is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter organization name"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Organization Domain
            </label>
            <input
              type="text"
              {...register("organizationDomain", { required: "Organization domain is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter domain"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboard;