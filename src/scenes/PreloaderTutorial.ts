import { LogConstant } from "~/utils/Const";
import { Global } from "~/utils/Global";
import Log from "~/utils/Log";

export default class PreloaderTutorial extends Phaser.Scene {
    private extruded:boolean = true
    private suffix:string = ""
    
    private issues: {
        "severity": string,
        "component": string,
        "debt": string,
        "type": string
    }[] = []

    private tutorialLayout: {
        children:any[],
        name:string,
        type:string,
        path:string,
        key:string,
        measures:any[]
    }[] = [{
        "name": "root",
        "type": "TRK",
        "path": "root",
        "key": "project-key-example",
        "measures": [
            {
                "metric": "security_remediation_effort",
                "value": "0",
                "bestValue": true
            },
            {
                "metric": "sqale_index",
                "value": "0",
                "bestValue": true
            },
            {
                "metric": "sqale_rating",
                "value": "1.0",
                "bestValue": true
            },
            {
                "metric": "bugs",
                "value": "0",
                "bestValue": true
            },
            {
                "metric": "reliability_remediation_effort",
                "value": "0",
                "bestValue": true
            },
            {
                "metric": "reliability_rating",
                "value": "4.0",
                "bestValue": true
            },
            {
                "metric": "code_smells",
                "value": "0",
                "bestValue": true
            },
            {
                "metric": "security_rating",
                "value": "4.0",
                "bestValue": true
            },
            {
                "metric": "vulnerabilities",
                "value": "0",
                "bestValue": true
            }
        ],
        "children": []
    }]

    private childExample = {
        "name": "small_demon_room.js",
        "type": "FIL",
        "path": "root/small_demon_room.js",
        "key": "project-key-example:small_demon_room.js",
        "measures": [
            {
                "metric": "reliability_rating",
                "value": "1.0",
                "bestValue": true
            },
            {
                "metric": "security_rating",
                "value": "1.0",
                "bestValue": true
            },
            {
                "metric": "sqale_rating",
                "value": "1.0",
                "bestValue": true
            },
            {
                "metric": "code_smells",
                "value": "0",
                "bestValue": true
            },
            {
                "metric": "bugs",
                "value": "0",
                "bestValue": true
            },
            {
                "metric": "reliability_remediation_effort",
                "value": "0",
                "bestValue": true
            },
            {
                "metric": "security_remediation_effort",
                "value": "0",
                "bestValue": true
            },
            {
                "metric": "vulnerabilities",
                "value": "0",
                "bestValue": true
            },
            {
                "metric": "sqale_index",
                "value": "0",
                "bestValue": true
            }
        ],
        "children": []
    }

    private key:string = ""

    constructor() {
        super('preloader-tutorial');
    }

    

    init(){}

    preload(){
        Log.addInformation(LogConstant.TUTORIAL_LOADING)
        if(this.extruded) this.suffix = "_extruded"
        /*
         * In the following tileset "dungeon_tiles_full.png":
         * 1 tile = 16x16 pixels
         * 1 row = 32 tiles
         * */
        this.load.image('tiles', `tiles/dungeon_tiles${this.suffix}.png`)

        // TODO: clean. There are 3 strategies right now, load frame by frame from separated files.
        // Or load the entire tileset with different frame size.
        // Or load multiple tilesets with different frame size.

        
        // loading for big monsters
        this.load.spritesheet('big_monsters', `tiles/big_monsters${this.suffix}.png`, { frameWidth: 32, frameHeight: 32, margin: 1, spacing: 2  })
        // loading for player characters
        this.load.spritesheet('character', `tiles/character${this.suffix}.png`, { frameWidth: 16, frameHeight: 32, margin: 1, spacing: 2 })
        // loading for tiny and medium monsters
        this.load.spritesheet('small_medium_monsters', `tiles/small_medium_monsters${this.suffix}.png`, { frameWidth: 16, frameHeight: 16, margin: 1, spacing: 2  })
        this.load.spritesheet('sword', `tiles/sword${this.suffix}.png`, { frameWidth: 16, frameHeight: 16, margin: 1, spacing: 2  })

        // Loading ui
        this.load.image('ui_heart_empty', 'ui/ui_heart_empty.png')
        this.load.image('ui_heart_full', 'ui/ui_heart_full.png')

        // Loading weapons

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

        this.key = this.tutorialLayout[0].key

        let types = ['CODE_SMELL', "BUG", "VULNERABILITY"]
        let severities = ['INFO', 'MAJOR', 'CRITICAL']


        types.forEach(type => {
            severities.forEach(severity => {
                this.tutorialLayout[0].children.push(this.createFileChild(`${severity}_${type}.file`))

                this.issues.push({
                    severity: severity,
                    component: this.tutorialLayout[0].children[this.tutorialLayout[0].children.length - 1],
                    debt: "1min",
                    type: type
                })
            })
        })


        this.tutorialLayout[0].children.push(this.createFileChild('file_example.js'))
        this.tutorialLayout[0].children.push(this.createFileChild('file_example.js'))


        Global.fileTree = this.tutorialLayout
        Global.issues = this.issues

        this.createLoading()
    }

    createFileChild(name: string){
        let child = JSON.parse(JSON.stringify(this.childExample))

        child.name = name
        child.path = `root/${child.name}`
        child.key = `${this.key}:root/${child.name}`
        child.id = this.tutorialLayout[0].children.length

        return child
    }

    create() {
        Log.addInformation(LogConstant.TUTORIAL_LOADED)
        //this.scene.start('menu_projects', { mapContext:mapContext })
        this.scene.start('tutorial')
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




