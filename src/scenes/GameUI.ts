import Phaser from "phaser"
import { sceneEvents } from "~/events/EventCenter"

export default class GameUI extends Phaser.Scene {
    private hearts!: Phaser.GameObjects.Group

    constructor() {
        super({key: 'game-ui'})
    }

    create() {
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

        sceneEvents.on('player-damage', this.handlePlayerDamage, this)
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off('player-damage', this.handlePlayerDamage, this)
        })

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