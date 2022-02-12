import ProjectTreeGenerator from "~/utils/ProjectTreeGenerator"
import jsonInput from "~/utils/component_tree.json"

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader');
    }

    preload() {
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
        
        // TODO: load the tree into phaser's cache
        const ptg = new ProjectTreeGenerator(jsonInput)
        ptg.makeTree()

        /*
         * In the following tileset "dungeon_tiles_full.png":
         * 1 tile = 16 pixels
         * 1 row = 32 tiles
         * */
        this.load.image('tiles', 'tiles/dungeon_tiles_full2.png')

        // TODO: clean. There are 2 strategies right now, load frame by frame from separated files.
        // Or load the entire tileset with different frame size.

        // Load big monsters
        for(let i=0; i < 4; i++){
            this.load.image('big_demon_idle_anim_f' + i.toString(), 'frames/big_demon_idle_anim_f'+ i.toString()+'.png')
            this.load.image('big_zombie_idle_anim_f' + i.toString(), 'frames/big_zombie_idle_anim_f'+ i.toString()+'.png')
            this.load.image('ogre_idle_anim_f' + i.toString(), 'frames/ogre_idle_anim_f'+ i.toString()+'.png')
        }

        // loading for big monsters
        this.load.spritesheet('animations_big_monsters', 'tiles/dungeon_tiles_full2.png', { frameWidth: 16, frameHeight: 36 })
        // loading for player characters
        this.load.spritesheet('animations_character', 'tiles/dungeon_tiles_full2.png', { frameWidth: 16, frameHeight: 32 })
        // loading for tiny and medium monsters
        this.load.spritesheet('animations_tiny_and_medium_monsters', 'tiles/dungeon_tiles_full2.png', { frameWidth: 16, frameHeight: 16 })
        
        //this.load.atlas('player', 'characters/fauna.png', 'characters/fauna.json')
        //this.load.atlas('monster', 'enemies/lizard.png', 'enemies/lizard.json')
    }

    create() {
        //this.scene.start('game');
        this.scene.start('map');
    }
}