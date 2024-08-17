/*
If you are gonna improve on this design or use it in general (Please don't it's insecure asf) Give me credits!

My discord: milw0rm.5
My website: pedophile.cc (I know the domain name is a bit weird it's just a about me site)
My discord server: https://discord.gg/ZFEQCDB3eW (NSFW SERVER!!!)
*/

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/whitelist-check', (req, res) => {
    const { Username } = req.body;
    console.log("Received whitelist check for username:", Username);

    if (!Username) {
        console.log("Invalid request: Username is missing.");
        return res.status(400).send('Invalid request');
    }
    if (Username.includes("ROBLOX") || Username.includes("ROBLOX")) { // you can keep on adding usernames here
        console.log("User is whitelisted:", Username);
        res.json({ message: "user is whitelisted" });
    } else {
        console.log("User is not whitelisted:", Username);
        res.json({ message: "user is not whitelisted" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
