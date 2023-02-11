WL.registerComponent('follow-axe', {
}, {
    init() {
    },
    start() {
        this._myOffset = [0.13, 0.17, 0];
        this._myPosition = PP.vec3_create();
        this._myTransformQuat = PP.quat2_create();
    },
    update(dt) {
        if (Global.myReady) {
            if (Global.myAxe) {
                let transform = Global.myAxe.pp_getTransformQuat(this._myTransformQuat);
                let position = this._myOffset.vec3_convertPositionToWorldQuat(transform, this._myPosition);

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