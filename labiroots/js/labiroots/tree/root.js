WL.registerComponent('root', {
}, {
    init: function () {
    },
    start: function () {
        this._myStarted = false;
        this._myHit = 0;
    },
    update: function (dt) {
        if (!this._myStarted) {
            if (Global.myReady) {
                this._myStarted = true;
                this._myHit = Global.mySetup.myTreeSetup.myRootHit;
            }
        } else {

        }
    },
    hit() {
        if (this._myHit > 0) {
            this._myHit--;
            // suono
            if (this._myHit == 0) {
                // cambia mesh
                let tree = WL.scene.pp_getComponent("big_tree");
                if (tree) {
                    tree.rootDie();
                }
            }
        }
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);

        return clonedComponent;
    },
});