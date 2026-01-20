import Sidebar from "../../components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-secondary">
      <Sidebar />
      <div className="w-full p-4 my-2 mr-2 bg-white rounded-xl border border-violet-200">
        {children}
      </div>
    </div>
  );
}
