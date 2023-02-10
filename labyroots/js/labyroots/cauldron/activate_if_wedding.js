WL.registerComponent('activate-if-wedding', {
    _myIsWedding: { type: WL.Type.Bool, default: false }
}, {
    init: function () {
    },
    start: function () {
    },
    update: function (dt) {
        let isWedding = Global.mySaveManager.loadBool("is_wedding", false);

        if (isWedding) {
            if (!this._myIsWedding) {
                this.object.pp_setActive(false);
            } else {
                this.object.pp_setActive(true);
            }
        } else {
            if (this._myIsWedding) {
                this.object.pp_setActive(false);
            } else {
                this.object.pp_setActive(true);
            }
        }
    }
});