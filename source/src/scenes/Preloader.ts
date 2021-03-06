import { LogConstant } from "~/utils/Const";
import { Global } from "~/utils/Global";
import Log from "~/utils/Log";


export default class Preloader extends Phaser.Scene {
    private projectName

    constructor(key:string = "preloader") {
        super(key);
    }

    init(data){
        if(data?.projectName){
            this.projectName = data.projectName
        }
    }

    preload() {
        document.body.style.cursor = 'default'
        this.createLoading()
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
        this.cache.json.remove('metrics')
        this.cache.json.remove('issues')
        this.load.json('metrics', `${domain}/metrics?project=${this.projectName}`)
        this.load.json('issues', `${domain}/issues?project=${this.projectName}`)

    }


    create() {
        this.scene.run('game-ui', { roomFile: "root" })
        this.load.removeAllListeners()

        Global.fileTree = this.cache.json.get('metrics')

        let issues = this.cache.json.get('issues')
        if(issues){
            Global.issues = this.cache.json.get('issues')
        } else {
            Global.issues = []
        }
         
        if(this.cache.json.get('metrics')[0].measures.length === 0){
            this.scene.start('menu_projects', { loadFailed: true })
        } else {
            Log.addInformation(LogConstant.PROJECT_LOADED, { name: this.projectName })
            this.scene.start('game',  {
                mapContext: {
                    file: Global.fileTree[0],
                    path: [0],
                    selected: "root",
                    selectedId:-1
                }
            })
        }

    }


    createLoading(){
        let pgBoxWidth = 320
        let progressBar = this.add.graphics()
        let progressBox = this.add.graphics()
        progressBox.fillStyle(0x222222, 0.8)
        progressBox.fillRect((this.game.canvas.width - pgBoxWidth)/2, (this.game.canvas.height - 50 - 10)/2, pgBoxWidth, 50)
        
        
        let width = this.cameras.main.width;
        let height = this.cameras.main.height;
        let loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Downloading...',
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

        let this_game = this
        let pgBoxInsideWidth = 300

        
        
        this.load.on('progress', function (value) {
            percentText.setText((value * 100).toString() + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect((this_game.game.canvas.width - pgBoxInsideWidth)/2, (this_game.game.canvas.height - 30 - 10)/2, pgBoxInsideWidth * value, 30);
        });
        
        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });

    }
}
