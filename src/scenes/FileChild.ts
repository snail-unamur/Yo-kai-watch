import Phaser from "phaser"
import Game from "./Game"

import { MonsterConstantsSize, MonsterConstantsType } from "~/utils/Const"

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
        severity:string
    }[] = []

    private issues: {
        component:string,
        type:string, 
        severity:string
    }[] = []

    constructor(file: {id: number, name: string, type: string, path: string, key: string, measures: {metric: string, value:string, bestValue: boolean}[]}, 
        game: Game, x:number, y:number, width:number, height:number){
        this.setFile(file)

        this.game = game

        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.initIssues()
    }

    setFile(file: {id: number, name: string, type: string, path: string, key: string, measures: {metric: string, value:string, bestValue: boolean}[]}){
        this.file = file
        this.infoString = `${this.file.name}, ${this.file.type}, ${this.file.path}, ${this.file.key}\n`
        if(this.file.measures){
            this.file.measures.forEach(element => {
                this.infoString += `${element.metric}, ${element.value}, ${element.bestValue}\n`
            }) 
        }
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

    getMonster(){
        let issue = this.issues.pop()
        if(!issue) return

        let monsterType = MonsterConstantsType.ZOMBIE
        switch(issue.type){
            case 'CODE_SMELL':
                monsterType = MonsterConstantsType.ZOMBIE
                break
            case 'BUG':
                monsterType = MonsterConstantsType.GOBLIN
                break
            case 'VULNERABILITY':
                monsterType = MonsterConstantsType.DEMON
                break
        }

        let monsterSize = MonsterConstantsSize.MEDIUM
        switch(issue.severity){
            case 'INFO':
                monsterSize = MonsterConstantsSize.TINY
                break
            case 'MINOR':
                monsterSize = MonsterConstantsSize.MEDIUM
                break
            case 'MAJOR':
                monsterSize = MonsterConstantsSize.BIG
                break
            case 'CRITICAL':
                monsterSize = MonsterConstantsSize.BIG
                break
        }
        
        let enemy = this.game.getEnemies().get(this.x + this.width/2, this.y + this.height/2, 'player') // Why "player" here?
        enemy.setMonsterType(monsterType)
        enemy.setMonsterSize(monsterSize)
        enemy.playAnim()
        enemy.input.hitArea = new Phaser.GameObjects.Rectangle(this.game, enemy.body.offset.x, enemy.body.offset.y, enemy.body.width, enemy.body.height)

        return enemy
    }

    initIssues(){
        FileChild.projectIssues.forEach((element:{ component:string, type:string, severity:string }) => {
            if(element.component.startsWith(this.file.key)){
                this.issues.push(element)
            }
        })
    }

}