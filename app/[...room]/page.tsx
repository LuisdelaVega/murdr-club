import { GameManager } from "@/components/game-manager";
import { lorelei } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { faker } from "@faker-js/faker";
import { Player } from "party/types";

interface GamePageProps {
  params: {
    room: string[];
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const [room, username, playerId] = params.room;

  // Create the player's Avatar image using the player's ID
  const avatar = createAvatar(lorelei, {
    seed: playerId,
  });
  const avatarImg = await avatar.toDataUri();

  let fakerSeed = "";
  for (let index = 0; index < playerId.length; index++) {
    fakerSeed += playerId.charCodeAt(index);
  }
  faker.seed(Number(fakerSeed));

  const player: Player = {
    id: playerId,
    name: username,
    image: {
      backgroundColor: faker.color.rgb(),
      src: avatarImg,
    },
  };

  return (
    <section className="h-[100dvh] grid grid-rows-[min-content_1fr] gap-10">
      <h2 className="text-center border-b bg-emerald-700">{room}</h2>
      <GameManager player={player} room={room} />
    </section>
  );
}
