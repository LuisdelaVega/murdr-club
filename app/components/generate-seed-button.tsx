"use client";

import Link from "next/link";
import ShortUniqueId from "short-unique-id";
import { Button } from "./ui/button";

export function GenerateSeedButton() {
  const uid = new ShortUniqueId({
    dictionary: "alphanum_upper",
    length: 8,
  });

  const seed = uid.rnd();

  return (
    <Button asChild>
      <Link href={`/${seed}`}>Play game</Link>
    </Button>
  );
}
