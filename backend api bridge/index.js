import express from 'express'
import cors from 'cors'
import { getSonarqubeMetricData, getSonarqubeProjects, getSonarqubeProjectIssues, makeTree } from './utils.js'

const app = express()

app.use(cors(
    {
        origin: 'http://localhost:8000',
    }
))

app.get('/metrics', async (req, res) => {
    const project = req.query.project

    // Get sonarqube data
    const sqData = await getSonarqubeMetricData(project, 1, [])
    
    // Convert to data structure
    const tree = makeTree(sqData)
    
    res.json(tree)
});

app.get('/search', async (req, res) => {
    let query = req.query.query

    console.log(`Project list queried with ${query}`)
    if(!query) query = "a" // This is required otherwise the server crash when req.query.query = ""

    const sqData = await getSonarqubeProjects(query)

    console.log(sqData.length)

    res.json(sqData)
})

app.get('/issues', async (req, res) => {
    let query = req.query.project
    console.log('Retrieving issues for ' + query)

    if(!query) query = "a" // This is required otherwise the server crash when req.query.query = ""

    const sqData = await getSonarqubeProjectIssues(query)

    res.json(sqData)
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => { console.log(`Server started on port ${PORT}`)})

