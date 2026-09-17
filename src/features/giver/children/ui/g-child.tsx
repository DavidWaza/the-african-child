"use client";

import Link from "next/link";
import {
  NButton,
  NEmpty,
  NEmptyDescription,
  NEmptyIcon,
  NEmptyTitle,
  NPage,
  NPageBack,
  NSkeleton,
} from "@/components/n";
import {
  CrChildHero,
  CrDisbursements,
  CrFamilyContact,
  CrResults,
  CrResultsTrend,
  CrSchoolCard,
  CrStory,
} from "@/features/shared/child-record/ui/cr-child-record";
import { useSession } from "@/stores/session-store";
import { GIVER_CHILDREN_ROUTES } from "../domain/giver-children";
import { useGiverChild } from "../composition/use-giver-children";

export function GChild({ id }: { id: string }) {
  const { detail, isLoading, notFound } = useGiverChild(id);
  const session = useSession();

  if (isLoading) {
    return (
      <NPage>
        <NSkeleton className="h-48 rounded-3xl" />
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <NSkeleton className="h-96 rounded-2xl" />
          <NSkeleton className="h-96 rounded-2xl" />
        </div>
      </NPage>
    );
  }

  if (notFound || !detail) {
    return (
      <NPage>
        <NEmpty>
          <NEmptyIcon name="children" />
          <NEmptyTitle>We couldn&apos;t find this child</NEmptyTitle>
          <NEmptyDescription>They may not be linked to your account. Only children your giving supports are shown.</NEmptyDescription>
          <NButton asChild className="mt-3" color="secondary" variant="outline">
            <Link href={GIVER_CHILDREN_ROUTES.list}>Back to my children</Link>
          </NButton>
        </NEmpty>
      </NPage>
    );
  }

  const { child } = detail;
  const coSponsors = detail.sponsors.filter((s) => s.id !== session?.user.id);
  const firstName = session?.user.fullName.split(" ")[0];

  return (
    <NPage>
      <NPageBack href={GIVER_CHILDREN_ROUTES.list}>My children</NPageBack>
      <CrChildHero child={child} />

      {coSponsors.length > 0 && (
        <p className="text-sm text-base-500">
          You support {child.firstName} together with {coSponsors.map((s) => s.fullName.split(" ")[0]).join(", ")}.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex min-w-0 flex-col gap-6">
          <CrResultsTrend results={detail.results} />
          <CrResults results={detail.results} />
          <CrDisbursements disbursements={detail.disbursements} total={detail.totalDisbursed} />
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <CrFamilyContact
            child={child}
            greeting={`Hello ${child.guardian.fullName}, ${firstName ? `this is ${firstName}, ` : "I'm "}${child.firstName}'s sponsor with The African Child. I hope you're all well.`}
          />
          <CrSchoolCard school={detail.school} />
          <CrStory child={child} />
        </div>
      </div>
    </NPage>
  );
}
