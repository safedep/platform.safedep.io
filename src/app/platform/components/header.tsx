export default function MainHeader({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <div>
      <h1 className="text-2xl font-bold mt-4">
        {children}
      </h1>
    </div>
  );
}
