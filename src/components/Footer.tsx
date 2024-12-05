import React from "react";

const Footer: React.FC = () => (
  <footer className="bg-blue-600 text-white text-sm mt-auto w-full py-4 shadow-md">
    <div className="container mx-auto flex justify-center items-center space-x-4">
      <span>&copy; 2024 SafeDep</span>
      <span>&bull;</span>
      <a
        href="#"
        className="hover:text-blue-300 transition-all"
        aria-label="Advertise with SafeDep"
      >
        Advertise
      </a>
      <span>&bull;</span>
      <a
        href="#"
        className="hover:text-blue-300 transition-all"
        aria-label="Privacy Policy"
      >
        Privacy
      </a>
    </div>
  </footer>
);

export default Footer;
