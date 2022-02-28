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
        key: 'player-attack',
        frames: anims.generateFrameNumbers('sword', { start: 0, end: 4 }),
        repeat: 0,
        frameRate: 16
    })

    // No faint animation in the tilset yet
    /*anims.create({
        key: 'player-faint',
        frames: anims.generateFrameNames('player', { start: 1, end: 4, prefix: 'faint-', suffix: '.png' }),
        frameRate: 15
    })*/
}

export{
    createCharacterAnims
}