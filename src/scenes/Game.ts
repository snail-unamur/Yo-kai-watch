import Phaser, { Time } from 'phaser'
import Player from '~/characters/Player'
import '~/characters/Player'

import { createCharacterAnims } from '~/animations/PlayerAnimation'
import { createMonsterAnims } from '~/animations/MonsterAnimation'
import Monster from '~/enemies/Monster'

import { ConstantsTiles, MonsterConstantsSize, MonsterConstantsType } from '~/utils/Const'

import FileChild from './FileChild'

import { sceneEvents } from '~/events/EventCenter'
import SwordContainer from '~/weapons/SwordContainer'
import HealthBar from '~/graphics/Healthbar'

export default class Game extends Phaser.Scene{
    private static readonly TILE_SIZE = 16  
    private static readonly NB_TILE_PER_FILE = 3  
    private dungeon_size = 10

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

    private player!: Player
    private sword?: SwordContainer

    private enemies!: Phaser.Physics.Arcade.Group
    private groundLayer!: Phaser.Tilemaps.TilemapLayer
    private fileLayer!: Phaser.Tilemaps.TilemapLayer

    private freezeLayer
    private freezing: boolean = false
    private playerMonsterCollider?: Phaser.Physics.Arcade.Collider | null


    private tooltip!: Phaser.GameObjects.Text

    private mapContext
    private sonarQubeData

    private monsterHovered:boolean = false


    private fileChildren:FileChild[] = []

	constructor(){
		super('game')
	}

