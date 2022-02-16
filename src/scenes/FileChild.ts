import Phaser from "phaser"
import Game from "./Game"

import { MonsterConstantsSize, MonsterConstantsType } from "~/utils/Const"

export default class FileChild {
    private file: {name: string, type: string, path: string, key: string, measures: {metric: string, value:string, bestValue: boolean}[]}
    private x: number
    private y: number
    private width: number
    private height: number

    private game: Game

    constructor(file: {name: string, type: string, path: string, key: string, measures: {metric: string, value:string, bestValue: boolean}[]}, 
        game: Game, x:number, y:number, width:number, height:number){
        this.file = file

        this.game = game

        this.x = x
        this.y = y
        this.width = width
        this.height = height
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