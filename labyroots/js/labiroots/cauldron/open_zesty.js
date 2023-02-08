WL.registerComponent('open-zesty', {
}, {
    init: function () {
    },
    start: function () {
        this._myChange = 0;
        this._myEnd = 0;
        this._myHit = 3;

        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));
    },
    update: function (dt) {
        if (this._myEnd > 0) {
            this._myEnd--;
            if (this._myEnd == 0) {
                if (WL.xrSession) {
                    WL.xrSession.end();
                }
            }
        }

        if (this._myChange > 0) {
            this._myChange--;
            if (this._myChange == 0) {
                let zesty = WL.scene.pp_getComponent("zesty-banner");
                if (zesty != null) {
                    Global.myZestyComponent = this;
                    if (zesty.banner != null) {
                        let result = zesty.onClick();
                    } else {
                        let result = Global.windowOpen("https://app.zesty.market/space/" + zesty.space);
                    }
                }
            }
        }
    },
    hit() {
        if (this._myHit == 0) {
            this._myHit = 3;
        }

        this._myHit--;
        return true;
    },
    open() {
        this._myEnd = 30;
        this._myChange = 180;
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        return clonedComponent;
    },
    _onXRSessionEnd() {
        if (this._myChange > 0) {
            this._myChange = 0;
            let zesty = WL.scene.pp_getComponent("zesty-banner");
            if (zesty != null) {
                Global.myZestyComponent = this;
                if (zesty.banner != null) {
                    let result = zesty.onClick();
                } else {
                    let result = Global.windowOpen("https://app.zesty.market/space/" + zesty.space);
                }
            }
        }
    },
    result(result) {
        if (!result) {
            this._myChange = 10;
        }
    }
});

Global.myZestyComponent = null;