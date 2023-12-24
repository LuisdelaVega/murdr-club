import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { lorelei } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { faker } from "@faker-js/faker";

interface GamePageProps {
  params: {
    seed: string;
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { seed } = params;

  const avatar = createAvatar(lorelei, {
    seed,
  });
  const avatarHref = await avatar.toDataUri();

  let fakerSeed = "";
  for (let index = 0; index < seed.length; index++) {
    fakerSeed += seed.charCodeAt(index);
  }
  faker.seed(Number(fakerSeed));

  const domainWord = faker.internet.domainWord();
  const [firstName, lastName] = domainWord.split("-");

  return (
    <section className="w-full h-[100dvh] flex flex-col justify-center align-middle items-center">
      <Avatar
        className="h-72 w-72"
        style={{ backgroundColor: faker.color.rgb() }}
      >
        <AvatarImage
          src={avatarHref}
          alt={`lorelei image with seed: ${seed}`}
          // className={`bg-[${faker.color.rgb()}]`}
        />
        <AvatarFallback>{`${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`}</AvatarFallback>
      </Avatar>

      <p>
        <b>
          Display Name:{" "}
          <span className="text-green-700">
            {faker.internet.displayName({ firstName, lastName })}
          </span>
        </b>
      </p>
    </section>
  );
}
