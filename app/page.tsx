import { lorelei } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { faker } from "@faker-js/faker";
import ShortUniqueId from "short-unique-id";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";

export default async function Home() {
  const uid = new ShortUniqueId({
    dictionary: "alphanum_upper",
    length: 8,
  });

  const seed = uid.rnd();

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

  const options = {
    firstName: domainWord.split("-")[0],
    lastName: domainWord.split("-")[1],
  };

  return (
    <>
      <Avatar className="h-72 w-72">
        <AvatarImage
          src={avatarHref}
          alt={`lorelei image with seed: ${seed}`}
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <p>Username: {faker.internet.userName(options)}</p>
      <p>Display Name: {faker.internet.displayName(options)}</p>
      <p>Domain Word: {domainWord}</p>
    </>
  );
}
