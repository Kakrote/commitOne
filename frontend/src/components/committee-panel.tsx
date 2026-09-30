"use client";

import type {FormEvent} from "react";
import {useEffect, useState} from "react";
import {ArrowUpRight, Check, FileText, Plus, ShieldCheck, Trash2, UploadCloud} from "lucide-react";
import {api} from "@/lib/api";
import type {Committee, Faculty, MeetingMinute, User} from "@/lib/types";

const dateLabel = (value: string) => new Intl.DateTimeFormat("en", {month: "short", day: "numeric", year: "numeric"}).format(new Date(value));

interface CommitteePanelProps {
  committee: Committee;
  canManage: boolean;
  token: string;
  user: User;
  onRefresh: () => void;
  onError: (message: string) => void;
}

export function CommitteePanel({committee, canManage, token, user, onRefresh, onError}: CommitteePanelProps) {
  const canManageMembers = user.role === "SUPER_ADMIN"
    || committee.chairman.id === user.id
    || committee.secretary.id === user.id;
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [facultyId, setFacultyId] = useState("");
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loadingFaculty, setLoadingFaculty] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!canManageMembers) return;

    api.faculty(token)
      .then(setFaculty)
      .catch((error: unknown) => onError(error instanceof Error ? error.message : "Could not load faculty members"))
      .finally(() => setLoadingFaculty(false));
  }, [canManageMembers, onError, token]);

  async function upload(event: FormEvent) {
    event.preventDefault();
    if (!file) return onError("Choose a PDF before uploading.");

    setBusy(true);
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("meetingDate", date);
      form.append("pdf", file);
      await api.uploadMinute(committee.id, form, token);
      setTitle("");
      setDate("");
      setFile(null);
      onRefresh();
    } catch (error) {
      onError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function addMember(event: FormEvent) {
    event.preventDefault();
    if (!facultyId) return;

    try {
      await api.addMember(committee.id, facultyId, token);
      setFacultyId("");
      onRefresh();
    } catch (error) {
      onError(error instanceof Error ? error.message : "Could not add member");
    }
  }

  async function removeMember(id: string) {
    try {
      await api.removeMember(committee.id, id, token);
      onRefresh();
    } catch (error) {
      onError(error instanceof Error ? error.message : "Could not remove member");
    }
  }

  async function download(minute: MeetingMinute) {
    try {
      const blob = await api.downloadMinute(minute.pdfUrl, token);
      const href = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = href;
      anchor.download = `${minute.title}.pdf`;
      anchor.click();
      URL.revokeObjectURL(href);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Could not download minute");
    }
  }

  return (
    <section className="mt-12 scroll-mt-24 rounded-2xl border border-[#dce7e0] bg-white p-5 shadow-xl shadow-[#3c6652]/5 sm:p-7">
      <div className="flex flex-col justify-between gap-4 border-b border-[#e4ebe7] pb-6 sm:flex-row sm:items-start">
        <div><span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8d9b95]">Committee workspace</span><h2 className="mt-1 text-2xl font-bold tracking-[-0.05em]">{committee.name}</h2><p className="mt-2 text-sm text-[#71807c]">{committee.description}</p></div>
        <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-[#edf7ef] px-2.5 py-2 text-[11px] font-bold text-[#27655a]">{user.role === "SUPER_ADMIN" ? <ShieldCheck size={15} /> : <Check size={15} />}{user.role === "SUPER_ADMIN" ? "Super admin" : canManage ? "Manager access" : "Member access"}</span>
      </div>
      <div className="grid gap-8 pt-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeading title="People" description="Members with access to this record." />
          <div className="grid gap-2">
            <Person label="Chairman" person={committee.chairman} />
            <Person label="Secretary" person={committee.secretary} />
            {committee.members.map((member) => <div className="flex items-center gap-3 rounded-lg bg-[#fafcf9] p-2.5" key={member.id}><Avatar name={member.faculty.name} /><div className="grid flex-1 gap-0.5"><strong className="text-xs">{member.faculty.name}</strong><span className="text-[10px] text-[#71807c]">{member.faculty.designation ?? "Committee member"}</span></div>{canManageMembers && <button className="grid size-8 place-items-center rounded-lg border border-[#e4ebe7] text-[#70807b] transition hover:border-[#efc9bd] hover:text-[#c7674d]" onClick={() => void removeMember(member.faculty.id)} title="Remove member"><Trash2 size={15} /></button>}</div>)}
          </div>
          {canManageMembers && <form className="mt-3 flex flex-col gap-2 sm:flex-row" onSubmit={addMember}><select className="min-w-0 flex-1 rounded-lg border border-[#e4ebe7] bg-white px-3 py-2.5 text-xs outline-none focus:border-[#8bc0a1] focus:ring-4 focus:ring-[#dcefe5]" value={facultyId} onChange={(event) => setFacultyId(event.target.value)} required disabled={loadingFaculty}><option value="">{loadingFaculty ? "Loading faculty details..." : "Select faculty by email"}</option>{faculty.map((member) => <option key={member.id} value={member.id}>{member.name} · {member.email}{member.department ? ` · ${member.department}` : ""}</option>)}</select><button className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#e8f2eb] px-3 py-2 text-xs font-bold text-[#27655a] disabled:opacity-60" type="submit" disabled={loadingFaculty}><Plus size={15} /> Add faculty</button></form>}
        </div>
        <div>
          <SectionHeading title="Meeting minutes" description="Uploaded decisions and records." />
          <div className="grid gap-2">{committee.meetingMinutes.length ? committee.meetingMinutes.map((minute) => <button className="flex w-full items-center gap-3 rounded-lg border border-[#e9efeb] bg-white p-2.5 text-left transition hover:border-[#b9d8c5] hover:bg-[#fbfefb]" key={minute.id} onClick={() => void download(minute)}><span className="grid size-8 place-items-center rounded-lg bg-[#fff0e9] text-[#ba7157]"><FileText size={17} /></span><span className="grid flex-1 gap-0.5"><strong className="text-xs">{minute.title}</strong><small className="text-[10px] text-[#71807c]">{dateLabel(minute.meetingDate)} · Filed {dateLabel(minute.uploadedAt)}</small></span><ArrowUpRight className="text-[#93a19a]" size={16} /></button>) : <p className="rounded-lg border border-dashed border-[#d9e5dd] p-6 text-center text-xs text-[#71807c]">No minutes filed yet.</p>}</div>
          {canManage && <form className="mt-4 flex flex-col gap-3 rounded-xl border border-[#dce9df] bg-[#f4faf5] p-3.5 sm:flex-row sm:items-end" onSubmit={upload}><div className="grid flex-1 gap-2"><strong className="text-xs">File a new minute</strong><div className="grid gap-2 sm:grid-cols-2"><input className="rounded-lg border border-[#e4ebe7] bg-white px-3 py-2.5 text-xs outline-none focus:border-[#8bc0a1]" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Meeting title" required /><input className="rounded-lg border border-[#e4ebe7] bg-white px-3 py-2.5 text-xs outline-none focus:border-[#8bc0a1]" type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></div><label className="inline-flex w-fit cursor-pointer items-center gap-1.5 text-[10px] font-bold text-[#27655a]">{file ? file.name : "Choose PDF"}<input className="hidden" type="file" accept="application/pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} required /><UploadCloud size={15} /></label></div><button className="inline-flex items-center justify-center rounded-lg bg-[#27655a] px-3 py-2.5 text-xs font-bold text-white disabled:opacity-60" disabled={busy}>{busy ? "Filing..." : "File minute"}</button></form>}
        </div>
      </div>
    </section>
  );
}

function SectionHeading({title, description}: {title: string; description: string}) { return <div className="mb-4"><h3 className="text-base font-bold tracking-[-0.03em]">{title}</h3><p className="mt-1 text-xs text-[#71807c]">{description}</p></div>; }
function Avatar({name}: {name: string}) { return <span className="grid size-9 place-items-center rounded-full bg-[#dcefe5] text-xs font-bold text-[#27655a]">{name[0]}</span>; }
function Person({label, person}: {label: string; person: Committee["chairman"]}) { return <div className="flex items-center gap-3 rounded-lg bg-[#fafcf9] p-2.5"><Avatar name={person.name} /><div className="grid flex-1 gap-0.5"><span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#9a7160]">{label}</span><strong className="text-xs">{person.name}</strong><span className="text-[10px] text-[#71807c]">{person.email}</span></div></div>; }