import Phaser from "phaser"

export const createMonsterAnims = (anims: Phaser.Animations.AnimationManager) => {
    // ---------- TINY MONSTERS -------------
    // Tiny zombie
    anims.create({
        key: 'tiny-zombie-idle',
        frames: anims.generateFrameNumbers('animations_tiny_and_medium_monsters', { start: 55, end: 58 }),
        repeat: -1,
        frameRate: 10
    })

    anims.create({
        key: 'tiny-zombie-run',
        frames: anims.generateFrameNumbers('animations_tiny_and_medium_monsters', { start: 59, end: 62 }),
        repeat: -1,
        frameRate: 7
    })

    // Tiny goblin
    anims.create({
        key: 'tiny-goblin-idle',
        frames: anims.generateFrameNumbers('animations_tiny_and_medium_monsters', { start: 87, end: 90 }),
        repeat: -1,
        frameRate: 10
    })

    anims.create({
        key: 'tiny-goblin-run',
        frames: anims.generateFrameNumbers('animations_tiny_and_medium_monsters', { start: 91, end: 94 }),
        repeat: -1,
        frameRate: 10
    })

    // Tiny demon
    anims.create({
        key: 'tiny-demon-idle',
        frames: anims.generateFrameNumbers('animations_tiny_and_medium_monsters', { start: 119, end: 122 }),
        repeat: -1,
        frameRate: 10
    })

    anims.create({
        key: 'tiny-demon-run',
        frames: anims.generateFrameNumbers('animations_tiny_and_medium_monsters', { start: 123, end: 126 }),
        repeat: -1,
        frameRate: 10
    })

    // ---------- MEDIUM MONSTERS -------------
    // Medium zombie
    anims.create({
        key: 'medium-zombie-idle',
        frames: anims.generateFrameNumbers('animations_tiny_and_medium_monsters', { start: 311, end: 314 }),
        repeat: -1,
        frameRate: 10
    })

    anims.create({
        key: 'medium-zombie-run',
        frames: anims.generateFrameNumbers('animations_tiny_and_medium_monsters', { start: 311, end: 314 }),
        repeat: -1,
        frameRate: 7
    })

    // Medium goblin
    anims.create({
        key: 'medium-goblin-idle',
        frames: anims.generateFrameNumbers('animations_tiny_and_medium_monsters', { start: 439, end: 443 }),
        repeat: -1,
        frameRate: 10
    })

    anims.create({
        key: 'medium-goblin-run',
        frames: anims.generateFrameNumbers('animations_tiny_and_medium_monsters', { start: 443, end: 446 }),
        repeat: -1,
        frameRate: 7
    })

    // Medium demon
    anims.create({
        key: 'medium-demon-idle',
        frames: anims.generateFrameNumbers('animations_tiny_and_medium_monsters', { start: 631, end: 635 }),
        repeat: -1,
        frameRate: 10
    })

    anims.create({
        key: 'medium-demon-run',
        frames: anims.generateFrameNumbers('animations_tiny_and_medium_monsters', { start: 635, end: 638 }),
        repeat: -1,
        frameRate: 5
    })
    

    // ---------- BIG MONSTERS -------------
    // Big demon
    anims.create({
        key: 'big-demon-run',
        frames: [
            {key:'big_demon_idle_anim_f0'},
            {key:'big_demon_idle_anim_f1'},
            {key:'big_demon_idle_anim_f2'},
            {key:'big_demon_idle_anim_f3'}
        ],
        repeat: -1,
        frameRate: 5
    })
    
    anims.create({
        key: 'big-demon-idle',
        frames: [
            {key:'big_demon_idle_anim_f0'},
            {key:'big_demon_idle_anim_f1'},
            {key:'big_demon_idle_anim_f2'},
            {key:'big_demon_idle_anim_f3'}
        ],
        repeat: -1,
        frameRate: 5
    })
    
    // Big goblin
    anims.create({
        key: 'big-goblin-run',
        frames: [
            {key:'ogre_idle_anim_f0'},
            {key:'ogre_idle_anim_f1'},
            {key:'ogre_idle_anim_f2'},
            {key:'ogre_idle_anim_f3'}
        ],
        repeat: -1,
        frameRate: 5
    })

    anims.create({
        key: 'big-goblin-idle',
        frames: [
            {key:'ogre_idle_anim_f0'},
            {key:'ogre_idle_anim_f1'},
            {key:'ogre_idle_anim_f2'},
            {key:'ogre_idle_anim_f3'}
        ],
        repeat: -1,
        frameRate: 5
    })
    
    // Big zombie
    anims.create({
        key: 'big-zombie-run',
        frames: [
            {key:'big_zombie_idle_anim_f0'},
            {key:'big_zombie_idle_anim_f1'},
            {key:'big_zombie_idle_anim_f2'},
            {key:'big_zombie_idle_anim_f3'}
        ],
        repeat: -1,
        frameRate: 5
    })
    
    anims.create({
        key: 'big-zombie-idle',
        frames: [
            {key:'big_zombie_idle_anim_f0'},
            {key:'big_zombie_idle_anim_f1'},
            {key:'big_zombie_idle_anim_f2'},
            {key:'big_zombie_idle_anim_f3'}
        ],
        repeat: -1,
        frameRate: 5
    })
}