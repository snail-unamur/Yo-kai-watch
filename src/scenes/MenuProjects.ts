import BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext";
import { TextEdit } from "phaser3-rex-plugins/plugins/textedit";
import ScrollablePanel from "phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel";

export default class MenuProjects extends Phaser.Scene {
    private suggestionPanel!: ScrollablePanel
    private textEditZone!: BBCodeText
    private textEdit!: TextEdit

    private rexUI


    constructor() {
        super('menu_projects');
    }

    preload() {
        this.rexUI = this['rexUI']
    }


    create() {
        this.textEditZone = new BBCodeText(this, this.game.canvas.width/2, this.game.canvas.height * 0.4, 'Hello World', { 
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
                    console.log(`Text: ${text}`)
                }
            })
            //To get the dom element use that: const elem = this.textEdit.inputText.node
        })

        let data = [
            'deada',
            'deada',
            'deada',
            'deada',
            'deada',
            'deada',
            'deada'
        ]

        this.suggestionPanel = this.rexUI.add.scrollablePanel({
            x: this.game.canvas.width/2,
            y: this.game.canvas.height * 0.4 + 20,
            // anchor: undefined,
            width: 280,
            height: 100,
        
            scrollMode: 1,// vertical scroll
        
            // Elements
            panel: {
                child: this.createPanel(data)
            }
        })
        this.suggestionPanel.setOrigin(0.5, 0)
        this.suggestionPanel.layout()


        this.rexUI.setChildrenInteractive(this.suggestionPanel, {
            targets: [this.suggestionPanel.getElement('panel')] // The target is the group of element
            
        }).on('child.click', function (child) {
            console.log(child.name)
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
                text: this.add.text(0, 0, 'ok' + i.toString()),
        
                align: 'center',
                name:'ok' + i.toString()
            }))
        }
    
        return panel;
    }
    
}
