import Phaser, { Time } from 'phaser'
import Player from '~/characters/Player'
import '~/characters/Player'

import { createCharacterAnims } from '~/animations/PlayerAnimation'
import { createMonsterAnims } from '~/animations/MonsterAnimation'
import Monster from '~/enemies/Monster'

import { ConstantsTiles, LogConstant, MonsterConstantsSize, MonsterConstantsType } from '~/utils/Const'

import FileChild from './FileChild'

import { sceneEvents } from '~/events/EventCenter'
import Sword from '~/weapons/Sword'
import '~/weapons/Sword'
import FileContainer from './FileContainer'
import Log from '~/utils/Log'
import { Global } from '~/utils/Global'

export default class Game extends Phaser.Scene{
    static readonly TILE_SIZE = 16
    static readonly NB_TILE_PER_FILE = 3
    static readonly ROW_SIZE = 2
    static readonly MIN_NB_FILE_LIMIT_ROW = 2
    static readonly MUSIC_VOLUME = 0.3
    static readonly CAMERA_SPEED = 5

    protected dungeon_size = 10

    private oldFileNameShowed

    protected reliability_rating
    protected sqale_rating

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

    protected player!: Player
    protected sword!: Sword

    protected enemies!: Phaser.Physics.Arcade.Group
    protected groundLayer!: Phaser.Tilemaps.TilemapLayer
    protected wall1Layer!: Phaser.Tilemaps.TilemapLayer
    protected wall2Layer!: Phaser.Tilemaps.TilemapLayer
    protected fileLayer!: Phaser.Tilemaps.TilemapLayer
    protected fileLayerGround!: Phaser.Tilemaps.TilemapLayer

    protected wallTexture: number = 0
    protected groundTexture: number = 0

    protected freezeLayer
    protected freezing: boolean = false
    protected playerMonsterCollider?: Phaser.Physics.Arcade.Collider | null


    protected tooltip!: Phaser.GameObjects.Text

    protected mapContext!:{
        file : {
            children:any,
            name:string,
            type:string
        },
        path: number[],
        selectedId: number,
        selected: FileContainer|string
    }
    protected fileTree
    protected sonarQubeData
    protected currentTileHovered: Phaser.Tilemaps.Tile | undefined


    protected fileChildren:FileChild[] = []

