const game = require("./gameState");
const express = require("express")();
const http = require("http").createServer(express);
const socketio = require("socket.io")(http);

http.listen(3300, () => {
  console.log("listening at : 3300...");
});

socketio.on("connection", (socket) => {
  console.log("a user connected");
  socketio.emit("gameState", game.getGameState());

  socket.on("joinGame", (formValue) => {
    console.log("join triggered", formValue);
    const player = game.addPlayer(formValue.name);
    socketio.emit("gameState", game.getGameState());
    socket.emit("playerState", player);
  });

  socket.on("startGame", (uuid) => {
    console.log("start triggered", uuid);
    game.startGame(uuid);
    socketio.emit("gameState", game.getGameState());
    socket.emit("playerState", game.getPlayer(uuid));
  });

  socket.on("startStory", ({ uuid, selectedCard }) => {
    console.log("start story triggered");
    game.startStory({ uuid, selectedCard });
    socketio.emit("gameState", game.getGameState());
    socket.emit("playerState", game.getPlayer(uuid));
  });

  socket.on("playStory", ({ uuid, selectedCard }) => {
    console.log("play story triggered");
    game.playStory({ uuid, selectedCard });
    socketio.emit("gameState", game.getGameState());
    socket.emit("playerState", game.getPlayer(uuid));
  });

  socket.on("guessStoryCard", ({ uuid, selectedCard }) => {
    console.log("guessStoryCard triggered");
    game.guessStoryCard({ uuid, selectedCard });
    socketio.emit("gameState", game.getGameState());
    socket.emit("playerState", game.getPlayer(uuid));
  });

  socket.on("resetGame", () => {
    console.log("reset triggered");
    game.setToInitState();
    socketio.emit("gameState", game.getGameState());
    socketio.emit("playerState", null);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
