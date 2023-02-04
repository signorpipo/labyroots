WL.registerComponent("labiroots-gateway", {
}, {
    init: function () {
    },
    start: function () {
        this._myLoadSetupDone = false;
        this._loadSetup();

        this._myFirstUpdate = true;
        this._myReadyCounter = 10;
    },
    update: function (dt) {
        if (!this._myLoadSetupDone) {
            return;
        }

        if (this._myFirstUpdate) {
            this._myFirstUpdate = false;
            Global.myMaze.buildMaze();
        } else if (this._myReadyCounter > 0) {
            this._myReadyCounter--;
            if (this._myReadyCounter == 0) {
                Global.myStoryReady = true;
            }
        }
        // ripulire i frutti e le asce 
        // aggiungere le radici
    },
    _loadSetup() {
        loadFileJSON("./setup.json", data => {
            Global.mySetup = data;
            this._loadMaze();
            this._myLoadSetupDone = true;
        });
    },
    _loadMaze() {
        Global.myMaze = new LR.Maze(Global.mySetup.myMazeSetup, this.object);
    }
});

Global = {
    mySetup: {},
    myMaze: null,
    myPlayer: null,
    myStoryReady: false,
    myReady: false,
    myStage: 0,
    myRoots: null
};

LR = {};