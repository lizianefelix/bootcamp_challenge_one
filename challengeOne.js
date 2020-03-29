const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

//middlewares
server.use((req, res, next) => {
    console.count("Qtd Requests");

    return next();
});

function checkIdExists(req, res, next) {
    const idExists = projects.find(project => project.id == req.params.id);

    if (!idExists) {
        return res.status(400).json({ error: "ID não existe" });
    }

    return next();
}

server.get('/projects', (req, res) => {
    return res.json(projects);
});

server.post('/projects', (req, res) => {
    const { id, title } = req.body;

    projects.push({ id, title, tasks: [] });

    return res.json(projects);
});

server.post('/projects/:id/tasks', checkIdExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(projectId => projectId.id == id);

    project.tasks.push(title);

    return res.json(project);
});

server.put('/projects/:id', checkIdExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(projectId => projectId.id == id);
    project.title = title;

    return res.json(project);
});

server.delete('/projects/:id', checkIdExists, (req, res) => {
    const { id } = req.params;

    const projectIndex = projects.findIndex(projectId => projectId.id == id);
    projects.splice(projectIndex, 1);

    return res.send();
});

server.listen(3000);