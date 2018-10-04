module.exports = function (db) {
    return {
        getUser: function (req, res) {
            var users = db.collection('users');
        },
        showUser: function (req, res) {
        },
        createUser: function (req, res) {
        }
    }
};