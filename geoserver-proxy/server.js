const express = require("express");
const request = require("request");
const cors = require("cors");

const app = express();
app.use(cors());

const GEOSERVER = "http://atlas.geocenter.survey.ntua.gr:8080";

app.use("/", (req, res) => {
  const url = GEOSERVER + req.url;
  req.pipe(request(url)).pipe(res);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Proxy listening on port ${port}`);
});
