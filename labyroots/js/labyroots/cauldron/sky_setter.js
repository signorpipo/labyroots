WL.registerComponent('sky-setter', {
}, {
    init: function () {
    },
    start: function () {
        Global.mySky = this.object;
    },
    update: function (dt) {
    }
});

Global.mySky = null;