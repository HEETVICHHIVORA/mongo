const { MongoClient } = require('mongodb');
let databaseConnect;
module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect("mongodb://localhost:27017/bookstore")
            .then(client => {
                databaseConnect = client.db();
                return cb();
            })
            .catch(err => {
                console.log(err);
                return cb(err);
            });
    },
    getDb: () => databaseConnect
};
