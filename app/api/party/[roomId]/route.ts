import { PARTYKIT_URL } from "@/env";

export async function GET(
  _request: Request,
  { params }: { params: { roomId: string } },
) {
  const data = await (
    await fetch(`${PARTYKIT_URL}/party/${params.roomId}`)
  ).json();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
