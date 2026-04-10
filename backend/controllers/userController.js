const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
var ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');

dotenv.config();
const uri = process.env.MONGODB_URL;

let client;

async function connectClient(){
    if (!client) {
        client = new MongoClient(uri);
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

        res.json({token, userId: result.insertedId});

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

            // Get real contribution count: count commits across all user repos
            const reposCollection = db.collection('repositories');
            const userRepos = await reposCollection.find({ owner: new ObjectId(currrntId) }).toArray();
            let totalContributions = 0;
            const contributionDates = [];
            for (const repo of userRepos) {
                if (Array.isArray(repo.commits)) {
                    totalContributions += repo.commits.length;
                    for (const commit of repo.commits) {
                        if (commit.date) contributionDates.push(commit.date);
                    }
                }
            }

            const followersCount = Array.isArray(user.followers) ? user.followers.length : 0;
            const followingCount = Array.isArray(user.followedUsers) ? user.followedUsers.length : 0;

            res.send({
                ...user,
                followersCount,
                followingCount,
                totalContributions,
                contributionDates,
            });

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



async function followUser(req, res) {
    const { id } = req.params;          // user to follow
    const { followerId } = req.body;    // logged-in user doing the following

    if (!id || !followerId) {
        return res.status(400).json({ message: 'Missing id or followerId' });
    }
    if (id === followerId) {
        return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    try {
        await connectClient();
        const db = client.db('versionloop');
        const usersCollection = db.collection('users');

        const targetObjId   = new ObjectId(id);
        const followerObjId = new ObjectId(followerId);

        // Check already following
        const follower = await usersCollection.findOne({ _id: followerObjId });
        if (!follower) return res.status(404).json({ message: 'Follower user not found' });
        const alreadyFollowing = (follower.followedUsers || []).some(uid => uid.toString() === id);
        if (alreadyFollowing) {
            return res.status(400).json({ message: 'Already following this user' });
        }

        // Add to follower's followedUsers
        await usersCollection.updateOne(
            { _id: followerObjId },
            { $addToSet: { followedUsers: targetObjId } }
        );
        // Add to target's followers
        await usersCollection.updateOne(
            { _id: targetObjId },
            { $addToSet: { followers: followerObjId } }
        );

        const updated = await usersCollection.findOne({ _id: targetObjId });
        res.json({
            message: 'Followed successfully',
            followersCount: (updated.followers || []).length,
        });
    } catch (err) {
        console.error('Error following user:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function unfollowUser(req, res) {
    const { id } = req.params;          // user to unfollow
    const { followerId } = req.body;    // logged-in user doing the unfollowing

    if (!id || !followerId) {
        return res.status(400).json({ message: 'Missing id or followerId' });
    }

    try {
        await connectClient();
        const db = client.db('versionloop');
        const usersCollection = db.collection('users');

        const targetObjId   = new ObjectId(id);
        const followerObjId = new ObjectId(followerId);

        // Remove from follower's followedUsers
        await usersCollection.updateOne(
            { _id: followerObjId },
            { $pull: { followedUsers: targetObjId } }
        );
        // Remove from target's followers
        await usersCollection.updateOne(
            { _id: targetObjId },
            { $pull: { followers: followerObjId } }
        );

        const updated = await usersCollection.findOne({ _id: targetObjId });
        res.json({
            message: 'Unfollowed successfully',
            followersCount: (updated.followers || []).length,
        });
    } catch (err) {
        console.error('Error unfollowing user:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Match the names exactly as defined above
module.exports = {
    getAllUsers,
    signUp,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    followUser,
    unfollowUser,
};