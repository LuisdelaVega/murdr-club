import { GameManager } from "@/[...room]/components/game-manager";
import { Header } from "@/components/header/header";
import { lorelei } from "@dicebear/collection";
import { createAvatar, type Options } from "@dicebear/core";
import { faker } from "@faker-js/faker";
import type { Avatar } from "common/types";
import { getSeedFromId } from "party/utils/get-seed-from-id";

interface Props {
  params: {
    room: string[];
  };
}

export default async function GamePage({ params }: Props) {
  const [room, name, id] = params.room;

  faker.seed(getSeedFromId(id));

  const avatarOptions: Partial<lorelei.Options & Options> = {
    seed: id,
    backgroundColor: [faker.color.rgb().substring(1)],
    backgroundType: ["solid"],
  };

  if (faker.number.int({ min: 1, max: 100 }) < 10) {
    avatarOptions.backgroundColor!.push(faker.color.rgb().substring(1));
    avatarOptions.backgroundType![0] = "gradientLinear";
  }

  // Create the player's Avatar image using the player's ID
  const diceBearAvatar = createAvatar(lorelei, avatarOptions);

  const player: Avatar = {
    id,
    name,
    image: await diceBearAvatar.toDataUri(),
  };

  return (
    <>
      <Header room={room} />
      <section className="mt-12 pb-10">
        <GameManager avatar={player} room={room} />
      </section>
    </>
  );
}
