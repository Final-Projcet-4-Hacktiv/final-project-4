require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const userRouters = require("./routers/userRouters");
const photoRouters = require("./routers/photoRouters");
const commentRouters = require("./routers/commentRouters");
const socialMediaRouters = require("./routers/socialMediaRouters");
const env = process.env.NODE_ENV || "development";

app.use(express.static("public"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouters);
app.use("/photos", photoRouters);
app.use("/comments", commentRouters);
app.use("/socialmedias", socialMediaRouters);
  
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
  
});

if(env !== "test"){
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}

module.exports = app;