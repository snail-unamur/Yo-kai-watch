import Phaser from "phaser"
import { sceneEvents } from "~/events/EventCenter"
import Log from "~/utils/Log"
import FileContainer from "./FileContainer"

export default class GameUI extends Phaser.Scene {
    private hearts!: Phaser.GameObjects.Group
    private roomFile!: Phaser.GameObjects.Text
    private tileFile!: Phaser.GameObjects.Text
    private nbMonsterText!: Phaser.GameObjects.Text

    private nbMonster: number = 0
    
    constructor() {
        super({key: 'game-ui'})
    }

    create(data:{ roomFile: string }) {
        console.log("start game UI")
        this.hearts = this.add.group({
            classType: Phaser.GameObjects.Image
        })

        this.hearts.createMultiple({
            key: 'ui_heart_full',
            setScale: { x: 2, y: 2 },
            setXY: {
                x: 20,
                y: 15,
                stepX: 32
            },
            quantity: 3
        })

        this.roomFile = this.add.text(5, 35, data.roomFile)
        this.tileFile = this.add.text(5, 55, "NaN")
        this.nbMonsterText = this.add.text(5, 75, this.nbMonster.toString())


        sceneEvents.on('player-damage', this.handlePlayerDamage, this)
        sceneEvents.on('player-dead-ui', this.handlePlayerDead, this)
        sceneEvents.on('tile-file-update', this.handleTileFileUpdate, this)
        sceneEvents.on('room-file-update', this.handleRoomFileUpdate, this)

        sceneEvents.on('monster-reset', this.handleMonsterReset, this)
        sceneEvents.on('monster-add', this.handleMonsterAdd, this)
        sceneEvents.on('monster-killed', this.handleMonsterKill, this)

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off('player-damage', this.handlePlayerDamage, this)
            sceneEvents.off('player-dead-ui', this.handlePlayerDead, this)
            sceneEvents.off('tile-file-update', this.handleTileFileUpdate, this)
            sceneEvents.off('room-file-update', this.handleRoomFileUpdate, this)

            sceneEvents.off('monster-reset', this.handleMonsterReset, this)
            sceneEvents.off('monster-add', this.handleMonsterAdd, this)
            sceneEvents.off('monster-killed', this.handleMonsterKill, this)
        })
    }

    private handlePlayerDead(){
        console.log("UI player dead")
        this.hearts.children.each((go: Phaser.GameObjects.GameObject, idx) => {
            const heart = go as Phaser.GameObjects.Image
            heart.setTexture('ui_heart_full')
        })
    }

    private updateMonsterText(){
        this.nbMonsterText.setText(this.nbMonster.toString())
    }

    private handleMonsterReset(){
        this.nbMonster = 0
        this.updateMonsterText()
    }

    private handleMonsterAdd(nbMonster: number){
        this.nbMonster += nbMonster
        this.updateMonsterText()
    }

    private handleMonsterKill(){
        this.nbMonster--
        this.updateMonsterText()
    }

    private handleRoomFileUpdate(newName:string){
        this.roomFile.setText(newName)
    }

    private handleTileFileUpdate(newName:string){
        this.tileFile.setText(newName)
    }

    private handlePlayerDamage(health: number) {
        this.hearts.children.each((go: Phaser.GameObjects.GameObject, idx) => {
            const heart = go as Phaser.GameObjects.Image
            if (idx < health) {
                heart.setTexture('ui_heart_full')
            } else {
                heart.setTexture('ui_heart_empty')
            }
        })
    }
}