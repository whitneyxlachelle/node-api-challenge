const express = require('express');
const action = require('../data/helpers/actionModel');
const project = require('../data/helpers/projectModel');

const router = express.Router();

//When adding an action, make sure the project_id 
//provided belongs to an existing project

// Retrieve actions
router.get('/', (req, res) => {
    action.get()
        .then((actions) => {
            res.status(200).json(actions)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                message: "Error retrieving actions.",
            });
        })
})

// Retrieves action by id
router.get('/:id', validateActionId(), (req, res) => {
    action.get(req.params.id)
        .then((action) => {
            res.status(200).json(action)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                message: "Error retrieving action by id.",
            });
        })
})

// Adds a new action
router.post('/', (req, res) => {
    const addAction = {
        project_id: req.body.project_id,
        description: req.body.description,
        notes: req.body.notes
    };
    action.insert(addAction)
        .then(() => {
            res.status(201).json({
                message: "Added a new action.",
            })
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                message: "Error adding action",
            });
        })
});

// Updates an action
router.put('/:id', validateActionId(), validateProjectId(), (req, res) => {
    action.update(req.params.id, req.body)
        .then((action) => {
            res.status(200).json(action)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                message: "Error updating action",
            });
        })
});

// Deletes an action 
router.delete('/:id', validateActionId(), (req, res) => {
    action.remove(req.params.id)
        .then(() => {
            res.status(200).json({
                message: "Action was removed.",
            });
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                message: "Error removing action",
            });
        })
})

// custome middleware
function validateActionId() {
    return (req, res, next) => {
        action.get(req.params.id)
            .then((action) => {
                if (action) {
                    req.action = action
                    next()
                } else {
                    res.status(400).json({
                        message: "invalid action id",
                    })
                }
            })
            .catch((error) => {
                next(error);
            })
    }
}

function validateProjectId() {
    return (req, res, next) => {
        const projectId = req.body.project_id;
        project.get(projectId)
            .then((project) => {
                if (project) {
                    next()
                } else {
                    res.status(400).json({
                        message: "invalid projet id",
                    })
                }
            })
            .catch((error) => {
                next(error);
            })
    }
}
module.exports = router;