"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

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
import { cn } from "@/lib/utils";

// Use schema input so the form deals with raw values before Zod transforms.
type FormValues = z.input<typeof createFeatureSchema>;
type FormOutput = z.output<typeof createFeatureSchema>;

export function CreateFeatureForm() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues, undefined, FormOutput>({
    resolver: zodResolver(createFeatureSchema),
    defaultValues: {
      title: "",
      description: "",
    },
    mode: "onChange",
  });

  const { execute, isExecuting } = useAction(createFeatureAction, {
    onSuccess({ data }) {
      if (data?.feature) {
        toast.success("Feature created", {
          description: "The new feature is now visible in your backlog.",
        });
        form.reset();
        setOpen(false);
      }
    },
    onError: ({ error }) => {
      const serverMessage =
        typeof error.serverError === "string" ? error.serverError : undefined;
      const thrownMessage = error.thrownError?.message;
      toast.error(serverMessage ?? thrownMessage ?? "Failed to create feature.");
    },
    onSettled: ({ result }) => {
      const fieldErrors = result.validationErrors?.fieldErrors;
      if (!fieldErrors) {
        return;
      }

      Object.entries(fieldErrors).forEach(([field, messages]) => {
        if (!messages || messages.length === 0) {
          return;
        }
        form.setError(field as keyof FormValues, {
          message: messages[0],
        });
      });
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

  useEffect(() => {
    if (!open && Object.keys(form.formState.errors).length > 0) {
      setOpen(true);
    }
  }, [form.formState.errors, open]);

  useEffect(() => {
    if (isExecuting) {
      setOpen(true);
    }
  }, [isExecuting]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-[color:var(--outline-soft)] bg-[color:var(--surface-floating)] px-5 py-4 shadow-[0_6px_0_var(--shadow-color)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Backlog intake</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
            Create a feature
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Capture the opportunity you&apos;re validating before it lands on the roadmap.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "group mt-2 flex w-full items-center justify-center gap-2 sm:mt-0 sm:w-auto",
            open && "border-primary/60 bg-primary/10 text-primary",
          )}
          onClick={() => setOpen((previous) => !previous)}
          aria-expanded={open}
          disabled={isExecuting}
        >
          <span>{open ? "Hide form" : "Add feature"}</span>
          <motion.span
            initial={false}
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex items-center"
          >
            <ChevronDown className="h-4 w-4 transition-colors group-hover:text-primary" aria-hidden />
          </motion.span>
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="create-feature-form"
            layout
            initial={{ opacity: 0, y: -10, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(12px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="rounded-xl border border-border/60 bg-card/70 p-6 shadow-[0_12px_24px_rgba(15,23,42,0.12)] backdrop-blur-xl"
          >
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-6">
                <FieldSet className="gap-6">
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
                <div className="flex items-center justify-end gap-3">
                  <Button type="submit" disabled={isExecuting}>
                    {isExecuting ? "Creating…" : "Add feature"}
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
