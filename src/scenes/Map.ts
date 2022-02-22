import Phaser from "phaser";

import './FileContainer'
import FileContainer from "./FileContainer";

import BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext";
import { TextEdit } from "phaser3-rex-plugins/plugins/textedit";
import ScrollablePanel from "phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel";
import FileChild from "./FileChild";

export default class Map extends Phaser.Scene{
    private static readonly FILE_STEP = 3/10
    private currentChildren: FileContainer[] = []
    private currentTop: FileContainer[] = []

    private lastSelectedId:number = 0

    private olds: FileContainer[] = []

    private fileTree

    // There must be always at least 1 element in the pathToCurrent (root)
    private pathToCurrent: integer[] = [0]
    private selected!: FileContainer
    private selectedId: number = 0
        
    private gameCanvas!: HTMLCanvasElement
    private cWidth!:number
    private cHeight!:number

    private rexUI
    private textEditZone!: BBCodeText
    private suggestionPanel!: ScrollablePanel
    private textEdit!: TextEdit

    private keys: Phaser.Input.Keyboard.Key[] = []
    
    private allPath: string[] = []
    private allPathSliced: string[] = []

    private lastTypeTime: number = 0

	constructor(){
		super('map')
	}

    rightPressed(event){
        if(this.selectedId >= this.currentChildren.length-1 || this.selectedId === -1){
            this.cameras.main.shake(250, 0.005)
            return
        }

        this.setSelected((this.selectedId + 1) % this.currentChildren.length)

        this.currentChildren.forEach(element => {
            element.setDestination(-Map.FILE_STEP * this.cWidth, 0)
        })
    }

    leftPressed(event){
        if(this.selectedId <= 0){
            this.cameras.main.shake(250, 0.005)
            return
        }
        this.setSelected((this.selectedId - 1) % this.currentChildren.length)

        this.currentChildren.forEach(element => {
            element.setDestination(Map.FILE_STEP * this.cWidth, 0)
        })
    }

    downPressed(event){
        let selectedName = this.selected.getName()
        if(selectedName !== 'root'){
            this.pathToCurrent.push(this.selected.getId())
        } else {
            this.selected.setSelected(false)

            this.setSelected(this.lastSelectedId)
            return
        }

        let children = Object.keys(this.getCurrentChildren())
        
        if(children.length !== 0){
            // empty olds
            let s = this.olds.length
            for(let i=0; i < s; i++){
                this.olds.pop()?.destroy()
            }
            s = this.currentChildren.length

            let el_ 
            if(this.currentTop.length >= 1){
                el_ = this.currentTop.pop()
                this.olds.push(el_)
                el_.setDestination(0, - this.cHeight * 0.5)
                el_.setAlphaDestination(0)
            } 
            
            s = this.currentChildren.length
            for(let i=0; i < s; i++){
                let el = this.currentChildren.pop()
                el?.setDestination(0, -this.cHeight*0.4)
                if(el?.getName() === this.selected.getName()){
                    this.currentTop.push(el)
                    el.setIsTop(true)
                    el.setSelected(false)
                } else {
                    // Must fade all but chosen one
                    el?.setAlphaDestination(0)
                    if(el) this.olds.push(el)
                }
            }
            this.drawChildren()

            this.setSelected(0)
        } else {
            this.pathToCurrent.pop()
            this.cameras.main.shake(250, 0.005)
        }

    }

    upPressed(event){
        let last_element = this.pathToCurrent[this.pathToCurrent.length-1]

        if(this.pathToCurrent.length <= 1){
            if(this.selected.getName() === 'root'){
                this.cameras.main.shake(250, 0.005)

            } else {
                this.lastSelectedId = this.selectedId
                this.setSelected(-1)

            }

        } else {
            // Everything slide up
            // Old ones fade
            // New focus grow
            // New ones appear
            let s = this.olds.length
            for(let i=0; i < s; i++){
                this.olds.pop()?.destroy()
            }

            // Here olds is empty
            s = this.currentChildren.length
            for(let i=0; i < s; i++){
                let el = this.currentChildren.pop()
                el?.setDestination(0, this.cHeight*0.5)

                if(el) this.olds.push(el)
            }                
            let previousTop
            if(this.currentTop.length >= 1) previousTop = this.currentTop.pop()
            previousTop.setIsTop(false)
            //this.olds.push(previousTop)
            previousTop.setDestination(0, + this.cHeight * 0.4)

            // Olds is full and going up, current empty
            
            this.pathToCurrent.pop()

            this.drawChildren(previousTop)
            //this.setSelected(last_element!)
            // Change top element
            this.drawTopFile(this.getParentPath(), this.pathToCurrent[this.pathToCurrent.length-1])
        }
    }

