import Link from "next/link";
import { Sprout } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2 text-slate-900">
          <Sprout className="size-6 shrink-0 text-emerald-500" aria-hidden="true" />
          <span className="truncate text-base font-bold tracking-tight sm:text-lg">
            교외체험학습 서류
          </span>
        </Link>
        <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 sm:text-sm">
          무료생성(광고)
        </span>
      </div>
    </header>
  );
}
