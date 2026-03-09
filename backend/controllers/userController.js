const getAllUsers = (req, res) => {
    res.send('all users fetched');
};

const signUp = (req, res) => {
    res.send('user signed up');
};

const login = (req, res) => {
    res.send('user logged in');
};

const getUserProfile = (req, res) => {
    res.send('profile fetched');
};

const updateUserProfile = (req, res) => {
    res.send('profile updated');
};

const deleteUserProfile = (req, res) => {
    res.send('profile deleted');
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