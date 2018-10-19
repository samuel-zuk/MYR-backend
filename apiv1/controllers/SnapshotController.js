let SnapshotModel = require('./../models/SnapshotModel.js');
let verify = require('./../authorization/verifyAuth.js');

/**
 * SnapshotController.js
 *
 * @description :: Server-side logic for managing Snapshots.
 */
module.exports = {

    /**
     * SnapshotController.list()
     */
    list: function (req, res) {
        // ToDo: Support comma separated list of categories
        let user = req.query.user ? { user: req.query.user } : null;
        let time = req.query.time ? { user: req.query.time } : null;
        let error = req.query.error ? { error: req.query.error } : null;
        let queryParams = { ...user, ...time, ...error };

        SnapshotModel.find(queryParams, function (err, Snapshot) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Snapshot.',
                    error: err
                });
            }
            if (!Snapshot) {
                return res.status(404).json({
                    message: 'No such Snapshot'
                });
            }
            return res.json(Snapshot);
        });
    },

    /**
     * SnapshotController.show()
     */
    show: function (req, res) {
        let id = req.params.id;
        SnapshotModel.findOne({ _id: id }, function (err, Snapshot) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Snapshot.',
                    error: err
                });
            }
            if (!Snapshot) {
                return res.status(404).json({
                    message: 'No such Snapshot'
                });
            }
            return res.json(Snapshot);
        });
    },

    /**
     * SnapshotController.show_via_snapshotNumber()
     */
    show_via_details: function (req, res) {
        let user = req.params.user;
        let timestamp = req.params.timestamp;
        SnapshotModel.findOne({ user: user, timestamp: timestamp }, function (err, Snapshot) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Snapshot.',
                    error: err
                });
            }
            if (!Snapshot) {
                return res.status(404).json({
                    message: 'No such Snapshot'
                });
            }
            return res.json(Snapshot);
        });
    },

    /**
      * SnapshotController.create()
      */
    /*
     * Will not allow duplicate snapshots at same time by same user
     */
    create: function (req, res) {
        let newSnapshot = new SnapshotModel({
            user: req.body.user,
            timestamp: req.body.timestamp,
            text: req.body.text,
            error: req.body.error
        })
        SnapshotModel.findOne({ user: newSnapshot.user, timestamp: newSnapshot.timestamp }, function (err, Snapshot) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating snapshot.',
                    error: err
                });
            }
            if (Snapshot != null) {
                return res.status(409).json({
                    message: 'A snapshot with this information already exists',
                });
            }
            else {
                Snapshot = newSnapshot
                Snapshot.save(function (err, Snapshot) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating Snapshot',
                            error: err
                        });
                    }
                    return res.status(201).json(Snapshot);
                });
            }
        });
    },

    /**
     * SnapshotController.remove()
     */
    remove: function (req, res) {
        let token = req.headers['x-access-token'];

        // verify.isAdmin(token).then(function (answer) {
        //     if (!answer) {
        //         res.status(401).send('Error 401: Not authorized');
        //     }
        //     else {
        //         let id = req.params.id;
        //         SnapshotModel.findByIdAndRemove(id, function (err, Snapshot) {
        //             if (err) {
        //                 return res.status(500).json({
        //                     message: 'Error when deleting the Snapshot.',
        //                     error: err
        //                 });
        //             }
        //             return res.status(200).json();
        //         });
        //     }
        // })

    },

    /**
     * SnapshotController.remove_via_snapshotNumber()
     */
    remove_via_snapshotNumber: function (req, res) {
        let token = req.headers['x-access-token'];

        verify.isAdmin(token).then(function (answer) {
            if (!answer) {
                res.status(401).send('Error 401: Not authorized');
            }
            else {
                let snapshotNumber = req.params.snapshotNumber;
                SnapshotModel.deleteOne({ snapshotNumber: snapshotNumber }, function (err, Snapshot) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when deleting the Snapshot.',
                            error: err
                        });
                    }
                    return res.status(200).json();
                });
            }
        })

    }
};