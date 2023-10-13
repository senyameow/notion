import Footer from "./_components/Footer";
import Heading from "./_components/Heading";
import Heroes from "./_components/Heroes";

export default function Home() {
  return (
    <div className="min-h-full flex flex-col overflow-x-hidden">
      <div className="flex flex-col items-center justify-center flex-1 md:justify-start gap-y-8 text-center px-6 pb-10">
        <Heading />
        <Heroes />
      </div>

      <Footer />
    </div>
  )
}
