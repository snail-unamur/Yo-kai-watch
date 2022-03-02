import { createMonsterAnims } from "~/animations/MonsterAnimation";
import { createCharacterAnims } from "~/animations/PlayerAnimation";
import Monster from "~/enemies/Monster";
import { sceneEvents } from "~/events/EventCenter";
import { ConstantsTiles, LogConstant, MonsterConstantsSize, MonsterConstantsType } from "~/utils/Const";
import { Global } from "~/utils/Global";
import Log from "~/utils/Log";
import FileChild from "./FileChild";
import Game from "./Game";

export default class Tutorial extends Game{

    private textColor = "#000000"

    private issueExample = {
        "severity": "MINOR",
        "component": "abc-map_abc-map:packages/server/src/utils/Validation.ts",
        "debt": "1min",
        "type": "CODE_SMELL"
    }

    private issues = [{
        "severity": "CRITICAL",
        "component": "abc-map_abc-map:packages/server/src/utils/Validation.ts",
        "debt": "1min",
        "type": "CODE_SMELL"
    },
    {
        "severity": "MINOR",
        "component": "abc-map_abc-map:packages/server/src/utils/Validation.ts",
        "debt": "1min",
        "type": "CODE_SMELL"
    },
    {
        "severity": "INFO",
        "component": "abc-map_abc-map:packages/server/src/utils/Validation.ts",
        "debt": "1min",
        "type": "CODE_SMELL"
    },
    {
        "severity": "CRITICAL",
        "component": "abc-map_abc-map:packages/server/src/utils/Validation.ts",
        "debt": "1min",
        "type": "VULNERABILITY"
    },
    {
        "severity": "MINOR",
        "component": "abc-map_abc-map:packages/server/src/utils/Validation.ts",
        "debt": "1min",
        "type": "VULNERABILITY"
    },
    {
        "severity": "INFO",
        "component": "abc-map_abc-map:packages/server/src/utils/Validation.ts",
        "debt": "1min",
        "type": "VULNERABILITY"
    },
    {
        "severity": "CRITICAL",
        "component": "abc-map_abc-map:packages/server/src/utils/Validation.ts",
        "debt": "1min",
        "type": "BUG"
    },
    {
        "severity": "MINOR",
        "component": "abc-map_abc-map:packages/server/src/utils/Validation.ts",
        "debt": "1min",
        "type": "BUG"
    },
    {
        "severity": "INFO",
        "component": "abc-map_abc-map:packages/server/src/utils/Validation.ts",
        "debt": "1min",
        "type": "BUG"
    }]
    
    constructor(){
        super('tutorial')
    }

    create(data) {
        FileChild.projectIssues = Global.issues
        console.log("create tutorial")
        this.fileTree = Global.fileTree
        
        Log.addInformation(LogConstant.START_ROOM, this.mapContext)
        sceneEvents.removeAllListeners('player-dead')
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
            this.sonarQubeData = this.fileTree[0]
            this.mapContext = {
                file: this.sonarQubeData,
                path: [0],
                selected: "root",
                selectedId:-1
            }
        }
        if(this.mapContext.path.length === 1 && this.mapContext.selected === "root"){
            this.generationRoot()
        } else {
            this.setGroundTexture()
            this.generation()
        }


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
        cam.setBackgroundColor(0x070707)


        // Character
        this.player = this.add.player(center, center, 'character', 0)
        this.player.setDepth(1)
        cam.startFollow(this.player)

        // Character Sword
        this.sword = this.add.sword(this.player.x, this.player.y, 'sword', 7)

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

    digProcess(fileObject: FileChild): void {
        if(fileObject.getName() === "exit_tutorial"){
            this.exit()
        } else {
            super.digProcess(fileObject)
        }
    }

