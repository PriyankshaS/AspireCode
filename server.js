const app = require("./app");
const db = require("./db/DBConnection");

app.set("port", process.env.APP_PORT || 8080);

app.listen(app.get("port"), () => {
  console.log("Server started and running on port 8080");
});
