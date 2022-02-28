

export default class Preloader extends Phaser.Scene {
    private projectName
    constructor() {
        super('preloader');
    }

    init(data){
        if(data?.projectName){
            this.projectName = data.projectName
        }
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
        // ENABLE THIS TO GET DATA (DISABLED TO NOT DESTROY THE SONARCLOUD API EVERY TIME WE TEST SOMETHING)
        console.log(`dowloading: ${this.projectName}`)
        const domain = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'http://bynge.synology.me:8081'
        this.load.json('metrics', `${domain}/metrics?project=${this.projectName}`)
        this.load.json('issues', `${domain}/issues?project=${this.projectName}`)

        /*
         * In the following tileset "dungeon_tiles_full.png":
         * 1 tile = 16x16 pixels
         * 1 row = 32 tiles
         * */
        this.load.image('tiles', 'tiles/dungeon_tiles_extruded.png')

        // TODO: clean. There are 2 strategies right now, load frame by frame from separated files.
        // Or load the entire tileset with different frame size.

        // Load big monsters
        let ar = ["idle", "appear", "run"]
        ar.forEach(element => {
            for(let i=0; i < 4; i++){
                this.load.image(`big_demon_${element}_anim_f` + i.toString(), `frames/big_demon_${element}_anim_f`+ i.toString()+'.png')
                this.load.image(`big_zombie_${element}_anim_f` + i.toString(), `frames/big_zombie_${element}_anim_f`+ i.toString()+'.png')
                this.load.image(`ogre_${element}_anim_f` + i.toString(), `frames/ogre_${element}_anim_f`+ i.toString()+'.png')
            }
        });

        // loading for big monsters
        this.load.spritesheet('animations_big_monsters', 'tiles/tiles_monster.png', { frameWidth: 16, frameHeight: 36 })
        // loading for player characters
        this.load.spritesheet('animations_character', 'tiles/tiles_monster.png', { frameWidth: 16, frameHeight: 32 })
        // loading for tiny and medium monsters
        this.load.spritesheet('animations_tiny_and_medium_monsters', 'tiles/tiles_monster.png', { frameWidth: 16, frameHeight: 16 })

        // Loading ui
        this.load.image('ui_heart_empty', 'ui/ui_heart_empty.png')
        this.load.image('ui_heart_full', 'ui/ui_heart_full.png')

        // Loading weapons
        this.load.image('sword', 'weapons/swordGold.png')
        this.createLoading()

        // Loading music
        this.load.audio('ambient_a', 'audio/A.mp3')
        this.load.audio('ambient_b', 'audio/B.mp3')
        this.load.audio('ambient_c', 'audio/C.mp3')
        this.load.audio('ambient_d', 'audio/D.mp3')
        this.load.audio('ambient_e', 'audio/E.mp3')
        this.load.audio('main_theme', 'audio/main_theme.mp3')

        // Load sound effects
        this.load.audio('oof', 'audio/oof.mp3')
        this.load.audio('player_death', 'audio/player_death.mp3')
    }


    create() {
        if(this.cache.json.get('metrics')[0].measures.length === 0){
            this.scene.start('menu_projects', { loadFailed: true })
        } else {
            this.scene.start('game')
        }

    }


    createLoading(){
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);
        
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        let percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        let assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace'
            }
        });
        assetText.setOrigin(0.5, 0.5);
        
        this.load.on('progress', function (value) {
            percentText.setText((value * 100).toString() + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });
        
        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });

    }
}
