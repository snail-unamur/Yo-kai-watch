import Phaser from "phaser"
import Game from "./Game"

import { MonsterConstantsSize, MonsterConstantsType } from "~/utils/Const"
import Monster from "~/enemies/Monster"
import { sceneEvents } from "~/events/EventCenter"

export default class FileChild {
    private file!: {id: number, name: string, type: string, path: string, key: string, measures: {metric: string, value:string, bestValue: boolean}[]}
    private x: number
    private y: number
    private width: number
    private height: number

    private game: Game

    private infoString: string = ""

    static projectIssues: {
        component:string,
        type:string, 
        severity:string,
        debt:string
    }[] = []

    private issues: {
        component:string,
        type:string, 
        severity:string,
        debt:string
    }[] = []

    private totalNbIssues: number = 0

    private textObject: Phaser.GameObjects.Text
    private nbMonsterText: Phaser.GameObjects.Text

    constructor(file: {id: number, name: string, type: string, path: string, key: string, measures: {metric: string, value:string, bestValue: boolean}[]}, 
        game: Game, x:number, y:number, width:number, height:number){
        this.setFile(file)

        this.game = game

        let string = file.name
        // let list_ = file.name.match(/.{1,12}/g)
        // let string = ""

        // list_!.forEach(el => {
        //     string += el + "\n"
        // })

        // string = string.slice(0, -1)

        this.textObject = this.game.add.text(x + width/2, y + 16, string)
            .setScale(0.5).setOrigin(0.5).setDepth(6)
            .setAlpha(1).setBackgroundColor('black')
            .setVisible(false)
            .setAlign('center')
            .setLineSpacing(2)

        let nbMonsterTextOffest = 6
        this.nbMonsterText = this.game.add.text(x + nbMonsterTextOffest, y + nbMonsterTextOffest, "")
        this.nbMonsterText.setScale(0.5).setOrigin(0).setAlpha(0.7).setColor("#000000").setFontStyle("bold")
        //this.nbMonsterText.setDepth(6)


        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.initIssues()
    }

    setFile(file: {id: number, name: string, type: string, path: string, key: string, measures: {metric: string, value:string, bestValue: boolean}[]}){
        this.file = file
        this.updateInfoString()

        // this.infoString = `${this.file.name}, ${this.file.type}, ${this.file.path}, ${this.file.key}\n`
        // if(this.file.measures){
        //     this.file.measures.forEach(element => {
        //         this.infoString += `${element.metric}, ${element.value}, ${element.bestValue}\n`
        //     }) 
        // }
    }

    updateInfoString(){
        this.infoString = `${this.file.name}\n${this.issues.length}/${this.totalNbIssues}`
    }

    showName(value:boolean = true){
        this.textObject.setVisible(value)
    }

    getFile(){
        return this.file
    }

    getInfoString(){
        return this.infoString
    }

    getName(){
        return this.file.name
    }

    getMonster(): Monster | null{
        this.updateText()
        let issue = this.issues.pop()
        if(!issue) return null
        
        let enemy: Monster = this.game.getEnemies().get(this.x + this.width/2, this.y + this.height/2, 'player') // Why "player" here?
        enemy.setIssue(issue)
        enemy.input.hitArea = new Phaser.GameObjects.Rectangle(this.game, enemy.body.offset.x, enemy.body.offset.y, enemy.body.width, enemy.body.height)

        return enemy
    }

    initIssues(){
        FileChild.projectIssues.forEach((element: { component:string, type:string, severity:string, debt:string }) => {
            if(element.component.startsWith(this.file.key)){
                this.issues.push(element)
            }
        })
        this.totalNbIssues = this.issues.length
        this.updateText()
        sceneEvents.emit("monster-add", this.issues.length)
    }

    updateText(){
        if(this.totalNbIssues > 0){
            this.nbMonsterText.setText(`${this.issues.length}/${this.totalNbIssues}`)
            this.textObject.setText(`${this.file.name}\n${this.issues.length}/${this.totalNbIssues}`)
            this.updateInfoString()
        } 
    }
    
    setIssues(issues: {
        component:string,
        type:string, 
        severity:string,
        debt:string
    }[]){
        this.issues = issues
    }
}