    selectRoom(event){
        let pathTemp = Array.from(this.pathToCurrent)
        if(this.selected.getName() !== 'root'){
            pathTemp.push(this.selected.getId())
        }


        let fileToOpen = this.getElementByPath(pathTemp)
        this.scene.start('game', { 
            mapContext : {
                file : fileToOpen,
                path: this.pathToCurrent,
                selectedId: this.selectedId,
                selected: this.selected.name
            }
        })

        // Start game with the element
    }

    getElementByPath(path?:integer[]){
        if(!path){
            path = this.pathToCurrent
        }

        let currentElement = { children: this.fileTree, name:'super root' }
        path.forEach(element => {
            currentElement = currentElement.children[element]
        })

        return currentElement
    }


    addKeys(){
        // TODO keep button left & right pressed
        // Setup keyboard control
        this.keys = []
        
        this.keys.push(this.input.keyboard.addKey('right').on('down', this.rightPressed, this))
        this.keys.push(this.input.keyboard.addKey('left').on('down', this.leftPressed, this))
        this.keys.push(this.input.keyboard.addKey('up').on('down', this.upPressed, this))
        this.keys.push(this.input.keyboard.addKey('down').on('down', this.downPressed, this))
        // Setup keyboard control
        this.keys.push(this.input.keyboard.addKey('d').on('down', this.rightPressed, this))
        this.keys.push(this.input.keyboard.addKey('q').on('down', this.leftPressed, this))
        this.keys.push(this.input.keyboard.addKey('z').on('down', this.upPressed, this))
        this.keys.push(this.input.keyboard.addKey('s').on('down', this.downPressed, this))

        this.keys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', this.selectRoom, this))
        this.keys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on('down', this.selectRoom, this))
        this.keys.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB).on('down', this.selectRoom, this))

    }

    preload(){
        this.rexUI = this['rexUI']
        this.fileTree = this.cache.json.get('metrics')

        this.getCurrentChildren()
        
        this.addKeys()

        

        FileChild.projectIssues.forEach(el => {
            let name = el.component.split(":")[1]
            let list_ = name.match(/.{1,20}/g)
            let string = ""

            list_!.forEach(el => {
                string += el + "\n"
            })

            string = string.slice(0, -1)

            this.allPathSliced.push(string)
            this.allPath.push(name)
        })

        //this.input.keyboard.addCapture()
        //this.input.keyboard.removeCapture('d')
    }

    create(data){
        this.olds = []

        if(data?.mapContext){
            let ctx = data.mapContext
            this.selected = ctx.selected
            this.pathToCurrent = ctx.path
            this.selectedId = ctx.selectedId

        } else {
            this.pathToCurrent = [0]
            this.selectedId = 0
        }

        this.currentChildren = []
        this.currentTop = []
        this.lastSelectedId = 0
        
        this.gameCanvas = this.game.canvas
        this.cWidth = this.gameCanvas.width
        this.cHeight = this.gameCanvas.height
    
        let cam = this.cameras.main
        
        let camCenterY = this.cHeight/2
        let camCenterX = this.cWidth/2
        cam.centerOn(camCenterX, camCenterY)

        cam.setBackgroundColor(0x483B3A)
    

        if(data?.mapContext){
            if(this.selectedId === -1){
                this.drawFiles(true)
            } else {
                this.drawTopFile(this.getParentPath(), this.pathToCurrent[this.pathToCurrent.length - 1], false)
                this.drawChildren(this.selected, true, true)
            }
        } else {
            this.drawFiles(true)
        }

        let zone = this.add.zone(0, 0, this.cWidth, this.cHeight)
        zone.setInteractive().on('pointerdown', () => {
            if(this.keys.length === 0) this.addKeys()
        })
        zone.setDepth(1)
        zone.setOrigin(0, 0)

        this.generateSearchBar()
    }

    update(t:number, dt:number){
        this.currentChildren.forEach(element => {
            element.update(t, dt)
        })
        this.currentTop.forEach(element => {
            element.update(t, dt)
        })
        this.olds.forEach(element => {
            element.update(t, dt)
        })
    }

    getCurrentChildren(path?:integer[]){
        if(!path){
            path = this.pathToCurrent
        }

        let children = this.fileTree
        path.forEach(element => {
            if(children[element].hasOwnProperty('children')){
                children = children[element].children
            } else {
                children = []
            }
        })

        return children // list of strings which are the children
    }

    /**
     * 
     * @param selectedTop param used only when the root is the first selected
     */
    drawFiles(selectedTop:boolean=false){
        // At the initialization
        this.drawTopFile(this.getParentPath(), this.pathToCurrent[this.pathToCurrent.length - 1], selectedTop)
        this.drawChildren(undefined, !selectedTop)
    }

    drawChildren(fileToNotDraw?:FileContainer | string, selected:boolean=true, stillDraw:boolean=false){
        let children = this.getCurrentChildren()


        let step = Map.FILE_STEP * this.cWidth
        let firstX = this.cWidth / 2 

        let selec_ = 0

        let n = ""

        if(fileToNotDraw){
            for(let i=0; i < children.length; i++){
                if(typeof fileToNotDraw === "string"){
                    n = fileToNotDraw
                } else {
                    n = fileToNotDraw.getName()
                }
                
                if(children[i].name === n){
                    selec_ = i
                }
            }
            firstX = (this.cWidth / 2) - step * selec_ 
        }

        let initialY = this.cHeight * 1.2
        let shiftY = - this.cHeight * 0.5

        
        if(fileToNotDraw){
            initialY = - this.cHeight * 0.3
            shiftY = this.cHeight
        }


        for(let i=0; i < children.length; i++){
            if(fileToNotDraw && i === selec_ && !stillDraw){
                if(typeof fileToNotDraw === "string"){
                    let a = Array.from(this.pathToCurrent)
                    a.push(i)
    
                    let f = this.drawFile(
                        firstX + i*step, initialY, 
                        this.cWidth*0.25, this.cHeight*0.2, 
                        children[i].name, i, 
                        Object.keys(this.getCurrentChildren(a)).length)
    
                    f.setDestination(0, shiftY)
                    this.currentChildren.push(f)
                } else {
                    this.currentChildren.push(fileToNotDraw)
                }
            } else {
                let a = Array.from(this.pathToCurrent)
                a.push(i)

                let f = this.drawFile(
                    firstX + i*step, initialY, 
                    this.cWidth*0.25, this.cHeight*0.2, 
                    children[i].name, i, 
                    Object.keys(this.getCurrentChildren(a)).length)

                f.setDestination(0, shiftY)
                this.currentChildren.push(f)
            }
        }
        if(selected){
            this.selectedId = selec_
            this.selected = this.currentChildren[selec_]
            this.currentChildren[selec_].setSelected(true)
        }
    }

    getParentPath(path?:integer[]){
        if(!path){
            path = this.pathToCurrent
        }

        let currentElement = { children: this.fileTree, name:'super root' }
        path.forEach(element => {
            currentElement = currentElement.children[element]
        })

        return currentElement.name
    }

    drawTopFile(fileName: string, fileId:number, selected:boolean=false){
        let f = this.drawFile(this.cWidth/2, this.cHeight * 0.3, this.cWidth*0.25, this.cHeight*0.2, fileName, fileId, Object.keys(this.getCurrentChildren()).length)
        this.currentTop.push(f)
        f.setIsTop(true)

        if(selected){
            this.selectedId = -1
            this.selected = f
            f.setSelected(selected)
        }
    }


    drawFile(x:number, y:number, width:number, height:number, name:string, fileId:number, nbChildren:number){
        let fileContainer = this.add.fileContainer(x, y, width, height, name, fileId, 0x00aa00, undefined, nbChildren)

        return fileContainer
    }

    setSelected(id:number){
        this.selected.setSelected(false)
        this.selectedId = id

        let el
        if(id === -1){
            el =  this.currentTop[0]
        } else {
            el = this.currentChildren[id]
        }
        this.selected = el
        el.setSelected(true)
    }



    generateSearchBar(){
        
        this.textEditZone = new BBCodeText(this, 15, 15, "text", { 
            fixedWidth: 220, 
            fixedHeight: 36,
            padding:{
                left:10
            },
            backgroundColor: '#202121',
            backgroundCornerRadius: 10,
            valign: "center",
            align:"center"
        })
        this.textEditZone.setOrigin(0, 0)
        this.textEditZone.setDepth(2)
        this.add.existing(this.textEditZone)

        this.cameras.main.setBackgroundColor(0x483B3A)
        

        this.textEditZone.setInteractive().on('pointerdown', () => {
            this.keys.forEach((el:Phaser.Input.Keyboard.Key) => {
                console.log("delete", el.keyCode)
                this.input.keyboard.removeKey(el.keyCode)
                this.input.keyboard.removeCapture(el.keyCode)
            })
            this.keys = []
            //this.input.keyboard.enabled = false
            //this.input.keyboard.enableGlobalCapture()

            this.textEdit = this.rexUI.edit(this.textEditZone, {
                onTextChanged: (textObject, text) => {
                    textObject.text = text

                    console.log(text)
                    this.lastTypeTime = Date.now()
                    setTimeout(() => {
                        if(Date.now() - this.lastTypeTime > 500){
                            this.suggestionPanel.destroy() // TODO: if possible, don't destroy and recreate but change children instead 
                            this.generatePanel(text)
                        }
                    }, 600)
                }
            })
            //To get the dom element use that: const elem = this.textEdit.inputText.node
        })

        this.generatePanel()
    }


    

    generatePanel(txt: string = ""){
        let panelData: string[] = []
        
        let c = 0
        for(let i=0; i < this.allPath.length && c < 10; i++){
            if(this.allPath[i].startsWith(txt)){
                
                let list_ = this.allPath[i].slice(txt.length).match(/.{1,20}/g)
                let string = ""

                list_!.forEach(el => {
                    string += el + "\n"
                })

                string = string.slice(0, -1)


                panelData.push(/*"..." + */string)
            }

        }
        // TODO set panel data to the suggestions 

        this.suggestionPanel = this.rexUI.add.scrollablePanel({
            x: 15,
            y: 15 + 40,
            // anchor: undefined,
            width: 200,
            height: 200,

            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, '#0000FF', 0.2),
          
            mouseWheelScroller: {
                focus: false,
                speed: 0.2
            },
        
            scrollMode: 0,// vertical scroll
        
            // Elements
            panel: {
                child: this.createPanel(panelData)
            },

            space: {
                left: 5,
                right: 5,
                top: 5,
                bottom: 5,

                panel: 5,
            }
        })
        this.suggestionPanel.setDepth(2)
        this.suggestionPanel.setOrigin(0, 0)
        this.suggestionPanel.layout()


        let el = this.rexUI.setChildrenInteractive(this.suggestionPanel, {
            targets: [this.suggestionPanel.getElement('panel')] // The target is the group of element
            
        })
        
        el.on('child.click', this.onClickSuggestion, this)
        
        el.on('child.over', function (child) {
            child.backgroundChildren[0].alpha = 0.2
        })
        
        el.on('child.out', function (child) {
            child.backgroundChildren[0].alpha = 1
        })
    }

    createMapContextFromPath(path:string){
        path = path.split('\n').join("")
        console.log(path)
        let pathList = path.split('/')
        let fullPath: number[] = []
        let selectedId = 0
        let selected = "root"
        let file = this.fileTree[0]


        pathList.forEach((pathElementToFind:string) => {
            fullPath.push(selectedId)
            file.children.forEach((el:{ name:string }, index) => {
                if(el.name === pathElementToFind){
                    file = el // Path element is the new parent element
                    selectedId = index
                    selected = el.name
                }
            })

        })

        let newMapContext = {
            file: file,
            path: fullPath,
            selected: selected,
            selectedId:selectedId
        }
        console.log(newMapContext)
        
        this.scene.start('game', { 
            mapContext : newMapContext
        });
    }

    onClickSuggestion(child){
        child.backgroundChildren[0].alpha = 1
        console.log(child.name)
        console.log(this.fileTree)
        this.createMapContextFromPath(child.name)

    }

    createPanel(data: string[]) {
        let panel = this.rexUI.add.sizer({
            orientation: 'y',
            space: { item: 5, top: 0, bottom: 20 }
        })
    
    
        for(let i=0; i < data.length; i++){
            let bg = this.rexUI.add.roundRectangle(0, 0, 200, 100, 15, 0x171818)
            let text = this.add.text(0, 0, data[i], { fontFamily: 'Helvetica, sans-serif' })

   
            panel.add(this.rexUI.add.label({
                orientation: 'y',
                width: 200,
                height: 10,
        
                background: bg,
                text: text,
        
                align: 'center',
                name: data[i],
                
                space: {
                    left: 5,
                    right: 5,
                    top: 5,
                    bottom: 5,
            
                    icon: 0,
                    text: 0,
                }
            }))
        }
    
        return panel;
    }
}