	preload() {
        this.cursors = this.input.keyboard.createCursorKeys()

        let this_scene = this
        this.input.keyboard.addKey('W').on('down', function(event) {
            console.log("restart")
            this_scene.scene.restart()
        }, this)

        this.input.keyboard.addKey('X').on('down', this.handleFreeze, this)

        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE).on('down', this.startMap, this)
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB).on('down', this.startMap, this)
    }

    startMap(){
        this.scene.start('map', { mapContext: this.mapContext });
    }

    handleFreeze(){
        this.freezing = !this.freezing
        this.freezeLayer.visible = this.freezing
        
        if(this.freezing){
            console.log("freeze")
        } else {
            console.log("unfreeze")
        }
    }

    create(data){
        this.fileChildren = []
        if(data?.mapContext){
            this.mapContext = data.mapContext
            this.sonarQubeData = this.mapContext.file
        } else {
            this.sonarQubeData = this.cache.json.get('metrics')[0]
        }
        this.generation()


        // Launch UI
        this.scene.run('game-ui')

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
        //this.player = this.add.player(center, center, 'player')
        this.player = this.add.player(center, center, 'player')
        cam.startFollow(this.player)

        // Character Sword
        this.sword = new SwordContainer(this, this.player.x, this.player.y)

        // Enemies
        let this_game = this
        this.enemies = this.physics.add.group({
            classType: Monster,
            createCallback: (go) => {
                const enemyGo = go as Monster
                enemyGo.body.onCollide = true
                enemyGo.setBounce(1)
                enemyGo.setInteractive()

                // Test healthbar
                const healthbar = new HealthBar(this_game, 30, 0)

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

        
        // Add walls layer
        const wallLayer = this.createWalls(Game.TILE_SIZE, this.dungeon_size)
        this.physics.add.collider(this.player, wallLayer)
        this.physics.add.collider(this.enemies, wallLayer)
        this.physics.add.collider(this.enemies, this.enemies)

        // Player monster collider
        this.playerMonsterCollider = this.physics.add.collider(this.player, this.enemies, this.handlePlayerMonsterCollision, undefined, this)

        // Sword monster collider
        this.physics.add.overlap(this.sword.physicsDisplay, this.enemies, this.handleSwordMonsterCollision, undefined, this)
        
        //this.debugWalls(wallLayer)

        
        let gameCanvas = this.sys.game.canvas
        this.freezeLayer = this.add.renderTexture(0, 0, gameCanvas.width, gameCanvas.height)
        this.freezeLayer.fill(0x000000, 0.5)
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
        this.tooltip.setAlpha(0.7)
        this.tooltip.setVisible(false)
        this.tooltip.setDepth(1) // put the tooltip in front of every other things


        this.input.on('pointermove', function(pointer: Phaser.Input.Pointer){
            this_game.tooltip.setPosition(pointer.worldX - this_game.tooltip.getBounds().width, pointer.worldY - this_game.tooltip.getBounds().height)

            if(!this_game.monsterHovered){
                let tileHovered = this_game.fileLayer.getTileAtWorldXY(pointer.worldX, pointer.worldY)
                if(tileHovered){
                    this_game.tooltip.visible = true
                    
                    this_game.tooltip.setText(this_game.tooltip.getWrappedText(tileHovered.collisionCallback().getInfoString()))
                }  else {
                    this_game.tooltip.visible = false
                }
            }
        }, this)


        this.fileChildren.forEach((file:FileChild) => {
            setTimeout(() => {
                file.getMonster()
            }, 500*Math.floor(Math.random()*5)) // The randomness here is just to make the first spawn more funky :)
        })
    }

    handleSwordMonsterCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        const enemy = obj2 as Monster
        
        // Knockback enemies
        const knockback = new Phaser.Math.Vector2(enemy.x - this.player.x, enemy.y - this.player.y).normalize().scale(250)
        
        enemy.handleDamage(knockback)
    }

    generation() {
        let nbFile
        console.log(this.sonarQubeData)

        if(this.sonarQubeData.children){
            nbFile = this.sonarQubeData.children.length
        } else {
            nbFile = 0
        }

        let nbFileBySide = Math.ceil(Math.sqrt(nbFile))

        this.dungeon_size = Game.NB_TILE_PER_FILE * 5

        if(nbFileBySide >= 4){
            this.dungeon_size = (Game.NB_TILE_PER_FILE+1) * nbFileBySide + 4
        }

        // Add ground layer
        const fundationLayer = this.newLayer(Game.TILE_SIZE, this.dungeon_size)
        fundationLayer.putTilesAt(this.filledMap(this.dungeon_size, ConstantsTiles.GROUND_CLEAN), 0, 0)

        // Add ground layer
        /**
         * 3 type of ground =  CLEAN/SLIGHTLY_CRACKED/CRACK
         * based on the reliability_rating (1.0=A -> 5.0=E)
         * 1.0 -> CLEAN
         * 2.0 -> CLEAN + SLIGHTLY CRACKED
         * ..
         * 5.0 -> CRACK
         * 
         * General is always clean
         */

        const reliability_rating = this.sonarQubeData.measures[6].value
        const probaCracked = -0.2 + reliability_rating*0.2
        const probaSlightlyCracked = 0.2
        const probaClean = 1 - probaCracked - probaSlightlyCracked
        

        
        // the parameters (..., 1, 1) force the first column and line of the layer to be ignored.
        // It does not display the layer from these coordinates. So, the layer has 5 column and 5 rows even if we want only 4 
        this.groundLayer = this.newLayer(Game.TILE_SIZE, this.dungeon_size-2)

        // But the map is like displayed from theses coordinates
        this.groundLayer.putTilesAt(this.filledMap(this.dungeon_size-4, ConstantsTiles.GROUND_CLEAN), 2, 2)

        // Add random cracked tiles based on bugs
        let r
        for(let i=2; i < this.dungeon_size-2; i++){
            for(let j=2; j < this.dungeon_size-2; j++){
                r = Math.random()
                if(r >= 1 - probaCracked){
                    this.groundLayer.putTileAt(ConstantsTiles.GROUND_CRACK, i, j)
                } else if(r > 1 - probaCracked - probaCracked) {
                    this.groundLayer.putTileAt(ConstantsTiles.GROUND_SLIGHTLY_CRACKED, i, j)
                } else {
                    this.groundLayer.putTileAt(ConstantsTiles.GROUND_CLEAN, i, j)
                }
            }
        }

        // Add File delimitation layer
        this.fileLayer = this.newLayer(Game.TILE_SIZE, this.dungeon_size-2)
        let baseX = 2
        let baseY = 2

        let file

        for(let i=0; i < nbFile; i++){
            file = this.sonarQubeData.children[i]
            this.generateFileLimitation(
                this.fileLayer, 
                baseX + (i % nbFileBySide) * (Game.NB_TILE_PER_FILE + 1), 
                baseY + Math.floor(i / nbFileBySide) * (Game.NB_TILE_PER_FILE + 1), 
                Game.NB_TILE_PER_FILE, file)
        }
    }

    generationRandom(){
        // generate random dungeon
        const dungeon_min = 16
        const dungeon_max = 24
        this.dungeon_size = Math.floor(dungeon_min + (Math.random() * (dungeon_max - dungeon_min)))  

        // Add ground layer
        const fundationLayer = this.newLayer(Game.TILE_SIZE, this.dungeon_size)
        fundationLayer.putTilesAt(this.filledMap(this.dungeon_size, ConstantsTiles.GROUND_CRACK), 0, 0)

        // Add ground layer

        // the parameters (..., 1, 1) force the first column and line of the layer to be ignored.
        // It does not display the layer from these coordinates. So, the layer has 5 column and 5 rows even if we want only 4 
        this.groundLayer = this.newLayer(Game.TILE_SIZE, this.dungeon_size-2)

        // But the map is like displayed from theses coordinates
        this.groundLayer.putTilesAt(this.filledMap(this.dungeon_size-4, ConstantsTiles.GROUND_CLEAN), 2, 2)

        // Add random cracked tiles
        for(let i=2; i < this.dungeon_size-2; i++){
            for(let j=2; j < this.dungeon_size-2; j++){
                if(Math.random() > 0.9){
                    this.groundLayer.putTileAt(ConstantsTiles.GROUND_CRACK, i, j)
                }
            }
        }



        // Add File delimitation layer
        this.fileLayer = this.newLayer(Game.TILE_SIZE, this.dungeon_size-2)

        //fileLimitLayer.putTilesAt(this.filledMap(this.dungeon_size-4, ConstantsTiles.GROUND_CLEAN), 2, 2);
        //this.generateFileLimitation()

        const file_tiles_size = 4
        const file = {
            name: 'UserRegistrationForm.php', 
            type: 'FIL', 
            path: 'root/UserRegistrationForm.php', 
            key: 'Caitanyakotla_Hobby-Projects:UserRegistrationForm.php', 
            measures: [
                {metric: 'code_smells', value: '3', bestValue: false},
                {metric: 'sqale_index', value: '15', bestValue: false},
                {metric: 'sqale_rating', value: '1.0', bestValue: true}, 
                {metric: 'security_rating', value: '1.0', bestValue: true}, 
                {metric: 'reliability_rating', value: '3.0', bestValue: false}, 
                {metric: 'reliability_remediation_effort', value: '20', bestValue: false}, 
                {metric: 'security_remediation_effort', value: '0', bestValue: true}, 
                {metric: 'vulnerabilities', value: '0', bestValue: true}
            ]
        }
        

        this.generateFileLimitation(this.fileLayer, 3, 7, file_tiles_size, file)
        this.generateFileLimitation(this.fileLayer, 6, 9, file_tiles_size, file)
        this.generateFileLimitation(this.fileLayer, 4, 4, file_tiles_size, file)
    }

    handlePlayerMonsterCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        const player = obj1 as Player
        const monster = obj2 as Monster

        const dx = player.x - monster.x
        const dy = player.y - monster.y

        const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)

        player.handleDamage(dir)

        sceneEvents.emit('player-damage', player.getHealth())

        if(this.player.getHealth() <= 0 && this.playerMonsterCollider !== null
            && this.playerMonsterCollider !== undefined) {
            this.playerMonsterCollider.destroy()
            this.playerMonsterCollider = null
            
        }

    }

    generateFileLimitation(fileLayer:Phaser.Tilemaps.TilemapLayer, x:number, y:number, size:number, file:{name: string, type: string, path: string, key: string, measures: {metric: string, value:string, bestValue: boolean}[]}){
        let l = new Array(size).fill(0)
        let t = new Array()
        for(let i=0; i < size; i++){
            t.push(Array.from(l))
        }

        t[0].fill(ConstantsTiles.WALL_TIP_INNER)
        t[0][0] = ConstantsTiles.WALL_TOP_LEFT_INNER_CORNER
        t[0][size-1] = ConstantsTiles.WALL_TOP_RIGHT_INNER_CORNER

        t[size-1].fill(ConstantsTiles.WALL_TIP)
        t[size-1][size-1] = ConstantsTiles.WALL_BOTTOM_RIGHT_CORNER_TIP
        t[size-1][0] = ConstantsTiles.WALL_BOTTOM_LEFT_CORNER_TIP

        for(let i=1; i < size-1; i++){
            t[i][0] = ConstantsTiles.WALL_LEFT
            t[i][size-1] = ConstantsTiles.WALL_RIGHT
        }

        this.fileLayer.putTilesAt(t, x, y).alpha = 0.5

        let fileChild = new FileChild(file, this, x*Game.TILE_SIZE, y*Game.TILE_SIZE, size*Game.TILE_SIZE, size*Game.TILE_SIZE)
        this.fileChildren.push(fileChild)

        this.fileLayer.tilemap.setTileLocationCallback(x, y, size*Game.TILE_SIZE, size*Game.TILE_SIZE, (): FileChild => {
            return fileChild
        }, {})

        return t
    }

    debugWalls(wallsLayer:Phaser.Tilemaps.TilemapLayer){
        // debug Walls
        const debugGraphics = this.add.graphics().setAlpha(0.3)
        wallsLayer.renderDebug(debugGraphics, {
            collidingTileColor: new Phaser.Display.Color(243, 234, 48, 200)
        })
    }

    update(t:number, dt:number){
        if(!this.player || !this.sword){
            return
        }
        
        this.player.update(this.cursors, this.sword, dt)
        
        
        // Make enemies run towards the player
        this.enemies.children.each(go => {
            const enemyGo = go as Monster
            // TODO: not working it creates a collider only
            // if (!this.physics.collide(enemyGo, this.player, undefined, undefined, enemyGo)) {
            // enemyGo.runTowards(this.player.x, this.player.y)
            // } else {
            //     enemyGo.setVelocity(0, 0)
            // }
            // 
            enemyGo.runTowards(this.player.x, this.player.y)
        })
    }

    newLayer(tile_size:number, dungeon_size:number, tilesString:string = "tiles"){

        //tile_size = 16
        const map = this.make.tilemap({
            tileWidth: tile_size,
            tileHeight: tile_size,
            width: dungeon_size,
            height: dungeon_size
        })

        const tileset = map.addTilesetImage(tilesString, undefined, tile_size, tile_size, 0, 0)

        const layer = map.createBlankLayer("Layer Blank", tileset)

        return layer
    }


    filledMap(size: number, tile=-1){
        let l = new Array(size).fill(tile)
        let t = new Array(size).fill(l)

        return t
    }

    createWalls(tile_size:number, dungeon_size:number){

        const wallsLayer = this.newLayer(tile_size, dungeon_size, "tiles")
        let tile:Phaser.Tilemaps.Tile

        //     FACES
        for(let i=2; i < dungeon_size - 2; i++){
            // Top walls
            wallsLayer.putTileAt(ConstantsTiles.WALL_FACE, i, 1).setCollision(true) // face of the wall
            wallsLayer.putTileAt(ConstantsTiles.WALL_TIP, i, 0) // tip of the wall
            // Bottom walls
            wallsLayer.putTileAt(ConstantsTiles.WALL_FACE, i, dungeon_size-2).setCollision(true) // face of the wall
            wallsLayer.putTileAt(ConstantsTiles.WALL_TIP, i, dungeon_size-3) // tip of the wall
        }

        for(let i=2; i < dungeon_size - 3; i++){
            // Left walls
            wallsLayer.putTileAt(ConstantsTiles.WALL_LEFT, 1, i) // face of the wall
            wallsLayer.putTileAt(0, 0, i).setCollision(true)
            // Right walls
            wallsLayer.putTileAt(ConstantsTiles.WALL_RIGHT, dungeon_size-2, i) // face of the wall
            wallsLayer.putTileAt(0, dungeon_size-1, i).setCollision(true)
        }

        //      CORNERS
        // Top left corner
        wallsLayer.putTileAt(ConstantsTiles.WALL_TOP_LEFT_CORNER, 1, 1).setCollision(true)
        wallsLayer.putTileAt(0, 0, 1).setCollision(true)
        wallsLayer.putTileAt(ConstantsTiles.WALL_TIP_TOP_LEFT, 1, 0)// tip of the wall
        // Top right corner
        wallsLayer.putTileAt(ConstantsTiles.WALL_TOP_RIGHT_CORNER,  dungeon_size - 2, 1).setCollision(true)
        wallsLayer.putTileAt(0, dungeon_size - 1, 1).setCollision(true)
        wallsLayer.putTileAt(ConstantsTiles.WALL_TIP_TOP_RIGHT,  dungeon_size - 2, 0)// tip of the wall
        
        // Bottom left corner
        wallsLayer.putTileAt(ConstantsTiles.WALL_BOTTOM_LEFT_CORNER_TIP, 1, dungeon_size - 3)// tip of the wall
        wallsLayer.putTileAt(0, 0, dungeon_size - 3).setCollision(true)
        wallsLayer.putTileAt(0, 0, dungeon_size - 2).setCollision(true)
        wallsLayer.putTileAt(ConstantsTiles.WALL_BOTTOM_LEFT_CORNER, 1, dungeon_size - 2).setCollision(true)
        // Bottom right corner
        wallsLayer.putTileAt(ConstantsTiles.WALL_BOTTOM_RIGHT_CORNER_TIP, dungeon_size - 2, dungeon_size - 3)// tip of the wall
        wallsLayer.putTileAt(0, dungeon_size - 1, dungeon_size - 3).setCollision(true)
        wallsLayer.putTileAt(0, dungeon_size - 1, dungeon_size - 2).setCollision(true)
        wallsLayer.putTileAt(ConstantsTiles.WALL_BOTTOM_RIGHT_CORNER, dungeon_size - 2, dungeon_size - 2).setCollision(true)

        return wallsLayer
    }

    getEnemies(){
        return this.enemies
    }
}
