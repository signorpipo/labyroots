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
                this._myChange = 1;

                if (WL.xrSession) {
                    Global.myUnmute = true;
                    Howler.mute(true);

                    if (Global.myAxe != null && Global.myAxe._myGrabbable != null) {
                        Global.myAxe._myGrabbable.release();
                    }
                    WL.xrSession.end();
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
        this._myEnd = 60;
        this._myChange = 60;

        if (Global.myGoogleAnalytics) {
            gtag("event", "open_zesty", {
                "value": 1
            });
        }
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        return clonedComponent;
    },
    _onXRSessionEnd() {
        this._myEnd = 0;
        if (this._myChange > 0) {
            this._myChange = 1;
        }
    },
    result(result) {
    },
    openZestyUrl() {
        let zesty = WL.scene.pp_getComponent("zesty-banner");
        if (zesty != null) {
            Global.myZestyComponent = this;

            let result = null;
            if (zesty.banner != null) {
                result = zesty.executeClick();
            } else {
                result = Global.windowOpen("https://app.zesty.market/space/" + zesty.space);
            }

            if (result == null) {
                this._myChange = 10;
            } else {
                Global.myUnmute = true;
                Howler.mute(true);

                if (Global.myAxe != null && Global.myAxe._myGrabbable != null) {
                    Global.myAxe._myGrabbable.release();
                }

                if (Global.myGoogleAnalytics) {
                    gtag("event", "open_zesty_success", {
                        "value": 1
                    });
                }
            }
        }
    }
});

Global.myZestyComponent = null;