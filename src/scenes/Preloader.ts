export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader');
    }

    preload() {
        /*
         * In the following tileset "dungeon_tiles_full.png":
         * 1 tile = 16 pixels
         * 1 row = 32 tiles
         * */
        this.load.image('tiles', 'tiles/dungeon_tiles_full2.png')
        
        this.load.atlas('player', 'characters/fauna.png', 'characters/fauna.json')
        this.load.atlas('monster', 'enemies/lizard.png', 'enemies/lizard.json')

        

    }

    create() {
        this.scene.start('game');
    }
}