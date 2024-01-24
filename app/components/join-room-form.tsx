"use client";

import { ZOD_STRING, shortUniqueIdOptions } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import ShortUniqueId from "short-unique-id";
import { toast } from "sonner";
import * as z from "zod";
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
  room: ZOD_STRING.schema.length(shortUniqueIdOptions.length ?? 8),
  name: ZOD_STRING.schema.min(2).max(16),
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

  function navigateToRoom(room: string, name: string, id: string) {
    router.push(`/${room}/${name}/${id}`);
  }

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

    toast.info("Attempting to join the Room");

    navigateToRoom(room, name, id);
  }

  return (
    <Form {...form}>
      {storedRoom.current && storedName.current && storedId.current && (
        <Button asChild variant="link" className="underline">
          <Link
            href={`/${storedRoom.current}/${storedName.current}/${storedId.current}`}
            className="uppercase"
          >
            Click here to join your previous game
          </Link>
        </Button>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Room ID */}
        <FormField
          control={form.control}
          name="room"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="uppercase">Room Id</FormLabel>
              <FormControl>
                <Input
                  className="uppercase"
                  placeholder={`Enter ${shortUniqueIdOptions.length}-Character Code`}
                  {...field}
                />
              </FormControl>
              <Button
                type="button"
                className="uppercase"
                onClick={(e) => {
                  e.preventDefault();
                  field.onChange(uid.rnd());
                }}
              >
                Generate
              </Button>
              <FormDescription className="uppercase">
                This is the id for the Room.
              </FormDescription>
              <FormMessage className="uppercase" />
            </FormItem>
          )}
        />

        {/* name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="uppercase">Name</FormLabel>
              <FormControl>
                <Input
                  className="uppercase"
                  placeholder="Enter your name"
                  {...field}
                />
              </FormControl>
              <FormDescription className="uppercase">
                Other players will see this name.
              </FormDescription>
              <FormMessage className="uppercase" />
            </FormItem>
          )}
        />

        <Button type="submit" className="uppercase">
          Play
        </Button>
      </form>
    </Form>
  );
}
