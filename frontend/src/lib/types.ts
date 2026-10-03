export type Role = "FACULTY" | "SUPER_ADMIN";

export interface User {
  id: string;
  name?: string;
  email: string;
  role: Role;
}

export interface Faculty {
  id: string;
  employeeId?: string | null;
  name: string;
  email: string;
  designation?: string | null;
  department?: string | null;
}

export interface CommitteeSummary {
  id: string;
  name: string;
  description?: string | null;
  chairman: Faculty;
  secretary: Faculty;
  createdAt: string;
  _count: {members: number; meetingMinutes: number};
}

export interface MeetingMinute {
  id: string;
  committeeId: string;
  title: string;
  meetingDate: string;
  pdfUrl: string;
  uploadedAt: string;
}

export interface Committee extends CommitteeSummary {
  members: Array<{id: string; joinedAt: string; faculty: Faculty}>;
  meetingMinutes: MeetingMinute[];
}

export interface PublicCommittee extends CommitteeSummary {
  meetingMinutes: MeetingMinute[];
}