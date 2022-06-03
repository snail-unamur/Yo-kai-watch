class Topic {
    children;
    label;
    parent;

    isCenter;
    x;
    y;
    radius;

    c;

    depth;


    constructor(label, depth) {
        this.depth = depth;
        this.label = label;
        this.children = [];

        //this.c = COLORS[Math.floor(Math.random()*4)];
        this.c = COLORS[depth-1]
    }

    add(child) {
        this.children.push(child);
        child.setParent(this);
    }

    setParent(parent) {
        this.parent = parent;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setAsChild(x, y) {
        this.setPosition(x, y);
        this.isCenter = false;
        this.radius = childRadius;
    }

    setCentered() {
        this.isCenter = true;

        this.x = width / 2;
        this.y = height / 2;
        this.radius = centerRadius;


        let childX;
        let childY;

        if (!this.hasChildren()) return;

        let rads;
        let radsUnit = TWO_PI / this.children.length;

        // Draw external children
        if(this.children.length >= innerChildrenLimit){
            radsUnit = TWO_PI / (this.children.length - innerChildrenLimit);
            
            for(let i = 0; i < this.children.length - innerChildrenLimit; i++){
                let child = this.children[innerChildrenLimit + i]

                rads = PI + PI / 2 + radsUnit * i;


                childX = this.x + (int)(Math.cos(rads) * radiusChildren);
                childY = this.y + (int)(Math.sin(rads) * radiusChildren);

                child.setAsChild(childX, childY);
            }

            radsUnit = TWO_PI / innerChildrenLimit;
        }

        // Draw inner children
        for(let i = 0; i < this.children.length && i < innerChildrenLimit; i++){
            let child = this.children[i]

            rads = PI + PI / 2 + radsUnit * i;


            childX = this.x + (int)(Math.cos(rads) * radiusChildrenInner);
            childY = this.y + (int)(Math.sin(rads) * radiusChildrenInner);

            child.setAsChild(childX, childY);
        }
    }

    display() {
        // draw
        strokeWeight(3);
        if (!this.hasChildren() || !this.parent) {
            stroke(0);
            fill(backgroundColor);
        } else {
            //noStroke();
            stroke(180);
            let col = color(this.c)
            if (this.isMouseIn(mouseX, mouseY)) {
                col.setAlpha(150);
            }
            fill(col);
        }
        ellipse(this.x, this.y, this.radius * 2, this.radius * 2);

        fill(0);
        strokeWeight(0);
        textAlign(CENTER, CENTER);
        textSize(fontSize);
        text(this.label, this.x, this.y);

        if (this.isCenter) {
            // draw children
            for (let child of this.children) {
                child.display();
            }
        }
    }

    hasChildren() {
        return this.children.length > 0;
    }


    mouseClicked(mX, mY) {
        // if center clicked, go to parent
        if (this.isMouseIn(mX, mY)) {
            return this.parent;
        } else {
            for (let child of this.children) {
                if (child.isMouseIn(mX, mY)) {
                    if (child.hasChildren()) {
                        return child;
                    } else {
                        child.copyLabel();
                        return null;
                    }
                }
            }
        }

        return null;
    }

    copyLabel(){
        let lab = this.getLabelContent()
        if(this.depth > 2){
            lab = this.parent.getLabelContent() + "-" + lab
        }
        copyToClipboard(`[T:${lab}]`)
    }

    getLabel(){
        return this.label;
    }

    getLabelContent(){
        return this.label.split("\n").join("");
    }

    isMouseIn(mX, mY) {
        // Check if is clicked
        return (dist(mX, mY, this.x, this.y) < this.radius);
    }
}