import { LogConstant } from "~/utils/Const";
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

    private childExample = {
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

    private key:string = ""

    constructor() {
        super('setup-tutorial');
    }

    preload(){
        this.resetTutorialLayout()
        this.key = this.tutorialLayout[0].key

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
        this.tutorialLayout[0].children.push(this.createFileChild('file_example.js'))


        Global.fileTree = this.tutorialLayout
        Global.issues = this.issues

    }

    createFileChild(name: string){
        let child = JSON.parse(JSON.stringify(this.childExample))

        child.name = name
        child.path = `root/${child.name}`
        child.key = `${this.key}:root/${child.name}`
        child.id = this.tutorialLayout[0].children.length

        return child
    }

    create() {
        Log.addInformation(LogConstant.TUTORIAL_LOADED)
        console.log("tuto setup")
        this.scene.start('tutorial')
    }

    resetTutorialLayout(){
        this.tutorialLayout = [{
            "name": "root",
            "type": "TRK",
            "path": "root",
            "key": "project-key-example",
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




