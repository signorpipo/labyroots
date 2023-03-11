WL.registerComponent('lights-setter', {
}, {
    init: function () {
    },
    start: function () {
        Global.myLights = this.object;
    },
    update: function (dt) {
    }
});

Global.myLights = null;