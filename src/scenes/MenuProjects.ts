import BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext";
import { TextEdit } from "phaser3-rex-plugins/plugins/textedit";
import Label from "phaser3-rex-plugins/templates/ui/label/Label";
import ScrollablePanel from "phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel";

export default class MenuProjects extends Phaser.Scene {
    private textEditZone!: BBCodeText
    private suggestionPanel!: ScrollablePanel
    private textEdit!: TextEdit

    private sceneUI!: Phaser.Scene

    private rexUI

    private projectNames: { key:string }[] = []


    private projectQuery:string = "abc"


    constructor() {
        super('menu_projects');
    }

    preload() {
        this.rexUI = this['rexUI']
        this.load.json('project_names', `http://localhost:5000/search?query=${this.projectQuery}`)
    }


    create() {
        this.projectNames = this.cache.json.get('project_names')


        this.textEditZone = new BBCodeText(this, this.game.canvas.width/2, this.game.canvas.height * 0.4, this.projectQuery, { 
            fixedWidth: 300, 
            fixedHeight: 36,
            padding:{
                left:10
            },
            backgroundColor: '#202121',
            valign: "center",
            align:"center"
        })
        this.textEditZone.setOrigin(0.5, 0.5)
        this.add.existing(this.textEditZone)

        this.cameras.main.setBackgroundColor(0x483B3A)

        this.textEditZone.setInteractive().on('pointerdown', () => {

            this.textEdit = this.rexUI.edit(this.textEditZone, {
                onTextChanged: (textObject, text) => {
                    textObject.text = text
                    this.projectQuery = text

                    this.cache.json.remove('project_names')
                    this.load.json('project_names', `http://localhost:5000/search?query=${this.projectQuery}`)
                    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
                        // TODO : don't reload on each key pressed, but only after a short delay in order to not spawn the API 
                        // texture loaded so use instead of the placeholder
                        console.log(`requested ${this.projectQuery}`)

                        this.projectNames = this.cache.json.get('project_names')

                        this.suggestionPanel.destroy() // TODO: if possible, don't destroy and recreate but change children instead 
                        this.generatePanel()
                    })
                    this.load.start()


                }
            })
            //To get the dom element use that: const elem = this.textEdit.inputText.node
        })

        this.generatePanel()
    }

    generatePanel(){
        let panelData: string[] = []

        this.projectNames.forEach(element => {
            panelData.push(element.key)
        })

        this.suggestionPanel = this.rexUI.add.scrollablePanel({
            x: this.game.canvas.width/2,
            y: this.game.canvas.height * 0.4 + 40,
            // anchor: undefined,
            width: 480,
            height: 300,

            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, '#0000FF', 0.2),
          
            mouseWheelScroller: {
                focus: false,
                speed: 0.2
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
            this_game.scene.start('preloader', { projectName: child.name })
        })
        
        el.on('child.over', function (child) {
            child.backgroundChildren[0].alpha = 0.2
        })
        
        el.on('child.out', function (child) {
            child.backgroundChildren[0].alpha = 1
        })
    }

    createPanel(data) {
        let panel = this.rexUI.add.sizer({
            orientation: 'y',
            space: { item: 20, top: 20, bottom: 20 }
        })
    
    
        for(let i=0; i < data.length; i++){
            let bg = this.rexUI.add.roundRectangle(0, 0, 400, 400, 15, 0x171818)
   
            panel.add(this.rexUI.add.label({
                orientation: 'y',
                width: 480,
                height: 10,
        
                background: bg,
                text: this.add.text(0, 0, data[i], { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }),
        
                align: 'center',
                name: data[i]
            }))
        }
    
        return panel;
    }

}
