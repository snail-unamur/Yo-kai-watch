import express from 'express';
import cors from 'cors';
import { getSonarqubeData, makeTree } from './utils.js';

const app = express();
let tree;

app.use(cors(
    {
        origin: 'http://localhost:8000',
    }
));

app.get('/metrics', async (req, res) => {
    const project = req.query.project;

    if(!tree){
        // Get sonarqube data
        const sqData = await getSonarqubeData(project, 1, []);
        
        // Convert to data structure
        tree = makeTree(sqData);
    }
    
    res.json(tree);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => { console.log(`Server started on port ${PORT}`)});

