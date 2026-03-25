const mongoose = require('mongoose');
const Repository = require('../models/repoModel');
const User = require('../models/userModel');
const Issue = require('../models/issueModel');

async function createIssue (req, res) {
    const {title , description } = req.body;
    const { id } = req.params; // Repository ID

    try {
    const issue = new Issue({
        title,
        description,
        repository: id
    });

    await issue.save();

    res.status(201).json(issue);
    } catch (err) {
        console.error('Error during issue creation:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
   
};

async function updateIssueById (req, res) {
    try {
        const { id } = req.params;
        const { title, description ,staus} = req.body;

        

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        issue.title = title;
        issue.description = description;
        issue.status = staus;
        await issue.save();


        res.json(issue);
    } catch (err) {
        console.error('Error during issue update:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
} ;


async function deleteIssueById  (req, res) {
   const { id } = req.params;

   try {
    const issue = await Issue.findByIdAndDelete(id);
    if (!issue) {
        return res.status(404).json({ message: 'Issue not found' });
    }
    res.json({ message: 'Issue deleted successfully' });
   } catch (err) {
    console.error('Error during issue deletion:', err.message);
    res.status(500).json({ message: 'Internal server error' });
   }
};

async function getAllIssues (req, res) {
   const { id } = req.params; // Repository ID

   try {
    const issues = await Issue.find({ repository: id });
    if (!issues) {
        return res.status(404).json({ message: 'No issues found for this repository' });
    }
    res.status(200).json(issues);
   } catch (err) {
    console.error('Error during fetching issues:', err.message);
    res.status(500).json({ message: 'Internal server error' });
   }
};

async function getIssueById  (req, res) {
    const { id } = req.params;

    try {
        const issue = await Issue.findById(id);
        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }
        res.status(200).json(issue);
    } catch (err) {
        console.error('Error during fetching issue:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById
};


