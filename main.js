import node_ from './node_.js'


function createNodes() {

    const grid = [];
    const NUM_ROWS = 25;
    const NUM_COLS = 25;
    const container = document.getElementsByClassName("nodeContainer")[0];
    const frag = document.createDocumentFragment();

    for (let row = 0; row < NUM_ROWS; row++) {
        let currRow = [];
        for (let col = 0; col < NUM_COLS; col++) {
            currRow.push(new node_(row, col));
        }
        grid.push(currRow)
    }

    container.appendChild(frag);
    console.log(grid);
}


createNodes();