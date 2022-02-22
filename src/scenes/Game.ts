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
import FileContainer from './FileContainer'

export default class Game extends Phaser.Scene{
    private static readonly TILE_SIZE = 16  
    private static readonly NB_TILE_PER_FILE = 3  
    private dungeon_size = 10

    private oldFileNameShowed

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

    private player!: Player
    private sword?: SwordContainer

    private enemies!: Phaser.Physics.Arcade.Group
    private groundLayer!: Phaser.Tilemaps.TilemapLayer
    private wall1Layer!: Phaser.Tilemaps.TilemapLayer
    private wall2Layer!: Phaser.Tilemaps.TilemapLayer
    private fileLayer!: Phaser.Tilemaps.TilemapLayer

    private wallTexture: number = 0
    private groundTexture: number = 0

    private freezeLayer
    private freezing: boolean = false
    private playerMonsterCollider?: Phaser.Physics.Arcade.Collider | null


    private tooltip!: Phaser.GameObjects.Text

    private mapContext!:{
        file : {
            children:any,
            name:string,
            type:string
        },
        path: number[],
        selectedId: number,
        selected: FileContainer|string
    }
    private fileTree
    private sonarQubeData

    private issues

    private monsterHovered:boolean = false
    private currentTileHovered


    private fileChildren:FileChild[] = []

    private playerControls!: {
        up: Phaser.Input.Keyboard.Key[],
        down: Phaser.Input.Keyboard.Key[],
        left: Phaser.Input.Keyboard.Key[],
        right: Phaser.Input.Keyboard.Key[],
        attack: Phaser.Input.Keyboard.Key[],
        dig: Phaser.Input.Keyboard.Key[],
        goUp: Phaser.Input.Keyboard.Key[],
        openMap: Phaser.Input.Keyboard.Key[],
        freeze: Phaser.Input.Keyboard.Key[],
        restart: Phaser.Input.Keyboard.Key[]
    }

    private incomingMonster: number[] = []

	constructor(){
		super('game')
	}

	preload() {
        FileChild.projectIssues = this.cache.json.get('issues')
        this.fileTree = this.cache.json.get('metrics')

        //this.cursors = this.input.keyboard.createCursorKeys()

        let this_scene = this
/*
        this.input.keyboard.addKey('X').on('down', this.handleFreeze, this)

        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE).on('down', this.startMap, this)*/

        // Don't put TAB key in the playerControls object or when the map will be open the capture will be cleared and a "tab action" will happen in the browser
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB).on('down', this.startMap, this)

