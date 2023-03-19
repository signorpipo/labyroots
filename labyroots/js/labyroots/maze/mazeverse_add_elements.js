Global.addElementsToMaze = function (maze, createWallsResults) {
    let freeCells = createWallsResults.myFreeCells.pp_clone();

    let itemsToAdd = [
        LR.MazeItemType.PLAYER_START, LR.MazeItemType.BIG_TREE, LR.MazeItemType.BIG_TREE_FIRST_ROOT,
        LR.MazeItemType.BIG_TREE_ROOT, LR.MazeItemType.BIG_TREE_ROOT, LR.MazeItemType.BIG_TREE_ROOT,
        LR.MazeItemType.HUMAN_TREE_0, LR.MazeItemType.HUMAN_TREE_0, LR.MazeItemType.HUMAN_TREE_0,
    ];

    for (let itemToAdd of itemsToAdd) {
        let randomCell = Math.pp_randomPick(freeCells);
        freeCells.pp_removeEqual(randomCell, Global.cellCoordinatesEqual);

        maze[randomCell[0]][randomCell[1]] = itemToAdd;
    }

    return true;
}