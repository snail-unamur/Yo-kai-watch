import Phaser from "phaser"
import Log from "~/utils/Log"
import Game from './Game'

export default class PauseOverlay extends Phaser.Scene {
    private veil!: Phaser.GameObjects.Graphics
    private exitButton!: Phaser.GameObjects.Rectangle
    private resumeButton!: Phaser.GameObjects.Rectangle

    private game_!: Game

    private isPause: boolean = false

    constructor() {
        super({key: 'pause'})
    }

    create(data:{ game:Game }) {
        this.game_ = data.game

        this.veil = this.add.graphics({ 
            x:0, 
            y:0, 
            fillStyle:{
                color: 0x000000,
                alpha: 0.3
            }
        })
        this.veil.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height)
        this.veil.setScrollFactor(0)


        this.exitButton = this.add.rectangle(this.game.canvas.width/2, this.game.canvas.height*0.5, 300, 100, 0x000000)
        this.exitButton.setInteractive()
        this.exitButton.on('pointerdown', this.onExit, this)

        this.resumeButton = this.add.rectangle(this.game.canvas.width/2, this.game.canvas.height*0.7, 300, 100, 0x0000FF)
        this.resumeButton.setInteractive()
        this.resumeButton.on('pointerdown', this.onResume, this)
    }

    onExit(){
        Log.sendResult()
        this.game_.scene.stop("game-ui")
        this.game_.scene.stop()
        this.scene.start('menu_projects')
        console.log("exit pause screen")
    }

    onResume(){
        this.game_.scene.resume()
        this.scene.stop()
        console.log("resume game")
    }
}