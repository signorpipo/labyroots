WL.registerComponent('deactivate-on-story', {
}, {
    init: function () {
    },
    start: function () {
    },
    update: function (dt) {
        if (Global.myReady) {
            this.object.pp_setActive(false);
        }
    }
});