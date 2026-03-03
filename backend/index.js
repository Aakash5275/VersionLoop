const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const {initRepo} = require("./controllers/init");
const {addrepo} = require("./controllers/add");
const {commitrepo} = require("./controllers/commit");
const {pullrepo} = require("./controllers/pull");
const {pushrepo} = require("./controllers/push");
const {revertrepo} = require("./controllers/revert");

yargs( hideBin(process.argv))
.command("init", "Initialise a new repository",{},initRepo)
.command("add <file>", "Add a file to the repository",
    (yargs) => {
     yargs.positional("file",{
     describe: "The file to add to the staging area",
     type: "string",})},addrepo)
.command("add <file>", "Add a file to the repository",
    (yargs) => {
     yargs.positional("file",{
     describe: "The file to add to the staging area",
     type: "string",})},addrepo)
.command(
    "commit <message>",
    "Commit changes to the repository",(yargs) => {
        yargs.positional("message",{
            describe: "The commit message",
            type: "string",
        });
    },commitrepo)
.command("pull", "Pull changes from remote repository",{},pullrepo)
.command("push", "Push changes to remote repository",{},pushrepo)
.command("revert <commitId>",
    "Revert to a specific commit",(yargs) => {
        yargs.positional("commitId",{
            describe: "commit ID to revert to",
            type: "string",
        });
    },revertrepo)
.demandCommand(1, "you need at least one command").help().argv;
