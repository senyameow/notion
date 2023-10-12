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
      <div className="relative">
        <div aria-hidden='true' className="absolute border isolate inset-x-0 -top-[] -z-10 opacity-70 h-16 transition blur-2xl sm:-top-[45rem]">
          <div style={{ clipPath: `polygon(24.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 55.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 70.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)` }} className="relative opacity-50 w-[42rem] left-[calc(50%-11rem)] sm:left-[calc(50%-30rem)] -translate-x-1/2 -rotate-[20deg] aspect-[1200/800] bg-gradient-to-tr from-[#9180Fc] to-[#FF9151]" />
        </div>
      </div>
      <Footer />
    </div>
  )
}
