// server/config/pusher.js
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1968017",
  key: "3eae2d73125b83698a00",
  secret: "811226cb2e941facc69d",
  cluster: "eu",
  useTLS: true
});

module.exports = pusher;
