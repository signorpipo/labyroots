WL.registerComponent('activate-if-wedding', {
    _myIsWedding: { type: WL.Type.Bool, default: false },
    _myIsMazeverse: { type: WL.Type.Bool, default: false }
}, {
    init: function () {
    },
    start: function () {
        this._myDone = false;
    },
    update: function (dt) {
        if (!this._myDone) {
            this._myDone = true;
            let isWedding = Global.isWedding();
            let isMazeverse = Global.isMazeverse();

            if (isMazeverse) {
                if (!this._myIsMazeverse) {
                    this.object.pp_setActive(false);
                } else {
                    this.object.pp_setActive(true);
                }
            } else if (isWedding) {
                if (!this._myIsWedding) {
                    this.object.pp_setActive(false);
                } else {
                    this.object.pp_setActive(true);
                }
            } else {
                if (this._myIsWedding || this._myIsMazeverse) {
                    this.object.pp_setActive(false);
                } else {
                    this.object.pp_setActive(true);
                }
            }
        }
    }
});