"use client";

import { Loading } from "@/components/Loading";
import { logger } from "@/utils/logger";
import { useUser } from "@auth0/nextjs-auth0/client";
import { TimerIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Badge from "../../components/Badge";
import { LogoutLink } from "@/components/LogoutLink";
import { Button } from "@/components/ui/button";
import { createOnboarding } from "./action";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type FormData = {
  name: string;
  organizationName: string;
  organizationDomain: string;
};

const Onboard: React.FC = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { register, handleSubmit } = useForm<FormData>();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const { mutateAsync: onboardUser, isPending } = useMutation({
    mutationKey: ["onboard"],
    mutationFn: async (data: FormData) => {
      await createOnboarding({
        ...data,
        // email: user?.email,
      });
    },

    onSuccess: () => {
      toast.success("Onboarding successful!");
      router.push("/");
    },
    onError: () => {
      setErrorMessage(
        "An organization with the same domain already exists. Please try a different domain.",
      );
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await onboardUser(data);
    } catch (error) {
      logger.error("Onboarding error:", error);
    }
  };

  if (isLoading) {
    return <Loading message="Loading user details..." />;
  }

  if (isPending) {
    return (
      <Loading message="Creating your organization..." badge={TimerIcon} />
    );
  }

  if (!isLoading && !user) {
    router.push("/");
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-lg w-full p-6 bg-white shadow-xl rounded-lg space-y-8">
        <Card className="flex flex-col gap-4 p-4 border-none shadow-none">
          <div className="flex justify-center items-center">
            <Badge
              icon={UserIcon}
              text={`Welcome, ${user?.name || "User"}! Please fill in the details to onboard.`}
              bgColor="bg-blue-100"
              textColor="text-blue-700"
            />
          </div>

          <form className="space-y-6">
            <CardHeader className="text-2xl font-semibold text-center text-gray-800">
              Create Your Organization
            </CardHeader>

            {errorMessage && (
              <div className="text-red-600 text-sm bg-red-100 p-3 rounded-lg">
                {errorMessage}
              </div>
            )}

            <div>
              <Label className="block mb-2 text-sm font-medium text-gray-700">
                Your Name
              </Label>
              <Input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label className="block mb-2 text-sm font-medium text-gray-700">
                Organization Name
              </Label>
              <Input
                id="organizationName"
                {...register("organizationName", {
                  required: "Organization name is required",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Example Inc"
              />
            </div>

            <div>
              <Label className="block mb-2 text-sm font-medium text-gray-700">
                Organization Domain
              </Label>
              <Input
                id="organizationDomain"
                {...register("organizationDomain", {
                  required: "Organization domain is required",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="example.com"
              />
            </div>

            <Button
              // variant="outline"
              type="button"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
              onClick={handleSubmit(onSubmit)}
            >
              Create
            </Button>
          </form>
          <div className="flex justify-center mt-4">
            <LogoutLink>
              <Badge
                icon={UserIcon}
                text="Sign out"
                bgColor="bg-blue-100"
                textColor="text-white-700"
              />
            </LogoutLink>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Onboard;
