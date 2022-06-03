import Phaser from 'phaser'

function createUIAnims(anims: Phaser.Animations.AnimationManager){
    anims.create({
        key:'left_click_anim',
        frames: [
            { key: "left_click" },
            { key: "mouse" }
        ],
        repeat:-1,
        frameRate:1
    })

    anims.create({
        key:'right_click_anim',
        frames: [
            { key: "right_click" },
            { key: "mouse" }
        ],
        repeat:-1,
        frameRate:1
    })
}

export{
    createUIAnims
}