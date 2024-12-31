const express = require("express");
const app = express();
const logger = require("morgan");

const port = process.env.PORT || 8080;

const { studentsRouter } = require("./routers/studentsRouter");
const { coursesRouter } = require("./routers/coursesRouter");
const { facultyMembersRouter } = require("./routers/facultyMembersRouter");

app.use(express.json());
app.use(logger("dev"));

app.use("/students", studentsRouter);
app.use("/courses", coursesRouter);
app.use("/facultyMembers", facultyMembersRouter);

app.use((req, res) => {
  res.status(400).send("Page wasn't found");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
