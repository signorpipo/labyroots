WL.registerComponent('axe', {
}, {
    init: function () {
    },
    start: function () {
        this._myPhysX = this.object.pp_getComponent('physx');
        this._myPhysX.onCollision(this._onCollision.bind(this));
    },
    update: function (dt) {
    },
    resetPosition() {

    },
    _onCollision(type, physXComponent) {
    }
});