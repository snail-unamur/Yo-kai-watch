import { createMonsterAnims } from "~/animations/MonsterAnimation";
import { createCharacterAnims } from "~/animations/PlayerAnimation";
import { createUIAnims } from "~/animations/UIAnimation";
import Monster from "~/enemies/Monster";
import { sceneEvents } from "~/events/EventCenter";
import { ConstantsTiles, LogConstant, TileSetName } from "~/utils/Const";
import { Global } from "~/utils/Global";
import Log from "~/utils/Log";
import FileChild from "./FileChild";
import Game from "./Game";

export default class Tutorial extends Game{
    private exitText = "exit_place.php"
    private textColor = "#000000"
    
    constructor(){
        super('tutorial')
    }

    digProcess(fileObject: FileChild){
        let name = fileObject.getFile().name
        if(TileSetName.tilesets.find(el => el === name)){
            Global.tileset = fileObject.getFile().name
            this.restart()
        } else {
            super.digProcess(fileObject)
        }
    }

    create(data) {
        Log.print(data, "Tutorial data:")
        Log.print(this.mapContext, "Tutorial initial this.mapContext:")
        createUIAnims(this.anims)
        this.sound.volume = Game.MUSIC_VOLUME
        console.log("create tutorial")

        
        this.fileTree = Global.fileTree
        FileChild.projectIssues = Global.issues
        
        Log.addInformation(LogConstant.START_ROOM, this.mapContext)

        // This should be a "once" I think
        sceneEvents.on('player-dead', () => {
            Log.addInformation(LogConstant.DIE, this.mapContext)
            this.scene.restart()
        })

        sceneEvents.on('player-dig-done', () => {
            Log.addInformation(LogConstant.DIG, this.mapContext)
            switch(this.mapContext.selected){
                case this.exitText:
                    this.exit()
                    break;
                default:
                    this.restart()

            }
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
            this.scene.setVisible(false, "game-ui")
        })

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
        Log.print(this.mapContext, "Tutorial this.mapContext:")

        // Launch UI
        sceneEvents.emit('room-file-update', this.mapContext.file.name)
        this.scene.setVisible(true, "game-ui")
        sceneEvents.emit("monster-reset")
        sceneEvents.emit('player-dead-ui')


        if(this.mapContext.path.length === 1 && this.mapContext.selected === "root"){
            this.generationRoot()
        } else {
            this.setGroundTexture()
            this.generation()
        }


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
        this.sword = this.add.sword(this.player.x, this.player.y, 'slash', 6)

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
                    if(this_game.freezing) this_game.tooltip.setVisible(true)
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
        this.freezeLayer.fill(0x000000, 0)
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
        this.tooltip.setWordWrapWidth(500)
        this.tooltip.setBackgroundColor('black')
        this.tooltip.setAlpha(1)
        this.tooltip.setVisible(false)
        this.tooltip.setDepth(100) // put the tooltip in front of every other things



        
        this.fileChildren.forEach(this.newMonster, this)

        
        this.physics.add.collider(this.player, this.wall1Layer)
        this.physics.add.collider(this.enemies, this.wall1Layer)
        this.physics.add.collider(this.player, this.wall2Layer)
        this.physics.add.collider(this.enemies, this.wall2Layer)
        this.physics.add.collider(this.enemies, this.enemies)
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
        document.body.style.cursor = 'default';
        this.scene.start('menu_projects')
        console.log("exit tutorial")
    }

    
    newMonster(file:FileChild){
        file.getMonster()?.setCanMove(false)
    }

    generation() {
        let nbFile

        if(this.sonarQubeData.children){
            nbFile = this.sonarQubeData.children.length
        } else {
            nbFile = 0
        }

        super.generation()

        if(nbFile === 0){
            const space = 0.8
                
            this.addKey(
                this.dungeon_size * 0.3 * Game.TILE_SIZE,
                Game.TILE_SIZE * 3.5,
                "Tab", "Minimap", true, "#000000")

                
            this.addKey(
                (this.dungeon_size * 0.7 + space) * Game.TILE_SIZE,
                Game.TILE_SIZE * 3.5,
                "E", undefined, false, "#000000")


            this.add.text(
                (this.dungeon_size * 0.7 - 0.1) * Game.TILE_SIZE,
                Game.TILE_SIZE * 3.5,
                "or")
                .setScale(0.5)
                .setOrigin(0.5, 0.5)
                .setColor(this.textColor)
                .setAlign('center')
                .setBackgroundColor('#FFFFFF')
                .setAlpha(0.7)

                


            this.add.text(
                (this.dungeon_size * 0.7) * Game.TILE_SIZE,
                Game.TILE_SIZE * 2.5,
                "Go up with")
                .setScale(0.5)
                .setOrigin(0.5, 0.5)
                .setColor(this.textColor)
                .setAlign('center')
                .setBackgroundColor('#FFFFFF')
                .setAlpha(0.7)


            let rc = this.add.sprite(
                (this.dungeon_size * 0.7 - space) * Game.TILE_SIZE,
                Game.TILE_SIZE * 3.5,
                "right_click").setAlpha(0.7).setOrigin(0.5, 0.5)

            rc.play("right_click_anim")
        }
    }

