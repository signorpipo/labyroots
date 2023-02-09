WL.registerComponent('root', {
    _myNormal: { type: WL.Type.Object },
    _myHurt: { type: WL.Type.Object },
    _myDead: { type: WL.Type.Object }
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
                this._myPhases[2].pp_setActive(true);
                let tree = WL.scene.pp_getComponent("big-tree");
                if (tree) {
                    tree.rootDie();
                }

                if (Global.myGoogleAnalytics) {
                    gtag("event", "defeat_root", {
                        "value": 1
                    });
                }
            } else {
                this._myPhases[1].pp_setActive(true);
            }
        }

        return hitted;
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);

        return clonedComponent;
    },
});