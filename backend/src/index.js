const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Voting } = require("./voting");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: true,
  origins: ["http://127.0.0.1:5500"],
});

const voting = new Voting();

io.on("connection", (socket) => {
  socket.emit("connection", JSON.stringify(voting.getAllVotings()));
  console.log("User " + socket.id + " connected.");

  socket.on("create_voting", (msg) => {
    const v = JSON.parse(msg);
    const result = voting.create_voting(v.id, v.topic);
    if (result.errors) {
      socket.emit("create_voting", JSON.stringify({ errors: result.errors }));
    } else {
      io.emit("create_voting", JSON.stringify({ id: v.id, topic: v.topic }));
      console.log("Vote " + v.id + ":" + v.topic + " created.");
    }
  });

  socket.on("vote", (msg) => {
    const v = JSON.parse(msg);
    const result = voting.vote(v.id, socket.id, v.vote);
    if (result.errors) {
      socket.emit("vote", JSON.stringify({ errors: result.errors }));
    } else {
      io.emit("vote", JSON.stringify(result));
      console.log("User " + socket.id + " voted " + v.id + " for " + v.vote);
    }
  });

  socket.on("disconnect", () => {
    console.log("User " + socket.id + " disconnected.");
  });
});

server.listen(4000, () => {
  console.log("listening on *:4000");
});
