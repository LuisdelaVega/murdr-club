import { Header } from "./components/header/header";
import { JoinRoomForm } from "./components/join-room-form";

export default async function Home() {
  return (
    <>
      <Header />
      <section className="w-full h-[calc(100dvh_-_2.5rem)] flex flex-col justify-center align-middle items-center">
        <JoinRoomForm />
      </section>
    </>
  );
}
