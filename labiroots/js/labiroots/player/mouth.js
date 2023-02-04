WL.registerComponent('mouth', {
}, {
    init: function () {
    },
    start: function () {
        this._myPhysX = this.object.pp_getComponent('physx');
        this._myPhysX.onCollision(this._onCollision.bind(this));
        this._myTimerDestroy = new PP.Timer(0.5, false);
        this._myFruitToDestroy = [];
    },
    update: function (dt) {
        if (this._myTimerDestroy.isRunning()) {
            if (this._myTimerDestroy.update(dt)) {
                if (this._myTimerDestroy.isDone()) {
                    for (let object of this._myFruitToDestroy) {
                        object.pp_destroy();
                    }
                    this._myFruitToDestroy = [];
                }
            }
        }
    },
    _onCollision(type, physXComponent) {
        if (type == WL.CollisionEventType.Touch || type == WL.CollisionEventType.TriggerTouch) {
            let fruit = physXComponent.object.pp_getComponent("fruit");
            if (fruit) {
                if (!fruit._myUsed) {
                    fruit.activateEffect();
                    fruit.object.pp_setActive(false);
                    this._myFruitToDestroy.push(fruit.object);
                    this._myTimerDestroy.start();
                }
            }
        }
    }
});