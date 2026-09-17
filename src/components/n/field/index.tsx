"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { NIcon } from "../media/icon";

const controlBase =
  "w-full min-w-0 rounded-xl border border-base-150 bg-base-0 px-3.5 text-sm text-base-900 transition-[border-color,box-shadow] outline-none placeholder:text-base-400 hover:border-base-400 focus-visible:border-accent-500 focus-visible:ring-4 focus-visible:ring-accent-100 disabled:cursor-not-allowed disabled:bg-base-50 disabled:opacity-60 aria-invalid:border-red-500 aria-invalid:focus-visible:ring-red-100";

const FieldContext = React.createContext<{ id: string; invalid: boolean }>({ id: "", invalid: false });

/** Wires label, control, hint and error together by id. Pass `error` to mark it invalid. */
export function NField({
  className,
  error,
  children,
  ...props
}: React.ComponentProps<"div"> & { error?: string | null }) {
  const id = React.useId();
  return (
    <FieldContext.Provider value={{ id, invalid: Boolean(error) }}>
      <div data-slot="field" className={cn("flex flex-col gap-1.5", className)} {...props}>
        {children}
        {error && (
          <p id={`${id}-error`} data-slot="field-error" className="flex items-center gap-1 text-xs font-medium text-red-600">
            <NIcon name="attention" className="size-3.5" />
            {error}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  );
}

export function NFieldLabel({
  className,
  optional,
  children,
  ...props
}: React.ComponentProps<"label"> & { optional?: boolean }) {
  const { id } = React.useContext(FieldContext);
  return (
    <label data-slot="field-label" htmlFor={id || undefined} className={cn("text-sm font-medium text-base-900", className)} {...props}>
      {children}
      {optional && <span className="ml-1 font-normal text-base-400">(optional)</span>}
    </label>
  );
}

export function NFieldHint({ className, ...props }: React.ComponentProps<"p">) {
  const { id } = React.useContext(FieldContext);
  return <p id={id ? `${id}-hint` : undefined} data-slot="field-hint" className={cn("text-xs text-base-500", className)} {...props} />;
}

function useControlProps(props: { id?: string; "aria-invalid"?: React.AriaAttributes["aria-invalid"] }) {
  const { id, invalid } = React.useContext(FieldContext);
  return {
    id: props.id ?? (id || undefined),
    "aria-invalid": props["aria-invalid"] ?? (invalid || undefined),
    "aria-describedby": id && invalid ? `${id}-error` : undefined,
  };
}

export function NInput({ className, ...props }: React.ComponentProps<"input">) {
  const control = useControlProps(props);
  return <input data-slot="input" className={cn(controlBase, "h-11", className)} {...props} {...control} />;
}

export function NTextarea({ className, ...props }: React.ComponentProps<"textarea">) {
  const control = useControlProps(props);
  return <textarea data-slot="textarea" className={cn(controlBase, "min-h-24 resize-y py-2.5", className)} {...props} {...control} />;
}

export function NSelect({ className, children, ...props }: React.ComponentProps<"select">) {
  const control = useControlProps(props);
  return (
    <div className={cn("relative", className)}>
      <select data-slot="select" className={cn(controlBase, "h-11 cursor-pointer appearance-none pr-10")} {...props} {...control}>
        {children}
      </select>
      <NIcon name="chevronDown" className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-base-500" />
    </div>
  );
}

/** Input with a leading adornment (currency sign, search icon). */
export function NInputGroup({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      className={cn("relative [&>[data-slot=input]]:pl-10 [&>[data-slot=input-addon]]:absolute [&>[data-slot=input-addon]]:top-1/2 [&>[data-slot=input-addon]]:left-3.5 [&>[data-slot=input-addon]]:-translate-y-1/2", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function NInputAddon({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="input-addon" className={cn("pointer-events-none text-sm text-base-500 [&_svg]:size-4", className)} {...props} />;
}

export function NCheckbox({ className, label, ...props }: React.ComponentProps<"input"> & { label: React.ReactNode }) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-2.5 text-sm text-base-600", className)}>
      <input type="checkbox" className="mt-0.5 size-4 cursor-pointer accent-[var(--accent-500)]" {...props} />
      <span>{label}</span>
    </label>
  );
}
