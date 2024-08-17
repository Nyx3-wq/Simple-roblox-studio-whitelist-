/*
  If you are gonna improve on this design or use it in general (Please don't it's insecure asf) Give me credits!
  
  My discord: milw0rm.5
  My website: pedophile.cc (I know the domain name is a bit weird it's just a about me site)
  My discord server: https://discord.gg/ZFEQCDB3eW (NSFW SERVER!!!)
*/

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const NodeCache = require("node-cache");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const cache = new NodeCache({ stdTTL: 600 });

const debounce = (req, res, next) => {
  console.log('Debounce triggered');
  setTimeout(() => {
    console.log('Debounce finished, passing control to next debounce');
    next();
  }, 3000);
};

app.use("/whitelist-check", debounce);

app.post("/whitelist-check", (req, res) => {
  console.log('POST /whitelist-check route hit');
  const { Username: r } = req.body;
  console.log('Received Username:', r);

  if (!r) {
    console.log('Invalid request: Username is missing');
    return res.status(400).send("Invalid request");
  }

  const crsp = cache.get(r);
  if (crsp) {
    console.log('Cache hit for Username:', r);
    return res.json(crsp);
  }

  console.log('Cache miss for Username:', r);
  const resp = { message: r.includes("COOLUSER") || r.includes("ROBLOX") ? "user is whitelisted" : "user is not whitelisted" };
  console.log('resp:', resp);
  cache.set(r, resp);
  res.json(resp);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
