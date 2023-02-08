WL.registerComponent('billboard-player', {
    _myKeepUp: { type: WL.Type.Bool, default: false }
}, {
    init() {
    },
    start() {
    },
    update(dt) {
        let playerPosition = PP.myPlayerObjects.myHead.pp_getPosition();
        let directionToPlayer = playerPosition.vec3_sub(this.object.pp_getPosition());
        if (!directionToPlayer.vec3_isZero(0.0001)) {
            if (this._myKeepUp) {
                this.object.pp_setUp([0, 1, 0], directionToPlayer);
            } else {
                this.object.pp_setForward(directionToPlayer, [0, 1, 0]);
            }
        }
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);

        clonedComponent._myKeepUp = this._myKeepUp;

        return clonedComponent;
    }
});