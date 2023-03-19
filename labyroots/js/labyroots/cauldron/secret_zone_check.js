WL.registerComponent('secret-zone-check', {
}, {
    init: function () {
    },
    start: function () {
        this._myReached = false;
        this._myStarted = false;
        this._myCell = null;

        this._myUp = [0, 1, 0];
        this._myPosition = [0, 1, 0];
    },
    update: function (dt) {
        if (Global.myReady) {
            if (!this._myStarted) {
                this._myStarted = true;

                this._myCell = Global.myMaze.getCellByPosition(this.object.pp_getPosition());
            }

            if (!this._myReached) {
                if (this._myCell != null) {
                    let distanceFromPlayer = Global.myPlayer.getPosition(this._myPosition).vec3_removeComponentAlongAxis(this._myUp, this._myPosition).vec3_distance(this._myCell.myCellPosition.vec3_removeComponentAlongAxis(this._myUp));
                    if (distanceFromPlayer <= this._myCell.myCellSize) {
                        this._myReached = true;

                        if (Global.myGoogleAnalytics) {
                            gtag("event", "enter_secret_zone", {
                                "value": 1
                            });
                        }
                    }
                }
            }
        }
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        clonedComponent.active = this.active;
        return clonedComponent;
    },
});