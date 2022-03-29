import Game from "~/scenes/Game"

export default class KeysGenerator{
    static textColor = "#000000"
    static keySize = 32
    static keyX = 20
    static keyY = 0

    static readonly playerMovements = {
        up: [
            'W', 
            'UP'
        ],
        down: [
            'S', 
            'DOWN'
        ],
        left: [
            'A', 
            'LEFT'
        ],
        right: [
            'D', 
            'RIGHT'
        ]
    }

    static readonly playerControls = {
        dig: ['Q'],
        restart: ['Z'],
        openMap: [],
        attack: ['SPACE'],
        goUp: ['E'],
        freeze: ['X']
    }

    static readonly openMap = [
        'TAB'
    ]

    static readonly mapClosingKeys = [
        KeysGenerator.playerControls.dig,
        KeysGenerator.playerControls.openMap,
        KeysGenerator.playerControls.attack,
        ['ENTER', 'TAB']
    ]

    constructor(){

    }

    static generateZQSD(
        scene: Phaser.Scene,
        caption:boolean = false, 
        up=KeysGenerator.playerMovements.up[0], 
        left=KeysGenerator.playerMovements.left[0], 
        right=KeysGenerator.playerMovements.right[0], 
        down=KeysGenerator.playerMovements.down[0])
        {
        KeysGenerator.addKey(
            scene, 
            KeysGenerator.keyX, 
            scene.game.canvas.height - KeysGenerator.keyY - KeysGenerator.keySize, 
            left)

        KeysGenerator.addKey(
            scene, 
            KeysGenerator.keyX + KeysGenerator.keySize, 
            scene.game.canvas.height - KeysGenerator.keyY - KeysGenerator.keySize, 
            down)

        KeysGenerator.addKey(
            scene, 
            KeysGenerator.keyX + KeysGenerator.keySize*2, 
            scene.game.canvas.height - KeysGenerator.keyY - KeysGenerator.keySize,
            right)

        KeysGenerator.addKey(
            scene, 
            KeysGenerator.keyX + KeysGenerator.keySize, 
            scene.game.canvas.height - KeysGenerator.keyY - KeysGenerator.keySize*2,
            up)

        if(caption){
            scene.add.text(
                KeysGenerator.keyX + KeysGenerator.keySize, 
                scene.game.canvas.height - KeysGenerator.keyY - KeysGenerator.keySize*2 - 1.8 * Game.TILE_SIZE, 
                " movements ").setOrigin(0.5, 0.5).setColor("#000000")
                .setBackgroundColor('#FFFFFF').setPadding(2, 2)
        }
        
    }

    static addKey(scene: Phaser.Scene, x: number, y: number, keyName: string, caption?:string, large:boolean = false){
        let keyId = "key"

        if(large){
            keyId = "large_key"
        }

        scene.add.image(x, y, keyId).setOrigin(0.5, 0.5).setScale(2)
        scene.add.text(x, y - 2, keyName).setOrigin(0.5, 0.5).setColor(KeysGenerator.textColor)
    }
}