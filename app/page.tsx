import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import BookUniqueHomes from "@/components/book-unique-homes";
import NaturesHideaway from "@/components/natures-hideaway";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <section>
      <Nav />
      <Hero />
      <BookUniqueHomes />
      <NaturesHideaway />
      <Footer />
    </section>
  );
}
