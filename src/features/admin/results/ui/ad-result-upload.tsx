"use client";

import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  NAlert,
  NButton,
  NDialog,
  NDialogContent,
  NDialogDescription,
  NDialogFooter,
  NDialogHeader,
  NDialogTitle,
  NField,
  NFieldHint,
  NFieldLabel,
  NIcon,
  NInput,
  NSelect,
  NTextarea,
} from "@/components/n";
import { academicSessions, averageOf, CA_MAX, CLASS_LEVELS, defaultSubjectsFor, EXAM_MAX, gradeFor, TERMS } from "@/lib/academics";
import type { ApiAttachment } from "@/lib/api-types";
import { fileToAttachment } from "@/lib/files";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  emptyResultForm,
  parsePastedScores,
  resultFormSchema,
  type ChildOption,
  type ResultFormOutput,
  type ResultFormValues,
} from "../domain/admin-results";

export function AdResultUpload({
  open,
  onClose,
  childOptions,
  initialChildId,
  onSubmit,
  loading,
  error,
}: {
  open: boolean;
  onClose: () => void;
  childOptions: ChildOption[];
  initialChildId: string;
  onSubmit: (values: ResultFormOutput, attachment: ApiAttachment | null) => void;
  loading: boolean;
  error: string | null;
}) {
  const form = useForm<ResultFormValues, unknown, ResultFormOutput>({
    resolver: zodResolver(resultFormSchema),
    defaultValues: emptyResultForm(),
  });
  const subjects = useFieldArray({ control: form.control, name: "subjects" });
  const [attachment, setAttachment] = React.useState<ApiAttachment | null>(null);
  const [attachError, setAttachError] = React.useState<string | null>(null);
  const [pasteOpen, setPasteOpen] = React.useState(false);
  const [pasteText, setPasteText] = React.useState("");
  const fileRef = React.useRef<HTMLInputElement>(null);

  // Re-seed whenever the dialog opens, preselecting the child when one is given.
  const childrenReady = childOptions.length > 0;
  React.useEffect(() => {
    if (!open) return;
    const child = childOptions.find((c) => c.id === initialChildId);
    form.reset(emptyResultForm(child?.id ?? "", child?.classLevel));
    setAttachment(null);
    setAttachError(null);
    setPasteOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialChildId, childrenReady]);

  const onChildChange = (id: string) => {
    const child = childOptions.find((c) => c.id === id);
    form.setValue("childId", id, { shouldValidate: true });
    if (child && !form.formState.dirtyFields.subjects) {
      form.setValue("classLevel", child.classLevel);
      subjects.replace(defaultSubjectsFor(child.classLevel).map((subject) => ({ subject, ca: "" as unknown as number, exam: "" as unknown as number })));
    }
  };

  const onFile = async (file: File | undefined) => {
    setAttachError(null);
    if (!file) return;
    try {
      setAttachment(await fileToAttachment(file));
    } catch (e) {
      setAttachError(e instanceof Error ? e.message : "That file couldn't be attached.");
    }
  };

  const applyPaste = () => {
    const rows = parsePastedScores(pasteText);
    if (!rows.length) return;
    subjects.replace(rows);
    setPasteOpen(false);
    setPasteText("");
  };

  const watched = form.watch("subjects");
  const filled = (v: unknown) => v !== "" && v != null && !Number.isNaN(Number(v));
  const scored = (watched ?? [])
    .filter((s) => filled(s.ca) && filled(s.exam))
    .map((s) => ({ ca_score: Number(s.ca), exam_score: Number(s.exam) }));
  const liveAverage = averageOf(scored);
  const { errors } = form.formState;

  return (
    <NDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <NDialogContent side="right" className="max-w-2xl">
        <NDialogHeader>
          <NDialogTitle>Upload term results</NDialogTitle>
          <NDialogDescription>Scores go live on the child&apos;s sponsor dashboards as soon as you save. Re-uploading a term replaces it.</NDialogDescription>
        </NDialogHeader>

        <form id="result-form" onSubmit={form.handleSubmit((v) => onSubmit(v, attachment))} className="flex flex-col gap-5" noValidate>
          {error && <NAlert tone="danger">{error}</NAlert>}

          <div className="grid gap-4 sm:grid-cols-2">
            <NField error={errors.childId?.message} className="sm:col-span-2">
              <NFieldLabel>Child</NFieldLabel>
              <NSelect value={form.watch("childId")} onChange={(e) => onChildChange(e.target.value)}>
                <option value="">Choose a child</option>
                {childOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName} — {c.schoolName}
                  </option>
                ))}
              </NSelect>
            </NField>
            <NField error={errors.session?.message}>
              <NFieldLabel>Session</NFieldLabel>
              <NSelect {...form.register("session")}>
                {academicSessions().map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </NSelect>
            </NField>
            <NField>
              <NFieldLabel>Term</NFieldLabel>
              <NSelect {...form.register("term")}>
                {TERMS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </NSelect>
            </NField>
            <NField>
              <NFieldLabel>Class that term</NFieldLabel>
              <NSelect {...form.register("classLevel")}>
                {CLASS_LEVELS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </NSelect>
            </NField>
            <div className="grid grid-cols-2 gap-3">
              <NField>
                <NFieldLabel optional>Position</NFieldLabel>
                <NInput type="number" min={1} {...form.register("position")} />
              </NField>
              <NField>
                <NFieldLabel optional>Class size</NFieldLabel>
                <NInput type="number" min={1} {...form.register("classSize")} />
              </NField>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">Subject scores</p>
                <p className="text-xs text-base-500">
                  CA out of {CA_MAX}, exam out of {EXAM_MAX}
                  {liveAverage != null && (
                    <>
                      {" "}
                      · average <span className="font-semibold text-base-900 tabular-nums">{formatNumber(liveAverage, 1)}%</span>
                    </>
                  )}
                </p>
              </div>
              <NButton type="button" size="xs" color="secondary" variant="outline" onClick={() => setPasteOpen((o) => !o)}>
                <NIcon name="document" /> Paste from spreadsheet
              </NButton>
            </div>

            {pasteOpen && (
              <div className="flex flex-col gap-2 rounded-xl border border-dashed border-base-150 bg-base-50 p-3">
                <NTextarea
                  rows={5}
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder={"Subject, CA, Exam — one per line\nMathematics, 32, 48\nEnglish Language, 28, 45"}
                  className="font-mono text-xs"
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-base-500">{parsePastedScores(pasteText).length} rows recognised</span>
                  <NButton type="button" size="xs" onClick={applyPaste} disabled={!parsePastedScores(pasteText).length}>
                    Replace subjects
                  </NButton>
                </div>
              </div>
            )}

            <div className="overflow-hidden rounded-xl border border-base-150">
              <div className="grid grid-cols-[1fr_64px_64px_52px_32px] gap-2 bg-base-50 px-3 py-2 text-[11px] font-semibold tracking-wide text-base-500 uppercase">
                <span>Subject</span>
                <span className="text-right">CA</span>
                <span className="text-right">Exam</span>
                <span className="text-right">Grade</span>
                <span />
              </div>
              <ul className="divide-y divide-base-100">
                {subjects.fields.map((field, i) => {
                  const row = watched?.[i];
                  const total = Number(row?.ca) + Number(row?.exam);
                  const rowErr = errors.subjects?.[i];
                  const complete = Boolean(row && filled(row.ca) && filled(row.exam));
                  return (
                    <li key={field.id} className="grid grid-cols-[1fr_64px_64px_52px_32px] items-center gap-2 px-3 py-1.5">
                      <input
                        aria-label={`Subject ${i + 1}`}
                        className={cn("h-9 min-w-0 rounded-lg border border-transparent bg-transparent px-2 text-sm outline-none hover:border-base-150 focus:border-accent-500", rowErr?.subject && "border-red-500")}
                        {...form.register(`subjects.${i}.subject`)}
                      />
                      <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={CA_MAX}
                        aria-label={`CA score for subject ${i + 1}`}
                        aria-invalid={Boolean(rowErr?.ca)}
                        title={rowErr?.ca?.message}
                        className="h-9 rounded-lg border border-base-150 px-2 text-right text-sm tabular-nums outline-none focus:border-accent-500 aria-invalid:border-red-500 aria-invalid:bg-red-50"
                        {...form.register(`subjects.${i}.ca`)}
                      />
                      <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={EXAM_MAX}
                        aria-label={`Exam score for subject ${i + 1}`}
                        aria-invalid={Boolean(rowErr?.exam)}
                        title={rowErr?.exam?.message}
                        className="h-9 rounded-lg border border-base-150 px-2 text-right text-sm tabular-nums outline-none focus:border-accent-500 aria-invalid:border-red-500 aria-invalid:bg-red-50"
                        {...form.register(`subjects.${i}.exam`)}
                      />
                      <span className="text-right text-xs font-semibold tabular-nums">{complete ? gradeFor(total).grade : "—"}</span>
                      <NButton type="button" size="icon-xs" color="neutral" variant="ghost" aria-label="Remove subject" onClick={() => subjects.remove(i)}>
                        <NIcon name="close" />
                      </NButton>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-base-100 px-3 py-2">
                <NButton type="button" size="xs" variant="ghost" onClick={() => subjects.append({ subject: "", ca: "" as unknown as number, exam: "" as unknown as number })}>
                  <NIcon name="add" /> Add subject
                </NButton>
              </div>
            </div>
            {errors.subjects && (
              <p className="text-xs font-medium text-red-600">
                {errors.subjects.message ?? errors.subjects.root?.message ?? "Check the highlighted scores: CA is out of 40 and exam out of 60."}
              </p>
            )}
          </div>

          <NField>
            <NFieldLabel optional>Teacher&apos;s remark</NFieldLabel>
            <NTextarea rows={2} {...form.register("teacherRemark")} />
          </NField>

          <NField error={attachError}>
            <NFieldLabel optional>Report sheet</NFieldLabel>
            <input ref={fileRef} type="file" accept="application/pdf,image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            {attachment ? (
              <div className="flex items-center gap-3 rounded-xl border border-base-150 p-3">
                <NIcon name="attachment" className="text-accent-500" />
                <span className="min-w-0 flex-1 truncate text-sm">{attachment.file_name}</span>
                <NButton type="button" size="xs" color="destructive" variant="ghost" onClick={() => setAttachment(null)}>
                  Remove
                </NButton>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border border-dashed border-base-150 p-5 text-sm text-base-500 transition-colors hover:border-accent-150 hover:bg-accent-50"
              >
                <NIcon name="upload" className="size-6 text-accent-500" />
                <span className="font-medium text-base-900">Attach the scanned report card</span>
                <span className="text-xs">PDF, PNG, JPG or WEBP · up to 1.5 MB</span>
              </button>
            )}
            <NFieldHint>Sponsors can open this file from the child&apos;s page.</NFieldHint>
          </NField>
        </form>

        <NDialogFooter className="sticky bottom-0 -mx-6 -mb-6 mt-auto border-t border-base-150 bg-base-0 px-6 py-4">
          <NButton color="secondary" variant="ghost" onClick={onClose}>
            Cancel
          </NButton>
          <NButton type="submit" form="result-form" loading={loading}>
            <NIcon name="upload" /> Publish results
          </NButton>
        </NDialogFooter>
      </NDialogContent>
    </NDialog>
  );
}
