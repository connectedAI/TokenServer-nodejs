const express = require("express");
const Agora = require("agora-access-token");

const app = express();
app.use(express.json());

if (!(process.env.APP_ID && process.env.APP_CERTIFICATE)) {
  throw new Error("You must define an APP_ID and APP_CERTIFICATE");
}

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

app.post("/rtctoken", (req, res) => {
  const uid = req.body.uid;
  const role = req.body.isPublisher
    ? Agora.RtcRole.PUBLISHER
    : Agora.RtcRole.SUBSCRIBER;
  const channel = req.body.channel;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const expirationTimestamp = currentTimestamp + 3600;

  const token = Agora.RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channel,
    uid,
    role,
    expirationTimestamp
  );
  res.send(token);
});

const port = process.env.PORT || 8080;
app.listen(port, () =>
  console.log(`Agora Auth Token Server listening at Port ${port}`)
);
