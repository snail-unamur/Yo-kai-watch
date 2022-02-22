import Phaser from 'phaser'

function createCharacterAnims(anims: Phaser.Animations.AnimationManager){
    // 144
    anims.create({
        key:'player-idle',
        frames: anims.generateFrameNumbers('animations_character', { start: 72, end: 75 }),
        repeat:-1,
        frameRate:7
    })

    anims.create({
        key: 'player-run',
        frames: anims.generateFrameNumbers('animations_character', { start: 75, end: 79 }),
        repeat: -1,
        frameRate: 15
    })

    anims.create({
        key: 'player-attack',
        frames: anims.generateFrameNumbers('animations_tiny_and_medium_monsters', { start: 33, end: 37 }),
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