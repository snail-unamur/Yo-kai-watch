import Phaser from "phaser"

export const createMonsterAnims = (anims: Phaser.Animations.AnimationManager) => {
    const width: number = 12
    // ---------- TINY MONSTERS -------------
    // Tiny zombie
    anims.create({
        key: 'tiny-zombie-idle',
        frames: anims.generateFrameNumbers('small_medium_monsters', { start: 4, end: 7 }),
        repeat: -1,
        frameRate: 10
    })

    anims.create({
        key: 'tiny-zombie-run',
        frames: anims.generateFrameNumbers('small_medium_monsters', { start: 8, end: 11 }),
        repeat: -1,
        frameRate: 7
    })

    anims.create({
        key: 'tiny-zombie-appear',
        frames: anims.generateFrameNumbers('small_medium_monsters', { start: 0, end: 3 }),
        repeat: -1,
        frameRate: 3
    })

    // Tiny goblin
    anims.create({
        key: 'tiny-goblin-idle',
        frames: anims.generateFrameNumbers('small_medium_monsters', { start: 16, end: 19 }),
        repeat: -1,
        frameRate: 10
    })

    anims.create({
        key: 'tiny-goblin-run',
        frames: anims.generateFrameNumbers('small_medium_monsters', { start: 20, end: 23 }),
        repeat: -1,
        frameRate: 10
    })

    anims.create({
        key: 'tiny-goblin-appear',
        frames: anims.generateFrameNumbers('small_medium_monsters', { start: 12, end: 15 }),
        repeat: -1,
        frameRate: 3
    })

    // Tiny demon
    anims.create({
        key: 'tiny-demon-idle',
        frames: anims.generateFrameNumbers('small_medium_monsters', { start: 28, end: 31 }),
        repeat: -1,
        frameRate: 10
    })

    anims.create({
        key: 'tiny-demon-run',
        frames: anims.generateFrameNumbers('small_medium_monsters', { start: 32, end: 35 }),
        repeat: -1,
        frameRate: 10
    })

    anims.create({
        key: 'tiny-demon-appear',
        frames: anims.generateFrameNumbers('small_medium_monsters', { start: 24, end: 27 }),
        repeat: -1,
        frameRate: 3
    })

    // ---------- MEDIUM MONSTERS -------------
    // Medium zombie
    anims.create({
        key: 'medium-zombie-idle',
        frames: anims.generateFrameNumbers('small_medium_monsters', { start: 40, end: 43 }),
        repeat: -1,
        frameRate: 10
    })

    anims.create({
        key: 'medium-zombie-run',
        frames: anims.generateFrameNumbers('small_medium_monsters', { start: 44, end: 47 }),
        repeat: -1,
        frameRate: 7
    })

    anims.create({
        key: 'medium-zombie-appear',
        frames: anims.generateFrameNumbers('small_medium_monsters', { start: 36, end: 39 }),
        repeat: -1,
        frameRate: 3
    })

    // Medium goblin
    anims.create({
        key: 'medium-goblin-idle',
        frames: anims.generateFrameNumbers('small_medium_monsters', { start: 52, end: 55 }),
        repeat: -1,
        frameRate: 10
    })

    anims.create({
        key: 'medium-goblin-run',
        frames: anims.generateFrameNumbers('small_medium_monsters', { start: 56, end: 59 }),
        repeat: -1,
        frameRate: 7
    })

    anims.create({
        key: 'medium-goblin-appear',
        frames: anims.generateFrameNumbers('small_medium_monsters', { start: 48, end: 51 }),
        repeat: -1,
        frameRate: 3
    })

    // Medium demon
    anims.create({
        key: 'medium-demon-idle',
        frames: anims.generateFrameNumbers('small_medium_monsters', { start: 64, end: 67 }),
        repeat: -1,
        frameRate: 10
    })

    anims.create({
        key: 'medium-demon-run',
        frames: anims.generateFrameNumbers('small_medium_monsters', { start: 68, end: 71 }),
        repeat: -1,
        frameRate: 5
    })

    anims.create({
        key: 'medium-demon-appear',
        frames: anims.generateFrameNumbers('small_medium_monsters', { start: 60, end: 63 }),
        repeat: -1,
        frameRate: 3
    })
    

    // ---------- BIG MONSTERS -------------
    // Big demon
    anims.create({
        key: 'big-demon-run',
        frames: anims.generateFrameNumbers('big_monsters', { start: 32, end: 35 }),
        repeat: -1,
        frameRate: 5
    })
    
    anims.create({
        key: 'big-demon-idle',
        frames: anims.generateFrameNumbers('big_monsters', { start: 28, end: 31 }),
        repeat: -1,
        frameRate: 5
    })

    anims.create({
        key: 'big-demon-appear',
        frames: anims.generateFrameNumbers('big_monsters', { start: 24, end: 27 }),
        repeat: -1,
        frameRate: 3
    })
    
    // Big goblin
    anims.create({
        key: 'big-goblin-run',
        frames: anims.generateFrameNumbers('big_monsters', { start: 20, end: 23 }),
        repeat: -1,
        frameRate: 5
    })

    anims.create({
        key: 'big-goblin-idle',
        frames: anims.generateFrameNumbers('big_monsters', { start: 16, end: 19 }),
        repeat: -1,
        frameRate: 5
    })

    anims.create({
        key: 'big-goblin-appear',
        frames: anims.generateFrameNumbers('big_monsters', { start: 12, end: 15 }),
        repeat: -1,
        frameRate: 3
    })
    
    // Big zombie
    anims.create({
        key: 'big-zombie-run',
        frames: anims.generateFrameNumbers('big_monsters', { start: 8, end: 11 }),
        repeat: -1,
        frameRate: 5
    })
    
    anims.create({
        key: 'big-zombie-idle',
        frames: anims.generateFrameNumbers('big_monsters', { start: 4, end: 7 }),
        repeat: -1,
        frameRate: 5
    })
    
    anims.create({
        key: 'big-zombie-appear',
        frames: anims.generateFrameNumbers('big_monsters', { start: 0, end: 3 }),
        repeat: -1,
        frameRate: 3
    })
}