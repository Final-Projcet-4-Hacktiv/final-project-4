const router = require("express").Router();
const commentController = require("../controllers/commentController");
const authentication = require("../middlewares/authentication");
const {commentAuthorization} = require("../middlewares/authorization");

router.use(authentication);
router.get("/", commentController.getAllComments);
router.post("/", commentController.createComment);
router.use("/:id", commentAuthorization);
router.put("/:id", commentController.updateComment);
router.delete("/:id", commentController.deleteComment);

module.exports = router;