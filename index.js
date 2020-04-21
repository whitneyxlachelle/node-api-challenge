const express = require('express');
const projectRouter = require('./project/projectRouter');
const actionRouter = require('./action/actionRouter');

const server = express();
const port = 3000; 

server.use(express.json());

server.use('/project', projectRouter);
server.use('/action', actionRouter);

server.use("/", (req, res) => {
    res.send('API is running')
});

server.listen(port, () => {
console.log(`API is running at http://localhost:${port}`)
});



