import {AppError} from "../../utils/appError";
import bcrypt from "bcrypt";
import {prisma} from "../../lib/prisma";
import {
    addCommitteeMember,
    createMeetingMinute,
    findCommitteeById,
    findCommitteeMember,
    findCommittees,
    findFacultyById,
    findMeetingMinutes,
    findMeetingMinuteById,
    removeCommitteeMember,
} from "./committee.repository";

export const listCommittees = (userId: string, isSuperAdmin: boolean) =>
    findCommittees(isSuperAdmin ? undefined : userId);

export const getCommittee = async (committeeId: string) => {
    const committee = await findCommitteeById(committeeId);
    if (!committee) throw new AppError("Committee not found", 404);
    return committee;
};

export const createNewCommittee = async (data: {
    name: string;
    description?: string;
    chairman: {
        name: string;
        email: string;
        password: string;
        employeeId?: string;
        department?: string;
        designation?: string;
    };
    secretary: {
        name: string;
        email: string;
        password: string;
        employeeId?: string;
        department?: string;
        designation?: string;
    };
}) => {
    const committeeId = await prisma.$transaction(async (transaction) => {
        const createOfficer = async (officer: typeof data.chairman) => {
            const existing = await transaction.facultyMember.findUnique({where: {email: officer.email}});
            if (existing) throw new AppError(`An account already exists for ${officer.email}`, 409);

            const password = await bcrypt.hash(officer.password, 12);
            const created = await transaction.facultyMember.create({
                data: {...officer, password, canLogin: true, role: "FACULTY"},
                select: {id: true},
            });
            return created.id;
        };

        const chairmanId = await createOfficer(data.chairman);
        const secretaryId = await createOfficer(data.secretary);
        const committee = await transaction.committee.create({
            data: {name: data.name, description: data.description, chairmanId, secretaryId},
            select: {id: true},
        });
        return committee.id;
    });

    return getCommittee(committeeId);
};

export const addFacultyToCommittee = async (committeeId: string, facultyId: string) => {
    const faculty = await findFacultyById(facultyId);
    if (!faculty) throw new AppError("Faculty member not found", 404);
    if (await findCommitteeMember(committeeId, facultyId)) {
        throw new AppError("Faculty member is already in this committee", 409);
    }
    return addCommitteeMember(committeeId, facultyId);
};

export const removeFacultyFromCommittee = async (committeeId: string, facultyId: string) => {
    const result = await removeCommitteeMember(committeeId, facultyId);
    if (result.count === 0) throw new AppError("Faculty member is not in this committee", 404);
};

export const listMinutes = async (committeeId: string) => findMeetingMinutes(committeeId);

export const meetingMinuteDownloadUrl = (committeeId: string, minuteId: string) =>
    `/api/committees/${committeeId}/minutes/${minuteId}/file`;

export const getMeetingMinute = async (committeeId: string, minuteId: string) => {
    const minute = await findMeetingMinuteById(committeeId, minuteId);
    if (!minute) throw new AppError("Meeting minute not found", 404);
    return minute;
};

export const uploadMinute = (data: {
    committeeId: string;
    title: string;
    meetingDate: Date;
    pdfUrl: string;
}) => createMeetingMinute(data);