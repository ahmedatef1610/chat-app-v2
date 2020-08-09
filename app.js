const path = require("path");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const session = require("express-session");
const sessionStore = require("connect-mongodb-session")(session);
const { mongoURL } = require("./config/keys");
const flash = require("connect-flash");
/********************************************************************/
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
/********************************************************************/
// app.use((req, res, next) => {
//   res.status(503).send("Site is currently down. Check back soon!");
// });
/**************************/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "images")));
app.set("view engine", "ejs");
app.set("views", "views"); //default
/**************************/
const store = new sessionStore({
  uri: mongoURL,
  collection: "sessions",
});
app.use(
  session({
    secret: "this is my secret to hash express sessions ba bal .....",
    saveUninitialized: false,
    resave: true,
    store,
  })
);
app.use(flash());
/**************************/
app.use((req, res, next) => {
  res.locals.date = new Date().getFullYear();
  res.locals.isUser = req.session.userId;
  next();
});
/********************************************************************/
const homeRouter = require("./routes/home.route");
const authRouter = require("./routes/auth.route");
const profileRouter = require("./routes/profile.route");
const friendRouter = require("./routes/friend.route");
const chatRouter = require("./routes/chat.route");

const UserDb = require("./models/user.db");

app.use((req, res, next) => {
  if (req.session.userId) {
    UserDb.getFriendRequests(req.session.userId)
      .then((requests) => {
        req.friendRequests = requests;
        res.locals.friendRequests = requests;
        next();
      })
      .catch((err) => next(err));
  } else {
    next();
  }
});

app.use("/", homeRouter);
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/friend", friendRouter);
app.use("/chat", chatRouter);

app.get("/error", (req, res, next) => {
  let errMsg = req.app.locals.errMsg;
  req.app.locals.errMsg = null;
  res.status(500);
  res.render("error", {
    path: "/error",
    pageTitle: "error",
    errMsg,
  });
});

app.get("/not-admin", (req, res, next) => {
  res.status(403);
  res.render("not-admin", {
    path: "/not-admin",
    pageTitle: "not-admin",
  });
});
app.use((req, res, next) => {
  res.status(404);
  res.render("not-found", {
    path: "/not-found",
    pageTitle: "not found",
  });
});
app.use((error, req, res, next) => {
  // res.status(500).send({ error: error.message });
  req.app.locals.errMsg = error.message;
  res.redirect("/error");
});
/********************************************************************/
//socket.emit // one client
//io.emit //all clients
//socket.broadcast.emit //all clients except this client
//socket.broadcast.to("myRoom").emit("newMsg"); //all clients except this client in this room

//socket.leave("room")
//socket.leaveAll()
/*********************/
io.onlineUsers = {};

io.on("connection", (socket) => {
  console.log("new user connected: " + socket.id);
});
require("./sockets/init.socket")(io);
require("./sockets/friend.socket")(io);
require("./sockets/chat.socket")(io);
/********************************************************************/
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
