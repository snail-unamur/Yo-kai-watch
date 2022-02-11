import Phaser from 'phaser'

function createCharacterAnims(anims: Phaser.Animations.AnimationManager){
    anims.create({
        key:'player-idle-down',
        frames: [{ key: 'player', frame: 'walk-down-3.png'}]
    })

    anims.create({
        key: 'player-idle-up',
        frames: [{ key: 'player', frame: 'walk-up-3.png' }]
    })

    anims.create({
        key: 'player-idle-side',
        frames: [{ key: 'player', frame: 'walk-side-3.png' }]
    })

    anims.create({
        key:'player-run-down',
        frames: anims.generateFrameNames('player', {start:1, end:8, prefix:'run-down-', suffix:'.png'}),
        repeat:-1,
        frameRate:15
    })
    
    anims.create({
        key: 'player-run-up',
        frames: anims.generateFrameNames('player', { start: 1, end: 8, prefix: 'run-up-', suffix: '.png' }),
        repeat: -1,
        frameRate: 15
    })

    anims.create({
        key: 'player-run-side',
        frames: anims.generateFrameNames('player', { start: 1, end: 8, prefix: 'run-side-', suffix: '.png' }),
        repeat: -1,
        frameRate: 15
    })

    anims.create({
        key: 'player-faint',
        frames: anims.generateFrameNames('player', { start: 1, end: 4, prefix: 'faint-', suffix: '.png' }),
        frameRate: 15
    })
}

export{
    createCharacterAnims
}