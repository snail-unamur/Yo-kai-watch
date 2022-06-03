import Phaser from 'phaser'

function createCharacterAnims(anims: Phaser.Animations.AnimationManager){
    // 144
    anims.create({
        key:'player-idle',
        frames: anims.generateFrameNumbers('character', { start: 0, end: 3 }),
        repeat:-1,
        frameRate:7
    })

    anims.create({
        key: 'player-run',
        frames: anims.generateFrameNumbers('character', { start: 4, end: 7 }),
        repeat: -1,
        frameRate: 15
    })

    anims.create({
        key: 'player-dig',
        frames: anims.generateFrameNumbers('character', { start: 10, end: 16 }),
        frameRate: 12
    })

    anims.create({
        key: 'player-go-up',
        frames: anims.generateFrameNumbers('character', { start: 20, end: 29 }),
        frameRate: 12
    })

    anims.create({
        key: 'slash',
        frames: anims.generateFrameNumbers('slash', { start: 0, end: 6 }),
        repeat: 0,
        frameRate: 40
    })
}

export{
    createCharacterAnims
}