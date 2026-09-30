"use client";

import type {ReactNode} from "react";
import {useEffect, useRef, useState} from "react";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import {AuthScreen} from "@/components/auth-screen";
import {CommitteePanel} from "@/components/committee-panel";
import {CreateCommitteeDialog} from "@/components/create-committee-dialog";
import {api} from "@/lib/api";
import type {Committee, CommitteeSummary, User} from "@/lib/types";

type View = "overview" | "archive";

export default function Home() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [committees, setCommittees] = useState<CommitteeSummary[]>([]);
  const [selected, setSelected] = useState<Committee | null>(null);
  const [view, setView] = useState<View>("overview");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const overviewRef = useRef<HTMLElement>(null);
  const archiveRef = useRef<HTMLElement>(null);

  async function loadCommittees(activeToken: string) {
    try {
      setCommittees(await api.committees(activeToken));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not load committees");
    }
  }

  useEffect(() => {
    const savedToken = localStorage.getItem("committee_token");
    const savedUser = localStorage.getItem("committee_user");
    if (!savedToken || !savedUser) return;

    const timer = window.setTimeout(() => {
      setToken(savedToken);
      setUser(JSON.parse(savedUser) as User);
      void loadCommittees(savedToken);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function openCommittee(item: CommitteeSummary) {
    setLoading(true);
    setNotice("");

    try {
      setSelected(await api.committee(item.id, token));
      setView("archive");
      setMobileNav(false);
      window.setTimeout(() => archiveRef.current?.scrollIntoView({behavior: "smooth"}), 0);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "You do not have access to this committee");
    } finally {
      setLoading(false);
    }
  }

  function navigate(nextView: View) {
    setView(nextView);
    setMobileNav(false);
    const target = nextView === "overview" ? overviewRef : archiveRef;
    window.setTimeout(() => target.current?.scrollIntoView({behavior: "smooth"}), 0);
  }

  function logout() {
    localStorage.removeItem("committee_token");
    localStorage.removeItem("committee_user");
    setToken("");
    setUser(null);
    setSelected(null);
    setCommittees([]);
  }

  if (!user) {
    return (
      <AuthScreen
        onAuthenticated={(nextToken, nextUser) => {
          setToken(nextToken);
          setUser(nextUser);
          void loadCommittees(nextToken);
        }}
      />
    );
  }

  const canManage = Boolean(
    user.role === "SUPER_ADMIN" ||
      selected?.chairman.id === user.id ||
      selected?.secretary.id === user.id,
  );

  return (
    <main className="min-h-screen bg-[#fbfcfa] text-[#17322d]">
      <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#e4ebe7] bg-white/85 px-5 backdrop-blur-xl sm:px-10 lg:px-16">
        <div className="flex items-center gap-2.5 text-lg font-bold tracking-[-0.04em]">
          <BrandMark />
          Convene
        </div>
        <button
          className="grid size-9 place-items-center rounded-lg border border-[#e4ebe7] text-[#27655a] md:hidden"
          onClick={() => setMobileNav((open) => !open)}
          aria-label="Toggle navigation"
        >
          <Menu size={19} />
        </button>
        <div className="flex items-center gap-3 text-sm text-[#60726c]">
          <span className="hidden items-center gap-2 sm:flex">
            <span className="grid size-8 place-items-center rounded-full bg-[#dcefe5] text-xs font-bold text-[#27655a]">
              {user.email[0].toUpperCase()}
            </span>
            {user.name ?? user.email}
          </span>
          <button
            className="grid size-9 place-items-center rounded-lg border border-[#e4ebe7] bg-white text-[#70807b] transition hover:border-[#bbd9ca] hover:text-[#27655a]"
            onClick={logout}
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-[1540px] md:grid-cols-[235px_minmax(0,1fr)]">
        <aside className={`fixed inset-y-[72px] left-0 z-20 w-[250px] border-r border-[#e4ebe7] bg-[#f8faf7] p-5 shadow-xl transition-transform md:static md:block md:w-auto md:translate-x-0 md:shadow-none ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}>
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#98a59f]">Workspace</p>
          <NavButton active={view === "overview"} onClick={() => navigate("overview")}><LayoutDashboard size={17} /> Overview</NavButton>
          <NavButton active={view === "archive"} onClick={() => navigate("archive")}><BookOpen size={17} /> Meeting archive</NavButton>
          <p className="mb-3 mt-9 flex justify-between px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#98a59f]">Your committees <span className="text-[#27655a]">{committees.length}</span></p>
          <div className="grid gap-1">
            {committees.map((item) => (
              <button
                key={item.id}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs transition ${selected?.id === item.id ? "bg-[#eaf4ee] font-semibold text-[#27655a]" : "text-[#71807c] hover:bg-[#eaf4ee] hover:text-[#27655a]"}`}
                onClick={() => void openCommittee(item)}
              >
                <span className="size-1.5 rounded-full bg-[#9bc9b0]" />
                <span className="truncate">{item.name}</span>
                <ChevronRight className="ml-auto shrink-0" size={15} />
              </button>
            ))}
          </div>
          <div className="mt-11 flex gap-2.5 rounded-xl border border-[#dce9df] bg-[#eff8f0] p-3.5 text-[11px] text-[#27655a]">
            <ShieldCheck className="shrink-0" size={18} />
            <div className="grid gap-1"><strong>Private by design</strong><span className="leading-snug text-[#759087]">Minutes are visible only to committee members.</span></div>
          </div>
        </aside>

        <section ref={overviewRef} className="w-full max-w-[1180px] px-5 py-8 sm:px-10 lg:px-[5.5vw] lg:py-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8d9b95]">Tuesday, September 29, 2026</p>
              <h1 className="text-[clamp(29px,3.2vw,43px)] font-bold leading-tight tracking-[-0.06em]">Hi there, {user.name?.split(" ")[0] ?? "there"}.</h1>
              <p className="mt-2 text-sm text-[#71807c]">Your committee workspace, all in one clear view.</p>
            </div>
            {user.role === "SUPER_ADMIN" && <button className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-[#27655a] px-4 py-3 text-xs font-bold text-white shadow-lg shadow-[#27655a]/15 transition hover:-translate-y-0.5 hover:bg-[#1b544a]" onClick={() => setShowCreate(true)}><Plus size={17} /> New committee</button>}
          </div>

          {notice && <div className="mt-5 flex items-center gap-2 rounded-lg border border-[#f0c9bd] bg-[#fff3ee] px-3 py-2.5 text-xs text-[#9b4f3c]"><X size={16} />{notice}<button className="ml-auto" onClick={() => setNotice("")}><X size={14} /></button></div>}

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat icon={<Users size={18} />} value={committees.length} label="Active committees" color="bg-[#dfeaf3] text-[#4f748f]" />
            <Stat icon={<FileText size={18} />} value={committees.reduce((sum, item) => sum + item._count.meetingMinutes, 0)} label="Minutes filed" color="bg-[#dcefe5] text-[#478268]" />
            <Stat icon={<CalendarDays size={18} />} value="This week" label="Next review" color="bg-[#f8e7d8] text-[#9b6a4b]" />
          </div>

          <div className="mt-7 grid gap-3 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="relative overflow-hidden rounded-xl bg-[#17322d] p-5 text-white shadow-lg shadow-[#17322d]/10 sm:p-6">
              <div className="relative z-10 max-w-lg">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b7d5c6]">Workspace pulse</span>
                <h2 className="mt-3 text-2xl font-bold tracking-[-0.05em]">Keep the record moving.</h2>
                <p className="mt-2 max-w-md text-xs leading-relaxed text-[#c2dcd0]">{committees.length ? `${committees[0].name} is your latest active committee. Open it to review people and meeting records.` : "Your workspace is ready for its first committee."}</p>
              </div>
              <Sparkles className="absolute -right-2 -bottom-5 size-32 text-[#315b50] opacity-70" strokeWidth={1} />
            </div>
            <div className="flex flex-col justify-between rounded-xl border border-[#dce7e0] bg-[#f4faf5] p-5 sm:p-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8d9b95]">Current access</span>
                <strong className="mt-3 block text-lg tracking-[-0.04em]">{user.role === "SUPER_ADMIN" ? "Super admin" : "Committee manager"}</strong>
                <p className="mt-1 text-xs leading-relaxed text-[#71807c]">{user.role === "SUPER_ADMIN" ? "Full workspace access across every committee." : "Manage the committees assigned to you."}</p>
              </div>
              <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 text-[10px] font-bold text-[#27655a]"><Check size={13} /> Access verified</span>
            </div>
          </div>

          <div className="mt-8 flex items-end justify-between gap-4">
            <div><h2 className="text-lg font-bold tracking-[-0.04em]">Committee overview</h2><p className="mt-1 text-sm text-[#71807c]">Choose a committee to see its working space.</p></div>
            <button className="inline-flex items-center gap-1 text-xs font-bold text-[#27655a]" onClick={() => navigate("overview")}>View all <ArrowUpRight size={15} /></button>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {committees.map((item) => <CommitteeCard key={item.id} committee={item} onOpen={() => void openCommittee(item)} />)}
          </div>

          <section ref={archiveRef} className="scroll-mt-24">
            {selected && <CommitteePanel committee={selected} canManage={canManage} token={token} user={user} onRefresh={() => { void openCommittee(selected); void loadCommittees(token); }} onError={setNotice} />}
            {!selected && <div className="mt-12 rounded-2xl border border-dashed border-[#d9e5dd] bg-white p-10 text-center text-sm text-[#71807c]">Select a committee to open its private archive.</div>}
          </section>
          {loading && <p className="pt-5 text-xs text-[#71807c]">Loading committee workspace...</p>}
        </section>
      </div>

      {showCreate && <CreateCommitteeDialog token={token} onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); setNotice("Committee created successfully."); void loadCommittees(token); }} onError={setNotice} />}
    </main>
  );
}

