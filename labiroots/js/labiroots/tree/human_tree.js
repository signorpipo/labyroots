WL.registerComponent('human-tree', {
    _myType: { type: WL.Type.Int, default: 60 }
}, {
    init: function () {
        this._myPoints = [];
    },
    start: function () {
        this._myPoints = this.object.pp_getChildren();
    },
    update: function (dt) {
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);

        return clonedComponent;
    },
    spawnFruits(fruitAmount) {
        if (fruitAmount == 8) {
            fruitAmount = Math.pp_randomInt(0, this._myPoints.length);
        } else if (fruitAmount == 9) {
            fruitAmount = Math.pp_randomInt(1, this._myPoints.length);
        }

        let points = this._myPoints.pp_clone();
        while (fruitAmount > 0) {
            fruitAmount--;
            let point = Math.pp_randomPick(points);
            points.pp_removeEqual(point);

            let fruit = Global.myFruits[this._myType].pp_clone();
            fruit.pp_setParent(this.object);
            fruit.pp_setTransformLocalQuat(point.pp_getTransformLocalQuat());
            fruit.pp_setActive(true);
        }
    },
    pp_clonePostProcess() {
        this.start();
    }
});