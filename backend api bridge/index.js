import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb'
import { getSonarqubeMetricData, getSonarqubeProjects, getSonarqubeProjectIssues, makeTree } from './utils.js'

const app = express()

// add json middleware
app.use(express.json())

app.use(cors(
    {
        origin: '*',
    }
))

// Mongo setup
// TODO: use ENV variables
const uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"

// Connect to Mongo
MongoClient.connect(uri, { useNewUrlParser: true }).then(
    client => {
        console.log('connected to mongo')
        const db = client.db('sonarqube')
        const collection = db.collection('analytics')
        
        // Get requests
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
            let sqData
        
            if(!query){
                sqData = []
            } else {
                sqData = await getSonarqubeProjects(query)
            } 
        
            res.json(sqData)
        })
        
        app.get('/issues', async (req, res) => {
            let query = req.query.project
            console.log('Retrieving issues for ' + query)
        
            if(!query) query = "a" // This is required otherwise the server crash when req.query.query = ""
        
            const sqData = await getSonarqubeProjectIssues(query)
        
            res.json(sqData)
        })

        // Post requests
        // Logging analytics
        app.post('/analytics', async (req, res) => {
            // log json
            collection.insertOne(req.body).then(() => {
                    res.json({status: 'success'})
                }
            ).catch(() => {
                    res.json({status: 'error'})
                }
            )
        })
        
        const PORT = process.env.PORT || 5000
        app.listen(PORT, () => { console.log(`Server started on port ${PORT}`)})
    }
).catch(console.error)
