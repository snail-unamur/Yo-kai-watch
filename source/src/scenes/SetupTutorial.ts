import { LogConstant, TileSetName } from "~/utils/Const";
import { Global } from "~/utils/Global";
import Log from "~/utils/Log";

export default class SetupTutorial extends Phaser.Scene {
    
    private issues: {
        "severity": string,
        "component": string,
        "debt": string,
        "type": string
    }[] = []

    private tutorialLayout: {
        children:any[],
        name:string,
        type:string,
        path:string,
        key:string,
        measures:any[]
    }[] = []

    private key:string = "project-key-example"

    constructor() {
        super('setup-tutorial')
    }

    preload(){
        this.resetData()

        let types = ['CODE_SMELL', "BUG", "VULNERABILITY"]
        let severities = ['INFO', 'MAJOR', 'CRITICAL']


        types.forEach(type => {
            severities.forEach(severity => {
                this.tutorialLayout[0].children.push(this.createFileChild(`${severity}_${type}.file`))

                this.issues.push({
                    severity: severity,
                    component: this.tutorialLayout[0].children[this.tutorialLayout[0].children.length - 1].key,
                    debt: "1min",
                    type: type
                })
            })
        })


        this.tutorialLayout[0].children.push(this.createFileChild('file_example.js'))
        this.tutorialLayout[0].children.push(this.createFileChild('file_example (1).js'))

        // let settings = this.createFileChild('settings')
        // settings["children"] = []
        // this.tutorialLayout[0].children.push(settings)
        
        // TileSetName.tilesets.forEach((tilesetName, index) => {
        //     let c = this.createFileChild(tilesetName)
        //     let i = 0
        //     c.measures.find(el => {
        //         i++
        //         return el.metric === "reliability_rating"
        //     })
        //     i--
        //     c.measures[i].value = `${Math.floor(Math.random()*5)}.0`

        //     i = 0
        //     c.measures.find(el => {
        //         i++
        //         return el.metric === "security_rating"
        //     })
        //     i--
        //     c.measures[i].value = `${Math.floor(Math.random()*5)}.0`
        //     settings["children"]?.push(c)
        // })
    }

    create() {
        Global.fileTree = this.tutorialLayout
        Global.issues = this.issues

        Log.addInformation(LogConstant.TUTORIAL_LOADED)

        console.log(`Tutorial setup`)
        console.log("File tree", JSON.parse(JSON.stringify(Global.fileTree)))
        console.log("Issues", JSON.parse(JSON.stringify(Global.issues)))

        this.scene.run('game-ui', { roomFile: "root" })
        this.scene.start('tutorial', { 
            mapContext: {
                file: Global.fileTree[0],
                path: [0],
                selected: "root",
                selectedId:-1
            }
        })
    }

    createFileChild(name: string){
        let child: {
            name:string,
            type:string,
            path:string,
            key:string,
            measures:any[],
            id:number
        } = {
            "id": 0,
            "name": "small_demon_room.js",
            "type": "FIL",
            "path": "root/small_demon_room.js",
            "key": "project-key-example:small_demon_room.js",
            "measures": [
                {
                    "metric": "reliability_rating",
                    "value": "1.0",
                    "bestValue": true
                },
                {
                    "metric": "security_rating",
                    "value": "1.0",
                    "bestValue": true
                },
                {
                    "metric": "sqale_rating",
                    "value": "1.0",
                    "bestValue": true
                },
                {
                    "metric": "code_smells",
                    "value": "0",
                    "bestValue": true
                },
                {
                    "metric": "bugs",
                    "value": "0",
                    "bestValue": true
                },
                {
                    "metric": "reliability_remediation_effort",
                    "value": "0",
                    "bestValue": true
                },
                {
                    "metric": "security_remediation_effort",
                    "value": "0",
                    "bestValue": true
                },
                {
                    "metric": "vulnerabilities",
                    "value": "0",
                    "bestValue": true
                },
                {
                    "metric": "sqale_index",
                    "value": "0",
                    "bestValue": true
                }
            ]
        }

        child.name = name
        child.path = `root/${child.name}`
        child.key = `${this.key}:root/${child.name}`
        child.id = this.tutorialLayout[0].children.length

        return child
    }

    resetData(){
        this.tutorialLayout = [{
            "name": "root",
            "type": "TRK",
            "path": "root",
            "key": this.key,
            "measures": [
                {
                    "metric": "security_remediation_effort",
                    "value": "0",
                    "bestValue": true
                },
                {
                    "metric": "sqale_index",
                    "value": "0",
                    "bestValue": true
                },
                {
                    "metric": "sqale_rating",
                    "value": "1.0",
                    "bestValue": true
                },
                {
                    "metric": "bugs",
                    "value": "0",
                    "bestValue": true
                },
                {
                    "metric": "reliability_remediation_effort",
                    "value": "0",
                    "bestValue": true
                },
                {
                    "metric": "reliability_rating",
                    "value": "4.0",
                    "bestValue": true
                },
                {
                    "metric": "code_smells",
                    "value": "0",
                    "bestValue": true
                },
                {
                    "metric": "security_rating",
                    "value": "4.0",
                    "bestValue": true
                },
                {
                    "metric": "vulnerabilities",
                    "value": "0",
                    "bestValue": true
                }
            ],
            "children": []
        }]
        this.issues = []
    }
}
