export default class ProjectTreeGenerator {
    private jsonInput
    private tree = []
    // {
    //     type: 'dir',
    //     path: 'app',
    //     dirs: [
    //         {
    //             type: 'dir',
    //             path: 'app/src',
    //             dirs: [{}],
    //             files: [{}]
    //         },

    //         {
    //             type: 'dir',
    //             path: 'app/tests',
    //             dirs: [{}],
    //             files: [{}]
    //         }
            
    //     ],
    //     files: [{
    //         type: 'file',
    //         path: 'app/hello.ts',
    //     }]
    // }
    constructor(jsonInput) {
        this.jsonInput = jsonInput
    }

    show() {
        console.log(this.jsonInput)
    }

    addPath(pathComponents, tree, leafInfo){
        let pathComponent = pathComponents.shift()
        
        let treePath = tree.find(item => item.name === pathComponent)
        if (!treePath) {
            treePath =  {name: pathComponent}
            tree.push(treePath)
        }
        if(pathComponents.length){
           this.addPath(pathComponents, treePath.children || (treePath.children = []), leafInfo)
        } 
        // we're at the leaf of the path
        else {
            treePath.type = leafInfo.qualifier
            treePath.path = leafInfo.path
            treePath.key = leafInfo.key
            treePath.measures = leafInfo.measures
        }
    }
    
    /**
     * Converts array of paths to tree structure
     * TODO: handle the base component (root) for now it just doesn't exist so we don't have global metrics for the
     * entire project
     */
    makeTree() {
        this.jsonInput.components.forEach(component => {
            const splittedPath = component.path.split('/')
            this.addPath(splittedPath, this.tree, component)
        })

        console.log(this.tree);
        
        // let res = this.jsonInput.components.reduce((arr, path) => this.addPath(path.split('/'), arr), [])
        
    }
}
