Global.myBigTree = null;
Global.myBigTreeDead = false;

WL.registerComponent('big-tree', {
    _myPhase1: { type: WL.Type.Object },
    _myPhase2: { type: WL.Type.Object },
    _myPhase3: { type: WL.Type.Object },
    _myPhase4: { type: WL.Type.Object },
    _myPhase5: { type: WL.Type.Object }
}, {
    init: function () {
    },
    start: function () {
        this._myStarted = false;
        this._myBigTreeRoots = 0;
        this._myHit = 0;

        this._myPhases = [];

        this._myCurrentPhase = 0;
        this.avoidIncrement = false;

        Global.myBigTree = this;

        this._myTimeToWin = 0;
    },
    update: function (dt) {
        if (!this._myStarted) {
            if (Global.myReady) {
                this._myBigTreeDie = new LR.BigTreeDie();

                let children = this.object.pp_getChildren();
                for (let i = 0; i < children.length; i++) {
                    this._myPhases[parseInt(children[i].pp_getName()) - 1] = children[i];
                }

                for (let phase of this._myPhases) {
                    phase.pp_setActive(false);
                }

                this._myStarted = true;
                this._myBigTreeRoots = Global.mySetup.myTreeSetup.myBigTreeRoots;
                this._myHit = Global.mySetup.myTreeSetup.myBigTreeHit;

                this._myPhases[0].pp_setActive(true);

                let rotationQuat = Global.lookPlayerAligned(this.object.pp_getPosition());
                this.object.pp_setRotationQuat(rotationQuat);
            }
        } else if (this._myHit == 0) {
            this._myBigTreeDie.update(dt);
        }

        if (this._myStarted && Global.myReady) {
            if (this._myHit > 0) {
                this._myTimeToWin += dt;
            }
        }
    },
    rootDie() {
        if (this._myBigTreeRoots > 0) {
            this._myBigTreeRoots--;

            for (let phase of this._myPhases) {
                phase.pp_setActive(false);
            }

            this._myCurrentPhase++;
            this._myPhases[Math.floor(this._myCurrentPhase / 2)].pp_setActive(true);
        }
    },
    hit() {
        let hitted = false;

        if (this._myBigTreeRoots == 0) {

            if (!this.avoidIncrement) {
                this._myCurrentPhase++;
            }

            if (this._myHit > 0) {

                this._myHit--;
                hitted = true;
                //suono

                for (let phase of this._myPhases) {
                    phase.pp_setActive(false);
                }

                if (this._myHit > 4) {
                    this._myPhases[2].pp_setActive(true);
                } else if (this._myHit > 0) {
                    this._myPhases[3].pp_setActive(true);
                } else {
                    this._myPhases[4].pp_setActive(true);
                }
                this.avoidIncrement = true;

                if (this._myHit == 0) {
                    Global.myBigTreeDead = true;
                    Global.myStage = 0;

                    if (Global.myGoogleAnalytics) {
                        gtag("event", "defeat_mother_tree", {
                            "value": 1
                        });
                    }

                    if (Global.myGoogleAnalytics) {
                        gtag("event", "defeat_mother_tree_seconds", {
                            "value": Math.round(this._myTimeToWin)
                        });
                    }

                    if (!Global.myIsMultiverseTime) {
                        let score = Math.floor(this._myTimeToWin * 1000);
                        PP.CAUtils.submitScore("labyroots", score, function () {
                            let leaderboards = WL.scene.pp_getComponents("display-leaderboard");
                            for (let leaderboard of leaderboards) {
                                leaderboard.updateLeaderboard();
                            }
                        });
                    }
                } else {
                    if (Global.myGoogleAnalytics) {
                        gtag("event", "mother_tree_hit", {
                            "value": 1
                        });
                    }
                }
            }
        } else {
            if (Global.myGoogleAnalytics) {
                gtag("event", "mother_tree_hit_invincible", {
                    "value": 1
                });
            }
        }

        return hitted;
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);

        return clonedComponent;
    },
    pp_clonePostProcess() {
        this.start();
    }
});