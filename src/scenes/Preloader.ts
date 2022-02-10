export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader');
    }

    preload() {
        this.load.image('tiles', 'tiles/dungeon_tiles.png')
        this.load.image('tiles2', 'tiles/TilesetFloor.png')
        
        this.load.atlas('player', 'characters/fauna.png', 'characters/fauna.json')
        this.load.atlas('monster', 'enemies/lizard.png', 'enemies/lizard.json')
    }

    create() {
        this.scene.start('game');
    }
}