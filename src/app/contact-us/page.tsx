"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  CircleNotch,
  ChatText,
  EnvelopeSimple,
  Phone,
  MapPin,
} from "@phosphor-icons/react";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Define the form schema using Zod
const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." })
    .max(100, { message: "Full name must not exceed 100 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters." })
    .max(150, { message: "Subject must not exceed 150 characters." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." })
    .max(1000, { message: "Message must not exceed 1000 characters." }),
  honeypot: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

// Default values for the form
const defaultValues: Partial<ContactFormValues> = {
  fullName: "",
  email: "",
  subject: "",
  message: "",
  honeypot: "",
};

// Placeholder for contact information
const contactDetails = {
  email: "info@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Creative Lane, Innovation City, Digital World",
  socialLinks: [
    // { name: "Twitter", url: "#", icon: <TwitterLogo size={24} /> }, // Example
    // { name: "LinkedIn", url: "#", icon: <LinkedinLogo size={24} /> },
  ],
};

export default function ContactUsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: ContactFormValues) {
    if (data.honeypot) {
      console.log("Bot detected!");
      return;
    }
    setIsSubmitting(true);
    console.log("Form data submitted:", data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      toast.success("Message sent successfully!", {
        description: "Thank you for reaching out. We'll get back to you soon.",
        duration: 5000,
      });
      form.reset();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Oops! Message failed to send.", {
        description: "Please check your connection or try again later.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 dark:from-slate-900 dark:via-gray-800 dark:to-slate-950  md:py-50 min-h-screen flex items-center px-3 sm:px-12 md:px-20 lg:px-36">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start my-36 md:my-10">
          <div className="space-y-6 lg:sticky lg:top-20 self-start">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              Let&apos;s Connect!
            </h1>
            <div className="mt-8 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">
                Our Office Hours
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Monday - Friday: 9:00 AM - 6:00 PM
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Saturday: 10:00 AM - 2:00 PM (Support Only)
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Sunday: Closed
              </p>
            </div>
            <Card className="shadow-xl dark:bg-slate-800/70 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-700 dark:text-slate-200">
                  Other Ways to Reach Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <a
                  href={`mailto:${contactDetails.email}`}
                  className="flex items-center space-x-3 text-slate-600 hover:text-yellow-600 dark:text-slate-300 dark:hover:text-yellow-400 transition-colors group"
                >
                  <EnvelopeSimple
                    size={28}
                    weight="duotone"
                    className="text-yellow-500 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors"
                  />
                  <span>{contactDetails.email}</span>
                </a>
                <Separator className="dark:bg-slate-700" />
                <a
                  href={`tel:${contactDetails.phone.replace(/\s+/g, "")}`} // Format for tel link
                  className="flex items-center space-x-3 text-slate-600 hover:text-yellow-600 dark:text-slate-300 dark:hover:text-yellow-400 transition-colors group"
                >
                  <Phone
                    size={28}
                    weight="duotone"
                    className="text-yellow-500 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors"
                  />
                  <span>{contactDetails.phone}</span>
                </a>
                <Separator className="dark:bg-slate-700" />
                <div className="flex items-start space-x-3 text-slate-600 dark:text-slate-300">
                  <MapPin
                    size={28}
                    weight="duotone"
                    className="text-yellow-500 mt-1 flex-shrink-0"
                  />
                  <span>{contactDetails.address}</span>
                </div>
              </CardContent>
              {contactDetails.socialLinks &&
                contactDetails.socialLinks.length > 0 && (
                  <CardFooter className="flex space-x-4 pt-4 border-t dark:border-slate-700"></CardFooter>
                )}
            </Card>
          </div>

          {/* Column 2: Form and Contact Details */}
          <div className="space-y-8">
            <Card className="shadow-xl dark:bg-slate-800/70 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center text-slate-700 dark:text-slate-200">
                  Send Us a Message
                </CardTitle>
                {/* <CardDescription className="text-center text-slate-500 dark:text-slate-400">
                  Fill in the details below.
                </CardDescription> */}
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="honeypot"
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormLabel>Leave this field empty</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              tabIndex={-1}
                              autoComplete="off"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-slate-300">
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your Full Name"
                              {...field}
                              className="dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 dark:border-slate-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-slate-300">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              {...field}
                              className="dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 dark:border-slate-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-slate-300">
                            Subject
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="What's this about?"
                              {...field}
                              className="dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 dark:border-slate-600"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-slate-300">
                            Message
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us more..."
                              className="min-h-[120px] resize-y dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 dark:border-slate-600"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="dark:text-slate-400">
                            The more details, the better we can assist you.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full text-lg py-3 bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:text-slate-900"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <CircleNotch
                            className="mr-2 h-5 w-5 animate-spin"
                            weight="bold"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message{" "}
                          <ChatText className="ml-2 h-5 w-5" weight="bold" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