function BrandMark() { return <span className="grid size-8 place-items-center rounded-[10px] bg-[#27655a] text-white shadow-lg shadow-[#27655a]/15"><Sparkles size={17} /></span>; }

function NavButton({children, active, onClick}: {children: ReactNode; active: boolean; onClick: () => void}) { return <button className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] transition ${active ? "bg-[#eaf4ee] font-semibold text-[#27655a]" : "text-[#71807c] hover:bg-[#eaf4ee] hover:text-[#27655a]"}`} onClick={onClick}>{children}</button>; }

function Stat({icon, value, label, color}: {icon: ReactNode; value: string | number; label: string; color: string}) { return <div className="flex min-h-[82px] items-center gap-3.5 rounded-xl border border-[#e4ebe7] bg-white p-4"><span className={`grid size-10 place-items-center rounded-[10px] ${color}`}>{icon}</span><span><strong className="block text-[22px] tracking-[-0.04em]">{value}</strong><small className="block text-[11px] text-[#71807c]">{label}</small></span></div>; }

function CommitteeCard({committee, onOpen}: {committee: CommitteeSummary; onOpen: () => void}) { return <button className="min-h-[180px] rounded-xl border border-[#e4ebe7] bg-white p-[18px] text-left transition hover:-translate-y-1 hover:border-[#b9d5c5] hover:shadow-xl hover:shadow-[#3d6854]/10" onClick={onOpen}><div className="flex items-start justify-between"><span className="inline-flex items-center gap-1 rounded-full bg-[#edf7ef] px-2 py-1 text-[10px] font-bold text-[#4d8065]"><span className="size-1.5 rounded-full bg-[#65ae82]" /> Active</span><ArrowUpRight className="text-[#9caaa4]" size={17} /></div><h3 className="mt-5 text-base font-bold tracking-[-0.03em]">{committee.name}</h3><p className="mt-2 min-h-8 text-[11px] leading-relaxed text-[#71807c]">{committee.description ?? "No description added yet."}</p><div className="mt-5 flex justify-between text-[10px] text-[#93a09a]"><span className="inline-flex items-center gap-1"><Users size={14} />{committee._count.members} members</span><span className="inline-flex items-center gap-1"><FileText size={14} />{committee._count.meetingMinutes} minutes</span></div></button>; }

