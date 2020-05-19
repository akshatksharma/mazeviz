export default class node_ {

    constructor(row, col) {
        this.col = col;
        this.row = row;
        this.dist = Infinity;
        this.visited = false;
    }

    isStart(start_row, start_col) {
        return this.col == start_col && this.row == start_row;
     }

     isStart(end_row, end_col) {
        return this.col == end_col && this.row == end_row;
     }

     set setVisited(value) {
        this.visited = value;
     }

}