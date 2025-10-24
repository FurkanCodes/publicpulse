"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { z } from "zod";

import { createFeatureAction } from "@/app/(dashboard)/dashboard/features/actions";
import { createFeatureSchema } from "@/app/(dashboard)/dashboard/features/schema";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FormValues = z.infer<typeof createFeatureSchema>;

export function CreateFeatureForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(createFeatureSchema),
    defaultValues: {
      title: "",
      description: "",
    },
    mode: "onChange",
  });

  const {
    execute,
    status: { isExecuting },
  } = useAction(createFeatureAction, {
    onSuccess({ data }) {
      if (data?.feature) {
        toast.success("Feature created", {
          description: "The new feature is now visible in your backlog.",
        });
        form.reset();
      }
    },
    onError({ serverError }) {
      toast.error(serverError ?? "Failed to create feature.");
    },
    onSettled({ validationErrors }) {
      if (validationErrors?.fieldErrors) {
        const entries = Object.entries(validationErrors.fieldErrors);
        entries.forEach(([field, messages]) => {
          if (!messages?.length) return;
          form.setError(field as keyof FormValues, {
            message: messages[0],
          });
        });
      }
    },
  });

  const onSubmit = useMemo(
    () =>
      form.handleSubmit(async (values) => {
        execute({
          title: values.title,
          description: values.description?.trim() ? values.description.trim() : undefined,
        });
      }),
    [execute, form],
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="rounded-lg border border-border/60 bg-card/60 p-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-foreground">Create a feature</h2>
          <p className="text-sm text-muted-foreground">
            Capture the problem, opportunity, or enhancement you want to validate with customers.
          </p>
        </div>
        <FieldSet className="mt-6 gap-6">
          <FieldGroup className="gap-6">
            <Field>
              <FieldLabel htmlFor="feature-title">Title</FieldLabel>
              <FieldContent>
                <Input
                  id="feature-title"
                  {...form.register("title")}
                  placeholder="Collaborative launch checklist"
                  autoComplete="off"
                  disabled={isExecuting}
                />
                <FieldError errors={[form.formState.errors.title]} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="feature-description">Description</FieldLabel>
              <FieldContent>
                <Textarea
                  id="feature-description"
                  {...form.register("description")}
                  placeholder="Outline the customer need, desired outcome, or acceptance criteria."
                  rows={4}
                  disabled={isExecuting}
                />
                <FieldError errors={[form.formState.errors.description]} />
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
        <div className="mt-6 flex items-center justify-end gap-3">
          <Button type="submit" disabled={isExecuting}>
            {isExecuting ? "Creating…" : "Add feature"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
