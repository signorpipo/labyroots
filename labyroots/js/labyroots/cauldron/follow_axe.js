WL.registerComponent('follow-axe', {
}, {
    init() {
    },
    start() {
    },
    update(dt) {
        if (Global.myReady) {
            if (Global.myAxe) {
                let transform = Global.myAxe.pp_getTransformQuat();
                let position = [0.13, 0.17, 0].vec3_convertPositionToWorldQuat(transform);

                this.object.pp_setTransformQuat(transform);
                this.object.pp_setPosition(position);
            }
        }
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        return clonedComponent;
    }
});