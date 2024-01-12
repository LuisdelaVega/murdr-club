import { PARTYKIT_URL } from "@/env";
import { type NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { roomId: string } },
) {
  const response = await fetch(`${PARTYKIT_URL}/party/${params.roomId}`);

  if (!response.ok) {
    return new Response("Something unexpected happened", {
      status: 500,
    });
  }

  const data = await response.json();

  return Response.json({ ...data });
}
