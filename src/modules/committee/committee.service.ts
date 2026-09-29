import {AppError} from "../../utils/appError";
import {
    addCommitteeMember,
    createCommittee,
    createMeetingMinute,
    findCommitteeById,
    findCommitteeMember,
    findCommittees,
    findFacultyById,
    findMeetingMinutes,
    findMeetingMinuteById,
    removeCommitteeMember,
} from "./committee.repository";

export const listCommittees = () => findCommittees();

export const getCommittee = async (committeeId: string) => {
    const committee = await findCommitteeById(committeeId);
    if (!committee) throw new AppError("Committee not found", 404);
    return committee;
};

export const createNewCommittee = async (data: {
    name: string;
    description?: string;
    chairmanId: string;
    secretaryId: string;
}) => {
    const [chairman, secretary] = await Promise.all([
        findFacultyById(data.chairmanId),
        findFacultyById(data.secretaryId),
    ]);
    if (!chairman || !secretary) throw new AppError("Chairman or secretary not found", 404);
    return createCommittee(data);
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