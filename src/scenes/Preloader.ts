export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader');
    }

    preload() {
        this.load.image('tiles', 'tiles/dungeon_tiles.png')
        this.load.image('tiles2', 'tiles/TilesetFloor.png')
        this.load.atlas('faune', 'characters/fauna.png', 'characters/fauna.json')
    }

    create() {
        this.scene.start('game');
    }
}