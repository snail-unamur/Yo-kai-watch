

export default class KeysGenerator{
    static textColor = "#000000"
    static keySize = 32
    static keyX = 20
    static keyY = 0

    constructor(){

    }

    static generateZQSD(scene: Phaser.Scene, up="z", left="q", right="d", down="s"){
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
    }

    static addKey(scene: Phaser.Scene, x: number, y: number, keyName: string, large:boolean = false){
        let keyId = "key"

        if(large){
            keyId = "large_key"
        }

        scene.add.image(x, y, keyId).setAlpha(0.7).setOrigin(0.5, 0.5).setScale(2)
        scene.add.text(x, y - 2, keyName).setOrigin(0.5, 0.5).setColor(KeysGenerator.textColor)
    }
}