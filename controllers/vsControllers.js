const db = require("../models");

module.exports = {
    /*
    createMessage: function (req, res) {
        db.Messages
            .create(req.body)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    findAllMessages: function (req, res) {
        db.Messages
            .find({})
            .sort({ created_date: -1 })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    deleteOneMessage: function (req, res) {
        db.Messages
            .deleteOne({ _id: req.body.messageID })
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    }
    */
};