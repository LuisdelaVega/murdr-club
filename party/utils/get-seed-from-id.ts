export function getSeedFromId(id: string) {
  let seed = "";
  for (let index = 0; index < id.length; index++) {
    seed += id.charCodeAt(index);
  }

  return Number(seed);
}
