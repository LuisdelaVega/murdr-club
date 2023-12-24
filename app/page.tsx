import { GenerateSeedButton } from "./components/generate-seed-button";

export default async function Home() {
  return (
    <section className="w-full h-[100dvh] flex flex-col justify-center align-middle items-center">
      <GenerateSeedButton />
    </section>
  );
}
