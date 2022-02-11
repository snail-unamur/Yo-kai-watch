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

        // Load metrics data
        /**
         * For ratings -> A=1 B=2 C=3 D=4 E=5
         * 
         * code_smells = nb code smells
         * sqale_index = code smells technical debt (in minutes)
         * sqale_rating = code smells rating 
         * vulnerabilities = nb vulns
         * security_rating = security rating
         * security_remediation_effort = security debt / time to fix everything (in minutes)
         * bugs = nb bugs
         * reliability_rating = bugs rating
         * reliability_remediation_effort = bugs debt / time to fix (in minutes)
         */
        // this.load.json('metrics', 'https://sonarcloud.io/api/measures/component_tree?component=brave_brave-core&metricKeys=code_smells,sqale_index,sqale_rating,vulnerabilities,security_rating,security_remediation_effort,bugs,reliability_rating,reliability_remediation_effort&ps=500&p=1')
        
        
    }

    create() {
        this.scene.start('game');
    }
}