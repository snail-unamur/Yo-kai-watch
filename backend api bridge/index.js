import express from 'express'
import cors from 'cors'
import { getSonarqubeMetricData, getSonarqubeProjects, makeTree } from './utils.js'

const app = express()
let tree

app.use(cors(
    {
        origin: 'http://localhost:8000',
    }
))

app.get('/metrics', async (req, res) => {
    const project = req.query.project

    if(!tree){
        // Get sonarqube data
        const sqData = await getSonarqubeMetricData(project, 1, [])
        
        // Convert to data structure
        tree = makeTree(sqData)
    }
    
    res.json(tree)
});

app.get('/search', async (req, res) => {
    const query = req.query.query

    const sqData = await getSonarqubeProjects(query)

    res.json(sqData)
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => { console.log(`Server started on port ${PORT}`)})

