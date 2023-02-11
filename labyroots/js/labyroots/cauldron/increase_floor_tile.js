WL.registerComponent('increase-floor-tile', {
    _myAmount: { type: WL.Type.Float, default: 1.0 }
}, {
    init() {
    },
    start() {
        this._myStarted = false;
    },
    update(dt) {
        if (!this._myStarted) {
            /*
            this._myStarted = true;
            let meshes = this.object.pp_getComponents("mesh");
            for (let mesh of meshes) {
                mesh.object.pp_scaleObject(this._myAmount);
            }*/
        }
    }
});