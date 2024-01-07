import { JoinRoomForm } from "./components/join-room-form";

export default async function Home() {
  return (
    <section className="w-full h-[100dvh] flex flex-col justify-center align-middle items-center">
      <JoinRoomForm />
    </section>
  );
}
