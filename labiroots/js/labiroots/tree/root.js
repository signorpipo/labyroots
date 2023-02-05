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

        this._myNormal.pp_setActive(false);
        this._myHurt.pp_setActive(false);
        this._myDead.pp_setActive(false);
    },
    update: function (dt) {
        if (!this._myStarted) {
            if (Global.myReady) {
                this._myStarted = true;
                this._myHit = Global.mySetup.myTreeSetup.myRootHit;
                this._myNormal.pp_setActive(true);
            }
        } else {

        }
    },
    hit() {
        let hitted = false;

        if (this._myHit > 0) {
            this._myHit--;
            hitted = true;

            this._myNormal.pp_setActive(false);
            this._myHurt.pp_setActive(false);
            this._myDead.pp_setActive(false);

            // suono
            if (this._myHit == 0) {
                this._myDead.pp_setActive(true);
                let tree = WL.scene.pp_getComponent("big_tree");
                if (tree) {
                    tree.rootDie();
                }
            } else {
                this._myHurt.pp_setActive(true);
            }
        }

        return hitted;
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);

        return clonedComponent;
    },
});