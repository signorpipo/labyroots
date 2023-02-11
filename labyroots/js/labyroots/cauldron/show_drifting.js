WL.registerComponent('show-drifting', {
}, {
    init: function () {
    },
    start: function () {
    },
    update: function (dt) {
        this.object.pp_getPosition().vec_error(8);
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        return clonedComponent;
    }
});