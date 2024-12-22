import React from "react";

const TermsAndPrivacy: React.FC = () => {
  return (
    <p className="text-xs text-gray-500 text-center mt-4">
      By continuing, you agree to our{" "}
      <a href="#" className="text-blue-600 hover:underline focus:underline">
        Terms of Service
      </a>{" "}
      and{" "}
      <a href="#" className="text-blue-600 hover:underline focus:underline">
        Privacy Policy
      </a>
      .
    </p>
  );
};

export default TermsAndPrivacy;
