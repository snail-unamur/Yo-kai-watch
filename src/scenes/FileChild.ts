import Phaser from "phaser"
import Game from "./Game"

import { MonsterConstantsSize, MonsterConstantsType } from "~/utils/Const"
import Monster from "~/enemies/Monster"
import { sceneEvents } from "~/events/EventCenter"

export default class FileChild {
    private file!: {id: number, name: string, type: string, path: string, key: string, measures: {metric: string, value:string, bestValue: boolean}[], children:any[]|undefined}
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
        debt:string, 
        key:string
    }[] = []

    private issues: {
        component:string,
        type:string, 
        severity:string,
        debt:string,
        key:string
    }[] = []

    private totalNbIssues: number = 0

    private textObject: Phaser.GameObjects.Text
    private nbMonsterText: Phaser.GameObjects.Text

    constructor(file: {id: number, name: string, type: string, path: string, key: string, measures: {metric: string, value:string, bestValue: boolean}[], children:any[]|undefined}, 
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

        this.textObject = this.game.add.text(x + width/2, y - 4, string)
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

    getX(): number{
        return this.x
    }

    getY(): number{
        return this.y
    }

    getWidth(): number{
        return this.width
    }

    getHeight(): number{
        return this.height
    }

    setFile(file: {id: number, name: string, type: string, path: string, key: string, measures: {metric: string, value:string, bestValue: boolean}[], children:any[]|undefined}){

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
        // this.textObject.setVisible(value)
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

    hasMonster(): boolean{
        return this.issues.length !== 0
    }

    getMonster(center:boolean=false): Monster | null{
        let issue = this.issues.pop()
        this.updateText()
        if(!issue) return null
        
        // Add a bit of random for the spawn position
        let ratioConstant = 0.5
        if(center) ratioConstant = 0
        let ratio = 2
        let mX = Math.floor((Math.random()*ratioConstant+(1-ratioConstant)/2)*(this.width/ratio))*ratio
        let mY = Math.floor((Math.random()*ratioConstant+(1-ratioConstant)/2)*(this.height/ratio))*ratio

        let enemy: Monster = this.game.getEnemies().get(this.x + mX, this.y + mY, 'player') // Why "player" here? Anyway it will be overwritten by the animation
        enemy.setIssue(issue)
        enemy.input.hitArea = new Phaser.GameObjects.Rectangle(this.game, enemy.body.offset.x, enemy.body.offset.y, enemy.body.width, enemy.body.height)

        return enemy
    }

    initIssues(){
        let k = this.file.key
        if(this.file.children){
            k = this.file.key + "/"
        }
        FileChild.projectIssues.forEach((element: { component:string, type:string, severity:string, debt:string, key:string }) => {
            if(element.component.startsWith(k)){
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
        debt:string, 
        key:string
    }[]){
        this.issues = issues
    }
}