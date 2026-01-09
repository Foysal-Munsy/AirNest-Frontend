import Hero from "@/components/hero";
import Link from "next/link";

export default function Home() {
  return (
    <section>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Airnest</a>
        </div>
        <div className="flex-none">
          <Link href="/login">
            <button className="btn btn-primary">Login</button>
          </Link>
        </div>
      </div>
      <Hero />
    </section>
  );
}
