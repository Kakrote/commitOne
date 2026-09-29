"use client";

import type {FormEvent} from "react";
import {useState} from "react";
import {ArrowUpRight, Sparkles} from "lucide-react";
import {api} from "@/lib/api";
import type {User} from "@/lib/types";

export function AuthScreen({onAuthenticated}: {onAuthenticated: (token: string, user: User) => void}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const result = await api.login(email, password);
      localStorage.setItem("committee_token", result.token);
      localStorage.setItem("committee_user", JSON.stringify(result.user));
      onAuthenticated(result.token, result.user);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not sign in");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[#f8faf7] lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-[#1f5147] p-10 text-white lg:flex lg:p-[6vw]">
        <div className="relative z-10 flex items-center justify-between">
          <Brand />
          <span className="text-[11px] text-[#b7d5c6]">Committee intelligence, made human</span>
        </div>
        <div className="relative z-10 max-w-lg">
          <span className="text-[10px] font-bold tracking-[0.18em] text-[#b7d5c6]">THE SHARED RECORD</span>
          <h1 className="mt-5 text-6xl font-bold leading-[0.95] tracking-[-0.07em] xl:text-7xl">Make every meeting<br /><em className="font-serif font-normal text-[#efc7a2]">matter.</em></h1>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#c2dcd0]">A calm, considered home for the people and decisions that move your institution forward.</p>
        </div>
        <div className="relative z-10 flex justify-between text-[11px] text-[#b7d5c6]"><span>Built for focused collaboration</span><span>01 / 03</span></div>
      </section>

      <section className="grid min-h-screen place-items-center bg-white px-6 py-10 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="lg:hidden"><Brand dark /></div>
          <div className="mb-8 mt-16 lg:mt-0">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8d9b95]">Welcome back</span>
            <h2 className="mt-2 text-3xl font-bold leading-tight tracking-[-0.06em]">Sign in to your workspace</h2>
            <p className="mt-2 text-sm text-[#71807c]">Your committees are waiting.</p>
          </div>
          <form className="grid gap-4" onSubmit={submit}>
            <label className="grid gap-1.5 text-[11px] font-semibold text-[#63736d]">Email address<input className="rounded-lg border border-[#e4ebe7] bg-[#fcfdfc] px-3 py-3 text-sm font-normal text-[#17322d] outline-none transition placeholder:text-[#a1ada7] focus:border-[#8bc0a1] focus:ring-4 focus:ring-[#dcefe5]" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@institution.edu" required /></label>
            <label className="grid gap-1.5 text-[11px] font-semibold text-[#63736d]">Password<input className="rounded-lg border border-[#e4ebe7] bg-[#fcfdfc] px-3 py-3 text-sm font-normal text-[#17322d] outline-none transition placeholder:text-[#a1ada7] focus:border-[#8bc0a1] focus:ring-4 focus:ring-[#dcefe5]" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" minLength={8} required /></label>
            {error && <p className="rounded-lg bg-[#fff1ec] p-2.5 text-xs text-[#9b4f3c]">{error}</p>}
            <button className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[#27655a] px-4 py-3.5 text-xs font-bold text-white shadow-lg shadow-[#27655a]/15 transition hover:bg-[#1b544a] disabled:cursor-wait disabled:opacity-60" disabled={busy}>{busy ? "Opening workspace..." : "Enter workspace"}<ArrowUpRight size={17} /></button>
          </form>
          <p className="mt-6 text-center text-[11px] text-[#84918c]">Accounts are created by your system administrator.</p>
        </div>
      </section>
    </main>
  );
}

function Brand({dark = false}: {dark?: boolean}) {
  return <div className={`flex items-center gap-2.5 text-lg font-bold tracking-[-0.04em] ${dark ? "text-[#17322d]" : "text-white"}`}><span className={`grid size-8 place-items-center rounded-[10px] ${dark ? "bg-[#27655a] text-white" : "bg-[#e9f5ee] text-[#27655a]"}`}><Sparkles size={17} /></span>Convene</div>;
}