"use client";

import { ZOD_STRING, shortUniqueIdOptions } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dices, Hourglass, Swords } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import ShortUniqueId from "short-unique-id";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const formSchema = z.object({
  room: ZOD_STRING.schema.length(shortUniqueIdOptions.length!, {
    message: `Must be ${shortUniqueIdOptions.length} characters`,
  }),
  name: ZOD_STRING.schema
    .min(2, { message: "Too short! 2 characters min." })
    .max(16, { message: "Too long! 16 characters max." }),
});

export function JoinRoomForm() {
  const router = useRouter();

  // Get the values from localStorage
  const storedRoom = useRef(localStorage.getItem("murdr-club-room") ?? "");
  const storedName = useRef(localStorage.getItem("murdr-club-name") ?? "");
  const storedId = useRef(localStorage.getItem("murdr-club-id") ?? "");

  const uid = new ShortUniqueId(shortUniqueIdOptions);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      room: "",
      name: storedName.current,
    },
  });

  function onSubmit({ room, name }: z.infer<typeof formSchema>) {
    let id = uid.rnd();

    if (storedRoom.current === room && storedName.current === name) {
      id = storedId.current;
    } else {
      // Store values in localStorage
      localStorage.setItem("murdr-club-room", room);
      localStorage.setItem("murdr-club-name", name);
      localStorage.setItem("murdr-club-id", id);
    }

    toast.info(
      <>
        <Hourglass className="w-4 h-4 mr-2 animate-spin" />
        <span>Joining the room</span>
      </>,
    );

    // Navigate to the Room
    router.push(`/${room}/${name}/${id}`);
  }

  return (
    <div>
      <Form {...form}>
        {storedRoom.current && storedName.current && storedId.current && (
          <Button asChild variant="link" className="underline">
            <Link
              href={`/${storedRoom.current}/${storedName.current}/${storedId.current}`}
            >
              Click here to join your previous game
            </Link>
          </Button>
        )}

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 p-6 bg-slate-100 rounded-sm"
        >
          {/* Room ID */}
          <FormField
            control={form.control}
            name="room"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Id</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder={`Enter ${shortUniqueIdOptions.length}-Character Code`}
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      field.onChange(uid.rnd());
                    }}
                  >
                    <Dices />
                  </Button>
                </div>
                <FormDescription>This is the id for the Room.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormDescription>
                  Other players will see this name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full text-center">
            <Swords className="w-4 h-4 mr-2 uppercase" />
            Join Room
          </Button>
        </form>
      </Form>
    </div>
  );
}
