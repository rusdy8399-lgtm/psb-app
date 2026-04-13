export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans">
      {children}
    </div>
  );
}
