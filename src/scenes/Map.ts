import Phaser from "phaser";

import './FileContainer'
import FileContainer from "./FileContainer";

export default class Map extends Phaser.Scene{
    private filestep = 3/10
    private currentElements: FileContainer[] = []
    private currentChildren: FileContainer[] = []
    private currentTop: FileContainer[] = []

    private lastSelectedId:number = 0


    private olds: FileContainer[] = []


    private fileTree = {
        'root':{
            'a':{},
            'c':{},
            'd':{},
            'e':{},
            'b':{},
            'cde':{
                'fqfdfsfd':{},
                'fdqfsdfefazeafdqs':{
                    'a':{},
                    'c':{},
                    'd':{},
                    'e':{},
                    'b':{},
                    'cde':{
                        'fqfdfsfd':{},
                        'fdqfsdfefazeafdqs':{}
                    }
                }
            }
        }
    }

    private current: object = this.fileTree
    // There must be always at least 1 element in the pathToCurrent (root)
    //private pathToCurrent: string[] = ['root', 'cde']
    private pathToCurrent: string[] = ['root', 'cde']
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

    preload(){

        // Setup keyboard control
        let this_scene = this
        this.input.keyboard.addKey('right').on('up', function(event) {
            if(this_scene.selectedId >= this_scene.currentChildren.length-1 || this_scene.selectedId === -1){
                this_scene.cameras.main.shake(250, 0.005)
                return
            }

            this_scene.setSelected((this_scene.selectedId + 1) % this_scene.currentChildren.length)
    
            this_scene.currentChildren.forEach(element => {
                element.setDestination(- this_scene.filestep*this_scene.cWidth, 0)
            })
        })


        this.input.keyboard.addKey('left').on('up', function(event) {
            if(this_scene.selectedId <= 0){
                this_scene.cameras.main.shake(250, 0.005)
                return
            }
            this_scene.setSelected((this_scene.selectedId - 1) % this_scene.currentChildren.length)
    
            this_scene.currentChildren.forEach(element => {
                element.setDestination(this_scene.filestep*this_scene.cWidth, 0)
            })
        })


        this.input.keyboard.addKey('up').on('up', function(event) {
            let last_element = this_scene.pathToCurrent[this_scene.pathToCurrent.length-1]

            if(last_element === 'root' || last_element === undefined){
                if(this_scene.selected.getName() === 'root'){
                    this_scene.cameras.main.shake(250, 0.005)

                } else {
                    this_scene.lastSelectedId = this_scene.selectedId
                    this_scene.setSelected(-1)

                }

            } else {
                // Everything slide up
                // Old ones fade
                // New focus grow
                // New ones appear
                let s = this_scene.olds.length
                for(let i=0; i < s; i++){
                    this_scene.olds.pop()?.destroy()
                }
    
                // Here olds is empty
                s = this_scene.currentChildren.length
                for(let i=0; i < s; i++){
                    let el = this_scene.currentChildren.pop()
                    el?.setDestination(0, this_scene.cHeight*0.5)
    
                    if(el) this_scene.olds.push(el)
                }                
                let el
                if(this_scene.currentTop.length >= 1) el = this_scene.currentTop.pop()
                el.setIsTop(false)
                //this_scene.olds.push(el)
                el.setDestination(0, + this_scene.cHeight * 0.4)
    
                // Olds is full and going up, current empty
                
                this_scene.pathToCurrent.pop()

                this_scene.drawChildren2(el)
                //this_scene.setSelected(last_element!)
                // Change top element
                console.log(this_scene.pathToCurrent[this_scene.pathToCurrent.length-1])
                this_scene.drawTopFile(this_scene.pathToCurrent[this_scene.pathToCurrent.length-1])
            }
        })


        this.input.keyboard.addKey('down').on('up', function(event) {
            let selectedName = this_scene.selected.getName()
            if(selectedName !== 'root'){
                this_scene.pathToCurrent.push(selectedName)
            } else {
                this_scene.selected.setSelected(false)

                this_scene.setSelected(this_scene.lastSelectedId)
                return
            }

            let children = Object.keys(this_scene.getCurrentChildren())
            
            if(children.length !== 0){
                // empty olds
                let s = this_scene.olds.length
                for(let i=0; i < s; i++){
                    this_scene.olds.pop()?.destroy()
                }
                s = this_scene.currentChildren.length

                let el_
                this_scene.currentTop.pop()?.destroy() // need to change
                
                s = this_scene.currentChildren.length
                for(let i=0; i < s; i++){
                    let el = this_scene.currentChildren.pop()
                    el?.setDestination(0, -this_scene.cHeight*0.4)
                    if(el?.getName() === this_scene.selected.getName()){
                        this_scene.currentTop.push(el)
                        el.setIsTop(true)
                        el.setSelected(false)
                    } else {
                        // Must fade all but chosen one
                        if(el) this_scene.olds.push(el)
                    }
                }
                this_scene.drawChildren()

                this_scene.setSelected(0)
            } else {
                this_scene.pathToCurrent.pop()
                this_scene.cameras.main.shake(250, 0.005)
            }
        })

    }

