WL.registerComponent('fix-drifting', {
}, {
    init: function () {
    },
    start: function () {
    },
    update: function (dt) {
        this.object.pp_resetPositionLocal();
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        return clonedComponent;
    }
});