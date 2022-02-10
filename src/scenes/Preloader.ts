export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader');
    }

    preload() {
        this.load.image('tiles', 'dungeon_tiles.png')
        this.load.image('tiles2', 'TilesetFloor.png')
        this.load.atlas('faune', 'fauna.png', 'fauna.json')
    }

    create() {
        this.scene.start('game');
    }
}