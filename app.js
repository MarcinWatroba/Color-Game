const express    = require("express")
      app        = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/assets"));

app.get("/", (req, res) => {
    res.render("home");
});

const port = process.env.PORT || 3000;
app.listen(port, process.env.IP, () => {
    console.log("Server Started");
});
