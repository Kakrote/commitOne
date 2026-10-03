import {Router} from "express";
import {
    downloadPublicMinuteController,
    getPublicCommitteeController,
    listPublicCommitteesController,
} from "./committee.controller";

const publicCommitteeRouter = Router();

publicCommitteeRouter.get("/committees", listPublicCommitteesController);
publicCommitteeRouter.get("/committees/:committeeId", getPublicCommitteeController);
publicCommitteeRouter.get(
    "/committees/:committeeId/minutes/:minuteId/file",
    downloadPublicMinuteController,
);

export default publicCommitteeRouter;