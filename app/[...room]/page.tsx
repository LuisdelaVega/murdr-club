import { GameManager } from "@/components/game-manager";
import { lorelei } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { faker } from "@faker-js/faker";
import { type Avatar } from "party/types";
import { getSeedFromId } from "party/utils/get-seed-from-id";

interface GamePageProps {
  params: {
    room: string[];
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const [room, name, id] = params.room;

  faker.seed(getSeedFromId(id));

  // Create the player's Avatar image using the player's ID
  const diceBearAvatar = createAvatar(lorelei, {
    seed: id,
    backgroundColor: [
      faker.color.rgb().substring(1),
      faker.color.rgb().substring(1),
    ],
    backgroundType: ["gradientLinear"],
  });

  const player: Avatar = {
    id,
    name,
    image: await diceBearAvatar.toDataUri(),
  };

  return (
    <section className="h-[100dvh] grid grid-rows-[min-content_1fr] gap-10">
      <h2 className="text-center border-b bg-emerald-700">{room}</h2>
      <GameManager avatar={player} room={room} />
    </section>
  );
}
