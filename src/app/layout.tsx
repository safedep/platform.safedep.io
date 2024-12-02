import React from 'react';
import './globals.css';

export const metadata = {
  title: 'SafeDep Platform',
  description: 'Safedep',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