        this.playerControls = {
            up: [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z)],
            down: [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)],
            left: [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)],
            right: [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)],
            attack: [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)],
            dig: [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)],
            goUp: [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)],
            openMap: [ this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE) ],
            freeze: [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X)],
            restart: [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)]
        }

        this.playerControls.openMap.forEach(element => { element.on('down', this.startMap, this) });
        this.playerControls.freeze.forEach(element => { element.on('down', this.handleFreeze, this) });

        this.playerControls.restart.forEach(element => { element.on('down', function(event) {
                console.log("restart")
                this_scene.scene.restart()
            }, this)
        })

        let i = this.input.on('pointerdown', this.onPointerDown, this)
        

        this.playerControls.dig.forEach(element => { element.on('down', this.onDig, this) })
        this.playerControls.goUp.forEach(element => { element.on('down', this.goUp, this) })
    }

    onPointerDown(cursor: Phaser.Input.Pointer){
        if(this.currentTileHovered){
            this.dig(this.currentTileHovered.collisionCallback())
            
        }
    }

    onDig(){
        this.dig()
    }

    dig(fileObject?: FileChild){
        if(!fileObject) fileObject = this.fileLayer.getTileAtWorldXY(this.player.x, this.player.y)?.collisionCallback()
        if(fileObject && this.mapContext.file.children) {
            if(this.mapContext.selectedId !== -1){
                this.mapContext.path.push(this.mapContext.selectedId)
            }
            this.mapContext.selectedId = fileObject.getFile().id
            this.mapContext.file = this.mapContext.file.children[fileObject.getFile().id]
            this.mapContext.selected = fileObject.getFile().name

            this.restart()
        }
    }

    goUp(){
        let parent = this.getParent(this.mapContext.path)
        
        let id_ = -1
        if(this.mapContext.selectedId !== -1){
            if(parent.name !== 'root'){
                id_ = this.mapContext.path[this.mapContext.path.length-1]
                this.mapContext.path.pop()
            }
    
            this.mapContext.file = parent
            this.mapContext.selected = parent.name
            this.mapContext.selectedId = id_
    
            this.restart()
        }
    }


    restart(){
        this.scene.restart({
            mapContext: this.mapContext
        })
    }

    getParent(path:integer[]){
        let currentElement = { children: this.fileTree, name:'super root', type:'DIR' }
        path.forEach(element => {
            currentElement = currentElement.children[element]
        })

        return currentElement
    }

    startMap(){
        if(this.mapContext && typeof this.mapContext?.selected !== "string"){
            this.mapContext.selected = this.mapContext.selected.getName()
        }
        Object.keys(this.playerControls).forEach(el => {
            let e:Phaser.Input.Keyboard.Key[] = this.playerControls[el]
            e.forEach((el: Phaser.Input.Keyboard.Key) => {
                this.input.keyboard.removeCapture(el.keyCode)
            })
        })

        this.scene.stop("game-ui")
        this.scene.start('map', { mapContext: this.mapContext });
    }

    handleFreeze(){
        this.freezing = !this.freezing
        this.freezeLayer.visible = this.freezing
        
        if(this.freezing){
            this.physics.pause()
            this.anims.pauseAll()
            this.fileChildren.forEach((el:FileChild) => { el.showName() })
        } else {
            this.physics.resume()
            this.anims.resumeAll()
            this.fileChildren.forEach((el:FileChild) => { el.showName(false) })
        }
    }

    create(data){
        sceneEvents.on('player-dead', () => {
            this.scene.restart()
        })
        this.incomingMonster.forEach(timeoutId => { clearTimeout(timeoutId) })
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
        console.log(this.sonarQubeData)
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
        //this.player = this.add.player(center, center, 'player')
        this.player = this.add.player(center, center, 'player')
        this.player.setDepth(1)
        cam.startFollow(this.player)

        // Character Sword
        this.sword = new SwordContainer(this, this.player.x, this.player.y)

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
        this.physics.add.overlap(this.sword.physicsDisplay, this.enemies, this.handleSwordMonsterCollision, undefined, this)
        

        
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

    newMonster(file:FileChild){
        this.incomingMonster.push(
            setTimeout(
                () => { 
                    file.getMonster()
                    this.newMonster(file) 
                }, 
                500*Math.floor((Math.random()+1)*2.5)
            )
        ) // The randomness here is just to make the first spawn more funky :)
    }

    handleSwordMonsterCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        const enemy = obj2 as Monster
        
        // Knockback enemies
        const knockback = new Phaser.Math.Vector2(enemy.x - this.player.x, enemy.y - this.player.y).normalize().scale(250)
        
        enemy.handleDamage(knockback)
    }

    generation() {
        let nbFile

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

        const reliability_rating = this.sonarQubeData.measures.find(measure => measure.metric === 'reliability_rating').value
        const sqale_rating = this.sonarQubeData.measures.find(measure => measure.metric === 'sqale_rating').value
        this.groundTexture = 5 - Math.floor(reliability_rating)


        const probaCracked = -0.2 + sqale_rating*0.2
        const probaSlightlyCracked = 0.2
        const probaClean = 1 - probaCracked - probaSlightlyCracked
        

        // Add ground layer
        const fundationLayer = this.newLayer(Game.TILE_SIZE, this.dungeon_size)
        fundationLayer.putTilesAt(this.filledMap(this.dungeon_size, ConstantsTiles.GROUND_CLEAN + this.groundTexture * ConstantsTiles.tileDistance), 0, 0)
        
        // the parameters (..., 1, 1) force the first column and line of the layer to be ignored.
        // It does not display the layer from these coordinates. So, the layer has 5 column and 5 rows even if we want only 4 
        this.groundLayer = this.newLayer(Game.TILE_SIZE, this.dungeon_size-2)

        // But the map is like displayed from theses coordinates
        this.groundLayer.putTilesAt(this.filledMap(this.dungeon_size-4, ConstantsTiles.GROUND_CLEAN + this.groundTexture * ConstantsTiles.tileDistance), 2, 2)

        // Add random cracked tiles based on bugs
        let r
        for(let i=2; i < this.dungeon_size-2; i++){
            for(let j=2; j < this.dungeon_size-2; j++){
                r = Math.random()
                if(r >= 1 - probaCracked){
                    this.groundLayer.putTileAt(ConstantsTiles.GROUND_CRACK + this.groundTexture * ConstantsTiles.tileDistance, i, j)
                } else if(r > 1 - probaCracked - probaCracked) {
                    this.groundLayer.putTileAt(ConstantsTiles.GROUND_SLIGHTLY_CRACKED + this.groundTexture * ConstantsTiles.tileDistance, i, j)
                } else {
                    this.groundLayer.putTileAt(ConstantsTiles.GROUND_CLEAN + this.groundTexture * ConstantsTiles.tileDistance, i, j)
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
            file.id = i
            this.generateFileLimitation(
                this.fileLayer, 
                baseX + (i % nbFileBySide) * (Game.NB_TILE_PER_FILE + 1), 
                baseY + Math.floor(i / nbFileBySide) * (Game.NB_TILE_PER_FILE + 1), 
                Game.NB_TILE_PER_FILE, file)
        }
        
        if(nbFile === 0){
            // We are in a leaf
            this.sonarQubeData.id = 0
            this.generateFileLimitation(
                this.fileLayer, 
                Math.floor(this.dungeon_size/2) - 2, 
                Math.floor(this.dungeon_size/2) - 2, 
                Game.NB_TILE_PER_FILE + 2, this.sonarQubeData)

        }

        // Add music of room
        // Switch case based on the reliability_rating (1.0=A -> 5.0=E)
     
        switch(reliability_rating) {
            default:
            case '1.0':
                if (!this.sound.get('ambient_a')) {
                    this.sound.removeAll()
                    this.sound.play('ambient_a', {loop: true})
                }
                break
            case '2.0':
                if (!this.sound.get('ambient_b')) {
                    this.sound.removeAll()
                    this.sound.play('ambient_b', {loop: true})
                }
                break
            case '3.0':
                if (!this.sound.get('ambient_c')) {
                    this.sound.removeAll()
                    this.sound.play('ambient_c', {loop: true})
                }
                break
            case '4.0':
                if (!this.sound.get('ambient_d')) {
                    this.sound.removeAll()
                    this.sound.play('ambient_d', {loop: true})
                }
                break
            case '5.0':
                if (!this.sound.get('ambient_e')) {
                    this.sound.removeAll()
                    this.sound.play('ambient_e', {loop: true})
                }
                break
        }
        

        
        // Add walls layer
        const security_rating = this.sonarQubeData.measures.find(measure => measure.metric === 'security_rating').value
        this.wallTexture = 5 - Math.floor(security_rating)

        let walls = this.createWalls(Game.TILE_SIZE, this.dungeon_size)
        this.wall1Layer = walls[0]
        this.wall2Layer = walls[1]
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

    generateFileLimitation(fileLayer:Phaser.Tilemaps.TilemapLayer, x:number, y:number, size:number, file:{id:number, name: string, type: string, path: string, key: string, measures: {metric: string, value:string, bestValue: boolean}[]}){
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
        
        if(this.freezing){
            return
        }


        this.player.update(this.playerControls, this.sword, dt)

        let file: FileChild = this.fileLayer.getTileAtWorldXY(this.player.x, this.player.y)?.collisionCallback()
        if(file){
            sceneEvents.emit('tile-file-update', file.getName())
            file.showName()
            this.oldFileNameShowed = file
        } else {
            sceneEvents.emit('tile-file-update', "Nothing here")
            if(this.oldFileNameShowed){
                this.oldFileNameShowed.showName(false)
                this.oldFileNameShowed = undefined
            } 
        }
        
        
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
        const map = this.make.tilemap({
            tileWidth: tile_size,
            tileHeight: tile_size,
            width: dungeon_size,
            height: dungeon_size
        })

        const tileset = map.addTilesetImage(tilesString, undefined, tile_size, tile_size, 1, 2)

        const layer = map.createBlankLayer("Layer Blank", tileset)

        return layer
    }


    filledMap(size: number, tile=-1){
        let l = new Array(size).fill(tile)
        let t = new Array(size).fill(l)

        return t
    }

    createWalls(tile_size:number, dungeon_size:number){
        const topWallLayer = this.newLayer(tile_size, dungeon_size, "tiles")
        topWallLayer.setDepth(0)
        const wallsLayer = this.newLayer(tile_size, dungeon_size, "tiles")
        wallsLayer.setDepth(2)
        let tile:Phaser.Tilemaps.Tile

        //     FACES
        for(let i=2; i < dungeon_size - 2; i++){
            // Top walls
            topWallLayer.putTileAt(ConstantsTiles.WALL_FACE + this.wallTexture * ConstantsTiles.tileDistance, i, 1).setCollision(true) // face of the wall
            topWallLayer.putTileAt(ConstantsTiles.WALL_TIP + this.wallTexture * ConstantsTiles.tileDistance, i, 0) // tip of the wall
            // Bottom walls
            wallsLayer.putTileAt(ConstantsTiles.WALL_FACE + this.wallTexture * ConstantsTiles.tileDistance, i, dungeon_size-2).setCollision(true) // face of the wall
            wallsLayer.putTileAt(ConstantsTiles.WALL_TIP + this.wallTexture * ConstantsTiles.tileDistance, i, dungeon_size-3) // tip of the wall
        }

        for(let i=2; i < dungeon_size - 3; i++){
            // Left walls
            wallsLayer.putTileAt(ConstantsTiles.WALL_LEFT + this.wallTexture * ConstantsTiles.tileDistance, 1, i) // face of the wall
            wallsLayer.putTileAt(0, 0, i).setCollision(true)
            // Right walls
            wallsLayer.putTileAt(ConstantsTiles.WALL_RIGHT + this.wallTexture * ConstantsTiles.tileDistance, dungeon_size-2, i) // face of the wall
            wallsLayer.putTileAt(0, dungeon_size-1, i).setCollision(true)
        }

        //      CORNERS
        // Top left corner
        topWallLayer.putTileAt(ConstantsTiles.WALL_TOP_LEFT_CORNER + this.wallTexture * ConstantsTiles.tileDistance, 1, 1).setCollision(true)
        topWallLayer.putTileAt(0, 0, 1).setCollision(true)
        topWallLayer.putTileAt(ConstantsTiles.WALL_TIP_TOP_LEFT + this.wallTexture * ConstantsTiles.tileDistance, 1, 0)// tip of the wall
        // Top right corner
        topWallLayer.putTileAt(ConstantsTiles.WALL_TOP_RIGHT_CORNER + this.wallTexture * ConstantsTiles.tileDistance,  dungeon_size - 2, 1).setCollision(true)
        topWallLayer.putTileAt(0, dungeon_size - 1, 1).setCollision(true)
        topWallLayer.putTileAt(ConstantsTiles.WALL_TIP_TOP_RIGHT + this.wallTexture * ConstantsTiles.tileDistance,  dungeon_size - 2, 0)// tip of the wall
        
        // Bottom left corner
        wallsLayer.putTileAt(ConstantsTiles.WALL_BOTTOM_LEFT_CORNER_TIP + this.wallTexture * ConstantsTiles.tileDistance, 1, dungeon_size - 3)// tip of the wall
        wallsLayer.putTileAt(0, 0, dungeon_size - 3).setCollision(true)
        wallsLayer.putTileAt(0, 0, dungeon_size - 2).setCollision(true)
        wallsLayer.putTileAt(ConstantsTiles.WALL_BOTTOM_LEFT_CORNER + this.wallTexture * ConstantsTiles.tileDistance, 1, dungeon_size - 2).setCollision(true)
        // Bottom right corner
        wallsLayer.putTileAt(ConstantsTiles.WALL_BOTTOM_RIGHT_CORNER_TIP + this.wallTexture * ConstantsTiles.tileDistance, dungeon_size - 2, dungeon_size - 3)// tip of the wall
        wallsLayer.putTileAt(0, dungeon_size - 1, dungeon_size - 3).setCollision(true)
        wallsLayer.putTileAt(0, dungeon_size - 1, dungeon_size - 2).setCollision(true)
        wallsLayer.putTileAt(ConstantsTiles.WALL_BOTTOM_RIGHT_CORNER + this.wallTexture * ConstantsTiles.tileDistance, dungeon_size - 2, dungeon_size - 2).setCollision(true)

        return [wallsLayer, topWallLayer]
    }

    getEnemies(){
        return this.enemies
    }
}
