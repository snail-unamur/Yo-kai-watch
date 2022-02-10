import Phaser from "phaser"

export const createMonsterAnims = (anims: Phaser.Animations.AnimationManager) => {
    anims.create({
        key: 'monster-idle',
        frames: anims.generateFrameNames('monster', { start: 0, end: 3, prefix: 'lizard_m_idle_anim_f', suffix: '.png' }),
        repeat: -1,
        frameRate: 10
    })

    anims.create({
        key: 'monster-run',
        frames: anims.generateFrameNames('monster', { start: 0, end: 3, prefix: 'lizard_m_run_anim_f', suffix: '.png' }),
        repeat: -1,
        frameRate: 10
    })
}