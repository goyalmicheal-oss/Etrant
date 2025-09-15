"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INTERESTS } from "@/data/interest";

const FormSchema = z.object({
  email: z
    .string({
      required_error: "Please select an interest.",
    })
    .email(),
});

export function InterestSelector() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("Interest submitted successfully!");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex gap-2 items-center"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              {/* <FormLabel>Interest</FormLabel> */}
              <FormLabel></FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-200 border border-gray-400 dark:border-gray-800 text-gray-950 dark:text-gray-100 dark:bg-gray-900">
                    <SelectValue placeholder="Select an interest" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {INTERESTS.map((interest) => (
                    <SelectItem key={interest.id} value={interest.id}>
                      {interest.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="bg-indigo-600 text-gray-100 hover:bg-indigo-700"
          type="submit"
        >
          Done
        </Button>
      </form>
    </Form>
  );
}
