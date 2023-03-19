WL.registerComponent('root', {
    _myNormal: { type: WL.Type.Object },
    _myHurt: { type: WL.Type.Object },
    _myDead: { type: WL.Type.Object },
    _myAxeSpawnRoot: { type: WL.Type.Bool, default: false }
}, {
    init: function () {
    },
    start: function () {
        this._myStarted = false;
        this._myHit = 0;

        this._myCurrentPhase = 0;
        this._myPhases = [];
    },
    update: function (dt) {
        if (!this._myStarted) {
            if (Global.myReady) {
                let children = this.object.pp_getChildren();
                for (let i = 0; i < children.length; i++) {
                    this._myPhases[parseInt(children[i].pp_getName()) - 1] = children[i];
                }

                for (let phase of this._myPhases) {
                    phase.pp_setActive(false);
                }

                this._myStarted = true;
                this._myHit = Global.mySetup.myTreeSetup.myRootHit;
                this._myPhases[0].pp_setActive(true);
            }
        } else {

        }
    },
    hit() {
        let hitted = false;

        if (this._myHit > 0) {
            this._myHit--;
            hitted = true;

            for (let phase of this._myPhases) {
                phase.pp_setActive(false);
            }

            // suono
            if (this._myHit == 0) {
                Global.myRootsDefeated += 1;

                this._myPhases[2].pp_setActive(true);
                let tree = WL.scene.pp_getComponent("big-tree");
                if (tree) {
                    tree.rootDie();
                }

                if (Global.myGoogleAnalytics) {
                    gtag("event", "defeat_root", {
                        "value": 1
                    });

                    gtag("event", "defeat_root_" + Global.myRootsDefeated, {
                        "value": 1
                    });

                    if (this._myAxeSpawnRoot) {
                        gtag("event", "defeat_root_axe_spawn", {
                            "value": 1
                        });

                        gtag("event", "defeat_root_axe_spawn_" + Global.myRootsDefeated, {
                            "value": 1
                        });
                    } else {
                        gtag("event", "defeat_root_normal", {
                            "value": 1
                        });

                        gtag("event", "defeat_root_normal_" + Global.myRootsDefeated, {
                            "value": 1
                        });
                    }
                }
            } else {
                this._myPhases[1].pp_setActive(true);

                if (Global.myGoogleAnalytics) {
                    gtag("event", "root_hit", {
                        "value": 1
                    });

                    let rootHit = Global.myRootsDefeated + 1;
                    gtag("event", "root_hit_" + rootHit, {
                        "value": 1
                    });

                    if (this._myAxeSpawnRoot) {
                        gtag("event", "root_hit_axe_spawn", {
                            "value": 1
                        });

                        gtag("event", "root_hit_axe_spawn_" + rootHit, {
                            "value": 1
                        });
                    } else {
                        gtag("event", "root_hit_normal", {
                            "value": 1
                        });

                        gtag("event", "root_hit_normal_" + rootHit, {
                            "value": 1
                        });
                    }
                }
            }
        }

        return hitted;
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        clonedComponent.active = this.active;

        clonedComponent._myAxeSpawnRoot = this._myAxeSpawnRoot;

        return clonedComponent;
    },
});

Global.myRootsDefeated = 0;