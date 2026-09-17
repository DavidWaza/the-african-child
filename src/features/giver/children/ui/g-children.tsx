"use client";

import {
  NDataTableSearch,
  NDataTableTopBar,
  NEmpty,
  NEmptyDescription,
  NEmptyIcon,
  NEmptyTitle,
  NPage,
  NPageDescription,
  NPageHeader,
  NPageHeading,
  NPageTitle,
  NSegmented,
  NSkeleton,
} from "@/components/n";
import { CrChildCard } from "@/features/shared/child-record/ui/cr-child-record";
import { CHILDREN_SORTS, GIVER_CHILDREN_ROUTES } from "../domain/giver-children";
import { useGiverChildren } from "../composition/use-giver-children";

export function GChildren() {
  const { rows, total, search, setSearch, sort, setSort, isLoading } = useGiverChildren();

  return (
    <NPage>
      <NPageHeader>
        <NPageHeading>
          <NPageTitle>My children</NPageTitle>
          <NPageDescription>
            {total ? `Your giving is reaching ${total} child${total === 1 ? "" : "ren"} in secondary school.` : "The children your giving supports."}
          </NPageDescription>
        </NPageHeading>
      </NPageHeader>

      <NDataTableTopBar>
        <NDataTableSearch value={search} onChange={setSearch} placeholder="Search by name, school or state" />
        <NSegmented label="Sort children" value={sort} onChange={setSort} options={CHILDREN_SORTS} />
      </NDataTableTopBar>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <NSkeleton key={i} className="h-72 rounded-2xl" />
          ))}
        </div>
      ) : rows.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rows.map((c) => (
            <CrChildCard key={c.id} child={c} href={GIVER_CHILDREN_ROUTES.detail(c.id)} />
          ))}
        </div>
      ) : (
        <NEmpty>
          <NEmptyIcon name="children" />
          <NEmptyTitle>{search ? "No children match that search" : "No children matched yet"}</NEmptyTitle>
          <NEmptyDescription>
            {search ? "Try a different name or school." : "Our team will match you with a child soon, and you'll see them here."}
          </NEmptyDescription>
        </NEmpty>
      )}
    </NPage>
  );
}
