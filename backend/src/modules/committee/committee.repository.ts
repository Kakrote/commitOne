import {prisma} from "../../lib/prisma";

const facultySummary = {
    id: true,
    employeeId: true,
    name: true,
    email: true,
    designation: true,
    department: true,
} as const;

const committeeInclude = {
    chairman: {select: facultySummary},
    secretary: {select: facultySummary},
    members: {
        orderBy: {joinedAt: "asc" as const},
        include: {faculty: {select: facultySummary}},
    },
    meetingMinutes: {orderBy: {meetingDate: "desc" as const}},
} as const;

export const findCommittees = (facultyId?: string) => prisma.committee.findMany({
    where: facultyId ? {
        OR: [
            {chairmanId: facultyId},
            {secretaryId: facultyId},
            {members: {some: {facultyId}}},
        ],
    } : undefined,
    select: {
        id: true,
        name: true,
        description: true,
        chairman: {select: facultySummary},
        secretary: {select: facultySummary},
        createdAt: true,
        updatedAt: true,
        _count: {select: {members: true, meetingMinutes: true}},
    },
    orderBy: {createdAt: "desc"},
});

export const findCommitteeById = (id: string) => prisma.committee.findUnique({
    where: {id},
    include: committeeInclude,
});

export const findFacultyById = (id: string) => prisma.facultyMember.findUnique({
    where: {id},
    select: {id: true},
});

export const createCommittee = (data: {
    name: string;
    description?: string;
    chairmanId: string;
    secretaryId: string;
}) => prisma.committee.create({
    data,
    include: committeeInclude,
});

export const findCommitteeMember = (committeeId: string, facultyId: string) =>
    prisma.committeeMember.findUnique({
        where: {committeeId_facultyId: {committeeId, facultyId}},
    });

export const addCommitteeMember = (committeeId: string, facultyId: string) =>
    prisma.committeeMember.create({data: {committeeId, facultyId}});

export const removeCommitteeMember = (committeeId: string, facultyId: string) =>
    prisma.committeeMember.deleteMany({where: {committeeId, facultyId}});

export const findMeetingMinutes = (committeeId: string) =>
    prisma.meetingMinute.findMany({
        where: {committeeId},
        orderBy: {meetingDate: "desc"},
    });

export const findMeetingMinuteById = (committeeId: string, id: string) =>
    prisma.meetingMinute.findFirst({where: {id, committeeId}});

export const createMeetingMinute = (data: {
    committeeId: string;
    title: string;
    meetingDate: Date;
    pdfUrl: string;
}) => prisma.meetingMinute.create({data});