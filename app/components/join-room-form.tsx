"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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

const ZOD_STRING = {
  schema: z
    .string()
    .regex(/^[a-zA-Z0-9]*$/, "Only letters and numbers are allowed")
    .toUpperCase()
    .trim(),
};

const formSchema = z.object({
  roomId: ZOD_STRING.schema.length(8),
  username: ZOD_STRING.schema.min(2).max(16),
});

export function JoinRoomForm() {
  const router = useRouter();

  const uid = new ShortUniqueId({
    dictionary: "alphanum_upper",
    length: 8,
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomId: "",
      username: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit({ roomId, username }: z.infer<typeof formSchema>) {
    toast.info("Attempting to join the Room");
    router.push(`/${roomId}/${username}/${uid.rnd()}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Room ID */}
        <FormField
          control={form.control}
          name="roomId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room ID</FormLabel>
              <FormControl>
                <Input
                  className="uppercase"
                  placeholder="ABCD1234"
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
                Generate Room ID
              </Button>
              <FormDescription>This is id for the Room.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  className="uppercase"
                  placeholder="papaluisre"
                  {...field}
                />
              </FormControl>
              <FormDescription>This is will be your username.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
