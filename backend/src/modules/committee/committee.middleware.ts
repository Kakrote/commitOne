import {RequestHandler} from "express";
import {prisma} from "../../lib/prisma";
import {AppError} from "../../utils/appError";

const loadCommitteeAccess = async (committeeId: string) =>
    prisma.committee.findUnique({
        where: {id: committeeId},
        select: {
            id: true,
            chairmanId: true,
            secretaryId: true,
        },
    });

export const requireCommitteeAccess: RequestHandler = async (req, _res, next) => {
    const committee = await loadCommitteeAccess(req.params.committeeId as string);

    if (!committee) {
        next(new AppError("Committee not found", 404));
        return;
    }

    const isManager = committee.chairmanId === req.user?.id || committee.secretaryId === req.user?.id;
    const isSuperAdmin = req.user?.role === "SUPER_ADMIN";

    if (!isSuperAdmin && !isManager) {
        next(new AppError("You do not have access to this committee", 403));
        return;
    }

    req.committee = {
        id: committee.id,
        chairmanId: committee.chairmanId,
        secretaryId: committee.secretaryId,
    };
    next();
};

export const requireCommitteeManager: RequestHandler = (req, _res, next) => {
    const isManager = req.committee?.chairmanId === req.user?.id
        || req.committee?.secretaryId === req.user?.id;

    if (req.user?.role !== "SUPER_ADMIN" && !isManager) {
        next(new AppError("Only the chairman, secretary, or super admin can manage this committee", 403));
        return;
    }

    next();
};