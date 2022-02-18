import Phaser from "phaser"
import { sceneEvents } from "~/events/EventCenter"
import FileContainer from "./FileContainer"

export default class GameUI extends Phaser.Scene {
    private hearts!: Phaser.GameObjects.Group
    private roomFile!: Phaser.GameObjects.Text
    private tileFile!: Phaser.GameObjects.Text

    constructor() {
        super({key: 'game-ui'})
    }

    create(data:{ roomFile: string }) {
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

        sceneEvents.on('player-damage', this.handlePlayerDamage, this)
        sceneEvents.on('tile-file-update', this.handleTileFileUpdate, this)

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off('player-damage', this.handlePlayerDamage, this)
            sceneEvents.off('tile-file-update', this.handleTileFileUpdate, this)
        })
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