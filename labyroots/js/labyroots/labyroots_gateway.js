WL.registerComponent("labyroots-gateway", {
}, {
    init: function () {
        Global.myGoogleAnalytics = window.gtag != null;
    },
    start: function () {
        this._myLoadSetupDone = false;
        this._loadSetup();

        this._myFirstUpdate = true;
        this._myReadyCounter = 10;

        if (WL.xrSession) {
            this._onXRSessionStart(WL.xrSession);
        }
        WL.onXRSessionStart.push(this._onXRSessionStart.bind(this));

        this._myButtonPressed = false;

        PP.CAUtils.setDummyServer(new LR.LRCADummyServer());
        PP.CAUtils.setUseDummyServerOnSDKMissing(true);
        PP.CAUtils.setUseDummyServerOnError(true);

        Global.mySaveManager = new PP.SaveManager();
    },
    update: function (dt) {
        if (!this._myLoadSetupDone) {
            return;
        }

        Global.mySaveManager.update(dt);

        if (this._myFirstUpdate) {
            this._myFirstUpdate = false;
            let gameplayItems = WL.scene.pp_getObjectByName("Gameplay Items");
            if (gameplayItems != null) {
                let fruits = gameplayItems.pp_getObjectByName("Fruits");
                let fruit1 = fruits.pp_getObjectByName("" + LR.MazeItemType.HUMAN_TREE_1).pp_getChildren()[0];
                let fruit2 = fruits.pp_getObjectByName("" + LR.MazeItemType.HUMAN_TREE_2).pp_getChildren()[0];
                let fruit3 = fruits.pp_getObjectByName("" + LR.MazeItemType.HUMAN_TREE_3).pp_getChildren()[0];
                let fruit4 = fruits.pp_getObjectByName("" + LR.MazeItemType.HUMAN_TREE_4).pp_getChildren()[0];
                Global.myFruits[LR.MazeItemType.HUMAN_TREE_1] = fruit1;
                Global.myFruits[LR.MazeItemType.HUMAN_TREE_2] = fruit2;
                Global.myFruits[LR.MazeItemType.HUMAN_TREE_3] = fruit3;
                Global.myFruits[LR.MazeItemType.HUMAN_TREE_4] = fruit4;

                Global.myAxeProto = gameplayItems.pp_getObjectByName("Axe");
                Global.myAxe = Global.myAxeProto;
            }

            let mazeItems = WL.scene.pp_getObjectByName("Maze Items");
            if (mazeItems != null) {
                let tree1 = mazeItems.pp_getObjectByName("" + LR.MazeItemType.HUMAN_TREE_1).pp_getChildren()[0];
                let tree2 = mazeItems.pp_getObjectByName("" + LR.MazeItemType.HUMAN_TREE_2).pp_getChildren()[0];
                let tree3 = mazeItems.pp_getObjectByName("" + LR.MazeItemType.HUMAN_TREE_3).pp_getChildren()[0];
                let tree4 = mazeItems.pp_getObjectByName("" + LR.MazeItemType.HUMAN_TREE_4).pp_getChildren()[0];
                Global.myTrees[LR.MazeItemType.HUMAN_TREE_1] = tree1;
                Global.myTrees[LR.MazeItemType.HUMAN_TREE_2] = tree2;
                Global.myTrees[LR.MazeItemType.HUMAN_TREE_3] = tree3;
                Global.myTrees[LR.MazeItemType.HUMAN_TREE_4] = tree4;
            }

            Global.myMaze.buildMaze();
        } else if (this._myReadyCounter > 0) {
            this._myReadyCounter--;
            if (this._myReadyCounter == 0) {
                Global.myStoryReady = true;
            }
        }
        // ripulire i frutti e le asce 
        // aggiungere le radici

        if (Global.mySessionStarted) {
            if (!this._myButtonPressed) {
                if (PP.myLeftGamepad.getButtonInfo(PP.GamepadButtonID.SELECT).isPressEnd() || PP.myLeftGamepad.getButtonInfo(PP.GamepadButtonID.SQUEEZE).isPressEnd() ||
                    PP.myRightGamepad.getButtonInfo(PP.GamepadButtonID.SELECT).isPressEnd() || PP.myRightGamepad.getButtonInfo(PP.GamepadButtonID.SQUEEZE).isPressEnd()) {
                    this._myButtonPressed = true;
                    if (Global.myGoogleAnalytics) {
                        gtag("event", "button_pressed", {
                            "value": 1
                        });
                    }
                }
            }
        }
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
    },
    _onXRSessionStart() {
        if (Global.myGoogleAnalytics) {
            gtag("event", "enter_vr", {
                "value": 1
            });
        }

        Global.mySessionStarted = true;
    }
});

Global = {
    mySetup: {},
    myMaze: null,
    myPlayer: null,
    myStoryReady: false,
    myReady: false,
    myStage: 0,
    myRoots: null,
    myAxe: null,
    myTrees: [],
    myFruits: [],
    myAxeProto: null
};

Global.mySessionStarted = false;

LR = {};