const express = require("express");
const Agora = require("agora-access-token");

const app = express();
app.use(express.json());

if (!(process.env.APP_ID && process.env.APP_CERTIFICATE)) {
    throw new Error('You must define an APP_ID and APP_CERTIFICATE');
}
var APP_ID = process.env.APP_ID;
var APP_CERTIFICATE = process.env.APP_CERTIFICATE;


app.post("/rtctoken", (req, res) => {
  const appID = APP_ID;
  const appCertificate = APP_CERTIFICATE;
  const expirationTimeInSeconds = 3600;
  const uid = req.body.uid;
  if (!uid) {
        uid = 0;
    }
  const role = req.body.isPublisher ? Agora.RtcRole.PUBLISHER : Agora.RtcRole.SUBSCRIBER;
  const channel = req.body.channel;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const expirationTimestamp = currentTimestamp + expirationTimeInSeconds;

  const token = Agora.RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channel, uid, role, expirationTimestamp);
  res.send({ uid, token });
});


const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Agora Auth Token Server listening at Port ${port}`));
