WL.registerComponent('open-zesty', {
}, {
    init: function () {
    },
    start: function () {
        this._myChange = 0;
        this._myEnd = 0;
        this._myHit = 3;
    },
    update: function (dt) {
        if (this._myEnd > 0) {
            this._myEnd--;
            if (this._myEnd == 0) {
                this._myChange = 1;

                Global.myUnmute = true;
                Howler.mute(true);

                if (Global.myAxe != null && Global.myAxe._myGrabbable != null) {
                    Global.myAxe._myGrabbable.release();
                }
            }
        }

        if (this._myEnd == 0 && this._myChange > 0) {
            this._myChange--;
            if (this._myChange == 0) {
                this.openZestyUrl();
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
        this._myEnd = 90;
        this._myChange = 1;

        Global.sendAnalytics("event", "open_zesty", {
            "value": 1
        });
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        clonedComponent.active = this.active;
        return clonedComponent;
    },
    result(result) {
    },
    openZestyUrl() {
        try {
            let zesty = WL.scene.pp_getComponent("zesty-banner");
            if (zesty != null) {
                Global.myZestyComponent = zesty;

                let onSuccess = function () {
                    Global.myUnmute = true;
                    Howler.mute(true);

                    if (Global.myAxe != null && Global.myAxe._myGrabbable != null) {
                        Global.myAxe._myGrabbable.release();
                    }

                    Global.sendAnalytics("event", "open_zesty_success", {
                        "value": 1
                    });
                }.bind(this);

                if (zesty.banner != null && zesty.banner.url != null) {
                    let onZestySuccess = function () {
                        onSuccess();

                        try {
                            zesty.executeClick();
                        } catch (error) {
                            // Do nothing
                        }
                    }.bind(this);

                    PP.XRUtils.openLink(zesty.banner.url, true, true, true, true, onZestySuccess);
                } else {
                    PP.XRUtils.openLink("https://www.zesty.market", true, true, true, true, onSuccess);
                }
            }
        } catch (error) {
            // Do nothing
        }
    }
});

Global.myZestyComponent = null;