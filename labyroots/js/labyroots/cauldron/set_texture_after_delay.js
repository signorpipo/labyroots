WL.registerComponent('set-texture-after-delay', {
    _myToSet: { type: WL.Type.Object }
}, {
    init: function () {
    },
    start: function () {
        this._myTimer = new PP.Timer(5);
    },
    update: function (dt) {
        if (Global.myStoryReady) {
            if (this._myTimer.isRunning()) {
                this._myTimer.update(dt);
                if (this._myTimer.isDone()) {
                    let myMesh = this.object.pp_getComponent("mesh");
                    if (myMesh) {
                        let setMesh = this._myToSet.pp_getComponent("mesh");
                        if (setMesh && setMesh.material.diffuseTexture._id == 0 && WL.scene.pp_getComponent("zesty-banner").banner == null) {
                            setMesh.material.diffuseTexture = myMesh.material.diffuseTexture;

                            if (Global.myGoogleAnalytics) {
                                gtag("event", "zesty_load_fail", {
                                    "value": 1
                                });
                            }
                        }
                    }
                }
            }
        }
    }
});