    generateSettings(){
        let nbFile

        this.wallTexture = 5
        this.groundTexture = 5
        if(this.sonarQubeData.children){
            nbFile = this.sonarQubeData.children.length
        } else {
            nbFile = 12
        }

        this.dungeon_size = 27
        this.generateGround()

        let themeFile = {
            "name": this.exitText,
            "type": "FIL",
            "path": `root/${this.exitText}`,
            "key": `project-key-example:${this.exitText}`,
            "id": 0,
            "measures": [
                {
                    "metric": "reliability_rating",
                    "value": "0.0",
                    "bestValue": true
                },
                {
                    "metric": "security_rating",
                    "value": "0.0",
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
            ],
            children:undefined
        }

        this.fileLayerGround = this.newLayer(Game.TILE_SIZE, this.dungeon_size-2)
        this.fileLayer = this.newLayer(Game.TILE_SIZE, this.dungeon_size-2)
        // Theme selection
        let themeY = 3
        let themeX = 4
        TileSetName.tilesets.forEach((tilesetName, index) => {
            let theme = JSON.parse(JSON.stringify(themeFile))
            theme.name = tilesetName
    
            this.generateFileLimitation(themeX + 4 * index, themeY, Game.NB_TILE_PER_FILE, theme)
        })
        let walls = this.createWalls(Game.TILE_SIZE, this.dungeon_size)
        this.wall1Layer = walls[0]
        this.wall2Layer = walls[1]
    }

    generationRoot() {
        Log.print(this.sonarQubeData, "Tutorial data:")
        this.wallTexture = 5
        this.groundTexture = 5
        // This function is called only in the root room then we can
        // make the assumption that we're in it. Thus we will place 
        // files manually, not with the automatic way
        let nbFile: number = 0
        if(this.sonarQubeData.children){
            nbFile = this.sonarQubeData.children.length
        }

        this.dungeon_size = 27
        this.generateGround()

        // Add File delimitation layer
        this.fileLayerGround = this.newLayer(Game.TILE_SIZE, this.dungeon_size-2)
        this.fileLayer = this.newLayer(Game.TILE_SIZE, this.dungeon_size-2)
        let baseX = 2
        let baseY = 9


        // Place first file
        let fileId = 0

        // CODE SMELLS FILE GENERATION
        for(let i=0; i<3; i++){
            this.sonarQubeData.children[fileId+i].id = fileId+i
            this.generateFileLimitation(
                baseX, 
                baseY + i * (Game.NB_TILE_PER_FILE + 1), 
                Game.NB_TILE_PER_FILE, this.sonarQubeData.children[fileId+i])
        }
        fileId += 3



        // BUGS FILE GENERATION
        for(let i=0; i<3; i++){
            this.sonarQubeData.children[fileId + i].id = fileId+i
            this.generateFileLimitation(
                this.dungeon_size - baseX - 3, 
                baseY + (2-i) * (Game.NB_TILE_PER_FILE + 1), 
                Game.NB_TILE_PER_FILE, this.sonarQubeData.children[fileId+i])
        }
        fileId += 3



        // VULNERABILITIES FILE GENERATION
        let vulnerabilitiesStartingX = Math.ceil(this.dungeon_size / 2 - (Game.NB_TILE_PER_FILE + 1) * 1.5)

        for(let i=0; i<3; i++){
            this.sonarQubeData.children[fileId+i].id = fileId+i
            this.generateFileLimitation(
                vulnerabilitiesStartingX + i * (Game.NB_TILE_PER_FILE + 1), 
                this.dungeon_size - 6, 
                Game.NB_TILE_PER_FILE, this.sonarQubeData.children[fileId+i])
        }
        fileId += 3



        let leftRoomExampleX = 7
        let rightRoomExampleX = this.dungeon_size - 5 - leftRoomExampleX
        let roomExampleY = 5

        this.generateFileExample(leftRoomExampleX, roomExampleY, fileId)
        fileId++
        this.generateFileExample(rightRoomExampleX, roomExampleY, fileId)


        // Generate exit tile in the center
        let exitFile = {
            "name": this.exitText,
            "type": "FIL",
            "path": `root/${this.exitText}`,
            "key": `project-key-example:${this.exitText}`,
            "id": 0,
            "measures": [
                {
                    "metric": "reliability_rating",
                    "value": "0.0",
                    "bestValue": true
                },
                {
                    "metric": "security_rating",
                    "value": "0.0",
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
            ],
            children:undefined
        }
        let exitTiles = {
            x: Math.floor(this.dungeon_size/2) - 2,
            y: Math.floor(this.dungeon_size/2) - 2,
            size: Game.NB_TILE_PER_FILE + 2
        }
        

        this.add.text(
            exitTiles.x * Game.TILE_SIZE + (Game.NB_TILE_PER_FILE + 2) * Game.TILE_SIZE / 2, 
            (exitTiles.y - 1) * Game.TILE_SIZE + (Game.NB_TILE_PER_FILE + 2) * Game.TILE_SIZE / 2, 
            "Dig this place\nto exit\nthe tutorial").setScale(0.5).setOrigin(0.5, 0.5).setColor(this.textColor)
            .setAlign('center')
            .setBackgroundColor('#FFFFFF')
            .setAlpha(0.7)

        this.generateFileLimitation(
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


        let sizeKeyDistance = 2.5
        this.addKey(
            (exitTiles.x + exitTiles.size +sizeKeyDistance) * Game.TILE_SIZE, 
            (exitTiles.y + exitTiles.size +sizeKeyDistance) * Game.TILE_SIZE, 
            "X", "(un)freeze")

        this.addKey(
            (exitTiles.x -sizeKeyDistance) * Game.TILE_SIZE, 
            (exitTiles.y + exitTiles.size +sizeKeyDistance) * Game.TILE_SIZE, 
            "space", "Attack", true)

        if(!this.sound.get('main_theme')){
            this.sound.removeAll()
            this.sound.play('main_theme', { loop: true, volume: Game.MUSIC_VOLUME })
        }

        
        let settingsFile = JSON.parse(JSON.stringify(exitFile))
        settingsFile.name = "settings"
        settingsFile.id = fileId
        console.log(this.sonarQubeData.children)
        console.log(this.sonarQubeData.children[this.sonarQubeData.children.length - 1])

        this.generateFileLimitation(2, 2, Game.NB_TILE_PER_FILE - 1, this.sonarQubeData.children[this.sonarQubeData.children.length - 1])

        
        
        // Add walls layer
        let walls = this.createWalls(Game.TILE_SIZE, this.dungeon_size)
        this.wall1Layer = walls[0]
        this.wall2Layer = walls[1]
    }

    generateFileExample(roomExampleX, roomExampleY, fileId){
        this.sonarQubeData.children[fileId].id = fileId

        this.generateFileLimitation(
            roomExampleX, roomExampleY, 
            Game.NB_TILE_PER_FILE + 2, this.sonarQubeData.children[fileId])

        this.add.text(roomExampleX * Game.TILE_SIZE + (Game.NB_TILE_PER_FILE + 2)*Game.TILE_SIZE/2, 
            (roomExampleY - 0.5) * Game.TILE_SIZE + (Game.NB_TILE_PER_FILE + 2)*Game.TILE_SIZE/2, 
            "Dig a\nfile with").setScale(0.5).setOrigin(0.5, 0.5).setColor(this.textColor)
            .setAlign('center')
            .setBackgroundColor('#FFFFFF')
            .setAlpha(0.7)


        this.addKey(
            (roomExampleX - 0.8) * Game.TILE_SIZE + (Game.NB_TILE_PER_FILE + 2)*Game.TILE_SIZE/2, 
            (roomExampleY + 0.5) * Game.TILE_SIZE + (Game.NB_TILE_PER_FILE + 2)*Game.TILE_SIZE/2,
            "A")


        this.add.text(
            (roomExampleX + 0.1) * Game.TILE_SIZE + (Game.NB_TILE_PER_FILE + 2)*Game.TILE_SIZE/2, 
            (roomExampleY + 0.5) * Game.TILE_SIZE + (Game.NB_TILE_PER_FILE + 2)*Game.TILE_SIZE/2,
            "or")
            .setScale(0.5)
            .setOrigin(0.5, 0.5)
            .setColor(this.textColor)
            .setAlign('center')
            .setBackgroundColor('#FFFFFF')
            .setAlpha(0.7)


        let lc = this.add.sprite(
            (roomExampleX + 0.8) * Game.TILE_SIZE + (Game.NB_TILE_PER_FILE + 2)*Game.TILE_SIZE/2, 
            (roomExampleY + 0.5) * Game.TILE_SIZE + (Game.NB_TILE_PER_FILE + 2)*Game.TILE_SIZE/2,  "left_click").setAlpha(0.7).setOrigin(0.5, 0.5)
        lc.play("left_click_anim")
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
                .setBackgroundColor('#FFFFFF')
                .setAlpha(0.7)
        }
    }
}