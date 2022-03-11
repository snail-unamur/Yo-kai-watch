import BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext";
import { TextEdit } from "phaser3-rex-plugins/plugins/textedit";
import ScrollablePanel from "phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel";
import { LogConstant } from "~/utils/Const";
import Log from "~/utils/Log";
import Game from "./Game";

export default class MenuProjects extends Phaser.Scene {
    private textEditZone!: BBCodeText
    private suggestionPanel!: ScrollablePanel
    private textEdit!: TextEdit

    private mostPopular!: BBCodeText
    private mostPopularName: string = "brave_brave-core"

    private sceneUI!: Phaser.Scene

    private rexUI

    private projectNames: { key:string }[] = []


    private projectQuery:string = ""

    private lastTypeTime: number = 0


    constructor() {
        super('menu_projects');
    }

    preload() {
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on('down', this.onPause, this)
        this.rexUI = this['rexUI']
        const domain = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'http://bynge.synology.me:8081'
        // Don't call the API for project names here, to smoothen the loading here
        //this.load.json('project_names', `${domain}/search?query=${this.projectQuery}`)
    }

    clearKeys(){
        this.input.keyboard.removeCapture(Phaser.Input.Keyboard.KeyCodes.ESC)
    }


    create(data) {
        document.body.style.cursor = 'default'
        this.projectQuery = "abc"
        this.sound.removeAll()
        this.sound.play('main_theme', {loop: true})
        // Load project names
        const domain = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'http://bynge.synology.me:8081'
        this.load.json('project_names', `${domain}/search?query=${this.projectQuery}`)
        this.load.once(Phaser.Loader.Events.COMPLETE, () => {
            // TODO : don't reload on each key pressed, but only after a short delay in order to not spawn the API 
            // texture loaded so use instead of the placeholder
            console.log(`requested ${this.projectQuery}`)

            this.projectNames = this.cache.json.get('project_names')

            if(this.projectNames.length !== 0) this.generatePanel()
        })
        this.load.start()



        if(data?.loadFailed){
            Log.addInformation(LogConstant.PROJECT_LOADING_FAILED)
            this.add.text(this.game.canvas.width/2, this.game.canvas.height*0.175, "Loading failed: project not analysed yet", {
                fontSize: "20px",
                color: "#FF5050"
            }).setOrigin(0.5)
        }

        this.cameras.main.setBackgroundColor(0x483B3A)


        //this.projectNames = this.cache.json.get('project_names')

        this.add.text(this.game.canvas.width/2, (this.game.canvas.height * 0.3 - 36)/2, "The Coding of Isaac", {
            fontSize: "40px"
        }).setOrigin(0.5)

        this.textEditZone = new BBCodeText(this, this.game.canvas.width/2, this.game.canvas.height * 0.3, this.projectQuery, { 
            fixedWidth: 300, 
            fixedHeight: 45,
            
            backgroundColor: '#202121',
            backgroundCornerRadius: 10,
            valign: "center",
            align:"center",
            fontFamily: 'Helvetica, sans-serif'
        })
        this.textEditZone.setOrigin(0.5, 0.5)
        this.add.existing(this.textEditZone)

        this.add.text(this.textEditZone.x - 150, this.game.canvas.height * 0.3 - 36, "Search a project:", {
            fontSize: "16px"
        }).setOrigin(0, 0.5)

        this.textEditZone.setInteractive().on('pointerdown', () => {

            this.textEdit = this.rexUI.edit(this.textEditZone, {
                onTextChanged: (textObject, text) => {
                    // if(text === ""){
                    //     console.log("here")
                    //     textObject.text = "Type a project name..."
                    //     textObject.setColor("#606060")
                    // } else {
                    textObject.text = text
                    //     textObject.setColor("#FFFFFF")
                    // }
                    this.projectQuery = text


                    this.lastTypeTime = Date.now()
                    setTimeout(() => {
                        if(Date.now() - this.lastTypeTime > 500){
                            let name = this.projectQuery

                            this.cache.json.remove('project_names')
                            const domain = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'http://bynge.synology.me:8081'
                            this.load.json('project_names', `${domain}/search?query=${name}`)
                            this.load.once(Phaser.Loader.Events.COMPLETE, () => {
                                // TODO : don't reload on each key pressed, but only after a short delay in order to not spawn the API 
                                // texture loaded so use instead of the placeholder
                                console.log(`requested ${name}`)
        
                                this.projectNames = this.cache.json.get('project_names')
                                 
                                if(name !== ""){
                                    this.generatePanel()

                                } else if(this.suggestionPanel){ 
                                    this.suggestionPanel.destroy()
                                } 
                            })
                            this.load.start()
                        }
                    }, 600)


                }
            })
            //To get the dom element use that: const elem = this.textEdit.inputText.node
        })

        
        this.textEditZone.on('pointerover', function () {
            document.body.style.cursor = 'text'
        })
        
        this.textEditZone.on('pointerout', function () {
            document.body.style.cursor = 'default'
        })
        
        if(this.projectNames.length !== 0) this.generatePanel()


        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            console.log("menu projects shutdown")
            this.textEditZone.removeAllListeners()
            this.load.removeAllListeners()
        })
        
        
        this.mostPopular = new BBCodeText(this, this.game.canvas.width/2, this.game.canvas.height * 0.3 + 50, `Most popular project: ${this.mostPopularName}`, { 
            fixedWidth: 460, 
            fixedHeight: 36,
            
            backgroundColor: '#171818',
            backgroundCornerRadius: 10,
            valign: "center",
            align:"center",
            fontFamily: 'Helvetica, sans-serif'
        })
        this.mostPopular.setOrigin(0.5, 0.5)
        this.add.existing(this.mostPopular)

        let this_game = this
        
        this.mostPopular.setInteractive().on('pointerover', function () {
            this_game.mostPopular.alpha = 0.5
            document.body.style.cursor = 'pointer'
        })
        
        this.mostPopular.on('pointerout', function () {
            this_game.mostPopular.alpha = 1
            document.body.style.cursor = 'default'
        })
        
        this.mostPopular.on('pointerdown', function () {
            this_game.mostPopular.alpha = 1
            this_game.selectProject(this_game.mostPopularName)
        })
    }


    onPause(){
        this.reduceVolume()
        document.body.style.cursor = 'default';
        this.scene.pause()
        this.scene.run('pause', { game: this })
    }

    reduceVolume(){
        this.sound.stopByKey('running')
        let new_vol = Game.MUSIC_VOLUME - 0.1
        if(new_vol > 0){
            this.sound.volume = new_vol
        } else {
            this.sound.volume = 0
        }
    }
    
    selectProject(projectName:string){
        this.scene.start('preloader', { projectName: projectName })
    }

    generatePanel(){
        if(this.suggestionPanel) this.suggestionPanel.destroy() // TODO: if possible, don't destroy and recreate but change children instead
        let panelData: string[] = []

        this.projectNames.forEach(element => {
            panelData.push(element.key)
        })

        let nbSuggestion = panelData.length
        let sizeSuggestion = 45
        if(nbSuggestion === 0) nbSuggestion = 1
        let heightPanel = nbSuggestion * sizeSuggestion
        let toScroll = false
        if(heightPanel > sizeSuggestion*6){
            heightPanel = sizeSuggestion*6
            toScroll = true
        } 
        
        let slider_ = {}
        if(toScroll){
            slider_ = {
                input: 0,
                track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, 0x101111, 1),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, 0x555555, 1)
            }
        }

        this.suggestionPanel = this.rexUI.add.scrollablePanel({
            x: this.game.canvas.width/2,
            y: this.game.canvas.height * 0.3 + 80,
            // anchor: undefined,
            width: 480,
            height: heightPanel + 15,

            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, 0x000000, 0.2),
          
            mouseWheelScroller: {
                focus: false,
                speed: 0.2
            },

            scroller: {
                // pointerOutRelease: false
            },

            slider: slider_,

            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,

                panel: 10,
            },
        
            scrollMode: 0,// vertical scroll
        
            // Elements
            panel: {
                child: this.createPanel(panelData)
            }
        })
        this.suggestionPanel.setOrigin(0.5, 0)
        this.suggestionPanel.layout()


        let this_game = this
        let el = this.rexUI.setChildrenInteractive(this.suggestionPanel, {
            targets: [this.suggestionPanel.getElement('panel')] // The target is the group of element
            
        })
        
        el.on('child.click', function (child) {
            child.backgroundChildren[0].alpha = 1
            this_game.selectProject(child.name)
        })
        
        el.on('child.over', function (child) {
            child.backgroundChildren[0].alpha = 0.2
            document.body.style.cursor = 'pointer'
        })
        
        el.on('child.out', function (child) {
            child.backgroundChildren[0].alpha = 1
            document.body.style.cursor = 'default'
        })
    }

    createPanel(data) {
        let panel = this.rexUI.add.sizer({
            orientation: 'y',
            space: { item: 7.5, top: 0, bottom: 20 }
        })
    
    
        for(let i=0; i < data.length; i++){
            let bg = this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, 0x171818)


            let name = data[i]
            let list_ = name.match(/.{1,50}/g)
            let string = ""

            list_!.forEach(el => {
                string += el + "\n"
            })

            string = string.slice(0, -1)
   
            
            panel.add(this.rexUI.add.label({
                orientation: 'y',
                width: 460,
                height: 10,
        
                background: bg,
                text: this.add.text(0, 0, string, { fontFamily: 'Helvetica, sans-serif' }),
        
                align: 'center',
                name: data[i],
                
                space: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10,
            
                    icon: 0,
                    text: 0,
                },
            }))
        }
    
        return panel;
    }

}
