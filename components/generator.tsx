"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import {
  Apple,
  Bone,
  Bot,
  Briefcase,
  Bus,
  CalendarDays,
  Check,
  Clapperboard,
  CookingPot,
  Copy,
  Droplets,
  Dumbbell,
  Eye,
  FerrisWheel,
  Film,
  Flag,
  FlaskConical,
  Flower2,
  Gift,
  Globe,
  HandHeart,
  Heart,
  House,
  Landmark,
  Languages,
  Leaf,
  Map,
  MessageCircle,
  MoonStar,
  Palette,
  PawPrint,
  Plane,
  Rocket,
  RotateCcw,
  ScrollText,
  Sparkles,
  Sprout,
  Sun,
  Sunrise,
  Tent,
  Ticket,
  TreePine,
  Trees,
  Users,
  Utensils,
  Wheat,
  type LucideIcon,
} from "lucide-react";

import { categories, categoryById, type DocKind, type GradeBand } from "@/lib/catalog";
import { buildSentences, copyText, type SentenceOutput } from "@/lib/sentences";

const ICONS: Record<string, LucideIcon> = {
  landmark: Landmark,
  trees: Trees,
  pine: TreePine,
  sun: Sun,
  ticket: Ticket,
  plane: Plane,
  house: House,
  eye: Eye,
  flower: Flower2,
  leaf: Leaf,
  tent: Tent,
  flag: Flag,
  heart: Heart,
  clapper: Clapperboard,
  dumbbell: Dumbbell,
  globe: Globe,
  languages: Languages,
  message: MessageCircle,
  flask: FlaskConical,
  palette: Palette,
  bone: Bone,
  rocket: Rocket,
  briefcase: Briefcase,
  scroll: ScrollText,
  bot: Bot,
  apple: Apple,
  droplets: Droplets,
  wheat: Wheat,
  paw: PawPrint,
  moon: MoonStar,
  utensils: Utensils,
  bus: Bus,
  map: Map,
  users: Users,
  sprout: Sprout,
  hand: HandHeart,
  pot: CookingPot,
  gift: Gift,
  calendar: CalendarDays,
  sunrise: Sunrise,
  ferris: FerrisWheel,
  film: Film,
  sparkles: Sparkles,
};

const DOC_OPTIONS: { id: DocKind; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: "set", label: "신청서+보고서 세트", icon: Sparkles },
  { id: "application", label: "신청서만 (사유)", icon: FilePenIcon },
  { id: "report", label: "보고서만 (느낀점)", icon: ClipboardIcon },
];

const GRADE_OPTIONS: { id: GradeBand; label: string }[] = [
  { id: "lower", label: "저학년 (1~2학년)" },
  { id: "upper", label: "고학년 (3~6학년)" },
];

function FilePenIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className} aria-hidden="true">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 3v5h5M9 15h3M9 11h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClipboardIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={props.className} aria-hidden="true">
      <rect x="7" y="4" width="10" height="16" rx="2" />
      <path d="M9 4.5h6V3.8A1.8 1.8 0 0 0 13.2 2h-2.4A1.8 1.8 0 0 0 9 3.8z" strokeLinecap="round" />
      <path d="M9 10h6M9 14h6" strokeLinecap="round" />
    </svg>
  );
}

const initialPurpose = categories[0].purposes[0].id;

