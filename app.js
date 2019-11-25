const feathers = require("@feathersjs/feathers");
const express = require("@feathersjs/express");
const socketio = require("@feathersjs/socketio");

class IdeaService {
  constructor() {
    this.ideas = [];
  }
  async find() {
    return this.ideas;
  }
  async create(data) {
    const idea = {
      id: this.ideas.length,
      text: data.text,
      tech: data.tech,
      viewer: data.viewer
    };

    this.ideas.push(idea);
    return idea;
  }
}

const app = express(feathers());

app.use(express.json());
app.configure(socketio());
app.configure(express.rest());
app.use("/ideas", new IdeaService());

app.on("connection", conn => app.channel("stream").join(conn));
app.publish(data => app.channel("stream"));

const PORT = 3000;

app
  .listen(PORT)
  .on("listening", () =>
    console.log(`Realtime server running on http://localhost:${PORT}`)
  );
