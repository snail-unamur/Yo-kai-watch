import Phaser from "phaser";

export default class Map extends Phaser.Scene{
    private currentElements = {}

    private fileTree = {
        'root':{
            'a':{},
            'b':{},
            'cde':{
                'fqfdfsfd':{},
                'fdqfsdfefazeafdqs':{}
            }
        }
    }

    private current: object = this.fileTree
    // There must be always at least 1 element in the pathToCurrent (root)
    private pathToCurrent: string[] = ['root', 'cde']
    private selected: string = 'fqfdfsfd'
    
        
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

        let this_scene = this

        // The cursor of the player is always on the lower level
        this.input.keyboard.addKey('right').on('up', function(event) {
            let keys = Object.keys(this_scene.getCurrentChildren())
            let cKey = keys.indexOf(this_scene.selected)

            this_scene.setSelected(keys[(cKey + 1) % keys.length])
        })

        this.input.keyboard.addKey('left').on('up', function(event) {
            let keys = Object.keys(this_scene.getCurrentChildren())
            let cKey = keys.indexOf(this_scene.selected)
            if(cKey <= 0){
                cKey = keys.length
            }
            this_scene.setSelected(keys[(cKey - 1) % keys.length])
        })

        this.input.keyboard.addKey('up').on('up', function(event) {
            let last_element = this_scene.pathToCurrent[this_scene.pathToCurrent.length-1]

            if(last_element === 'root' || last_element === undefined){
                if(this_scene.selected === 'root'){
                    this_scene.cameras.main.shake(250, 0.005)

                } else {
                    this_scene.setSelected('root')

                }

            } else {
                this_scene.pathToCurrent.pop()
                this_scene.setSelected(last_element!)
            }
        })

        this.input.keyboard.addKey('down').on('up', function(event) {
            if(this_scene.selected !== 'root'){
                this_scene.pathToCurrent.push(this_scene.selected)
            }

            let children = Object.keys(this_scene.getCurrentChildren())

            if(children.length !== 0){
                this_scene.setSelected(children[0])
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
        return children
    }

    drawFiles(){
        this.drawTopFile(this.pathToCurrent[this.pathToCurrent.length - 1])
        this.drawChildren()
    }

    drawChildren(){
        let children = this.getCurrentChildren()

        let keys = Object.keys(children)

        if(keys.length > 2){
            this.drawRightChild(keys[2])
        }

        if(keys.length > 1){
            this.drawCenterChild(keys[1])
        }
        
        if(keys.length > 0){
            this.drawLeftChild(keys[0])
        }
    }

    drawTopFile(fileName:string){
        this.drawFile(this.cWidth/2, this.cHeight * 0.3, this.cWidth*0.4, this.cHeight*0.25, fileName)
    }

    drawLeftChild(fileName:string){
        this.drawFile(this.cWidth/5, this.cHeight * 0.7, this.cWidth*0.25, this.cHeight*0.2, fileName)
    }

    drawRightChild(fileName:string){
        this.drawFile(this.cWidth -this.cWidth/5, this.cHeight * 0.7, this.cWidth*0.25, this.cHeight*0.2, fileName)
    }

    drawCenterChild(fileName:string){
        this.drawFile(this.cWidth/2, this.cHeight * 0.7, this.cWidth*0.25, this.cHeight*0.2, fileName)
    }

    drawFile(x:number, y:number, width:number, height:number, name:string){
        if(this.selected === name){
            width *= 1.1
            height *= 1.1
        }

        let r = this.add.rectangle(x, y, width, height, 0x00aa00)
        let t = this.add.text(x - width/2, y - height/2 - 16, name)
        t.setColor('white')
        r.alpha = 0.5

        this.currentElements[name] = [r, t]

        if(this.selected === name){
            r.strokeColor = 0xaaffaa
            r.isStroked = true
            r.alpha = 1
        }
    }

    setSelected(name:string){
        this.selected = name
        Object.keys(this.currentElements).forEach(element => {
            this.currentElements[element].forEach(element1 =>{
                element1.destroy()
            })
        });

        this.drawFiles()

    }
}