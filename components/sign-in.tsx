"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type SignInFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

export default function SignIn() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(
    null,
  );

  const form = useForm<SignInFormValues>({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    try {
      await signIn.email(
        {
          email: values.email.trim(),
          password: values.password,
        },
        {
          onRequest: () => setAuthLoading(true),
          onResponse: () => setAuthLoading(false),
        
          onSuccess: () => router.push("/dashboard/overview"),
        },
      );
    } catch (error) {
      console.error("[sign-in] Email sign-in failed", error);
      setAuthLoading(false);
      toast.error("Something went wrong while signing you in.");
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    try {
      await signIn.social(
        {
          provider,
          callbackURL: "/dashboard/overview",
        },
        {
          onRequest: () => setSocialLoading(provider),
          onResponse: () => setSocialLoading(null),
          onError: (ctx) => { toast.error(ctx.error.message); },
        },
      );
    } catch (error) {
      console.error("[sign-in] Social sign-in failed", error);
      setSocialLoading(null);
      toast.error("We couldn't start the social sign-in. Try again.");
    }
  };

  const isSubmitting =
    authLoading || socialLoading !== null || form.formState.isSubmitting;

  return (
    <Card className="w-full max-w-xl border-border/60 shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Continue managing your workspace or contribute to boards that require sign-in for suggestions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FieldSet className="gap-5">
              <FieldLegend>Account access</FieldLegend>
              <FieldGroup className="flex flex-col gap-4">
                <Controller
                  control={form.control}
                  name="email"
                  rules={{
                    required: "Enter the email you used during sign-up.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address.",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <FieldContent>
                        <Input
                          id="email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@company.com"
                          disabled={isSubmitting}
                          {...field}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="password"
                  rules={{
                    required: "Enter your account password.",
                  }}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="password"
                        className="flex items-center gap-2 text-sm font-medium"
                      >
                        <span>Password</span>
                        <Link
                          href="#"
                          className="ml-auto text-xs font-normal text-primary underline-offset-4 hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          id="password"
                          type="password"
                          autoComplete="current-password"
                          placeholder="••••••••"
                          disabled={isSubmitting}
                          {...field}
                        />
                        <FieldDescription>
                          Passwords are case sensitive. Check for caps lock if
                          sign-in fails.
                        </FieldDescription>
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <Field orientation="horizontal" className="items-start">
                      <FieldContent className="flex flex-row items-center gap-3">
                        <Checkbox
                          id="remember"
                          checked={field.value}
                          disabled={isSubmitting}
                          onCheckedChange={(checked) =>
                            field.onChange(checked === true)
                          }
                        />
                        <FieldLabel
                          htmlFor="remember"
                          className="text-sm font-medium leading-none"
                        >
                          Remember this device
                        </FieldLabel>
                      </FieldContent>
                      <FieldDescription className="pl-[1.75rem] text-xs">
                        We keep you signed in for 30 days unless you log out.
                      </FieldDescription>
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {authLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing you in…
                </span>
              ) : (
                "Continue"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-6 border-t pt-6">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Or continue with
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              className={cn("w-full gap-2")}
              disabled={isSubmitting}
              onClick={() => handleSocialSignIn("google")}
            >
              {socialLoading === "google" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="0.98em"
                  height="1em"
                  viewBox="0 0 256 262"
                >
                  <path
                    fill="#4285F4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  />
                  <path
                    fill="#34A853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  />
                  <path
                    fill="#FBBC05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                  />
                  <path
                    fill="#EB4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  />
                </svg>
              )}
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className={cn("w-full gap-2")}
              disabled={isSubmitting}
              onClick={() => handleSocialSignIn("github")}
            >
              {socialLoading === "github" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
                  />
                </svg>
              )}
              GitHub
            </Button>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Need a PublicPulse account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Create one in minutes
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
