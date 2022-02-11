import Phaser from 'phaser'
import Player from '~/characters/Player'
import '~/characters/Player'

import { createCharacterAnims } from '~/animations/PlayerAnimation'
import { createMonsterAnims } from '~/animations/MonsterAnimation'
import Monster from '~/enemies/Monster'

export default class Game extends Phaser.Scene{
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

    private player!: Player
    private enemies!: Phaser.Physics.Arcade.Group
    private groundLayer

	constructor(){
		super('game')
	}

	preload() {
        this.cursors = this.input.keyboard.createCursorKeys()

        let this_scene = this.scene
        let keyObj = this.input.keyboard.addKey('W') // Get key object
        keyObj.on('down', function(event) {
            console.log("restart")
            this_scene.restart()
        })

        /*this.load.image('tiles_reduced', 'dungeon_tiles.png')

        
         * In the following tileset "dungeon_tiles_full.png":
         * 1 tile = 16 pixels
         * 1 row = 32 tiles

        
        this.load.image('tiles', 'dungeon_tiles_full2.png')
        this.load.atlas('faune', 'fauna.png', 'fauna.json')*/
        
    }

    create(){
        // Create anims
        createCharacterAnims(this.anims)
        createMonsterAnims(this.anims)

        const dungeon_min = 16
        const dungeon_max = 24
        const dungeon_size = Math.floor(dungeon_min + (Math.random() * (dungeon_max - dungeon_min)))

        const tile_size = 16    

        // Add ground layer
        const fundationLayer = this.newLayer(tile_size, dungeon_size)
        fundationLayer.putTilesAt(this.filledMap(dungeon_size, Constants.ECHELLE), 0, 0)

        // Add ground layer
        
        // the parameters (..., 1, 1) force the first column and line of the layer to be ignored.
        // It does not display the layer from these coordinates. So, the layer has 5 column and 5 rows even if we want only 4 
        this.groundLayer = this.newLayer(tile_size, dungeon_size-2)

        // But the map is like displayed from theses coordinates
        this.groundLayer.putTilesAt(this.filledMap(dungeon_size-4, Constants.GROUND_CLEAN), 2, 2);

        // Add random cracked tiles
        for(let i=2; i < dungeon_size-2; i++){
            for(let j=2; j < dungeon_size-2; j++){
                if(Math.random() > 0.9){
                    this.groundLayer.putTileAt(Constants.GROUND_CRACK, i, j)
                }
            }
        }



        // Add File delimitation layer
        const fileLimitLayer = this.newLayer(tile_size, dungeon_size-2)

        //fileLimitLayer.putTilesAt(this.filledMap(dungeon_size-4, Constants.GROUND_CLEAN), 2, 2);
        //this.generateFileLimitation()

        const file_tiles_size = 4

        this.generateFileLimitation(fileLimitLayer, 3, 7, file_tiles_size)
        this.generateFileLimitation(fileLimitLayer, 6, 9, file_tiles_size)
        this.generateFileLimitation(fileLimitLayer, 4, 4, file_tiles_size)


        // Add treasure
        // treasure = 58
        const treasureLayer = this.newLayer(tile_size, dungeon_size)
        treasureLayer.putTileAt(Constants.TREASURE_CLOSED, 2, 2)

        
        // Add another layer
        //const acidLayer = this.newLayer(tile_size, dungeon_size/2, "tiles2")
        //acidLayer.putTilesAt(this.filledMap(8, 1), 0, 0);


        // Camera management
        let cam = this.cameras.main
        let center = tile_size * dungeon_size / 2
        cam.centerOn(center, center)
        cam.zoom = 2


        // Character
        this.player = this.add.player(center, center, 'player')

        // Enemies
        this.enemies = this.physics.add.group({
            classType: Monster,
            createCallback: (go) => {
                const enemyGo = go as Monster
                enemyGo.body.onCollide = true
            }
        })
        this.enemies.get(center + 50, center + 50, 'monster')
        
        // Add walls layer
        const wallLayer = this.createWalls(tile_size, dungeon_size)
        this.physics.add.collider(this.player, wallLayer)

        // Player monster collider
        this.physics.add.collider(this.player, this.enemies)

        //this.debugWalls(wallLayer)

    }

