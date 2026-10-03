"use client";

import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {ArrowLeft, Download, FileText, Search, ShieldCheck, Sparkles, UserRound} from "lucide-react";
import {api, API_URL} from "@/lib/api";
import type {CommitteeSummary, PublicCommittee} from "@/lib/types";

export default function PublicPage() {
  const [committees, setCommittees] = useState<CommitteeSummary[]>([]);
  const [selected, setSelected] = useState<PublicCommittee | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void api.publicCommittees()
      .then(setCommittees)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load committees"))
      .finally(() => setLoading(false));
  }, []);

  const filteredCommittees = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return committees;
    return committees.filter((committee) =>
      [committee.name, committee.description, committee.chairman.name, committee.secretary.name]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedQuery)),
    );
  }, [committees, query]);

  async function openCommittee(id: string) {
    setDetailLoading(true);
    setError("");
    try {
      setSelected(await api.publicCommittee(id));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not load this committee");
    } finally {
      setDetailLoading(false);
    }
  }

  const downloadBaseUrl = API_URL.replace(/\/api$/, "");

  return (
    <main className="min-h-screen bg-[#f5f7f3] text-[#17322d]">
      <header className="border-b border-[#dfe8e1] bg-[#fbfcfa]">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-5 sm:px-10 lg:px-16">
          <Link className="flex items-center gap-2.5 text-lg font-bold tracking-[-0.04em]" href="/">
            <span className="grid size-9 place-items-center rounded-[11px] bg-[#27655a] text-white shadow-lg shadow-[#27655a]/15"><Sparkles size={18} /></span>
            Convene
          </Link>
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#71807c]"><ShieldCheck size={16} className="text-[#4c9670]" /> Public records</span>
        </div>
      </header>

      <section className="mx-auto max-w-[1240px] px-5 pb-10 pt-14 sm:px-10 lg:px-16 lg:pt-20">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#4d8065]">Open committee archive</p>
          <h1 className="mt-4 font-serif text-[clamp(42px,6vw,76px)] leading-[0.94] tracking-[-0.06em]">Meetings, made visible.</h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[#667871]">Browse committees, find their chairperson and secretary, and download the official meeting minutes. No account is required.</p>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-4 border-y border-[#dfe8e1] py-5 sm:flex-row sm:items-center">
          <div><p className="text-sm font-bold">Committee directory</p><p className="mt-1 text-xs text-[#82908a]">{committees.length} published {committees.length === 1 ? "committee" : "committees"}</p></div>
          <label className="flex w-full items-center gap-2 rounded-lg border border-[#d8e3da] bg-white px-3.5 py-2.5 text-sm text-[#71807c] sm:max-w-[340px]">
            <Search size={17} /><span className="sr-only">Search committees</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent outline-none placeholder:text-[#9aa7a1]" placeholder="Search by committee or officer" />
          </label>
        </div>

        {error && <div className="mt-6 rounded-lg border border-[#f0c9bd] bg-[#fff3ee] px-4 py-3 text-sm text-[#9b4f3c]">{error}</div>}
        {loading && <p className="py-16 text-center text-sm text-[#71807c]">Loading public records...</p>}
        {!loading && !filteredCommittees.length && <div className="py-16 text-center"><p className="font-bold">No committees found</p><p className="mt-2 text-sm text-[#71807c]">Try a different search term.</p></div>}

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCommittees.map((committee) => <button key={committee.id} onClick={() => void openCommittee(committee.id)} className="group rounded-xl border border-[#dfe8e1] bg-white p-5 text-left transition hover:-translate-y-1 hover:border-[#9fc7ad] hover:shadow-xl hover:shadow-[#27655a]/10">
            <div className="flex items-start justify-between"><span className="rounded-full bg-[#edf7ef] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#4d8065]">Committee</span><ArrowLeft className="rotate-135 text-[#9caaa4] transition group-hover:translate-x-1" size={17} /></div>
            <h2 className="mt-7 text-lg font-bold tracking-[-0.04em]">{committee.name}</h2>
            <p className="mt-2 min-h-10 text-xs leading-relaxed text-[#71807c]">{committee.description ?? "Official committee records and meeting minutes."}</p>
            <div className="mt-6 grid gap-2 border-t border-[#edf1ed] pt-4 text-xs text-[#60726c]"><Officer label="Chairperson" name={committee.chairman.name} /><Officer label="Secretary" name={committee.secretary.name} /></div>
          </button>)}
        </div>
      </section>

      {selected && <div className="fixed inset-0 z-40 overflow-y-auto bg-[#17322d]/35 p-4 backdrop-blur-sm sm:p-8" role="dialog" aria-modal="true" aria-labelledby="committee-title">
        <section className="mx-auto max-w-3xl rounded-2xl bg-[#fbfcfa] p-6 shadow-2xl sm:p-10">
          <button onClick={() => setSelected(null)} className="inline-flex items-center gap-2 text-xs font-bold text-[#4d8065] hover:text-[#17322d]"><ArrowLeft size={16} /> Back to directory</button>
          <div className="mt-8 border-b border-[#dfe8e1] pb-7"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#4d8065]">Public committee record</p><h2 id="committee-title" className="mt-3 font-serif text-4xl tracking-[-0.05em]">{selected.name}</h2><p className="mt-3 max-w-xl text-sm leading-relaxed text-[#71807c]">{selected.description ?? "Official committee records and meeting minutes."}</p><div className="mt-6 flex flex-wrap gap-6"><Officer label="Chairperson" name={selected.chairman.name} /><Officer label="Secretary" name={selected.secretary.name} /></div></div>
          <div className="pt-7"><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-bold">Meeting minutes</p><p className="mt-1 text-xs text-[#82908a]">PDF files available for download</p></div><span className="text-xs text-[#82908a]">{selected.meetingMinutes.length} files</span></div>
            {detailLoading && <p className="py-10 text-sm text-[#71807c]">Loading records...</p>}
            {!detailLoading && !selected.meetingMinutes.length && <p className="py-10 text-sm text-[#71807c]">No meeting minutes have been published yet.</p>}
            <div className="mt-4 grid gap-2">{selected.meetingMinutes.map((minute) => <a key={minute.id} href={`${downloadBaseUrl}${minute.pdfUrl}`} download className="flex items-center gap-3 rounded-lg border border-[#e2e9e3] bg-white p-4 transition hover:border-[#9fc7ad] hover:bg-[#f6fbf7]"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#e5f1e8] text-[#4d8065]"><FileText size={17} /></span><span className="min-w-0 flex-1"><strong className="block truncate text-sm">{minute.title}</strong><span className="mt-1 block text-xs text-[#82908a]">{formatDate(minute.meetingDate)}</span></span><Download size={17} className="shrink-0 text-[#4d8065]" /></a>)}</div>
          </div>
        </section>
      </div>}
    </main>
  );
}

function Officer({label, name}: {label: string; name: string}) { return <span className="inline-flex items-center gap-2 text-xs text-[#60726c]"><span className="grid size-7 place-items-center rounded-full bg-[#e5f1e8] text-[#4d8065]"><UserRound size={14} /></span><span><small className="block text-[10px] uppercase tracking-[0.1em] text-[#94a19b]">{label}</small><strong className="block text-xs text-[#31564d]">{name}</strong></span></span>; }

function formatDate(value: string) { return new Intl.DateTimeFormat("en", {month: "long", day: "numeric", year: "numeric"}).format(new Date(value)); }
