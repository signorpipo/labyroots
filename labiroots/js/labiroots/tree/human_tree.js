WL.registerComponent('human-tree', {
}, {
    init: function () {
    },
    start: function () {
    },
    update: function (dt) {
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);

        return clonedComponent;
    },
});