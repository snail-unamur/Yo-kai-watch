import Phaser from "phaser";

import './FileContainer'
import FileContainer from "./FileContainer";

export default class Map extends Phaser.Scene{
    private filestep = 3/10
    private currentChildren: FileContainer[] = []
    private currentTop: FileContainer[] = []

    private lastSelectedId:number = 0


    private olds: FileContainer[] = []


    private fileTree

    // There must be always at least 1 element in the pathToCurrent (root)
    //private pathToCurrent: string[] = ['root', 'cde']
    private pathToCurrent: integer[] = [0]
    private selected!: FileContainer
    private selectedId: number = 0
    
        
    private gameCanvas!: HTMLCanvasElement
    private cWidth!:number
    private cHeight!:number

    private camDistanceY: number = 0
    private camSpeed: number = 0
    private camRemainingTime: number = 0
    private camCenterY: number = 0
    private camCenterX: number = 0
    private cam! : Phaser.Cameras.Scene2D.Camera

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
            element.setDestination(- this.filestep*this.cWidth, 0)
        })
    }

    leftPressed(event){
        if(this.selectedId <= 0){
            this.cameras.main.shake(250, 0.005)
            return
        }
        this.setSelected((this.selectedId - 1) % this.currentChildren.length)

        this.currentChildren.forEach(element => {
            element.setDestination(this.filestep*this.cWidth, 0)
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
                selected: this.selected
            }
        });

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



    preload(){
        this.fileTree = this.cache.json.get('metrics')

        this.getCurrentChildren()
        
        // TODO keep button left & right pressed
        // Setup keyboard control
        this.input.keyboard.addKey('right').on('down', this.rightPressed, this)
        this.input.keyboard.addKey('left').on('down', this.leftPressed, this)
        this.input.keyboard.addKey('up').on('down', this.upPressed, this)
        this.input.keyboard.addKey('down').on('down', this.downPressed, this)

        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', this.selectRoom, this)
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on('down', this.selectRoom, this)
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
    
        this.cam = this.cameras.main
        
        this.camCenterY = this.cHeight/2
        this.camCenterX = this.cWidth/2
        this.cam.centerOn(this.camCenterX, this.camCenterY)

        this.cam.setBackgroundColor(0x483B3A)
    

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

        // update camera
        if(this.camRemainingTime > 0){
            let distanceToTravel = (this.camDistanceY/this.camRemainingTime) * dt
            this.camDistanceY -= distanceToTravel
            this.camCenterY -= distanceToTravel
            this.cam.centerOn(this.camCenterX, this.camCenterY)
            this.camRemainingTime -= dt
        }
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

    drawChildren(fileToNotDraw?:FileContainer, selected:boolean=true, stillDraw:boolean=false){
        let children = this.getCurrentChildren()


        let step = this.filestep * this.cWidth
        let firstX = this.cWidth / 2 

        let selec_ = 0

        if(fileToNotDraw){
            for(let i=0; i < children.length; i++){
                if(children[i].name === fileToNotDraw.getName()){
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
                this.currentChildren.push(fileToNotDraw)
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
        //this.currentChildren[this.selectedId].setSelected(false)
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
}