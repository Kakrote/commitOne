"use client";

import type {FormEvent} from "react";
import {useState} from "react";
import {ArrowUpRight, X} from "lucide-react";
import {api, type AccountInput} from "@/lib/api";
import type {CommitteeSummary} from "@/lib/types";

interface CreateCommitteeDialogProps {
  token: string;
  onClose: () => void;
  onCreated: (committee: CommitteeSummary) => void;
  onError: (message: string) => void;
}

const emptyAccount: AccountInput = {name: "", email: "", password: ""};

export function CreateCommitteeDialog({token, onClose, onCreated, onError}: CreateCommitteeDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [chairman, setChairman] = useState<AccountInput>(emptyAccount);
  const [secretary, setSecretary] = useState<AccountInput>(emptyAccount);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);

    try {
      const committee = await api.createCommittee({name, description, chairman, secretary}, token);
      onCreated(committee);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Could not create committee");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#17322d]/30 p-5 backdrop-blur-sm">
      <form className="my-5 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl" onSubmit={submit}>
        <div className="flex items-start justify-between">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8d9b95]">Admin workspace</p><h2 className="mt-1 text-2xl font-bold tracking-[-0.05em]">Create committee accounts</h2><p className="mt-2 text-xs text-[#71807c]">The chairman and secretary will use these credentials to sign in.</p></div>
          <button type="button" className="grid size-8 place-items-center rounded-lg border border-[#e4ebe7] text-[#71807c]" onClick={onClose} aria-label="Close dialog"><X size={16} /></button>
        </div>

        <div className="mt-6 grid gap-4">
          <label className="grid gap-1.5 text-[11px] font-semibold text-[#63736d]">Committee name<input className="rounded-lg border border-[#e4ebe7] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#8bc0a1] focus:ring-4 focus:ring-[#dcefe5]" value={name} onChange={(event) => setName(event.target.value)} placeholder="Academic review board" required /></label>
          <label className="grid gap-1.5 text-[11px] font-semibold text-[#63736d]">Description<input className="rounded-lg border border-[#e4ebe7] px-3 py-2.5 text-sm font-normal outline-none focus:border-[#8bc0a1] focus:ring-4 focus:ring-[#dcefe5]" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What this committee stewards" /></label>
          <div className="grid gap-4 md:grid-cols-2">
            <OfficerFields title="Chairman account" account={chairman} onChange={setChairman} />
            <OfficerFields title="Secretary account" account={secretary} onChange={setSecretary} />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2"><button type="button" className="rounded-lg px-4 py-2.5 text-xs font-bold text-[#71807c] hover:bg-[#f4f8f5]" onClick={onClose}>Cancel</button><button className="inline-flex items-center gap-2 rounded-lg bg-[#27655a] px-4 py-2.5 text-xs font-bold text-white disabled:cursor-wait disabled:opacity-60" disabled={busy}>{busy ? "Creating accounts..." : "Create committee"}<ArrowUpRight size={15} /></button></div>
      </form>
    </div>
  );
}

function OfficerFields({title, account, onChange}: {title: string; account: AccountInput; onChange: (account: AccountInput) => void}) {
  const update = (key: keyof AccountInput, value: string) => onChange({...account, [key]: value});
  return <fieldset className="grid gap-3 rounded-xl border border-[#e4ebe7] bg-[#fafcf9] p-4"><legend className="px-1 text-xs font-bold text-[#27655a]">{title}</legend><AccountField label="Full name" value={account.name} onChange={(value) => update("name", value)} placeholder="Avery Morgan" /><AccountField label="Email" type="email" value={account.email} onChange={(value) => update("email", value)} placeholder="avery@institution.edu" /><AccountField label="Temporary password" type="password" value={account.password} onChange={(value) => update("password", value)} placeholder="At least 8 characters" /></fieldset>;
}

function AccountField({label, type = "text", value, onChange, placeholder}: {label: string; type?: string; value: string; onChange: (value: string) => void; placeholder: string}) { return <label className="grid gap-1.5 text-[10px] font-semibold text-[#63736d]">{label}<input className="rounded-lg border border-[#e4ebe7] bg-white px-3 py-2.5 text-xs font-normal outline-none focus:border-[#8bc0a1] focus:ring-4 focus:ring-[#dcefe5]" type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} minLength={type === "password" ? 8 : undefined} required /></label>; }