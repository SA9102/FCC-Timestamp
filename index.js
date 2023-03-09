// init project
var express = require("express");
var app = express();
var port = 8080;

const convertToUtcAndUnix = (date) => {
  let utc = date.toString().split(" ").slice(0, 6);
  utc[5] = utc[5].split("+")[0];
  utc[0] = `${utc[0]},`;

  const month = utc[1];
  utc[1] = utc[2];
  utc[2] = month;

  return [utc.join(" "), Math.floor(date.getTime())];
};

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/:date", (req, res) => {
  let date;
  if (isNaN(new Date(Number(req.params.date)))) {
    // String date
    date = new Date(req.params.date);
  } else {
    // Unix timestamp
    date = new Date(Number(req.params.date));
  }

  // If 'date' is invalid
  if (date.toString() === "Invalid Date") {
    res.json({ error: "Invalid Date" });
  } else {
    const [utc, unix] = convertToUtcAndUnix(date);
    res.json({ unix, utc });
  }
});

app.get("/api/", (req, res) => {
  const date = new Date();
  const [utc, unix] = convertToUtcAndUnix(date);
  res.json({ unix, utc });
});

// listen for requests
var listener = app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
