WL.registerComponent("labyroots-gateway", {
    _myFromAbove: { type: WL.Type.Bool, default: false }
}, {
    init: function () {
        Global.myAnalyticsEnabled = true;
        Global.myFromAbove = this._myFromAbove;

        Global.mySaveManager = new PP.SaveManager();

        if (window.location != null && window.location.host != null) {
            Global.myIsLocalhost = window.location.host == "localhost:8080";
        }
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

        this._myTimePlayingVR = 0;
        this._myTimePlayingVRStep = [1, 2, 3, 5, 10, 20, 30, 60];
        this._myTimePlayingVRStepIndex = 0;
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
                Global.myFollowAxe = gameplayItems.pp_getObjectByName("Follow Axe");
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
                    Global.sendAnalytics("event", "button_pressed", {
                        "value": 1
                    });
                }
            }
        }

        if (Global.myReady) {
            if (PP.XRUtils.isSessionActive()) {
                this._myTimePlayingVR += dt;

                if (this._myTimePlayingVRStepIndex < this._myTimePlayingVRStep.length && this._myTimePlayingVR > this._myTimePlayingVRStep[this._myTimePlayingVRStepIndex] * 60) {
                    Global.sendAnalytics("event", "playing_for_" + this._myTimePlayingVRStep[this._myTimePlayingVRStepIndex] + "_minutes_vr", {
                        "value": 1
                    });
                    this._myTimePlayingVRStepIndex++;
                }
            }
        }

        if (Global.myElementToClick != null) {
            Global.myElementToClickCounter--;
            if (Global.myElementToClickCounter <= 0) {
                Global.myElementToClickCounter = 0;
                let elementToClick = Global.myElementToClick;
                Global.myElementToClick = null;

                try {
                    elementToClick.click();
                    document.body.removeChild(elementToClick);
                } catch (error) {
                    // Do nothing 
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
        Global.sendAnalytics("event", "enter_vr", {
            "value": 1
        });

        let isFirstEnterVR = Global.mySaveManager.loadBool("is_first_enter_vr", true);
        if (isFirstEnterVR) {
            Global.sendAnalytics("event", "enter_vr_first_time", {
                "value": 1
            });
        }

        Global.mySaveManager.save("is_first_enter_vr", false, false);

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
    myAxeProto: null,
    myFollowAxe: null,
    myFromAbove: false,
    myAnalyticsEnabled: false,
    myIsLocalhost: false,
    myElementToClick: null,
    myElementToClickCounter: 0
};

Global.mySessionStarted = false;

Global.sendAnalytics = function sendAnalytics(eventType, eventName, eventValue) {
    try {
        if (Global.myAnalyticsEnabled) {
            if (window.gtag != null) {
                window.gtag(eventType, eventName, eventValue);
            }
        }
    } catch (error) {
        // Do nothing
    }
};

LR = {};