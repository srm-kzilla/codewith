import express = require("express");
import http = require("http");
import io = require("socket.io");
import path = require("path");

import { Document } from "./document";

const app = express();
const httpServer = new http.Server(app);

const socketServer = io(httpServer);

app.use(express.static(path.join(__dirname, "..", "public")));

socketServer.on("connection", socket => {
    socket.on("join-project", (projectId: string) => {
        socket.join(projectId);
        socketServer
            .to(projectId)
            .emit("join-project", socket.id + " just joined this project");
    });
});

socketServer.on("file-change", (document: Document) => {
    console.log("File change", document);
    const project = document.project;
    socketServer.to(project).emit("file-change", document);
});

const port = process.env.PORT;
httpServer.listen(port, () => {
    console.log("Server started on port", port);
});
