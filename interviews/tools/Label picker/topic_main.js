let current

function settings() {
    println("settings");
    size(sizeValue, sizeValue);
}

function setup() {
    createCanvas(sizeValue, sizeValue);
    background(0);

    let root = initData(ROOT_NAME, data, 0)

    root.setCentered();

    setCurrent(root);
}

function initData(topicName, dataChunk, depth){
    // init topic object
    let topic = new Topic(topicName, depth)
    for(const childName in dataChunk){
        // add children
        topic.add(initData(childName, dataChunk[childName], depth+1))
    }
    // return object
    return topic
}

function setCurrent(newCurrent) {
    current = newCurrent;
    current.setCentered();
}

function draw() {
    background(backgroundColor);
    noStroke();
    current.display();
}

function mouseClicked() {
    clickedTopic = current.mouseClicked(mouseX, mouseY);

    if (clickedTopic != null) {
        setCurrent(clickedTopic);
    }
}