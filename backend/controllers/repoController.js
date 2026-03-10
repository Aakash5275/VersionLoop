const createRepository = (req, res) => {
    res.send('Repository created');
};

const getAllRepositories = (req, res) => {
    res.send('All repositories fetched');
};

const fetchRepositortById = (req, res) => {
    res.send('Repository fetched by id');
};

const fetchRepositoryByName = (req, res) => {
    res.send('Repository fetched by name');
};

const fetchRepositoryForCurrentUser = (req, res) => {
    res.send('Repository for Logged in user fetched');
};

const updateRepositoryById = (req, res) => {
    res.send('Repository Updated');
};

const toggleVisibilityById = (req, res) => {
    res.send('Repository toggled');
};

const deleteRepositoryById = (req, res) => {
    res.send('Repository Deleted');
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






