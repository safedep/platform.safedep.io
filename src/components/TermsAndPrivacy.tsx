import React from "react";
import { externalUrls } from "@/lib/config";

const TermsAndPrivacy: React.FC = () => {
  return (
    <p className="text-xs text-gray-500 text-center mt-4">
      By continuing, you agree to our{" "}
      <a
        href={externalUrls.termsOfService}
        className="text-blue-600 hover:underline focus:underline"
      >
        Terms of Service
      </a>{" "}
      and{" "}
      <a
        href={externalUrls.privacyPolicy}
        className="text-blue-600 hover:underline focus:underline"
      >
        Privacy Policy
      </a>
      .
    </p>
  );
};

export default TermsAndPrivacy;
