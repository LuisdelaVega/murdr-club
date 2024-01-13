import { GameManager } from "@/components/game-manager";
import { lorelei } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { faker } from "@faker-js/faker";
import { type Avatar } from "party/types";

interface GamePageProps {
  params: {
    room: string[];
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const [room, name, id] = params.room;

  // Create the player's Avatar image using the player's ID
  const avatar = createAvatar(lorelei, {
    seed: id,
  });

  let fakerSeed = "";
  for (let index = 0; index < id.length; index++) {
    fakerSeed += id.charCodeAt(index);
  }
  faker.seed(Number(fakerSeed));

  const player: Avatar = {
    id,
    name,
    image: {
      backgroundColor: faker.color.rgb(),
      src: await avatar.toDataUri(),
    },
  };

  return (
    <section className="h-[100dvh] grid grid-rows-[min-content_1fr] gap-10">
      <h2 className="text-center border-b bg-emerald-700">{room}</h2>
      <GameManager avatar={player} room={room} />
    </section>
  );
}
