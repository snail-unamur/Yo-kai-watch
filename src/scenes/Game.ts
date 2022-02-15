import Phaser from 'phaser'
import Player from '~/characters/Player'
import '~/characters/Player'

import { createCharacterAnims } from '~/animations/PlayerAnimation'
import { createMonsterAnims } from '~/animations/MonsterAnimation'
import Monster from '~/enemies/Monster'

import { ConstantsTiles, MonsterConstantsSize, MonsterConstantsType } from '~/utils/Const'

import { sceneEvents } from '~/events/EventCenter'

export default class Game extends Phaser.Scene{
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

    private player!: Player
    private enemies!: Phaser.Physics.Arcade.Group
    private groundLayer!: Phaser.Tilemaps.TilemapLayer

    private freezeLayer
    private freezing: boolean = false
    private playerMonsterCollider?: Phaser.Physics.Arcade.Collider | null

	constructor(){
		super('game')
	}

	preload() {
        this.cursors = this.input.keyboard.createCursorKeys()

        let this_scene = this
        let keyObj = this.input.keyboard.addKey('W') // Get key object
        keyObj.on('down', function(event) {
            console.log("restart")
            this_scene.scene.restart()
        })

        keyObj = this.input.keyboard.addKey('X') // Get key object
        keyObj.on('down', function(event) {
            this_scene.handleFreeze()
        })
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

    create(){
        // Launch UI
        this.scene.run('game-ui')

        // Create anims
        createCharacterAnims(this.anims)
        createMonsterAnims(this.anims)


        const dungeon_min = 16
        const dungeon_max = 24
        const dungeon_size = Math.floor(dungeon_min + (Math.random() * (dungeon_max - dungeon_min)))

        const tile_size = 16    

        // Add ground layer
        const fundationLayer = this.newLayer(tile_size, dungeon_size)
        fundationLayer.putTilesAt(this.filledMap(dungeon_size, ConstantsTiles.GROUND_CRACK), 0, 0)

        // Add ground layer
        
        // the parameters (..., 1, 1) force the first column and line of the layer to be ignored.
        // It does not display the layer from these coordinates. So, the layer has 5 column and 5 rows even if we want only 4 
        this.groundLayer = this.newLayer(tile_size, dungeon_size-2)

        // But the map is like displayed from theses coordinates
        this.groundLayer.putTilesAt(this.filledMap(dungeon_size-4, ConstantsTiles.GROUND_CLEAN), 2, 2)

        // Add random cracked tiles
        for(let i=2; i < dungeon_size-2; i++){
            for(let j=2; j < dungeon_size-2; j++){
                if(Math.random() > 0.9){
                    this.groundLayer.putTileAt(ConstantsTiles.GROUND_CRACK, i, j)
                }
            }
        }



        // Add File delimitation layer
        const fileLimitLayer = this.newLayer(tile_size, dungeon_size-2)

        //fileLimitLayer.putTilesAt(this.filledMap(dungeon_size-4, ConstantsTiles.GROUND_CLEAN), 2, 2);
        //this.generateFileLimitation()

        const file_tiles_size = 4

        this.generateFileLimitation(fileLimitLayer, 3, 7, file_tiles_size)
        this.generateFileLimitation(fileLimitLayer, 6, 9, file_tiles_size)
        this.generateFileLimitation(fileLimitLayer, 4, 4, file_tiles_size)


        // Add treasure
        // treasure = 58
        const treasureLayer = this.newLayer(tile_size, dungeon_size)
        treasureLayer.putTileAt(ConstantsTiles.TREASURE_CLOSED, 2, 2)

        
        // Add another layer
        //const acidLayer = this.newLayer(tile_size, dungeon_size/2, "tiles2")
        //acidLayer.putTilesAt(this.filledMap(8, 1), 0, 0);


        // Camera management
        let cam = this.cameras.main
        let center = tile_size * dungeon_size / 2
        cam.centerOn(center, center)
        cam.zoom = 2


        // Character
        //this.player = this.add.player(center, center, 'player')
        this.player = this.add.player(center, center, 'player')

        // Enemies
        this.enemies = this.physics.add.group({
            classType: Monster,
            createCallback: (go) => {
                const enemyGo = go as Monster
                enemyGo.body.onCollide = true
            }
        })

        let enemy:Monster
        let c=-1

        let arr = [MonsterConstantsType.DEMON, MonsterConstantsType.GOBLIN, MonsterConstantsType.ZOMBIE]
        arr.forEach((monsterType:MonsterConstantsType) => {
            let c1=-1
            let arr2 = [MonsterConstantsSize.BIG, MonsterConstantsSize.MEDIUM, MonsterConstantsSize.TINY]
            arr2.forEach((monsterSize:MonsterConstantsSize) => {
                // enemy = this.enemies.get(center + 30 * c1, center + 80 * c, 'player')
                enemy = this.enemies.get(center + 80 * c1 / 2, center + 80 * c + 40, 'player')
                enemy.setMonsterType(monsterType)
                enemy.setMonsterSize(monsterSize)
                enemy.playAnim()
                enemy.setBounce(1)
                c1++
            })
            c++
        });

        
        // Add walls layer
        const wallLayer = this.createWalls(tile_size, dungeon_size)
        this.physics.add.collider(this.player, wallLayer)
        this.physics.add.collider(this.enemies, wallLayer)
        this.physics.add.collider(this.enemies, this.enemies)

        // Player monster collider
        this.playerMonsterCollider = this.physics.add.collider(this.player, this.enemies, this.handlePlayerMonsterCollision, undefined, this)

        //this.debugWalls(wallLayer)

        
        let gameCanvas = this.sys.game.canvas
        this.freezeLayer = this.add.renderTexture(0, 0, gameCanvas.width, gameCanvas.height)
        this.freezeLayer.fill(0x000000, 0.5)
        this.handleFreeze()
        this.handleFreeze()
    }

    handlePlayerMonsterCollision(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject) {
        const player = obj1 as Player
        const monster = obj2 as Monster

        const dx = player.x - monster.x
        const dy = player.y - monster.y

        const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)

        // player.setHit(1)

        player.handleDamage(dir)

        sceneEvents.emit('player-damage', player.getHealth())

        if(this.player.getHealth() <= 0 && this.playerMonsterCollider !== null
            && this.playerMonsterCollider !== undefined) {
            this.playerMonsterCollider.destroy()
            this.playerMonsterCollider = null
            
        }

    }

    generateFileLimitation(fileLayer:Phaser.Tilemaps.TilemapLayer, x:number, y:number, size:number){
        let l = new Array(size).fill(-1)
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

        fileLayer.putTilesAt(t, x, y).alpha = 0.5
        for(let i=x; i < x+size; i++){
            for(let j=y; j < y+size; j++){
                this.groundLayer.putTileAt(ConstantsTiles.GROUND_TOP_LEFT_HOLE, i, j)
            }
        }

        return t

        
    }

    debugWalls(wallsLayer:Phaser.Tilemaps.TilemapLayer){
        // debug Walls
        const debugGraphics = this.add.graphics().setAlpha(0.3)
        wallsLayer.renderDebug(debugGraphics, {
            //tileColor:new Phaser.Display.Color(40, 39, 37, 255),
            //faceColor: new Phaser.Display.Color(40, 39, 37, 255),
            collidingTileColor: new Phaser.Display.Color(243, 234, 48, 200)
        })
    }

    update(t:number, dt:number){
        if(!this.player){
            return
        }
        
        this.player.update(this.cursors)
        
        
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
}
