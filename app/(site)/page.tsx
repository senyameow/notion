import Heading from "./_components/Heading";

export default function Home() {
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col items-center justify-center flex-1 md:justify-start gap-y-8 text-center px-6 pb-10">
        <Heading />
      </div>
      <div>
        footer
      </div>
    </div>
  )
}
