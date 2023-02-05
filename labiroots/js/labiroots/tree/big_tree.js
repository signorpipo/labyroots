WL.registerComponent('big-tree', {
}, {
    init: function () {
    },
    start: function () {
        this._myStarted = false;
        this.myBigTreeRoots = 0;
        this._myHit = 0;
    },
    update: function (dt) {
        if (!this._myStarted) {
            if (Global.myReady) {
                this._myStarted = true;
                this.myBigTreeRoots = Global.mySetup.myTreeSetup.myBigTreeRoots;
                this._myHit = Global.mySetup.myTreeSetup.myBigTreeHit;
            }
        } else {

        }
    },
    rootDie() {
        if (this.myBigTreeRoots > 0) {
            this.myBigTreeRoots--;
            // cambia mesh
        }
    },
    hit() {
        if (this.myBigTreeRoots == 0) {
            if (this._myHit > 0) {
                this._myHit--;
                //suono
            }
        }
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);

        return clonedComponent;
    },
});