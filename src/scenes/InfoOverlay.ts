import Phaser from "phaser"
import { ConstantsTiles, LogConstant } from "~/utils/Const"
import { Global } from "~/utils/Global"
import KeysGenerator from "~/utils/KeysGenerator"
import Log from "~/utils/Log"
import Game from './Game'

export default class InfoOverlay extends Phaser.Scene {
    private veil!: Phaser.GameObjects.Graphics

    private veilX!: number
    private veilWidth!: number

    
    private textColor = "#000000"

    constructor() {
        super({key: 'info'})
    }

    create() {
        Log.addInformation(LogConstant.PAUSE, { state: true })

        this.veilX = this.game.canvas.width * 3/4
        this.veilWidth = this.game.canvas.width - this.veilX

        this.veil = this.add.graphics({ 
            x:0, 
            y:0, 
            fillStyle:{
                color: 0x000000,
                alpha: 0.9
            }
        })
        this.veil.fillRect(this.veilX, 0, this.veilWidth, this.game.canvas.height)
        this.veil.setScrollFactor(0)


        const space = 120
        const firstY = 10
        this.add.text(this.veilX + 10, firstY, `Tile theme:\n${Global.tileset}`)
            .setColor(this.textColor)
            .setBackgroundColor("#000000")
            .setColor("#FFFFFF")
            .setAlpha(0.7)
            .setAlign("left")


        this.addText(10, firstY + 40, "Walls represent \nthe security \n(vulnerabilities)")

        const wallFirstY = firstY + 40 + 40
        for(let i = 0; i < 10; i++){
            this.add.image(this.veilX + 20 + 16*i, firstY + wallFirstY, Global.tileset, ConstantsTiles.WALL_TIP + ConstantsTiles.tileDistance * Math.floor(i/2))
            this.add.image(this.veilX + 20 + 16*i, firstY + wallFirstY + 16, Global.tileset, ConstantsTiles.WALL_FACE + ConstantsTiles.tileDistance * Math.floor(i/2))
        }

        this.addText(10, firstY + space + 10, "Ground Tiles \nrepresent the \nreliability (bugs)")
        const groundFirstY = firstY + space + 60
        for(let i = 0; i < 10; i++){
            this.add.image(this.veilX + 20 + 16*i, firstY + groundFirstY, Global.tileset, ConstantsTiles.GROUND_CLEAN + ConstantsTiles.tileDistance * Math.floor(i/2))
            this.add.image(this.veilX + 20 + 16*i, firstY + groundFirstY + 16, Global.tileset, ConstantsTiles.GROUND_CLEAN + ConstantsTiles.tileDistance * Math.floor(i/2))
        }

        this.addText(10, firstY + 2 * space, "Cracks represent \nthe reliability \n(code smells)")

        const crackFirstY = firstY + 2 * space + 50
        const crackAlpha = 0.6
        for(let i = 0; i < 10; i++){
            this.add.image(this.veilX + 20 + 16*i, firstY + crackFirstY, Global.tileset, ConstantsTiles.GROUND_CRACK + ConstantsTiles.tileDistance * Math.floor(i/2))
            this.add.image(this.veilX + 20 + 16*i, firstY + crackFirstY + 16, Global.tileset, ConstantsTiles.GROUND_CRACK + ConstantsTiles.tileDistance * Math.floor(i/2))
            this.add.image(this.veilX + 20 + 16*i, firstY + crackFirstY, "crack").setAlpha(crackAlpha)
            this.add.image(this.veilX + 20 + 16*i, firstY + crackFirstY + 16, "crack").setAlpha(crackAlpha)
        }

        this.addText(10, firstY + 3 * space, "Code smells \nmonsters")
        const monsterStartX = this.veilX + 35
        const monsterSpace = 30
        const code_smellsY = firstY + 3 * space + 50
        this.add.image(monsterStartX, code_smellsY, "small_medium_monsters", 5)
        this.add.image(monsterStartX + monsterSpace, code_smellsY, "small_medium_monsters", 41)
        this.add.image(monsterStartX + 2*monsterSpace, code_smellsY, "big_monsters", 4)



        this.addText(10, firstY + 3.7 * space, "Bugs monsters")
        const bugsY = firstY + 3.7 * space + 30
        this.add.image(monsterStartX, bugsY, "small_medium_monsters", 17)
        this.add.image(monsterStartX + monsterSpace, bugsY, "small_medium_monsters", 53)
        this.add.image(monsterStartX + 2*monsterSpace, bugsY, "big_monsters", 16)



        this.addText(10, firstY + 4.2 * space, "Vulnerabilities \nmonsters")
        const vulnerabilitiesY = firstY + 4.2 * space + 50
        this.add.image(monsterStartX, vulnerabilitiesY, "small_medium_monsters", 29)
        this.add.image(monsterStartX + monsterSpace, vulnerabilitiesY, "small_medium_monsters", 65)
        this.add.image(monsterStartX + 2*monsterSpace, vulnerabilitiesY, "big_monsters", 28)

        KeysGenerator.generateZQSD(this)
    }
    
    addText(x: number, y: number, text: string): Phaser.GameObjects.Text{
        return this.add.text(this.veilX + x, y, text)
            .setColor(this.textColor)
            .setBackgroundColor("#FFFFFF")
            .setAlpha(0.7)
            .setAlign("center")
    }

    addKey(x: number, y: number, keyName: string, caption?:string, large:boolean = false, captionColor:string = this.textColor){
        let keyId = "key"

        if(large){
            keyId = "large_key"
        }

        this.add.image(x, y, keyId).setAlpha(0.7).setOrigin(0.5, 0.5)
        this.add.text(x, y - 0.5, keyName).setOrigin(0.5, 0.5).setScale(0.5).setColor(this.textColor)
        if(caption){
            this.add.text(
                x, y - 0.8 * Game.TILE_SIZE, 
                caption).setScale(0.5).setOrigin(0.5, 0.5).setColor(captionColor)
                .setBackgroundColor('#FFFFFF')
                .setAlpha(0.7)
        }
    }
}