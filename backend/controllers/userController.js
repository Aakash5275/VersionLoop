const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
var ObjectId = require('mongodb').ObjectId;

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

async function signUp (req, res) {
    const { username, email, password } = req.body;
    try {
        await connectClient();
        const db = client.db('versionloop');
        const usersCollection = db.collection('users');

        const user =await usersCollection.findOne({username});
        if (user) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = {
            username,
            email,
            password: hashedPassword,
            repositories: [],
            followedUsers: [],
            startRepos : [],
        };

        const result = await usersCollection.insertOne(newUser);

        const token = jwt.sign({id: result.insertedId, username }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        res.json({token});

    } catch (err) {
        console.error('Error during sign up:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
     




       
};


async function login (req, res){
    const {email, password } = req.body;
    try{
        await connectClient();
        const db = client.db('versionloop');
        const usersCollection = db.collection('users');

        const user =await usersCollection.findOne({email});
        if (!user) {
            return res.status(400).json({ message: 'Invalid credential' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credential' });
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.json({token,userId: user._id});
    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).json({ message: ' server error' });
    }
};



async function getAllUsers(req, res){
    try {
        await connectClient();
        const db = client.db('versionloop');
        const usersCollection = db.collection('users');

        const users = await usersCollection.find({}).toArray(); // Fetch all users

    } catch (err) {
        console.error('Error during fetching:', err.message);
        res.status(500).json({ message: ' server error' });
    }
};


async function getUserProfile(req, res){
    const currrntId = req.params.id;
        try {
            await connectClient();
            const db = client.db('versionloop');
            const usersCollection = db.collection('users');

            const user = await usersCollection.findOne({_id: new ObjectId(currrntId)}); // Fetch user by ID
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.send(user);




        } catch (err) {
            console.error('Error fetching user profile:', err.message);
            res.status(500).json({ message: ' server error' });
        }
       
};



async function updateUserProfile(req, res){
    const currrntId = req.params.id;
    const {email, password} = req.body;

    try {
        await connectClient();
        const db = client.db('versionloop');
        const usersCollection = db.collection('users');

        let updateFields = {email};
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateFields.password = hashedPassword;

        }
        const result = await usersCollection.findOneAndUpdate(
            {_id: new ObjectId(currrntId)},
            {$set: updateFields},
            {returnDocument: 'after'}
        );

       if (!result.value) {
        return res.status(404).json({ message: 'User not found' });
       }    
        res.send(result.value);

    } catch (err) {
            console.error('Error fetching user profile:', err.message);
            res.status(500).json({ message: ' server error' });
        }
};



async function deleteUserProfile(req, res){
    const currrntId = req.params.id;
    try {
        await connectClient();
        const db = client.db('versionloop');
        const usersCollection = db.collection('users');
        const result = await usersCollection.deleteOne({_id: new ObjectId(currrntId)});
        if (result.deletedCount === 0) { // No user was deleted, meaning the user was not found
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User profile deleted successfully' });
    } catch (err) {
        console.error('Error deleting user profile:', err.message);
        res.status(500).json({ message: ' server error' });
    }



   
}; 



// Match the names exactly as defined above
module.exports = {
    getAllUsers,
    signUp, // Fixed: changed 'signup' to 'signUp'
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
};