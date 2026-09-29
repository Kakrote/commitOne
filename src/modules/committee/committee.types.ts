export interface CommitteeParams {
    committeeId: string;
}

export interface MemberParams extends CommitteeParams {
    facultyId: string;
}

export interface MinuteParams extends CommitteeParams {
    minuteId: string;
}