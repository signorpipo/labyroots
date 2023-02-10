
WL.registerComponent('deactivate-physx-if-far-from-player', {
}, {
    init() {
    },
    start() {
        this._myStartd = false;
        this._myPhysxList = [];

        this._myMaxDistance = 4;
        this._myPosition = PP.vec3_create();
        this._myPlayerPosition = PP.vec3_create();

        this._myActive = false;
    },
    update(dt) {
        if (!this._myStartd) {
            this._myStartd = true;
            this._myPhysxList = this.object.pp_getComponents("physx");

            for (let physx of this._myPhysxList) {
                //physx.static = true;
            }
        } else if (this._myActive) {
            let position = this.object.pp_getPosition(this._myPosition);
            let playerPosition = Global.myPlayer.getPosition(this._myPlayerPosition);
            if (position.vec3_distance(playerPosition) > this._myMaxDistance) {
                for (let physx of this._myPhysxList) {
                    physx.active = false;
                }
            } else {
                for (let physx of this._myPhysxList) {
                    physx.active = true;
                }
            }
        }
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        return clonedComponent;
    }
});