const router = require("express").Router();
const {
  createSocialMedia,
  getSocialMedia,
  updateSocialMedia,
  deleteSocialMedia,
} = require("../controllers/socialMediaController");
const authentication = require("../middlewares/authentication");
const { socialmediaAuthorization } = require("../middlewares/authorization");

router.use(authentication);
router.post("/", createSocialMedia);
router.get("/", getSocialMedia);
router.use("/:id", socialmediaAuthorization);
router.put("/:id", updateSocialMedia);
router.delete("/:id", deleteSocialMedia);

module.exports = router;
