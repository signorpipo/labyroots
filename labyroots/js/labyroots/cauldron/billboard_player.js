WL.registerComponent('billboard-player', {
    _myKeepUp: { type: WL.Type.Bool, default: false }
}, {
    init() {
    },
    start() {
        this._myUp = [0, 1, 0];
        this._myPosition = PP.vec3_create();
    },
    update(dt) {
        let playerPosition = PP.myPlayerObjects.myHead.pp_getPosition();
        let directionToPlayer = playerPosition.vec3_sub(this.object.pp_getPosition(this._myPosition), this._myPosition);
        if (!directionToPlayer.vec3_isZero(0.0001)) {
            if (this._myKeepUp) {
                this.object.pp_setUp(this._myUp, directionToPlayer);
            } else {
                this.object.pp_setForward(directionToPlayer, this._myUp);
            }
        }
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        clonedComponent.active = this.active;

        clonedComponent._myKeepUp = this._myKeepUp;

        return clonedComponent;
    }
});