//commonJS ! esmodule

const { createServer, request } = require("http");
const { Server } = require("socket.io");
const { serialize, parse } = require("cookie");

const app = createServer();
const io = new Server(app, {
  cookie: {
    path: "/",
    httpOnly: false,
    secure: false,
    expires: new Date("21/06/2025"),
    sameSite: true,
  },
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("nuevo cliente", socket.id);
  socket.on("message", (value) => {
    socket.emit("listMessage", value)
  });
  setInterval(() => {
    socket.emit("newMessage", "hola desde el servidor");
  }, 1000);
});

app.listen(9001, () => {
  console.log("estoy en el puerto 9001");
});

io.listen(9002);
