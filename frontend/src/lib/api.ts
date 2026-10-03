import type {Committee, CommitteeSummary, Faculty, MeetingMinute, PublicCommittee, User} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

interface ApiResponse<T> { success: boolean; data: T; message?: string; }

export interface AccountInput {
  name: string;
  email: string;
  password: string;
  employeeId?: string;
  department?: string;
  designation?: string;
}

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_URL}${path}`, {...options, headers});
  const payload = await response.json().catch(() => ({})) as ApiResponse<T>;
  if (!response.ok) throw new Error(payload.message ?? "Something went wrong");
  return payload.data;
}

export const api = {
  login: (email: string, password: string) => request<{token: string; user: User}>("/auth/login", {method: "POST", body: JSON.stringify({email, password})}),
  faculty: (token: string) => request<Faculty[]>("/auth/faculty", {}, token),
  createCommittee: (payload: {name: string; description?: string; chairman: AccountInput; secretary: AccountInput}, token: string) => request<CommitteeSummary>("/committees", {method: "POST", body: JSON.stringify(payload)}, token),
  committees: (token: string) => request<CommitteeSummary[]>("/committees", {}, token),
  committee: (id: string, token: string) => request<Committee>(`/committees/${id}`, {}, token),
  publicCommittees: () => request<CommitteeSummary[]>("/public/committees"),
  publicCommittee: (id: string) => request<PublicCommittee>(`/public/committees/${id}`),
  addMember: (committeeId: string, facultyId: string, token: string) => request<unknown>(`/committees/${committeeId}/members`, {method: "POST", body: JSON.stringify({facultyId})}, token),
  removeMember: (committeeId: string, facultyId: string, token: string) => request<unknown>(`/committees/${committeeId}/members/${facultyId}`, {method: "DELETE"}, token),
  uploadMinute: (committeeId: string, form: FormData, token: string) => request<MeetingMinute>(`/committees/${committeeId}/minutes`, {method: "POST", body: form}, token),
  downloadMinute: async (url: string, token: string) => {
    const response = await fetch(`${API_URL.replace(/\/api$/, "")}${url}`, {headers: {Authorization: `Bearer ${token}`} });
    if (!response.ok) throw new Error("Could not download this minute");
    return response.blob();
  },
};

export {API_URL};