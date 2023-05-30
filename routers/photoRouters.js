const Router = require("express").Router();
const photoController = require("../controllers/photoController");
const authentication = require("../middlewares/authentication");
const {photoAuthorization} = require("../middlewares/authorization");

Router.use(authentication)
Router.get("/", photoController.getAllPhotos);
Router.post("/", photoController.createPhoto);
Router.use("/:id", photoAuthorization);
Router.put("/:id", photoController.updatePhoto);
Router.delete("/:id", photoController.deletePhoto);

module.exports = Router;
