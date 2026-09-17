"use client";

import * as React from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  NAlert,
  NAvatar,
  NButton,
  NCard,
  NCardContent,
  NCardDescription,
  NCardHeader,
  NCardTitle,
  NCheckbox,
  NField,
  NFieldHint,
  NFieldLabel,
  NIcon,
  NInput,
  NPage,
  NPageBack,
  NPageDescription,
  NPageHeader,
  NPageHeading,
  NPageTitle,
  NSelect,
  NSkeleton,
  NTextarea,
} from "@/components/n";
import { CLASS_LEVELS } from "@/lib/academics";
import { imageToDataUrl } from "@/lib/files";
import { toastError } from "@/lib/http/errors";
import {
  ADMIN_CHILDREN_ROUTES,
  childFormSchema,
  childToForm,
  EMPTY_CHILD_FORM,
  GUARDIAN_RELATIONSHIPS,
  type ChildFormValues,
} from "../domain/admin-children";
import { useAdminChildForm } from "../composition/use-admin-children";

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <NCard className="md:grid md:grid-cols-[240px_1fr] md:gap-0">
      <NCardHeader className="md:pr-0">
        <NCardTitle>{title}</NCardTitle>
        <NCardDescription>{description}</NCardDescription>
      </NCardHeader>
      <NCardContent className="grid gap-5 sm:grid-cols-2">{children}</NCardContent>
    </NCard>
  );
}

