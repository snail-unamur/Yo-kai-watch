import Phaser from "phaser"
import Game from "./Game"

import { MonsterConstantsSize, MonsterConstantsType } from "~/utils/Const"

export default class FileChild {
    private file!: {name: string, type: string, path: string, key: string, measures: {metric: string, value:string, bestValue: boolean}[]}
    private x: number
    private y: number
    private width: number
    private height: number

    private game: Game

    private infoString: string = ""

    constructor(file: {name: string, type: string, path: string, key: string, measures: {metric: string, value:string, bestValue: boolean}[]}, 
        game: Game, x:number, y:number, width:number, height:number){
        this.setFile(file)

        this.game = game

        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    setFile(file: {name: string, type: string, path: string, key: string, measures: {metric: string, value:string, bestValue: boolean}[]}){
        this.file = file
        this.infoString = `${this.file.name}, ${this.file.type}, ${this.file.path}, ${this.file.key}\n`
        this.file.measures.forEach(element => {
            this.infoString += `${element.metric}, ${element.value}, ${element.bestValue}\n`
        }) 
    }

    getInfoString(){
        return this.infoString
    }

    getName(){
        return this.file.name
    }

    getMonster(){
        const monsterType = MonsterConstantsType.DEMON
        const monsterSize = MonsterConstantsSize.MEDIUM
        
        let enemy = this.game.getEnemies().get(this.x + this.width/2, this.y + this.height/2, 'player')
        enemy.setMonsterType(monsterType)
        enemy.setMonsterSize(monsterSize)
        enemy.playAnim()
        enemy.input.hitArea = new Phaser.GameObjects.Rectangle(this.game, enemy.body.offset.x, enemy.body.offset.y, enemy.body.width, enemy.body.height)

        return enemy
    }

}