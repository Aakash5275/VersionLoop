const mongoose = require('mongoose');
const Repository = require('../models/repoModel');
const User = require('../models/userModel');
const Issue = require('../models/issueModel');
const dotenv = require('dotenv'); 


dotenv.config();
const uri = process.env.MONGODB_URL;

let client;

async function connectClient(){
    if (!client) {
        client = new MongoClient(uri, { useNewUrlParser: true,
         useUnifiedTopology: true });
        await client.connect();
    }
} 

async function createRepository(req, res) {

    const {owner, name, issues, description, content, visibility} = req.body;
    try {
        if(!neme){
            return res.status(400).json({message: 'Repository name is required'});
        }

        if(!mongoose.Types.ObjectId.isValid(owner)){
            return res.status(400).json({message: 'Invalid owner ID'});
        }
    
        const newReository = new Repository({
            name,
            description, visibility,
            content,
            owner,
            issues,
        });
    

        const result = await newReository.save();


        res.status(201).json({message: 'Repository created successfully',
         repositoryID: result._id});
         

        } catch (err) {
        console.error('Error during repository creation:', err.message);
        res.status(500).json({ message: ' server error' });
    }
};
async function getAllRepositories(req, res) {
    try {
        const repositories = await Repository.find({})
        .populate("owner")
        .populate("issues");

        res.json(repositories);
    } catch (err) {
        console.error('Error during fetching repositories:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

async function fetchRepositortById  (req, res) {
    const  {id} = req.params;
    try {
        const repository = await Repository.findById({_id: id})
        .populate("owner")
        .populate("issues");

        res.json(repository);
    } catch (err) {
        console.error('Error during fetching repository by ID:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};


async function fetchRepositoryByName (req, res)  {
    const {name } = req.params;
    try {
        const repository = await Repository.findOne({name})
        .populate("owner")
        .populate("issues");
        res.json(repository);
    } catch (err) {
        console.error('Error during fetching repository by name:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

async function fetchRepositoryForCurrentUser (req, res) {
   const userId = req.user; // Assuming you have user authentication and userId is available in the request

    try {
        const repositories = await Repository.find({owner: userId});

        if(!repositories || repositories.length === 0){
            return res.status(404).json({message: 'No repositories found for the current user'});
            
            
            res.json({message: 'Repositories found successfully', repositories}); 


        }
     } catch (err) {
        console.error('Error during fetching repositories for current user:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }

};

async function updateRepositoryById (req, res) {
    const {id} = req.params;
    const { description,  content} = req.body;

    try {
        const repository = await Repository.findById(id);
        if(!repository){
            return res.status(404).json({message: 'Repository not found'});
        }

        repository.content.push(content);
        repository.description = description;

        const updatedRepository = await repository.save();

        res.json({message: 'Repository updated successfully', repository: updatedRepository});
        
    } catch (err) {
        console.error('Error during repository update:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

async function toggleVisibilityById (req, res) {
    const {id} = req.params;

    try {
        const repository = await Repository.findById(id);

        if(!repository){
            return res.status(404).json({message: 'Repository not found'});
        }

        repository.visibility = !repository.visibility;
        await repository.save();

        res.json({message: 'Repository visibility toggled successfully', repository});
    } catch (err) {
        console.error('Error during visibility toggle:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};


async function deleteRepositoryById (req, res)  {
    const {id} = req.params;

    try {
        const repository = await Repository.findByIdAndDelete(id);

        if(!repository){
            return res.status(404).json({message: 'Repository not found'});
        }
        res.json({message: 'Repository deleted successfully'});
    } catch (err) {
        console.error('Error during repository deletion:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }

};


module.exports = {
    createRepository,
    getAllRepositories,
    fetchRepositortById,
    fetchRepositoryByName,
    fetchRepositoryForCurrentUser,
    updateRepositoryById,
    toggleVisibilityById,
    deleteRepositoryById,
};