    generateFileLimitation(fileLayer:Phaser.Tilemaps.TilemapLayer, x:number, y:number, size:number){
        let l = new Array(size).fill(-1)
        let t = new Array()
        for(let i=0; i < size; i++){
            t.push(Array.from(l))
        }

        console.log(t)
        t[0].fill(Constants.WALL_TIP_INNER)
        t[0][0] = Constants.WALL_TOP_LEFT_INNER_CORNER
        t[0][size-1] = Constants.WALL_TOP_RIGHT_INNER_CORNER

        console.log(t)
        t[size-1].fill(Constants.WALL_TIP)
        t[size-1][size-1] = Constants.WALL_BOTTOM_RIGHT_CORNER_TIP
        t[size-1][0] = Constants.WALL_BOTTOM_LEFT_CORNER_TIP

        for(let i=1; i < size-1; i++){
            t[i][0] = Constants.WALL_LEFT
            t[i][size-1] = Constants.WALL_RIGHT
        }

        fileLayer.putTilesAt(t, x, y).alpha = 0.5
        for(let i=x; i < x+size; i++){
            for(let j=y; j < y+size; j++){
                this.groundLayer.putTileAt(Constants.GROUND_TOP_LEFT_HOLE, i, j)
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
            if (!this.physics.collide(enemyGo, this.player, undefined, undefined, enemyGo)) {
                enemyGo.runTowards(this.player.x, this.player.y)
            } else {
                console.log("collide");
                
                enemyGo.setVelocity(0, 0)
            }
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
            wallsLayer.putTileAt(Constants.WALL_FACE, i, 1).setCollision(true) // face of the wall
            wallsLayer.putTileAt(Constants.WALL_TIP, i, 0) // tip of the wall
            // Bottom walls
            wallsLayer.putTileAt(Constants.WALL_FACE, i, dungeon_size-2).setCollision(true) // face of the wall
            wallsLayer.putTileAt(Constants.WALL_TIP, i, dungeon_size-3) // tip of the wall
        }

        for(let i=2; i < dungeon_size - 3; i++){
            // Left walls
            wallsLayer.putTileAt(Constants.WALL_LEFT, 1, i) // face of the wall
            wallsLayer.putTileAt(0, 0, i).setCollision(true)
            // Right walls
            wallsLayer.putTileAt(Constants.WALL_RIGHT, dungeon_size-2, i) // face of the wall
            wallsLayer.putTileAt(0, dungeon_size-1, i).setCollision(true)
        }

        //      CORNERS
        // Top left corner
        wallsLayer.putTileAt(Constants.WALL_TOP_LEFT_CORNER, 1, 1).setCollision(true)
        wallsLayer.putTileAt(0, 0, 1).setCollision(true)
        wallsLayer.putTileAt(Constants.WALL_TIP_TOP_LEFT, 1, 0)// tip of the wall
        // Top right corner
        wallsLayer.putTileAt(Constants.WALL_TOP_RIGHT_CORNER,  dungeon_size - 2, 1).setCollision(true)
        wallsLayer.putTileAt(0, dungeon_size - 1, 1).setCollision(true)
        wallsLayer.putTileAt(Constants.WALL_TIP_TOP_RIGHT,  dungeon_size - 2, 0)// tip of the wall
        
        // Bottom left corner
        wallsLayer.putTileAt(Constants.WALL_BOTTOM_LEFT_CORNER_TIP, 1, dungeon_size - 3)// tip of the wall
        wallsLayer.putTileAt(0, 0, dungeon_size - 3).setCollision(true)
        wallsLayer.putTileAt(0, 0, dungeon_size - 2).setCollision(true)
        wallsLayer.putTileAt(Constants.WALL_BOTTOM_LEFT_CORNER, 1, dungeon_size - 2).setCollision(true)
        // Bottom right corner
        wallsLayer.putTileAt(Constants.WALL_BOTTOM_RIGHT_CORNER_TIP, dungeon_size - 2, dungeon_size - 3)// tip of the wall
        wallsLayer.putTileAt(0, dungeon_size - 1, dungeon_size - 3).setCollision(true)
        wallsLayer.putTileAt(0, dungeon_size - 1, dungeon_size - 2).setCollision(true)
        wallsLayer.putTileAt(Constants.WALL_BOTTOM_RIGHT_CORNER, dungeon_size - 2, dungeon_size - 2).setCollision(true)

        return wallsLayer
    }
}
