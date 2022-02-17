import BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext";
import { TextEdit } from "phaser3-rex-plugins/plugins/textedit";
import ScrollablePanel from "phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel";

export default class MenuProjects extends Phaser.Scene {
    private suggestionPanel!: ScrollablePanel
    private textEditZone!: BBCodeText
    private textEdit!: TextEdit

    private projectNames

    private rexUI

    private projectQuery:string = "brave"


    constructor() {
        super('menu_projects');
    }

    init(data){
        if(data?.query){
            this.projectQuery = data.query
        }
    }

    preload() {
        this.rexUI = this['rexUI']
        this.load.json('project_names', `http://localhost:5000/search?query=${this.projectQuery}`)
    }


    create() {
        this.projectNames = this.cache.json.get('project_names')

        console.log(this.projectNames)
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
                    this.scene.start('menu_projects', { query:text })
                    /*console.log(`Text: ${text}`)
                    this.load.json('project_names', `http://localhost:5000/search?query=${text}`)
                    this.projectNames = this.cache.json.get('project_names')
                    console.log(this.projectNames)*/
                }
            })
            //To get the dom element use that: const elem = this.textEdit.inputText.node
        })

        
        let panelData = []

        this.projectNames.forEach(element => {
            panelData.push(element.key)
        })

        this.suggestionPanel = this.rexUI.add.scrollablePanel({
            x: this.game.canvas.width/2,
            y: this.game.canvas.height * 0.4 + 20,
            // anchor: undefined,
            width: 280,
            height: 100,
        
            scrollMode: 1,// vertical scroll
        
            // Elements
            panel: {
                child: this.createPanel(panelData)
            }
        })
        this.suggestionPanel.setOrigin(0.5, 0)
        this.suggestionPanel.layout()


        let this_game = this
        this.rexUI.setChildrenInteractive(this.suggestionPanel, {
            targets: [this.suggestionPanel.getElement('panel')] // The target is the group of element
            
        }).on('child.click', function (child) {
            console.log(child.name)
            this_game.scene.start('preloader', { projectName:child.name})
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
                width: 280,
                height: 10,
        
                background: bg,
                text: this.add.text(0, 0, data[i]),
        
                align: 'center',
                name: data[i]
            }))
        }
    
        return panel;
    }
    
}
