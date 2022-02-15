import axios from "axios";

/**
 * 
 * @param {string} page the page number to fetch
 * @param {array} dataArray the array to append to
 * @returns {array} the dataArray with the sonarqube data appended
 */
 export async function getSonarqubeData(project, page, dataArray) {
    const url =  `https://sonarcloud.io/api/measures/component_tree?component=${project}&metricKeys=code_smells,sqale_index,sqale_rating,vulnerabilities,security_rating,security_remediation_effort,bugs,reliability_rating,reliability_remediation_effort&ps=500&p=${page}&s=qualifier,name`
    const sonarQubeDataRes = await axios.get(url);

    if (page === 1) {
        sonarQubeDataRes.data.baseComponent.path = 'root';
        const cleanedDataRes = [
            sonarQubeDataRes.data.baseComponent,
            sonarQubeDataRes.data.components
        ].flat();
        dataArray.push(cleanedDataRes);
        return getSonarqubeData(project, page + 1, dataArray);

    } else {
        const components = sonarQubeDataRes.data.components
        if(components.length !== 0) {
            dataArray.push(components);
            return getSonarqubeData(project, page + 1, dataArray);
        } else {
            return dataArray.flat();
        }
    }
}

export function addPath(pathComponents, tree, leafInfo) {
    let pathComponent = pathComponents.shift()
    
    let treePath = tree.find(item => item.name === pathComponent)
    if (!treePath) {
        treePath =  {name: pathComponent}
        tree.push(treePath)
    }
    if(pathComponents.length) {
       addPath(pathComponents, treePath.children || (treePath.children = []), leafInfo)
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
export function makeTree(data) {
    var tree = []
    for (const component of data) {
        // add 'root/' to the beginning of the path
        if (component.path !== 'root') {
            component.path = 'root/' + component.path;
        }
        const splittedPath = component.path.split('/')
        addPath(splittedPath, tree, component)
    }

    return tree
}