    exit(){
        // Delete player controls
        Object.keys(this.playerControls).forEach(el => {
            let e:Phaser.Input.Keyboard.Key[] = this.playerControls[el]
            e.forEach((el: Phaser.Input.Keyboard.Key) => {
                this.input.keyboard.removeCapture(el.keyCode)
            })
        })

        sceneEvents.removeAllListeners()

        Log.addInformation(LogConstant.EXIT)
        this.scene.stop("game-ui")
        this.scene.stop()
        this.scene.start('menu_projects')
        console.log("exit tutorial")
    }

    
    newMonster(file:FileChild){
        this.incomingMonster.push({
            durationLeft: 500*Math.floor((Math.random()+1)*2.5),
            callback: () => { 
                file.getMonster()?.setCanMove(false)
                this.newMonster(file)
            }
        })
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


        this.generateGround()

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
            
            this.addKey(
                this.dungeon_size * 0.7 * Game.TILE_SIZE,
                Game.TILE_SIZE * 3.5,
                "E", "Go up", false, "#000000")
                
            this.addKey(
                this.dungeon_size * 0.3 * Game.TILE_SIZE,
                Game.TILE_SIZE * 3.5,
                "Tab", "Minimap", true, "#000000")

            // We are in a leaf
            this.sonarQubeData.id = 0
            this.generateFileLimitation(
                this.fileLayer, 
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

    generationRoot() {
        this.wallTexture = 5
        this.groundTexture = 5
        // This function is called only in the root room then we can
        // make the assumption that we're in it. Thus we will place 
        // files manually, not with the automatic way
        let nbFile

        if(this.sonarQubeData.children){
            nbFile = this.sonarQubeData.children.length
        } else {
            nbFile = 0
        }

        let nbFileBySide = Math.ceil(Math.sqrt(nbFile))

        this.dungeon_size = 23

        this.generateGround()

        // Add File delimitation layer
        this.fileLayer = this.newLayer(Game.TILE_SIZE, this.dungeon_size-2)
        let baseX = 3
        let baseY = 8

        let file


        // Place first file
        let fileId = 0

        for(let i=0; i<3; i++){
            this.generateFileLimitation(
                this.fileLayer, 
                2, 
                baseY + i * (Game.NB_TILE_PER_FILE + 1), 
                Game.NB_TILE_PER_FILE, this.sonarQubeData.children[fileId+i])
        }
        fileId += 3

        for(let i=0; i<3; i++){
            this.generateFileLimitation(
                this.fileLayer, 
                this.dungeon_size - 5, 
                baseY + (2-i) * (Game.NB_TILE_PER_FILE + 1), 
                Game.NB_TILE_PER_FILE, this.sonarQubeData.children[fileId+i])
        }
        fileId += 3

        for(let i=0; i<3; i++){
            this.generateFileLimitation(
                this.fileLayer, 
                6 + i * (Game.NB_TILE_PER_FILE + 1), 
                this.dungeon_size - 6, 
                Game.NB_TILE_PER_FILE, this.sonarQubeData.children[fileId+i])
        }
        fileId += 3

        
        this.generateFileLimitation(
            this.fileLayer, 
            6, 5, 
            Game.NB_TILE_PER_FILE, this.sonarQubeData.children[fileId])

        this.add.text(6 * Game.TILE_SIZE + Game.NB_TILE_PER_FILE*Game.TILE_SIZE/2, 
            4.5 * Game.TILE_SIZE + Game.NB_TILE_PER_FILE*Game.TILE_SIZE/2, 
            "Come here\nand press").setScale(0.5).setOrigin(0.5, 0.5).setColor(this.textColor)


        this.addKey(
            6 * Game.TILE_SIZE + Game.NB_TILE_PER_FILE*Game.TILE_SIZE/2, 
            5.5 * Game.TILE_SIZE + Game.NB_TILE_PER_FILE*Game.TILE_SIZE/2,
            "A")

        fileId++

        this.generateFileLimitation(
            this.fileLayer, 
            this.dungeon_size - 6 - 3, 5, 
            Game.NB_TILE_PER_FILE, this.sonarQubeData.children[fileId])
            
        this.add.text((this.dungeon_size - 6 - 3) * Game.TILE_SIZE + Game.NB_TILE_PER_FILE*Game.TILE_SIZE/2, 
            5 * Game.TILE_SIZE + Game.NB_TILE_PER_FILE*Game.TILE_SIZE/2, 
            "Click me").setScale(0.5).setOrigin(0.5, 0.5).setColor(this.textColor)

        // Generate exit tile in the center
        let exitFile = {
            "name": "exit_tutorial",
            "type": "FIL",
            "path": "root/exit_tutorial",
            "key": "project-key-example:exit_tutorial",
            "id": 0,
            "measures": [
                {
                    "metric": "reliability_rating",
                    "value": "1.0",
                    "bestValue": true
                },
                {
                    "metric": "security_rating",
                    "value": "1.0",
                    "bestValue": true
                },
                {
                    "metric": "sqale_rating",
                    "value": "1.0",
                    "bestValue": true
                },
                {
                    "metric": "code_smells",
                    "value": "0",
                    "bestValue": true
                },
                {
                    "metric": "bugs",
                    "value": "0",
                    "bestValue": true
                },
                {
                    "metric": "reliability_remediation_effort",
                    "value": "0",
                    "bestValue": true
                },
                {
                    "metric": "security_remediation_effort",
                    "value": "0",
                    "bestValue": true
                },
                {
                    "metric": "vulnerabilities",
                    "value": "0",
                    "bestValue": true
                },
                {
                    "metric": "sqale_index",
                    "value": "0",
                    "bestValue": true
                }
            ]
        }
        let exitTiles = {
            x: Math.floor(this.dungeon_size/2) - 2,
            y: Math.floor(this.dungeon_size/2) - 2,
            size: Game.NB_TILE_PER_FILE + 2
        }
        this.generateFileLimitation(
            this.fileLayer, 
            exitTiles.x, 
            exitTiles.y, 
            Game.NB_TILE_PER_FILE + 2, exitFile)

        this.addKey(
            (exitTiles.x + exitTiles.size / 2) * Game.TILE_SIZE, 
            (exitTiles.y - 0.5) * Game.TILE_SIZE, 
            "Z")

        this.addKey(
            (exitTiles.x + exitTiles.size / 2) * Game.TILE_SIZE, 
            (exitTiles.y + exitTiles.size + 0.5) * Game.TILE_SIZE, 
            "S")

        this.addKey(
            (exitTiles.x - 0.5) * Game.TILE_SIZE, 
            (exitTiles.y + exitTiles.size / 2) * Game.TILE_SIZE, 
            "Q")

        this.addKey(
            (exitTiles.x + exitTiles.size + 0.5) * Game.TILE_SIZE, 
            (exitTiles.y + exitTiles.size / 2) * Game.TILE_SIZE, 
            "D")

        this.addKey(
            (exitTiles.x + exitTiles.size + 1.5) * Game.TILE_SIZE, 
            (exitTiles.y + exitTiles.size + 1.5) * Game.TILE_SIZE, 
            "X", "(un)freeze")

        this.addKey(
            (exitTiles.x - 1.5) * Game.TILE_SIZE, 
            (exitTiles.y + exitTiles.size + 1.5) * Game.TILE_SIZE, 
            "space", "Attack", true)

        this.generateMusic()
        

        
        // Add walls layer

        let walls = this.createWalls(Game.TILE_SIZE, this.dungeon_size)
        this.wall1Layer = walls[0]
        this.wall2Layer = walls[1]

        // add wall texture examples
        let wallExampleX = 4
        let wallExampleY = 1
        let totalNbTextureExample = 15
        let totalNbVerticalTextureExample = 10
        for(let i=0; i < totalNbTextureExample; i++){
            this.wall2Layer.putTileAt(ConstantsTiles.WALL_FACE + Math.floor(i / Math.floor(totalNbTextureExample / 5)) * ConstantsTiles.tileDistance, wallExampleX+i, wallExampleY).setCollision(true)
            this.wall1Layer.putTileAt(ConstantsTiles.WALL_TIP + Math.floor(i / Math.floor(totalNbTextureExample / 5)) * ConstantsTiles.tileDistance, wallExampleX+i, wallExampleY-1)
        }
        this.add.text(this.dungeon_size * Game.TILE_SIZE / 2, Game.TILE_SIZE * 0.4, "Walls represent the security").setScale(0.5).setOrigin(0.5, 0.5).setColor(this.textColor)

        // add ground texture examples
        let groundExampleX = wallExampleX
        let groundExampleY = wallExampleY+1
        for(let i=0; i < totalNbTextureExample; i++){
            for(let j=0; j < Math.floor(totalNbVerticalTextureExample / 5); j++){
                this.groundLayer.putTileAt(ConstantsTiles.GROUND_CLEAN + Math.floor(i / Math.floor(totalNbTextureExample / 5)) * ConstantsTiles.tileDistance, groundExampleX + i, groundExampleY + j)
            }
        }
        this.add.text(this.dungeon_size * Game.TILE_SIZE / 2, Game.TILE_SIZE * 4.3, "Ground tiles represent the reliability").setScale(0.5).setOrigin(0.5, 0.5).setColor(this.textColor)

    }

    addKey(x: number, y: number, keyName: string, caption?:string, large:boolean = false, captionColor:string = this.textColor){
        let keyId = "key"

        if(large){
            keyId = "large_key"
        }

        this.add.image(x, y, keyId).setAlpha(0.7).setOrigin(0.5, 0.5)
        this.add.text(x, y - 0.5, keyName).setOrigin(0.5, 0.5).setScale(0.5).setColor(this.textColor)
        if(caption){
            this.add.text(
                x, y - 0.8 * Game.TILE_SIZE, 
                caption).setScale(0.5).setOrigin(0.5, 0.5).setColor(captionColor)
        }
    }
}