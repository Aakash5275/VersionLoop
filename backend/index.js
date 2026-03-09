const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const mainRouter = require("./routes/main.router");

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const {initRepo} = require("./controllers/init");
const {addrepo} = require("./controllers/add");
const {commitrepo} = require("./controllers/commit");
const {pullrepo} = require("./controllers/pull");
const {pushrepo} = require("./controllers/push");
const {revertrepo} = require("./controllers/revert");

dotenv.config();

yargs( hideBin(process.argv))

.command("start", "start a new server",{},startServer)

.command("init", "Initialise a new repository",{},initRepo)  // Command to initialize a new repository, it calls the initRepo function from the init controller

.command("add <file>", "Add a file to the repository",       // Command to add a file to the staging area, it calls the addrepo function from the add controller
    (yargs) => {
     yargs.positional("file",{
     describe: "The file to add to the staging area",
     type: "string",})
    },
    (argv) => {
        addrepo(argv.file);
    }
)
// .command("add <file>", "Add a file to the repository",
//     (yargs) => {
//      yargs.positional("file",{
//      describe: "The file to add to the staging area",
//      type: "string",})},addrepo)

.command(                                                  // Command to commit changes to the repository, it calls the commitrepo function from the commit controller
    "commit <message>",
    "Commit changes to the repository",(yargs) => {
        yargs.positional("message",{
            describe: "The commit message",
            type: "string",
        });
    },
    (argv) => {
        commitrepo(argv.message);
    }
)

.command("pull", "Pull changes from remote repository",{},pullrepo)

.command("push", "Push changes to remote repository",{},pushrepo)

.command(
    "revert <commitId>",
    "Revert to a specific commit",
    (yargs) => {
        yargs.positional("commitId", {
            describe: "commit ID to revert to",
            type: "string",
        });
    },
    (argv) => {
        // ✅ Explicitly pass the string ID, not the whole 'argv' object
        revertrepo(argv.commitId); 
    }
)
.demandCommand(1, "you need at least one command").help().argv;


function startServer(){
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(bodyParser.json());
    app.use(express.json()); 
    const mongoURI = process.env.MONGODB_URL;

    mongoose.connect(mongoURI).then(() => {
        console.log("Connected to MongoDB");
    }).catch((err) => {
        console.error("Error connecting to MongoDB", err);
    });

    app.use(cors({ origin: "*" }));

    app.use("/", mainRouter);


    let user = "test";
    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        socket.on("joinRoom", (userID) => {
            user = userID;
            console.log("=====");
            console.log(user);
            console.log("=====");
            socket.join(userID);

        }
        );
    });

    const db = mongoose.connection;
    db.once("open", async() => {
        console.log("CEUD operations called");  // crud operations for commits, events, users, and diffs
    });

    httpServer.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    }
    );
}