    create(){
        this.gameCanvas = this.game.canvas
        this.cWidth = this.gameCanvas.width
        this.cHeight = this.gameCanvas.height

    
        this.cam = this.cameras.main
        
        let center = this.cWidth/2
        this.camCenterY = 0
        this.camCenterX = center
        this.cam.centerOn(this.camCenterX, this.camCenterY)

        this.camDistanceY = - this.cHeight/2
        this.camRemainingTime = 1000

    
        this.drawFiles()
    }

    update(t:number, dt:number){
        this.currentChildren.forEach(element => {
            element.update()
        })
        this.currentTop.forEach(element => {
            element.update()
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

    getCurrentChildren(){
        let children = this.fileTree
        this.pathToCurrent.forEach(element => {
            children = children[element]
        })
        return children // list of strings which are the children
    }

    drawFiles(){
        // At the initialization
        this.drawTopFile(this.pathToCurrent[this.pathToCurrent.length - 1])
        this.drawChildren()
        //this.currentTop[0].setSelected(true)
    }

    drawChildren(){
        let children = this.getCurrentChildren()

        let keys = Object.keys(children)

        let step = this.filestep * this.cWidth
        let firstX = this.cWidth / 2 //-this.cWidth / 10


        /*if(keys.length < 3){
            firstX += step
        }*/

        for(let i=0; i < keys.length /*&& i < 5*/; i++){
            this.currentChildren.push(this.drawFile(firstX + i*step, this.cHeight * 0.7, this.cWidth*0.25, this.cHeight*0.2, keys[i]))
        }
        let selec_ = 0
        this.selectedId = selec_
        this.selected = this.currentChildren[selec_]
        this.currentChildren[selec_].setSelected(true)
    }

    drawChildren2(fileToNotDraw:FileContainer){
        let children = this.getCurrentChildren()

        let keys = Object.keys(children)

        let selec_ = keys.indexOf(fileToNotDraw.getName())

        let step = this.filestep * this.cWidth
        let firstX = (this.cWidth / 2) - step * selec_ 

        for(let i=0; i < keys.length; i++){
            if(i !== selec_){
                this.currentChildren.push(this.drawFile(firstX + i*step, this.cHeight * 0.7, this.cWidth*0.25, this.cHeight*0.2, keys[i]))
            } else {
                this.currentChildren.push(fileToNotDraw)
            } 
        }
        this.selectedId = selec_
        this.selected = this.currentChildren[selec_]
        this.currentChildren[selec_].setSelected(true)
    }

    drawTopFile(fileName:string){
        let f = this.drawFile(this.cWidth/2, this.cHeight * 0.3, this.cWidth*0.25, this.cHeight*0.2, fileName)
        this.currentTop.push(f)
        f.setIsTop(true)
    }


    drawFile(x:number, y:number, width:number, height:number, name:string){
        let fileContainer = this.add.fileContainer(x, y, width, height, name, 0x00aa00)
        

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