import { createMonsterAnims } from "~/animations/MonsterAnimation";
import { createCharacterAnims } from "~/animations/PlayerAnimation";
import Monster from "~/enemies/Monster";
import { sceneEvents } from "~/events/EventCenter";
import { LogConstant } from "~/utils/Const";
import Log from "~/utils/Log";
import Game from "./Game";

export default class Tutorial extends Game{

    constructor(){
        super('tutorial')
    }



    create(data) {
        console.log('Tutorial scene started')
        
        Log.addInformation(LogConstant.START_ROOM, this.mapContext)
        sceneEvents.on('player-dead', () => {
            Log.addInformation(LogConstant.DIE, this.mapContext)
            this.scene.restart()
        })

        sceneEvents.removeAllListeners('player-dig-done')
        sceneEvents.on('player-dig-done', () => {
            Log.addInformation(LogConstant.DIG, this.mapContext)
            this.restart()
        })

        sceneEvents.removeAllListeners('player-go-up-done')
        sceneEvents.on('player-go-up-done', () => {
            Log.addInformation(LogConstant.GO_UP, this.mapContext)
            this.restart()
        })
        this.incomingMonster = []

        this.fileChildren = []
        if(data?.mapContext){
            this.mapContext = data.mapContext
            this.sonarQubeData = this.mapContext.file
        } else {
            this.sonarQubeData = this.cache.json.get('metrics')[0]
            this.mapContext = {
                file: this.sonarQubeData,
                path: [0],
                selected: "root",
                selectedId:-1
            }
        }
        //console.log(this.sonarQubeData)
        this.generation()


        // Launch UI
        this.scene.run('game-ui', { roomFile: this.mapContext.selected })

        // Create anims
        createCharacterAnims(this.anims)
        createMonsterAnims(this.anims)


        // Camera management
        let cam = this.cameras.main
        let center = Game.TILE_SIZE * this.dungeon_size / 2
        cam.centerOn(center, center)
        cam.zoom = 2
        cam.setBackgroundColor(0x202121)


        // Character
        this.player = this.add.player(center, center, 'character', 0)
        this.player.setDepth(1)
        cam.startFollow(this.player)

        // Character Sword
        this.sword = this.add.sword(this.player.x, this.player.y, 'sword', 4)

        // Enemies
        let this_game = this
        this.enemies = this.physics.add.group({
            classType: Monster,
            createCallback: (go) => {
                const enemyGo = go as Monster
                enemyGo.body.enable = false
                enemyGo.setBounce(1)
                enemyGo.setInteractive()
                enemyGo.initialize()

                enemyGo.on('pointerover', function(pointer: Phaser.Input.Pointer){
                    this_game.tooltip.setVisible(true)
                    this_game.monsterHovered = true
                    this_game.tooltip.setText(enemyGo.getInfoString())
                })

                enemyGo.on('pointerout', function(pointer){
                    this_game.monsterHovered = false
                    this_game.tooltip.setVisible(false)
                })
            }
        })

        // Player monster collider
        this.playerMonsterCollider = this.physics.add.collider(this.player, this.enemies, this.handlePlayerMonsterCollision, undefined, this)

        // Sword monster collider
        this.physics.add.overlap(this.sword, this.enemies, this.handleSwordMonsterCollision, undefined, this)
        

        
        let gameCanvas = this.sys.game.canvas
        this.freezeLayer = this.add.renderTexture(0, 0, this.dungeon_size*Game.TILE_SIZE, this.dungeon_size*Game.TILE_SIZE)
        this.freezeLayer.fill(0x000000, 0.5)
        this.freezeLayer.setDepth(5)
        this.handleFreeze()
        this.handleFreeze()



        const textStyle = {
            font: "normal 16px Arial",
            fill: '#ffffff',
            align: 'center',
            boundsAlignH: "center", // bounds center align horizontally
            boundsAlignV: "middle", // bounds center align vertically
            padding: {
                x: 8,
                y: 8
            }
        }

        this.tooltip = this.add.text(0, 0, "this is a tooltip", textStyle)
        this.tooltip.setScale(0.5) // revert camera zoom
        this.tooltip.setWordWrapWidth(500) // buggy when text is overriden
        this.tooltip.setBackgroundColor('black')
        this.tooltip.setAlpha(1)
        this.tooltip.setVisible(false)
        this.tooltip.setDepth(100) // put the tooltip in front of every other things


        this.input.on('pointermove', function(pointer: Phaser.Input.Pointer){
            let x = pointer.worldX
            let y = pointer.worldY

            if(pointer.x > this_game.game.canvas.width/2){
                x -= this_game.tooltip.getBounds().width
            }
            if(pointer.y > this_game.game.canvas.height/2){
                y -= this_game.tooltip.getBounds().height
            }
            this_game.tooltip.setPosition(x, y)

            if(!this_game.monsterHovered){
                let tileHovered = this_game.fileLayer.getTileAtWorldXY(pointer.worldX, pointer.worldY)
                if(tileHovered){
                    this_game.tooltip.visible = true
                    this_game.currentTileHovered = tileHovered
                    
                    this_game.tooltip.setText(this_game.tooltip.getWrappedText(tileHovered.collisionCallback().getInfoString()))
                }  else {
                    this_game.tooltip.visible = false
                    this_game.currentTileHovered = undefined
                }
            } else {
                this_game.currentTileHovered = undefined
            }
        }, this)


        
        this.fileChildren.forEach(this.newMonster, this)

        
        this.physics.add.collider(this.player, this.wall1Layer)
        this.physics.add.collider(this.enemies, this.wall1Layer)
        this.physics.add.collider(this.player, this.wall2Layer)
        this.physics.add.collider(this.enemies, this.wall2Layer)
        this.physics.add.collider(this.enemies, this.enemies)
    }
}