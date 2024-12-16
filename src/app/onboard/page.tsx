'use client';

import { logger } from "@/utils/logger";
import { useUser } from "@auth0/nextjs-auth0/client";
import { TimerIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Badge from "../../components/Badge";
import { Loading } from "@/components/Loading";
import Link from "next/link";

type FormData = {
  name: string;
  organizationName: string;
  organizationDomain: string;
};

const Onboard: React.FC = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { register, handleSubmit, setError } = useForm<FormData>();
  const [apiLoading, setApiLoading] = React.useState(false);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setApiLoading(true);
      const response = await fetch("/api/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setApiLoading(false);

      const body = await response.json();
      if (!response.ok) {
        logger.error("Failed to onboard", body);
        return;
      }

      if (body.isDomainDuplicate) {
        setError("organizationDomain", {
          type: "manual",
          message: body.message || "This domain is already in use"
        });
        return;
      }

      logger.info("Onboarding successful", body);
      router.push("/");
    } catch (error) {
      logger.error("Error occurred while onboarding", error);
    }
  };

  if (apiLoading) {
    return (
      <Loading message="Creating your organization..." badge={TimerIcon} />
    )
  }

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
              placeholder="John Doe"
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
              placeholder="Example Inc"
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
              placeholder="example.com"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            Create
          </button>
        </form>
        <div className="flex justify-center mt-4">
          <Link href="/api/auth/logout">
            <Badge icon={UserIcon} text="Sign out" bgColor="bg-blue-100" textColor="text-white-700" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Onboard;
