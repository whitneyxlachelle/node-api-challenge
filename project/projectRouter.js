const express = require('express');
const project = require('../data/helpers/projectModel');

const router = express.Router();

// Retrieves projects
router.get('/', (req, res) => {
    project.get()
        .then((projects) => {
            res.status(200).json(projects)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                message: "Error retrieving projects.",
            });
        })
});

// Retrieves project by id
router.get("/:id", validateProjectId(), (req, res) => {
    project.get(req.params.id)
        .then((project) => {
            res.status(200).json(project);
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                message: "Error retrieving project.",
            });
        })
});

// Retrieves list of actions
router.get('/:id/action', validateProjectId(), (req, res) => {
    project.getProjectActions(req.params.id)
        .then((actions) => {
                res.status(200).json(actions)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                message: "Error retrieving projects.",
            });
        })
})

// This will create a project
router.post("/", validateProject(), (req, res) => {
    project.insert(req.body)
        .then((project) => {
            res.status(201).json(project)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                message: "Error retrieving unable to add project.",
            });
        })
});

// This will update project
router.put('/:id', validateProjectId(), validateProject(), (req, res) => {
    project.update(req.params.id, req.body)
        .then((project) => {
            res.status(200).json(project)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                message: "Error updating project.",
            });
        })
});

// This will remove project
router.delete('/:id', validateProjectId(), (req, res) => {
    project.remove(req.params.id)
        .then(() => {
            res.status(200).json({
                message: "Project was removed.",
            })
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({
                message: "Error removing project.",
            });
        })
})

// custome middleware
function validateProjectId() {
    return (req, res, next) => {
        project.get(req.params.id)
            .then((project) => {
                if (project) {
                    req.project = project
                    next()
                } else {
                    res.status(400).json({
                        message: "invalid project id",
                    })
                }
            })
            .catch((error) => {
                next(error);
            })
    }
}

function validateProject() {
    return (req, res, next) => {
        if (!req.body) {
            return res.status(400).json({
                message: "missing project data",
            })
        } else if (!req.body.name || !req.body.description) {
            return res.status(400).json({
                message: "missing required text field",
            })
        } else {
            next();
        }
    }
}

module.exports = router;

