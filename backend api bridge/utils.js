import axios from "axios"

/**
 * 
 * @param {string} page the page number to fetch
 * @param {array} dataArray the array to append to
 * @returns {array} the dataArray with the sonarqube data appended
 */
 export async function getSonarqubeMetricData(project, page, dataArray) {
    let url =  `https://sonarcloud.io/api/measures/component_tree?component=${project}&metricKeys=code_smells,sqale_index,sqale_rating,vulnerabilities,security_rating,security_remediation_effort,bugs,reliability_rating,reliability_remediation_effort&ps=500&p=${page}&s=qualifier,name`
    const sonarQubeDataRes = await axios.get(url)

    if (page === 1) {
        sonarQubeDataRes.data.baseComponent.path = 'root'
        const cleanedDataRes = [
            sonarQubeDataRes.data.baseComponent,
            sonarQubeDataRes.data.components
        ].flat()
        dataArray.push(cleanedDataRes)
        return getSonarqubeMetricData(project, page + 1, dataArray)

    } else {
        const components = sonarQubeDataRes.data.components
        if(components.length !== 0) {
            dataArray.push(components)
            return getSonarqubeMetricData(project, page + 1, dataArray)
        } else {            
            return {data: dataArray.flat(), issues: await getSonarqubeProjectIssues(project)}
        }
    }
}

export function addPath(pathComponents, tree, leafInfo, typeOfData) {
    let pathComponent = pathComponents.shift()
    
    let treePath = tree.find(item => item.name === pathComponent)
    if (!treePath) {
        treePath =  {name: pathComponent}
        tree.push(treePath)
    }
    if(pathComponents.length) {
       addPath(pathComponents, treePath.children || (treePath.children = []), leafInfo, typeOfData)
    } 
    // we're at the leaf of the path
    else {
        if (typeOfData === 'metrics') {
            treePath.type = leafInfo.qualifier
            treePath.path = leafInfo.path
            treePath.key = leafInfo.key
            treePath.measures = leafInfo.measures
        } else if (typeOfData === 'issues') {
            treePath.issues ? treePath.issues.push(leafInfo) : (treePath.issues = [leafInfo])
        }
    }
}

/**
 * Converts array of paths to tree structure
 * TODO: handle the base component (root) for now it just doesn't exist so we don't have global metrics for the
 * entire project
 */
export function makeTree(data) {
    var tree = []

    // Make tree of the data
    for (const component of data.data) {
        // add 'root/' to the beginning of the path
        if (component.path !== 'root') {
            component.path = 'root/' + component.path
        }
        const splittedPath = component.path.split('/')
        addPath(splittedPath, tree, component, 'metrics')
    }

    // Add issues to the tree
    for (const issue of data.issues) {
        // replace path key to root
        issue.component = issue.component.replace(/.+:/gm, 'root/')
        const splittedPath = issue.component.split('/')
        addPath(splittedPath, tree, issue, 'issues')
    }

    return tree
}

export async function getSonarqubeProjects(query) {
    const url = `https://sonarcloud.io/api/components/search_projects?boostNewProjects=false&ps=50&f=analysisDate&filter=query=${query}&s=analysisDate&asc=false`

    const sonarQubeDataRes = await axios.get(url)
    return sonarQubeDataRes.data.components
}

export async function getSonarqubeProjectIssues(project) {
    // Get issues
    let issues = []
    let url = `https://sonarcloud.io/api/issues/search?resolved=false&ps=500&componentKeys=${project}&additionalFields=_all&p=1`
    let sonarQubeIssuesDataRes = await axios.get(url)

    issues = issues.concat(sonarQubeIssuesDataRes.data.issues)

    const nbMaxPg = Math.ceil(sonarQubeIssuesDataRes.data.total / 500)
    for (let i = 2; i <= nbMaxPg; i++) {
        url = `https://sonarcloud.io/api/issues/search?resolved=false&ps=500&componentKeys=${project}&additionalFields=_all&p=${i}`
        sonarQubeIssuesDataRes = await axios.get(url)  

        issues = issues.concat(sonarQubeIssuesDataRes.data.issues)
    }
    
    return issues
}
