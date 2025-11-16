"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { signUp } from "@/lib/auth-client";
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

type SignUpFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar?: FileList;
};

const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB

export default function SignUp() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const form = useForm<SignUpFormValues>({
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const resetImage = () => {
    setImageFile(null);
    setImagePreview(null);
    form.setValue("avatar", undefined);
    setFileInputKey((key) => key + 1);
  };

  const handleFileChange = (file: File | null) => {
    if (!file) {
      resetImage();
      return false;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Please pick an image smaller than 4MB.");
      resetImage();
      return false;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    return true;
  };

  const onSubmit = async (values: SignUpFormValues) => {
    if (values.password.trim().length < 8) {
      form.setError("password", {
        type: "manual",
        message: "Use at least 8 characters for a secure password.",
      });
      return;
    }

    if (values.password !== values.confirmPassword) {
      form.setError("confirmPassword", {
        type: "validate",
        message: "Passwords do not match.",
      });
      return;
    }

    const fullName = [values.firstName.trim(), values.lastName.trim()]
      .filter(Boolean)
      .join(" ");

    let imageBase64 = "";
    if (imageFile) {
      try {
        imageBase64 = await convertImageToBase64(imageFile);
      } catch (error) {
        console.error("[sign-up] Failed to read avatar file", error);
        toast.error("We couldn't read your image. Try another file.");
        return;
      }
    }

    try {
      await signUp.email(
        {
          email: values.email.trim(),
          password: values.password,
          name: fullName,
          image: imageBase64,
          callbackURL: "/dashboard/overview",
        },
        {
          onRequest: () => setLoading(true),
          onResponse: () => setLoading(false),
             onError: (ctx) => { toast.error(ctx.error.message); },
          onSuccess: () => router.push("/dashboard/overview"),
        }
      );
    } catch (error) {
      console.error("[sign-up] Sign up request failed", error);
      setLoading(false);
      toast.error("Unexpected error while creating your account.");
    }
  };

  const isSubmitting = loading || form.formState.isSubmitting;

  return (
    <Card className="w-full max-w-xl border-border/60 shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Create your account
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Ready to create a workspace or join a board as a contributor? Sign up once, then either launch a new
          product workspace or sign in on a public board to leave suggestions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FieldSet className="gap-5">
              <FieldLegend>Your details</FieldLegend>
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
                <Controller
                  control={form.control}
                  name="firstName"
                  rules={{
                    required: "Please add your first name.",
                    minLength: {
                      value: 2,
                      message: "First name should be at least 2 characters.",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="first-name">First name</FieldLabel>
                      <FieldContent>
                        <Input
                          id="first-name"
                          autoComplete="given-name"
                          placeholder="Max"
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
                  name="lastName"
                  rules={{
                    required: "Please add your last name.",
                    minLength: {
                      value: 2,
                      message: "Last name should be at least 2 characters.",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="last-name">Last name</FieldLabel>
                      <FieldContent>
                        <Input
                          id="last-name"
                          autoComplete="family-name"
                          placeholder="Robinson"
                          disabled={isSubmitting}
                          {...field}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <FieldSet className="gap-5">
              <FieldLegend>Account access</FieldLegend>
              <FieldGroup className="flex flex-col gap-4">
                <Controller
                  control={form.control}
                  name="email"
                  rules={{
                    required: "We need an email to create your account.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please provide a valid email address.",
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
                        <FieldDescription>
                          We’ll send confirmation emails to this address.
                        </FieldDescription>
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="password"
                  rules={{
                    required: "Set a password to secure your account.",
                    minLength: {
                      value: 8,
                      message: "Use at least 8 characters.",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <FieldContent>
                        <Input
                          id="password"
                          type="password"
                          autoComplete="new-password"
                          placeholder="••••••••"
                          disabled={isSubmitting}
                          {...field}
                        />
                        <FieldDescription>
                          Include a mix of letters, numbers, and symbols for
                          stronger security.
                        </FieldDescription>
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="confirmPassword"
                  rules={{
                    required: "Confirm your password to continue.",
                  }}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="confirm-password">
                        Confirm password
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          id="confirm-password"
                          type="password"
                          autoComplete="new-password"
                          placeholder="Re-enter password"
                          disabled={isSubmitting}
                          {...field}
                        />
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <FieldSet className="gap-5">
              <FieldLegend>Profile (optional)</FieldLegend>
              <FieldGroup className="flex flex-col gap-4">
                <Controller
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="avatar">Profile image</FieldLabel>
                      <FieldContent>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                          <div
                            className={cn(
                              "relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border",
                              imagePreview
                                ? "bg-muted"
                                : "border-dashed bg-muted/30"
                            )}
                          >
                            {imagePreview ? (
                              <Image
                                src={imagePreview}
                                alt="Profile preview"
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                Optional
                              </span>
                            )}
                          </div>
                          <div className="flex flex-1 flex-col gap-2">
                            <Input
                              key={fileInputKey}
                              id="avatar"
                              type="file"
                              accept="image/*"
                              disabled={isSubmitting}
                              onChange={(event) => {
                                const file = event.target.files?.[0] ?? null;
                                const accepted = handleFileChange(file);
                                if (accepted) {
                                  field.onChange(event.target.files);
                                } else {
                                  field.onChange(undefined);
                                  event.target.value = "";
                                }
                              }}
                              ref={field.ref}
                            />
                            <FieldDescription>
                              Upload a square image under 4MB to personalise
                              your workspace.
                            </FieldDescription>
                            {imagePreview && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="w-fit px-2"
                                onClick={() => {
                                  resetImage();
                                  field.onChange(undefined);
                                }}
                              >
                                <X className="mr-2 h-4 w-4" aria-hidden />
                                Remove image
                              </Button>
                            )}
                          </div>
                        </div>
                      </FieldContent>
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating your account…
                </span>
              ) : (
                "Create an account"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t pt-6 text-center text-sm text-muted-foreground">
        <div className="space-y-1">
          <p>Already have an account?</p>
          <Link
            href="/sign-in"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in instead
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          Secured by{" "}
          <span className="font-medium text-primary">better-auth</span>. Your
          details stay encrypted end-to-end.
        </p>
      </CardFooter>
    </Card>
  );
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
