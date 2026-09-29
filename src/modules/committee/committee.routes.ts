import {Router} from "express";
import {authenticate} from "../../middlewares/auth.middleware";
import {requireCommitteeAccess, requireCommitteeManager} from "./committee.middleware";
import {uploadMinuteFile} from "./committee.upload";
import {
    addMemberController,
    createCommitteeController,
    downloadMinuteController,
    getCommitteeController,
    listCommitteesController,
    listMinutesController,
    removeMemberController,
    uploadMinuteController,
} from "./committee.controller";

const committeeRouter = Router();

committeeRouter.use(authenticate);
committeeRouter.get("/", listCommitteesController);
committeeRouter.post("/", createCommitteeController);
committeeRouter.get("/:committeeId", requireCommitteeAccess, getCommitteeController);
committeeRouter.get("/:committeeId/minutes", requireCommitteeAccess, listMinutesController);
committeeRouter.get("/:committeeId/minutes/:minuteId/file", requireCommitteeAccess, downloadMinuteController);

committeeRouter.use("/:committeeId", requireCommitteeAccess, requireCommitteeManager);
committeeRouter.post("/:committeeId/members", addMemberController);
committeeRouter.delete("/:committeeId/members/:facultyId", removeMemberController);
committeeRouter.post("/:committeeId/minutes", uploadMinuteFile, uploadMinuteController);

export default committeeRouter;