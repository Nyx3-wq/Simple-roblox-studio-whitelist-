/*
  If you are gonna improve on this design or use it in general (Please don't it's insecure asf) Give me credits!
  
  My discord: milw0rm.5
  My website: pedophile.cc (I know the domain name is a bit weird it's just a about me site)
*/

import e from 'express';
import f from 'fs';
import p from 'path';
import { fileURLToPath as u } from 'url';

const app = e();
app.use(e.json());

const fpth = u(import.meta.url);
const dpth = p.dirname(fpth);

const wpth = p.join(dpth, 'whitelist.json');

const ldwl = () => f.existsSync(wpth) ? JSON.parse(f.readFileSync(wpth, 'utf8')) : [];

app.get('/whitelist-check', (req, res) => {
  const username = req.query.Username;
  if (!username) return res.status(400).send("Invalid request");
  const wl = ldwl();
  const iswld = wl.includes(username);
  res.json({ Username: username, iswld });
});

app.post('/whitelist', (req, res) => {
  const { Username: username } = req.body;
  if (!username) return res.status(400).send("Invalid request");
  const wl = ldwl();
  if (!wl.includes(username)) {
    wl.push(username);
    f.writeFileSync(wpth, JSON.stringify(wl, null, 2));
    return res.json({ message: "User added to whitelist" });
  }
  res.json({ message: "User is already whitelisted" });
});

app.post('/unwhitelist', (req, res) => {
  const { Username: username } = req.body;
  if (!username) return res.status(400).send("Invalid request");
  let wl = ldwl();
  if (wl.includes(username)) {
    wl = wl.filter(user => user !== username);
    f.writeFileSync(wpth, JSON.stringify(wl, null, 2));
    return res.json({ message: "User removed from whitelist" });
  }
  res.json({ message: "User is not in whitelist" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));

