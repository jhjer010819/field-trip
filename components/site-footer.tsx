import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <nav className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-8 text-sm text-slate-500">
        <Link href="/about" className="hover:text-slate-800">
          About
        </Link>
        <Link href="/privacy" className="hover:text-slate-800">
          개인정보처리방침
        </Link>
        <Link href="/terms" className="hover:text-slate-800">
          이용약관
        </Link>
      </nav>
    </footer>
  );
}