    protected playerControls!: {
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

    protected incomingMonster: { durationLeft: number, callback}[] = []

	constructor(key:string = "game"){
		super(key)
	}

	preload() {
        FileChild.projectIssues = Global.issues
        this.fileTree = Global.fileTree

        let issues = this.cache.json.get('issues')
        if(issues){
            FileChild.projectIssues = issues
        } else {
        }

        // Don't put TAB key in the playerControls object or when the map will be open the capture will be cleared and a "tab action" will happen in the browser
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB).on('down', this.startMap, this)
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on('down', this.onPause, this)

        this.playerControls = {
            up: [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z), this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)],
            down: [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S), this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)],
            left: [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q), this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)],
            right: [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D), this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)],
            attack: [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)],
            dig: [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)],
            goUp: [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)],
            openMap: [ this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE)],
            freeze: [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X)],
            restart: [this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)]
        }

        this.playerControls.openMap.forEach(element => { element.on('down', this.startMap, this) });
        this.playerControls.freeze.forEach(element => { element.on('down', this.handleFreeze, this) });

        this.playerControls.restart.forEach(element => { element.on('down', this.restart, this)
        })

        this.input.mouse.disableContextMenu()
        let i = this.input.on('pointerdown', this.onPointerDown, this)
        

        this.playerControls.dig.forEach(element => { element.on('down', this.onDig, this) })
        this.playerControls.goUp.forEach(element => { element.on('down', this.goUp, this) })
    }

    onPause(){
        this.reduceVolume()
        this.scene.pause()
        this.scene.run('pause', { game: this })
    }

    onPointerDown(pointer){
        if(pointer.rightButtonDown()){
            this.goUp()
        } else if(this.currentTileHovered){
            this.dig(this.currentTileHovered.collisionCallback())
        }
    }

    onDig(){
        this.dig()
    }

    dig(fileObject?: FileChild){
        if(this.player.isDigging() || this.player.isGoingUp()) return
        if(!fileObject){
            fileObject = this.fileLayer.getTileAtWorldXY(this.player.x, this.player.y + Game.TILE_SIZE)?.collisionCallback()
        } 

        if(fileObject){
            this.player.setPosition(fileObject.getX() + fileObject.getWidth()/2, fileObject.getY() + fileObject.getHeight()/2)
            
            if(this.mapContext.file.children) {
                if(this.mapContext.selectedId !== -1){
                    this.mapContext.path.push(this.mapContext.selectedId)
                }
                this.mapContext.selectedId = fileObject.getFile().id
                this.mapContext.file = this.mapContext.file.children[fileObject.getFile().id]
                this.mapContext.selected = fileObject.getFile().name
                if(this.freezing){
                    this.restart()
                } else {
                    this.player.dig()
                }
            }
        } 
    }

    goUp(){
        if(this.player.isDigging() || this.player.isGoingUp()) return
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

            if(this.freezing){
                this.restart()
            } else {
                this.player.goUp()
            }
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

    clearKeys(){
        Object.keys(this.playerControls).forEach(el => {
            let e:Phaser.Input.Keyboard.Key[] = this.playerControls[el]
            e.forEach((el: Phaser.Input.Keyboard.Key) => {
                this.input.keyboard.removeCapture(el.keyCode)
            })
        })

    }

    startMap(){
        if(this.mapContext && typeof this.mapContext?.selected !== "string"){
            this.mapContext.selected = this.mapContext.selected.getName()
        }
        this.clearKeys()

        this.incomingMonster = []
        this.reduceVolume()
        this.scene.setVisible(false, "game-ui")
        //this.scene.stop("game-ui")
        this.scene.start('map', { mapContext: this.mapContext, lastScene: this.scene.key })
    }

    reduceVolume(){
        this.sound.stopByKey('running')
        let new_vol = Game.MUSIC_VOLUME - 0.1
        if(new_vol > 0){
            this.sound.volume = new_vol
        } else {
            this.sound.volume = 0
        }
    }

    handleFreeze(){
        this.freezing = !this.freezing
        Log.addInformation(LogConstant.FREEZE, { state: this.freezing })
        this.freezeLayer.visible = this.freezing
        
        if(this.freezing){
            this.cameras.main.stopFollow()
            this.reduceVolume()
            this.physics.pause()
            this.anims.pauseAll()
            // this.fileChildren.forEach((el:FileChild) => { el.showName() })
        } else {
            this.cameras.main.startFollow(this.player, undefined, 0.4, 0.4)
            this.sound.volume = Game.MUSIC_VOLUME
            this.physics.resume()
            this.anims.resumeAll()
            // this.fileChildren.forEach((el:FileChild) => { el.showName(false) })
        }
    }

    create(data){
        this.sound.volume = Game.MUSIC_VOLUME
        console.log('game scene started')

        Log.addInformation(LogConstant.START_ROOM, this.mapContext)
        
        // This should be a "once" I think
        sceneEvents.on('player-dead', () => {
            Log.addInformation(LogConstant.DIE, this.mapContext)
            this.scene.restart()
        })

        sceneEvents.on('player-dig-done', () => {
            Log.addInformation(LogConstant.DIG, this.mapContext)
            this.restart()
        })

        sceneEvents.on('player-go-up-done', () => {
            Log.addInformation(LogConstant.GO_UP, this.mapContext)
            this.restart()
        })

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off('player-dead')
            sceneEvents.off('player-dig-done')
            sceneEvents.off('player-go-up-done')
        })

        this.incomingMonster = []

        this.fileChildren = []
        if(data?.mapContext){
            this.mapContext = data.mapContext
            this.sonarQubeData = this.mapContext.file
        } else {
            this.sonarQubeData = this.fileTree[0]
            this.mapContext = {
                file: this.sonarQubeData,
                path: [0],
                selected: "root",
                selectedId:-1
            }
        }

        // Launch UI
        sceneEvents.emit('room-file-update', this.mapContext.file.name)
        this.scene.setVisible(true, "game-ui")
        sceneEvents.emit("monster-reset")
        sceneEvents.emit('player-dead-ui')


        this.generation()



        // Create anims
        createCharacterAnims(this.anims)
        createMonsterAnims(this.anims)


        // Camera management
        let cam = this.cameras.main
        let center = Game.TILE_SIZE * this.dungeon_size / 2
        cam.centerOn(center, center)
        cam.zoom = 2
        cam.setBackgroundColor(0x070707)


        // Character
        this.player = this.add.player(center + 16, center + 16, 'character', 0)
        this.player.setDepth(1)
        cam.startFollow(this.player, undefined, 0.4, 0.4)

        // Character Sword
        this.sword = this.add.sword(this.player.x, this.player.y, 'sword', 7)

        // Enemies
        let this_game = this
        this.enemies = this.physics.add.group({
            classType: Monster,
            createCallback: (go) => {
                const enemyGo = go as Monster
                enemyGo.body.enable = false
                enemyGo.setBounce(0.2)
                // enemyGo.setInteractive()
                enemyGo.initialize()
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

            let tileHovered = this_game.fileLayer.getTileAtWorldXY(pointer.worldX, pointer.worldY)
            if(tileHovered){
                if(this_game.freezing) this_game.tooltip.setVisible(true)
                document.body.style.cursor = 'pointer';
                this_game.currentTileHovered = tileHovered
                
                this_game.tooltip.setText(this_game.tooltip.getWrappedText(tileHovered.collisionCallback().getInfoString()))
            }  else {
                this_game.tooltip.setVisible(false)
                document.body.style.cursor = 'default';
                this_game.currentTileHovered = undefined
            }
        }, this)


        
        this.fileChildren.forEach(this.newMonster, this)

        
        this.physics.add.collider(this.player, this.wall1Layer)
        this.physics.add.collider(this.enemies, this.wall1Layer)
        this.physics.add.collider(this.player, this.wall2Layer)
        this.physics.add.collider(this.enemies, this.wall2Layer)
        this.physics.add.collider(this.enemies, this.enemies)


        

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.scene.setVisible(false, "game-ui")
            //this.scene.stop("game-ui")
        })
    }

    newMonster(file:FileChild){
        this.incomingMonster.push({
            durationLeft: 500*Math.floor((Math.random()+1)*2.5),
            callback: () => { 
                file.getMonster()
                this.newMonster(file)
            }
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

        if(this.sonarQubeData.children){
            nbFile = this.sonarQubeData.children.length
        } else {
            nbFile = 0
        }

        let nbFileBySide = Math.ceil(Math.sqrt(nbFile))

        this.dungeon_size = (Game.NB_TILE_PER_FILE + Game.ROW_SIZE) * Game.MIN_NB_FILE_LIMIT_ROW + 3

        if(nbFileBySide >= Game.MIN_NB_FILE_LIMIT_ROW){
            this.dungeon_size = (Game.NB_TILE_PER_FILE + Game.ROW_SIZE) * nbFileBySide + 4
        }


        this.setGroundTexture()
        this.generateGround()

        // Add File delimitation layer
        this.fileLayerGround = this.newLayer(Game.TILE_SIZE, this.dungeon_size-2)
        this.fileLayer = this.newLayer(Game.TILE_SIZE, this.dungeon_size-2)
        let baseX = Game.ROW_SIZE/2 + 2
        let baseY = baseX

        let file

        for(let i=0; i < nbFile; i++){
            file = this.sonarQubeData.children[i]
            file.id = i
            this.generateFileLimitation(
                baseX + (i % nbFileBySide) * (Game.NB_TILE_PER_FILE + Game.ROW_SIZE), 
                baseY + Math.floor(i / nbFileBySide) * (Game.NB_TILE_PER_FILE + Game.ROW_SIZE), 
                Game.NB_TILE_PER_FILE, file)
        }
        
        if(nbFile === 0){
            // We are in a leaf
            this.sonarQubeData.id = 0
            this.generateFileLimitation(
                Math.floor(this.dungeon_size/2) - 2, 
                Math.floor(this.dungeon_size/2) - 2, 
                Game.NB_TILE_PER_FILE + 2, this.sonarQubeData)

        }

        this.generateMusic()
        

        
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

        if(this.player.getHealth() <= 0 && this.playerMonsterCollider !== null
            && this.playerMonsterCollider !== undefined) {
            this.playerMonsterCollider.destroy()
            this.playerMonsterCollider = null
            
        }

    }

    generateFileLimitation(x:number, y:number, size:number, file:{id:number, name: string, type: string, path: string, key: string, measures: {metric: string, value:string, bestValue: boolean}[], children:any[]|undefined}){
        let l = new Array(size).fill(ConstantsTiles.EMPTY)
        let t = new Array()
        for(let i=0; i < size; i++){
            t.push(Array.from(l))
        }

        let childSecurityRating = file.measures.find(measure => measure.metric === 'security_rating')?.value
        
        let childWallTexture

        if(childSecurityRating){
            childWallTexture = 5 - Math.floor(parseFloat(childSecurityRating))
        } else {
            childWallTexture = 0
        }


        t[0].fill(ConstantsTiles.FILE_LIMIT_TOP + childWallTexture * ConstantsTiles.tileDistance)
        t[0][0] = ConstantsTiles.FILE_LIMIT_TOP_LEFT + childWallTexture * ConstantsTiles.tileDistance
        t[0][size-1] = ConstantsTiles.FILE_LIMIT_TOP_RIGHT + childWallTexture * ConstantsTiles.tileDistance

        t[size-1].fill(ConstantsTiles.FILE_LIMIT_BOTTOM + childWallTexture * ConstantsTiles.tileDistance)
        t[size-1][size-1] = ConstantsTiles.FILE_LIMIT_BOTTOM_RIGHT + childWallTexture * ConstantsTiles.tileDistance
        t[size-1][0] = ConstantsTiles.FILE_LIMIT_BOTTOM_LEFT + childWallTexture * ConstantsTiles.tileDistance

        for(let i=1; i < size-1; i++){
            t[i][0] = ConstantsTiles.FILE_LIMIT_LEFT + childWallTexture * ConstantsTiles.tileDistance
            t[i][size-1] = ConstantsTiles.FILE_LIMIT_RIGHT + childWallTexture * ConstantsTiles.tileDistance
        }
 
        this.fileLayer.putTilesAt(t, x, y)//.alpha = 0.5

        

        let childReliabilityRating = file.measures.find(measure => measure.metric === 'reliability_rating')?.value
        let childSqaleRating = file.measures.find(measure => measure.metric === 'sqale_rating')!.value

        let childGroundTexture

        if(childReliabilityRating){
            childGroundTexture = 5 - Math.floor(parseFloat(childReliabilityRating))
        } else {
            childGroundTexture = 0
        }

        let l2 = new Array(size).fill(ConstantsTiles.GROUND_CLEAN + childGroundTexture * ConstantsTiles.tileDistance)
        let t2 = new Array()
        for(let i=0; i < size; i++){
            t2.push(Array.from(l2))
        }

        this.fileLayerGround.putTilesAt(t2, x, y)


        let fileChild = new FileChild(file, this, x*Game.TILE_SIZE, y*Game.TILE_SIZE, size*Game.TILE_SIZE, size*Game.TILE_SIZE)
        this.fileChildren.push(fileChild)

        this.fileLayer.tilemap.setTileLocationCallback(x, y, size, size, (): FileChild => {
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
            this.updateCamera()
            return
        } 
        
        let index = this.incomingMonster.length - 1
        let el
      
        while (index >= 0) {
            el = this.incomingMonster[index]
            el.durationLeft -= dt
            if(el.durationLeft < 0){
                el.callback()
                this.incomingMonster.splice(index, 1);
            }
            index -= 1
        }
      


        this.player.update(this.playerControls, this.sword, dt)

        let file: FileChild = this.fileLayer.getTileAtWorldXY(this.player.x, this.player.y + Game.TILE_SIZE)?.collisionCallback()
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

    updateCamera(){
        const cam = this.cameras.main
        const cameraPositionOffset = new Phaser.Math.Vector2(0, 0)

        // Left
        if(this.playerControls.left.some(el => el.isDown)) {
            cameraPositionOffset.x = -1
        }

        // Right
        else if(this.playerControls.right.some(el => el.isDown)) {
            cameraPositionOffset.x = 1
        }

        // Up
        if(this.playerControls.up.some(el => el.isDown)) {
            cameraPositionOffset.y = -1
        }

        // Down
        else if(this.playerControls.down.some(el => el.isDown)) {
            cameraPositionOffset.y = 1
        }

        cameraPositionOffset.normalize().scale(Game.CAMERA_SPEED)
        cam.setScroll(cam.scrollX + cameraPositionOffset.x, cam.scrollY + cameraPositionOffset.y)
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
    
    newLayerWH(tile_size:number, width:number, height:number, tilesString:string = "tiles"){
        const map = this.make.tilemap({
            tileWidth: tile_size,
            tileHeight: tile_size,
            width: width,
            height: height
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

    filledMapWH(width: number, height: number, tile=-1){
        let l = new Array(width).fill(tile)
        let t = new Array(height).fill(l)

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

    setGroundTexture(){
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

         this.reliability_rating = this.sonarQubeData.measures.find(measure => measure.metric === 'reliability_rating').value
         this.sqale_rating = this.sonarQubeData.measures.find(measure => measure.metric === 'sqale_rating').value
         this.groundTexture = 5 - Math.floor(this.reliability_rating)
    }

    generateGround(){
        const probaCracked = -0.2 + this.sqale_rating*0.2
        const probaSlightlyCracked = 0.2
        const probaClean = 1 - probaCracked - probaSlightlyCracked
        

        // Add ground layer
        const fundationLayer = this.newLayer(Game.TILE_SIZE, this.dungeon_size)
        fundationLayer.putTilesAt(this.filledMap(this.dungeon_size, ConstantsTiles.EMPTY/*ConstantsTiles.GROUND_CLEAN + this.groundTexture * ConstantsTiles.tileDistance*/), 0, 0)
        
        // the parameters (..., 1, 1) force the first column and line of the layer to be ignored.
        // It does not display the layer from these coordinates. So, the layer has 5 column and 5 rows even if we want only 4 
        //this.groundLayer = this.newLayer(Game.TILE_SIZE, this.dungeon_size-2)
        this.groundLayer = this.newLayerWH(Game.TILE_SIZE, this.dungeon_size + 2, this.dungeon_size)

        // But the map is like displayed from theses coordinates
        this.groundLayer.putTilesAt(this.filledMapWH(this.dungeon_size - 2, this.dungeon_size - 4, ConstantsTiles.GROUND_CLEAN + this.groundTexture * ConstantsTiles.tileDistance), 1, 2)

        
        // for(let i=0; i < this.dungeon_size; i++){
        //     this.groundLayer.putTileAt(ConstantsTiles.EMPTY, 0, i)
        // }
        // for(let i=0; i < this.dungeon_size; i++){
        //     this.groundLayer.putTileAt(ConstantsTiles.EMPTY, this.dungeon_size, i)
        // }
        // for(let i=0; i < this.dungeon_size; i++){
        //     this.groundLayer.putTileAt(ConstantsTiles.EMPTY, i, 0)
        // }
        // for(let i=0; i < this.dungeon_size; i++){
        //     this.groundLayer.putTileAt(ConstantsTiles.EMPTY, i, this.dungeon_size)
        // }
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
    }

    generateMusic(){
        // Add music of room
        // Switch case based on the reliability_rating (1.0=A -> 5.0=E)
     
        const reliability_rating = this.sonarQubeData.measures.find(measure => measure.metric === 'reliability_rating').value
        switch(reliability_rating) {
            default:
            case '1.0':
                if (!this.sound.get('ambient_a')) {
                    this.sound.removeAll()
                    this.sound.play('ambient_a', { loop: true, volume: Game.MUSIC_VOLUME })
                }
                break
            case '2.0':
                if (!this.sound.get('ambient_b')) {
                    this.sound.removeAll()
                    this.sound.play('ambient_b', { loop: true, volume: Game.MUSIC_VOLUME })
                }
                break
            case '3.0':
                if (!this.sound.get('ambient_c')) {
                    this.sound.removeAll()
                    this.sound.play('ambient_c', { loop: true, volume: Game.MUSIC_VOLUME })
                }
                break
            case '4.0':
                if (!this.sound.get('ambient_d')) {
                    this.sound.removeAll()
                    this.sound.play('ambient_d', { loop: true, volume: Game.MUSIC_VOLUME })
                }
                break
            case '5.0':
                if (!this.sound.get('ambient_e')) {
                    this.sound.removeAll()
                    this.sound.play('ambient_e', { loop: true, volume: Game.MUSIC_VOLUME })
                }
                break
        }
    }
}
