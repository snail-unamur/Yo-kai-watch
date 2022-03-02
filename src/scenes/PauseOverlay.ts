import Phaser from "phaser"
import { LogConstant } from "~/utils/Const"
import Log from "~/utils/Log"
import Game from './Game'

export default class PauseOverlay extends Phaser.Scene {
    private veil!: Phaser.GameObjects.Graphics

    private tutorialButton!: Phaser.GameObjects.Rectangle
    private tutorialText!: Phaser.GameObjects.Text

    private exitButton!: Phaser.GameObjects.Rectangle
    private exitText!: Phaser.GameObjects.Text

    private resumeButton!: Phaser.GameObjects.Rectangle
    private resumeText!: Phaser.GameObjects.Text

    private game_!: Game

    private isPause: boolean = false

    constructor() {
        super({key: 'pause'})
    }

    create(data:{ game:Game }) {
        const buttonColor = 0x202020
        Log.addInformation(LogConstant.PAUSE, { state: true })
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on('down', this.onResume, this)
        this.game_ = data.game

        this.veil = this.add.graphics({ 
            x:0, 
            y:0, 
            fillStyle:{
                color: 0x000000,
                alpha: 0.6
            }
        })
        this.veil.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height)
        this.veil.setScrollFactor(0)


        // EXIT TO PROJECT SELECTION
        this.exitButton = this.add.rectangle(this.game.canvas.width/2, this.game.canvas.height * 0.5, 300, 100, buttonColor).setOrigin(0.5)
        this.exitButton.setInteractive()
        this.exitButton.on('pointerdown', this.onGoProjectSelection, this)

        this.exitText = this.add.text(this.game.canvas.width/2, this.game.canvas.height * 0.5, 'PROJECT SELECTION').setOrigin(0.5)



        // EXIT TO TUTORIAL
        this.tutorialButton = this.add.rectangle(this.game.canvas.width/2, this.game.canvas.height * 0.7, 300, 100, buttonColor).setOrigin(0.5)
        this.tutorialButton.setInteractive()
        this.tutorialButton.on('pointerdown', this.onGoTutorial, this)

        this.tutorialText = this.add.text(this.game.canvas.width/2, this.game.canvas.height * 0.7, 'TUTORIAL').setOrigin(0.5)



        // RESUME
        this.resumeButton = this.add.rectangle(this.game.canvas.width/2, this.game.canvas.height * 0.3, 300, 100, buttonColor).setOrigin(0.5)
        this.resumeButton.setInteractive()
        this.resumeButton.on('pointerdown', this.onResume, this)
        
        this.resumeText = this.add.text(this.game.canvas.width/2, this.game.canvas.height * 0.3, 'RESUME').setOrigin(0.5)
    }

    onExit(sceneName:string = "menu_projects"){
        Log.addInformation(LogConstant.EXIT)
        Log.sendResult()
        this.game_.scene.stop("game-ui")
        this.game_.scene.stop()
        this.scene.start(sceneName)
        console.log("exit pause screen")
    }

    onGoProjectSelection(){
        this.onExit()
    }

    onGoTutorial(){
        this.onExit("setup-tutorial")
    }

    onResume(){
        Log.addInformation(LogConstant.PAUSE, { state: false })
        this.game_.scene.resume()
        this.scene.stop()
        console.log("resume game")
    }
}