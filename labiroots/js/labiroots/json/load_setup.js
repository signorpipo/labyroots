WL.registerComponent("load-setup", {
}, {
    init: function () {
    },
    start: function () {
        loadFileJSON("./setup.json", data => Global.mySetup = data);
    },
    update: function (dt) {
    }
});

Global.mySetup = {};