import Phaser from 'phaser'

import { createCharacterAnims } from '~/animations/PlayerAnimation'

export default class Game extends Phaser.Scene{
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private faune!: Phaser.Physics.Arcade.Sprite

	constructor(){
		super('game')
	}

	preload() {
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create() {
             
        const dungeon_size = 16
        const tile_size = 16    

        // Add ground layer
        const fundationLayer = this.newLayer(tile_size, dungeon_size)
        fundationLayer.putTilesAt(this.filledMap(dungeon_size, 18), 0, 0)

        // Add ground layer
        
        // the parameters (..., 1, 1) force the first column and line of the layer to be ignored.
        // It does not display the layer from these coordinates. So, the layer has 5 column and 5 rows even if we want only 4 
        const groundLayer = this.newLayer(tile_size, dungeon_size-2)

        // But the map is like displayed from theses coordinates
        groundLayer.putTilesAt(this.filledMap(dungeon_size-4, 41), 2, 2);

        // Add treasure
        // treasure = 58
        const treasureLayer = this.newLayer(tile_size, dungeon_size, "tiles")
        treasureLayer.putTileAt(58, 2, 2)

        
        // Add another layer
        //const acidLayer = this.newLayer(tile_size, dungeon_size/2, "tiles2")
        //acidLayer.putTilesAt(this.filledMap(8, 1), 0, 0);


        // Camera management
        let cam = this.cameras.main
        let center = tile_size * dungeon_size / 2
        cam.centerOn(center, center)
        cam.zoom = 2


        // Character
        this.faune = this.physics.add.sprite(128, 128, 'faune', 'walk-down-3.png')
        this.faune.body.setSize(this.faune.width * 0.5, this.faune.height * 0.8)

        createCharacterAnims(this.anims)
        
        this.faune.anims.play('faune-run-down')

        // Add walls layer
        const wallLayer = this.createWalls(tile_size, dungeon_size)
        this.physics.add.collider(this.faune, wallLayer)

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
        if(!this.cursors || !this.faune){
            return
        }

        const speed = 100

        if(this.cursors.left?.isDown) {
            this.faune.anims.play('faune-run-side', true)
            this.faune.setVelocity(-speed, 0)

            this.faune.scaleX = -1
            this.faune.body.offset.x = this.faune.body.width * 1.5

        } else if(this.cursors.right?.isDown){
            this.faune.anims.play('faune-run-side', true)
            this.faune.setVelocity(speed, 0)

            this.faune.scaleX = 1
            this.faune.body.offset.x = this.faune.body.width * 0.5

        } else if(this.cursors.up?.isDown){
            this.faune.anims.play('faune-run-up', true)
            this.faune.setVelocity(0, -speed)

        } else if(this.cursors.down?.isDown){
            this.faune.anims.play('faune-run-down', true)
            this.faune.setVelocity(0, speed)

        } else {
            this.faune.anims.play('faune-idle-down', true)
            this.faune.setVelocity(0, 0)
        }
    }


    newLayer(tile_size:number, dungeon_size:number, tilesString:string = "tiles"){

        tile_size = 16
        const map = this.make.tilemap({
            tileWidth: tile_size,
            tileHeight: tile_size,
            width: dungeon_size,
            height: dungeon_size
        })

        const tileset = map.addTilesetImage(tilesString, undefined, 16, 16, 0, 0)

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
            wallsLayer.putTileAt(12, i, 1).setCollision(true) // face of the wall
            wallsLayer.putTileAt(2, i, 0) // tip of the wall
            // Bottom walls
            wallsLayer.putTileAt(12, i, dungeon_size-2).setCollision(true) // face of the wall
            wallsLayer.putTileAt(2, i, dungeon_size-3) // tip of the wall
        }

        for(let i=2; i < dungeon_size - 3; i++){
            // Left walls
            wallsLayer.putTileAt(81, 1, i) // face of the wall
            wallsLayer.putTileAt(0, 0, i).setCollision(true)
            // Right walls
            wallsLayer.putTileAt(80, dungeon_size-2, i) // face of the wall
            wallsLayer.putTileAt(0, dungeon_size-1, i).setCollision(true)
        }

        //      CORNERS
        // Top left corner
        wallsLayer.putTileAt(82, 1, 1).setCollision(true)
        wallsLayer.putTileAt(0, 0, 1).setCollision(true)
        wallsLayer.putTileAt(72, 1, 0)// tip of the wall
        // Top right corner
        wallsLayer.putTileAt(83,  dungeon_size - 2, 1).setCollision(true)
        wallsLayer.putTileAt(0, dungeon_size - 1, 1).setCollision(true)
        wallsLayer.putTileAt(73,  dungeon_size - 2, 0)// tip of the wall
        
        // Bottom left corner
        wallsLayer.putTileAt(92, 1, dungeon_size - 3)// tip of the wall
        wallsLayer.putTileAt(0, 0, dungeon_size - 3).setCollision(true)
        wallsLayer.putTileAt(0, 0, dungeon_size - 2).setCollision(true)
        wallsLayer.putTileAt(102, 1, dungeon_size - 2).setCollision(true)
        // Bottom right corner
        wallsLayer.putTileAt(93, dungeon_size - 2, dungeon_size - 3)// tip of the wall
        wallsLayer.putTileAt(0, dungeon_size - 1, dungeon_size - 3).setCollision(true)
        wallsLayer.putTileAt(0, dungeon_size - 1, dungeon_size - 2).setCollision(true)
        wallsLayer.putTileAt(103, dungeon_size - 2, dungeon_size - 2).setCollision(true)

        return wallsLayer
    }
}
