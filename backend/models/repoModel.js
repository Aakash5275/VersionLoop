const mongoose = require('mongoose');
const { Schema } = mongoose;

const commitSchema = new Schema({
    message: { type: String },
    author:  { type: String },
    date:    { type: Date, default: Date.now },
});

const repositorySchema = new Schema({
    name: { type: String, required: true , unique: true },
    description: { type: String },
    content: [{ type: String }],
    visibility: { type: Boolean },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    issues: [{ type: Schema.Types.ObjectId, ref: 'Issue' }],
    commits: [commitSchema],
}, { timestamps: true });

const Repository = mongoose.model('Repository', repositorySchema);
module.exports = Repository;