export function AdChildForm({ id }: { id?: string }) {
  const app = useAdminChildForm(id ?? null);
  const form = useForm<ChildFormValues>({
    resolver: zodResolver(childFormSchema),
    defaultValues: EMPTY_CHILD_FORM,
    values: app.child ? childToForm(app.child) : undefined,
  });
  const { errors } = form.formState;
  const photo = form.watch("photoUrl");
  const firstName = form.watch("firstName");
  const lastName = form.watch("lastName");
  const fileRef = React.useRef<HTMLInputElement>(null);

  const onPhoto = async (file: File | undefined) => {
    if (!file) return;
    try {
      form.setValue("photoUrl", await imageToDataUrl(file), { shouldDirty: true });
    } catch (e) {
      toastError(e);
    }
  };

  if (app.isLoadingChild) {
    return (
      <NPage>
        <NSkeleton className="h-10 w-64" />
        <NSkeleton className="h-96 rounded-2xl" />
      </NPage>
    );
  }

  const cancelHref = id ? ADMIN_CHILDREN_ROUTES.detail(id) : ADMIN_CHILDREN_ROUTES.list;

  return (
    <NPage className="max-w-5xl">
      <NPageBack href={cancelHref}>{id ? "Back to profile" : "Children"}</NPageBack>
      <NPageHeader>
        <NPageHeading>
          <NPageTitle>{id ? `Edit ${app.child?.fullName ?? "child"}` : "Register a child"}</NPageTitle>
          <NPageDescription>Only students in secondary school (JSS 1 – SSS 3) can join the programme.</NPageDescription>
        </NPageHeading>
      </NPageHeader>

      {!app.schoolsLoading && app.schools.length === 0 && (
        <NAlert tone="pending">
          Add a secondary school before registering a child.{" "}
          <Link href={ADMIN_CHILDREN_ROUTES.schools} className="font-semibold underline">
            Add a school
          </Link>
        </NAlert>
      )}

      <form onSubmit={form.handleSubmit(app.submit)} className="flex flex-col gap-6" noValidate>
        {app.error && <NAlert tone="danger">{app.error}</NAlert>}

        <Section title="The child" description="Shown to the child's sponsors. Use a recent, respectful photo with the guardian's consent.">
          <div className="flex items-center gap-4 sm:col-span-2">
            <NAvatar name={`${firstName} ${lastName}`.trim() || "New child"} src={photo} className="size-20 text-xl" />
            <div className="flex flex-wrap gap-2">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPhoto(e.target.files?.[0])} />
              <NButton type="button" size="sm" color="secondary" variant="outline" onClick={() => fileRef.current?.click()}>
                <NIcon name="upload" /> {photo ? "Change photo" : "Upload photo"}
              </NButton>
              {photo && (
                <NButton type="button" size="sm" color="destructive" variant="ghost" onClick={() => form.setValue("photoUrl", null, { shouldDirty: true })}>
                  Remove
                </NButton>
              )}
            </div>
          </div>
          <NField error={errors.firstName?.message}>
            <NFieldLabel>First name</NFieldLabel>
            <NInput {...form.register("firstName")} />
          </NField>
          <NField error={errors.lastName?.message}>
            <NFieldLabel>Last name</NFieldLabel>
            <NInput {...form.register("lastName")} />
          </NField>
          <NField>
            <NFieldLabel>Gender</NFieldLabel>
            <NSelect {...form.register("gender")}>
              <option value="female">Girl</option>
              <option value="male">Boy</option>
            </NSelect>
          </NField>
          <NField error={errors.dateOfBirth?.message}>
            <NFieldLabel>Date of birth</NFieldLabel>
            <NInput type="date" {...form.register("dateOfBirth")} />
          </NField>
          <NField>
            <NFieldLabel optional>Dream career</NFieldLabel>
            <NInput placeholder="e.g. Doctor" {...form.register("aspiration")} />
          </NField>
          <NField>
            <NFieldLabel>Programme status</NFieldLabel>
            <NSelect {...form.register("status")}>
              <option value="pending_review">Awaiting match</option>
              <option value="active">Active</option>
              <option value="graduated">Graduated</option>
              <option value="withdrawn">Withdrawn</option>
            </NSelect>
          </NField>
          <NField error={errors.story?.message} className="sm:col-span-2">
            <NFieldLabel>Their story</NFieldLabel>
            <NTextarea rows={4} placeholder="What brought them to the programme, what they love, what they hope for…" {...form.register("story")} />
            <NFieldHint>Avoid details that could identify where the family lives.</NFieldHint>
          </NField>
        </Section>

        <Section title="School" description="The secondary school the child attends now.">
          <NField error={errors.schoolId?.message} className="sm:col-span-2">
            <NFieldLabel>School</NFieldLabel>
            <NSelect {...form.register("schoolId")} disabled={app.schoolsLoading}>
              <option value="">{app.schoolsLoading ? "Loading schools…" : "Choose a school"}</option>
              {app.schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.state}
                </option>
              ))}
            </NSelect>
          </NField>
          <NField error={errors.classLevel?.message}>
            <NFieldLabel>Class</NFieldLabel>
            <NSelect {...form.register("classLevel")}>
              {CLASS_LEVELS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </NSelect>
          </NField>
        </Section>

        <Section title="Family contact" description="Sponsors can call or message this person. Confirm they've agreed to be contacted.">
          <NField error={errors.guardian?.fullName?.message}>
            <NFieldLabel>Guardian&apos;s full name</NFieldLabel>
            <NInput {...form.register("guardian.fullName")} />
          </NField>
          <NField error={errors.guardian?.relationship?.message}>
            <NFieldLabel>Relationship to child</NFieldLabel>
            <NSelect {...form.register("guardian.relationship")}>
              {GUARDIAN_RELATIONSHIPS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </NSelect>
          </NField>
          <NField error={errors.guardian?.phone?.message}>
            <NFieldLabel>Phone</NFieldLabel>
            <NInput type="tel" placeholder="+234…" {...form.register("guardian.phone")} />
          </NField>
          <NField error={errors.guardian?.whatsapp?.message}>
            <NFieldLabel optional>WhatsApp number</NFieldLabel>
            <NInput type="tel" placeholder="Same as phone if blank" {...form.register("guardian.whatsapp")} />
          </NField>
          <NField error={errors.guardian?.email?.message}>
            <NFieldLabel optional>Email</NFieldLabel>
            <NInput type="email" {...form.register("guardian.email")} />
          </NField>
          <NField>
            <NFieldLabel optional>Town / area</NFieldLabel>
            <NInput placeholder="e.g. Ikot Ekpene, Akwa Ibom" {...form.register("guardian.address")} />
          </NField>
        </Section>

        <Section title="Sponsors" description="Givers linked here see this child, their results and spending on their dashboard.">
          <Controller
            control={form.control}
            name="sponsorIds"
            render={({ field }) => (
              <div className="flex flex-col gap-2 sm:col-span-2">
                {app.givers.length === 0 && <p className="text-sm text-base-500">No givers have signed up yet.</p>}
                {app.givers.map((g) => (
                  <NCheckbox
                    key={g.id}
                    className="rounded-xl border border-base-150 p-3 hover:bg-base-50"
                    checked={field.value.includes(g.id)}
                    onChange={(e) => field.onChange(e.target.checked ? [...field.value, g.id] : field.value.filter((x) => x !== g.id))}
                    label={
                      <span>
                        <span className="font-medium text-base-900">{g.fullName}</span>
                        <span className="block text-xs text-base-500">
                          {g.email} · supports {g.childrenCount} child{g.childrenCount === 1 ? "" : "ren"}
                        </span>
                      </span>
                    }
                  />
                ))}
              </div>
            )}
          />
        </Section>

        <div className="sticky bottom-0 z-10 -mx-4 flex justify-end gap-2 border-t border-base-150 bg-base-50/95 px-4 py-4 backdrop-blur md:-mx-8 md:px-8">
          <NButton asChild color="secondary" variant="ghost">
            <Link href={cancelHref}>Cancel</Link>
          </NButton>
          <NButton type="submit" loading={app.isSaving}>
            {id ? "Save changes" : "Register child"}
          </NButton>
        </div>
      </form>
    </NPage>
  );
}