export function Generator() {
  const [doc, setDoc] = useState<DocKind>("set");
  const [grade, setGrade] = useState<GradeBand>("lower");
  const [categoryId, setCategoryId] = useState(categories[0].id);
  const [purposeIds, setPurposeIds] = useState<string[]>([initialPurpose]);
  const [place, setPlace] = useState("");
  const [companion, setCompanion] = useState("");
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const [output, setOutput] = useState<SentenceOutput | null>(null);
  const [copied, setCopied] = useState(false);
  const [purposeError, setPurposeError] = useState(false);
  const resultRef = useRef<HTMLElement>(null);
  const timerRef = useRef<number | null>(null);

  const category = categoryById(categoryId);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  function selectCategory(nextId: string) {
    const next = categoryById(nextId);
    setCategoryId(nextId);
    setPurposeIds([next.purposes[0].id]);
    setPurposeError(false);
  }

  function togglePurpose(id: string) {
    setPurposeIds((current) => {
      const exists = current.includes(id);
      const next = exists ? current.filter((item) => item !== id) : [...current, id];
      if (next.length > 0) setPurposeError(false);
      return next;
    });
  }

  function generate() {
    if (purposeIds.length === 0) {
      setPurposeError(true);
      return;
    }
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setCopied(false);
    setPhase("loading");
    setOutput(null);
    const snapshot = { doc, grade, categoryId, purposeIds, place, companion };
    timerRef.current = window.setTimeout(() => {
      setOutput(buildSentences(snapshot));
      setPhase("done");
      window.setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 40);
    }, 1600);
  }

  function reset() {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setDoc("set");
    setGrade("lower");
    setCategoryId(categories[0].id);
    setPurposeIds([initialPurpose]);
    setPlace("");
    setCompanion("");
    setPhase("idle");
    setOutput(null);
    setCopied(false);
    setPurposeError(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function copyAll() {
    if (!output) return;
    const text = copyText(doc, output);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const showApplication = doc !== "report";
  const showReport = doc !== "application";

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-7">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          교외체험학습 제출 문장 메이커
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          원하는 조건과 장소를 입력하면 제출용 문장을 즉시 생성합니다.
        </p>

        <Field title="1. 작성할 문서 종류">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {DOC_OPTIONS.map((option) => (
              <Chip
                key={option.id}
                selected={doc === option.id}
                onClick={() => setDoc(option.id)}
                icon={option.icon}
                label={option.label}
              />
            ))}
          </div>
        </Field>

        <Field title="2. 아이 학년">
          <div className="grid grid-cols-2 gap-2">
            {GRADE_OPTIONS.map((option) => (
              <Chip
                key={option.id}
                selected={grade === option.id}
                onClick={() => setGrade(option.id)}
                label={option.label}
                wide
              />
            ))}
          </div>
        </Field>

        <Field title="3. 체험/여행 카테고리 선택">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {categories.map((item) => (
              <Chip
                key={item.id}
                selected={categoryId === item.id}
                onClick={() => selectCategory(item.id)}
                icon={ICONS[item.icon]}
                label={item.label}
                wide
              />
            ))}
          </div>
        </Field>

        <Field
          title="4. 세부 체험 목적 (복수 선택 가능)"
          aside="여러 개 선택 가능"
        >
          <div className="flex flex-col gap-2">
            {category.purposes.map((purpose) => (
              <Chip
                key={purpose.id}
                selected={purposeIds.includes(purpose.id)}
                onClick={() => togglePurpose(purpose.id)}
                icon={ICONS[purpose.icon]}
                label={purpose.label}
                wide
              />
            ))}
          </div>
          {purposeError ? (
            <p className="mt-2 text-sm text-rose-600" role="alert">
              세부 목적을 하나 이상 골라 주세요.
            </p>
          ) : null}
        </Field>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800">5. 방문 장소명 (수동 입력)</span>
            <input
              value={place}
              onChange={(event) => setPlace(event.target.value)}
              placeholder="예: 경주 불국사, 에버랜드, 외가댁"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-800">6. 동반자 (수동 입력)</span>
            <input
              value={companion}
              onChange={(event) => setCompanion(event.target.value)}
              placeholder="예: 부모님, 가족 일동, 할머니"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={generate}
          disabled={phase === "loading"}
          className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#4f46e5] text-base font-semibold text-white shadow-sm transition hover:bg-[#4338ca] disabled:cursor-wait disabled:opacity-80"
        >
          <Sparkles className="size-4" aria-hidden="true" />
          {phase === "loading" ? "문장을 만드는 중" : "맞춤 사유/보고서 문장 3초 생성하기"}
        </button>
      </section>

      {phase !== "idle" ? (
        <section
          ref={resultRef}
          className="scroll-mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-7"
          aria-live="polite"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Sparkles className="size-4 text-[#4f46e5]" aria-hidden="true" />
              자동 완성된 제출용 문장
            </h2>
            <span className={`text-sm font-semibold ${phase === "done" ? "text-emerald-600" : "text-slate-400"}`}>
              {phase === "done" ? "생성 완료" : "생성 중"}
            </span>
          </div>

          {phase === "loading" || !output ? (
            <div className="mt-4 space-y-3">
              <div className="h-24 animate-pulse rounded-2xl bg-indigo-50" />
              <div className="h-24 animate-pulse rounded-2xl bg-emerald-50" />
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              {showApplication ? (
                <article className="rounded-2xl border border-indigo-100 bg-[#f4f3ff] p-4">
                  <h3 className="text-sm font-bold text-indigo-700">[신청서 제출용 사유]</h3>
                  <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-800">{output.application}</p>
                </article>
              ) : null}
              {showReport ? (
                <article className="rounded-2xl border border-emerald-100 bg-[#ecfdf3] p-4">
                  <h3 className="text-sm font-bold text-emerald-700">[결과보고서 제출용 느낀점]</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-800">{output.report}</p>
                </article>
              ) : null}
              <div className="mt-1 grid gap-2 sm:grid-cols-[1fr_auto]">
                <button
                  type="button"
                  onClick={() => void copyAll()}
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-900 text-sm font-semibold text-white"
                >
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {copied ? "복사했습니다" : "전체 문장 복사하기"}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700"
                >
                  <RotateCcw className="size-4" />
                  새로 만들기
                </button>
              </div>
              <p className="rounded-2xl border border-amber-200 bg-[#fff8e1] px-4 py-3 text-sm leading-6 text-amber-900">
                <span aria-hidden="true">💡 </span>
                안내: 문장 복사 후 학교 서식 사유란 및 보고서란에 바로 붙여넣으시면 됩니다.
              </p>
              <CoupangAd />
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}

const coupangBanners = {
  narrow: {
    src: "https://ads-partners.coupang.com/widgets.html?id=1047934&template=carousel&trackingCode=AF7694438&subId=&width=250&height=140&tsource=",
    width: 250,
    height: 140,
  },
  wide: {
    src: "https://ads-partners.coupang.com/widgets.html?id=1047891&template=carousel&trackingCode=AF7694438&subId=&width=680&height=140&tsource=",
    width: 680,
    height: 140,
  },
} as const;

function CoupangAd() {
  const [wide, setWide] = useState<boolean | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const banner = wide === null ? null : wide ? coupangBanners.wide : coupangBanners.narrow;

  return (
    <div className="mt-2 w-full">
      <div className="flex h-[140px] justify-center">
        {banner ? (
          <iframe
            src={banner.src}
            width={banner.width}
            height={banner.height}
            frameBorder={0}
            scrolling="no"
            referrerPolicy="unsafe-url"
            title="쿠팡 파트너스"
            className="border-0"
          />
        ) : null}
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-400">
        이 영역은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
}

function Field({
  title,
  aside,
  children,
}: {
  title: string;
  aside?: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-6">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-bold text-slate-900 sm:text-base">{title}</h2>
        {aside ? <p className="shrink-0 text-xs text-slate-400">{aside}</p> : null}
      </div>
      {children}
    </div>
  );
}

function Chip({
  selected,
  onClick,
  label,
  icon: Icon,
  wide = false,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  icon?: LucideIcon | ComponentType<{ className?: string }>;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-medium transition ${
        wide ? "w-full" : ""
      } ${
        selected
          ? "border-[#4f46e5] bg-[#eef2ff] text-[#3730a3]"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
      }`}
    >
      {Icon ? <Icon className="size-4 shrink-0" /> : null}
      <span className="text-left leading-snug break-keep">{label}</span>
    </button>
  );
}
