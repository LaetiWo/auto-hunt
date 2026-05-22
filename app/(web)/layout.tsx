import NavBar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";

export const dynamic = "force-dynamic";

export default function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <NavBar />
        <main className="overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-8xl w-full h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
