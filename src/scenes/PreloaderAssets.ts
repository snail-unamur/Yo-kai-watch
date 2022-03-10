import { LogConstant } from "~/utils/Const";
import Log from "~/utils/Log";

export default class PreloaderAssets extends Phaser.Scene {
    private swordSize: number = 24
    private extruded:boolean = true
    private suffix:string = ""

    constructor() {
        super('preloader-assets');
    }

    preload(){
        Log.addInformation(LogConstant.TUTORIAL_LOADING)
        if(this.extruded) this.suffix = "_extruded"
        /*
         * In the following tileset "dungeon_tiles_full.png":
         * 1 tile = 16x16 pixels
         * 1 row = 32 tiles
         * */
        const tilesetSetup = { frameWidth: 16, frameHeight: 16, margin: 1, spacing: 2  }
        this.load.spritesheet('funky', `tiles/funky/dungeon_tiles${this.suffix}.png`, tilesetSetup)
        this.load.spritesheet('grayscale_light', `tiles/grayscale_light/dungeon_tiles${this.suffix}.png`, tilesetSetup)
        this.load.spritesheet('grayscale_dark', `tiles/grayscale_dark/dungeon_tiles${this.suffix}.png`, tilesetSetup)
        this.load.spritesheet('rainbow', `tiles/rainbow/dungeon_tiles${this.suffix}.png`, tilesetSetup)
        this.load.spritesheet('materials', `tiles/materials/dungeon_tiles${this.suffix}.png`, tilesetSetup)
        this.load.spritesheet('grayscale_rainbow', `tiles/grayrainbowscale/dungeon_tiles${this.suffix}.png`, tilesetSetup)
        this.load.spritesheet('grayscale_rainbow2', `tiles/grayrainbow2colorscale_too light/dungeon_tiles${this.suffix}.png`, tilesetSetup)
        this.load.spritesheet('grayscale_rainbow2_cheat', `tiles/grayrainbow2colorscale_cheatedwalles/dungeon_tiles${this.suffix}.png`, tilesetSetup)

        
        // TODO: clean. There are 3 strategies right now, load frame by frame from separated files.
        // Or load the entire tileset with different frame size.
        // Or load multiple tilesets with different frame size.
        
        
        // loading for big monsters
        this.load.spritesheet('big_monsters', `tiles/big_monsters${this.suffix}.png`, { frameWidth: 32, frameHeight: 32, margin: 1, spacing: 2  })
        // loading for player characters
        this.load.spritesheet('character', `tiles/character${this.suffix}.png`, { frameWidth: 16, frameHeight: 32, margin: 1, spacing: 2 })
        // loading for tiny and medium monsters
        this.load.spritesheet('small_medium_monsters', `tiles/small_medium_monsters${this.suffix}.png`, { frameWidth: 16, frameHeight: 16, margin: 1, spacing: 2  })

        this.load.spritesheet('sword', `tiles/sword${this.suffix}.png`, { frameWidth: this.swordSize, frameHeight: this.swordSize, margin: 1, spacing: 2  })
        this.load.spritesheet('slash', `tiles/slash.png`, { frameWidth: 48, frameHeight: 48 })

        // Loading ui
        this.load.image('ui_heart_empty', 'ui/ui_heart_empty.png')
        this.load.image('ui_heart_full', 'ui/ui_heart_full.png')

        this.load.image('key', 'tiles/key.png')
        this.load.image('large_key', 'tiles/large_key.png')

        this.load.image('crack', 'tiles/crack.png')
        this.load.image('music_note', 'tiles/music_note.png')

        this.load.image('skull', 'tiles/skull.png')
        this.load.image('left_click', 'tiles/left_click.png')
        this.load.image('right_click', 'tiles/right_click.png')
        this.load.image('mouse', 'tiles/mouse.png')
        this.load.image('folder', 'tiles/folder.png')
        this.load.image('file', 'tiles/file.png')
        
        // Loading weapons

        // Loading music
        this.load.audio('ambient_a', 'audio/A.mp3')
        this.load.audio('ambient_b', 'audio/B.mp3')
        this.load.audio('ambient_c', 'audio/C.mp3')
        this.load.audio('ambient_d', 'audio/D.mp3')
        this.load.audio('ambient_e', 'audio/E.mp3')
        this.load.audio('main_theme', 'audio/main_theme.mp3')
        this.load.audio('sword_slash', 'audio/sword_slash.mp3')
        this.load.audio('sword_hit', 'audio/sword_hit.mp3')
        this.load.audio('running', 'audio/running.mp3')
        this.load.audio('dig', 'audio/dig.mp3')

        // Load sound effects
        this.load.audio('oof', 'audio/oof.mp3')
        this.load.audio('player_death', 'audio/player_death.mp3')

    
        this.createLoading()
    }

    create() {
        Log.addInformation(LogConstant.TUTORIAL_LOADED)
        this.scene.start('setup-tutorial')
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




