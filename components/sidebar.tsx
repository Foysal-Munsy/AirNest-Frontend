import { getUserFromToken, logoutUser } from "@/lib/auth_actions";
import { redirect } from "next/navigation";
import Link from "next/link";

const links = [
  { name: "Home", href: "/dashboard" },
  { name: "Tickets", href: "/dashboard/tickets" },
];

export default async function Sidebar() {
  const user = await getUserFromToken();

  async function handleLogout() {
    "use server";
    await logoutUser();
    redirect("/login");
  }

  return (
    <div className="bg-secondary p-2 h-screen w-64">
      {user && (
        <div className="mb-6 pb-4 px-2 border-b border-violet-200">
          <div className="font-semibold text-lg text-violet-900">
            {user.name}
          </div>
          <div className="text-sm text-violet-400">{user.role}</div>
        </div>
      )}

      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="px-2 py-1 hover:bg-violet-100 rounded-md text-violet-950"
          >
            {link.name}
          </Link>
        ))}

        <form action={handleLogout}>
          <button
            type="submit"
            className="w-full text-left px-2 py-1 hover:bg-violet-100 rounded-md text-red-600 cursor-pointer"
          >
            Logout
          </button>
        </form>
      </nav>
    </div>
  );
}
