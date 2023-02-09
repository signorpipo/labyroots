WL.registerComponent('activate-if-wedding', {
    _myIsWedding: { type: WL.Type.Bool, default: false }
}, {
    init: function () {
    },
    start: function () {
    },
    update: function (dt) {
        let urlSearchParams = new URL(document.location).searchParams;
        if (urlSearchParams != null && urlSearchParams.get("wedding") != null) {
            if (!this._myIsWedding) {
                this.object.pp_setActive(false);
            }
        } else {
            if (this._myIsWedding) {
                this.object.pp_setActive(false);
            }
        }
    }
});