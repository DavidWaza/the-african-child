import { useState } from "react";
import type { School } from "@/lib/dto";
import type { SchoolFormOutput } from "../domain/admin-schools";
import type { AdminSchoolsQueryPort } from "../ports/admin-schools.port";

export interface AdminSchoolsDeps {
  queryPort: AdminSchoolsQueryPort;
  notify: { success: (message: string) => void; error: (error: unknown) => void };
}

export function useAdminSchoolsApp({ deps }: { deps: AdminSchoolsDeps }) {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<School | "new" | null>(null);
  const query = deps.queryPort.useSchoolsQuery({ search: () => search });
  const save = deps.queryPort.useSaveSchoolMutation();
  const remove = deps.queryPort.useDeleteSchoolMutation();

  const schools = query.data ?? [];

  return {
    schools,
    totals: {
      schools: schools.length,
      children: schools.reduce((a, s) => a + s.childrenCount, 0),
      states: new Set(schools.map((s) => s.state)).size,
    },
    search,
    setSearch,
    isLoading: query.isLoading,
    isPlaceholder: query.isPlaceholderData,

    editing,
    openCreate: () => {
      save.reset();
      setEditing("new");
    },
    openEdit: (s: School) => {
      save.reset();
      setEditing(s);
    },
    close: () => setEditing(null),
    submit: (values: SchoolFormOutput) =>
      save.mutate(
        { id: editing && editing !== "new" ? editing.id : undefined, values },
        {
          onSuccess: (s) => {
            deps.notify.success(editing === "new" ? `${s.name} was added.` : `${s.name} was updated.`);
            setEditing(null);
          },
        },
      ),
    isSaving: save.isPending,
    saveError: save.error?.message ?? null,

    remove: (s: School) =>
      remove.mutate(s.id, {
        onSuccess: () => deps.notify.success(`${s.name} was removed.`),
        onError: deps.notify.error,
      }),
  };
}
