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

        if (Global.myGoogleAnalytics) {
            gtag("event", "open_zesty", {
                "value": 1
            });
        }
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        clonedComponent.active = this.active;
        return clonedComponent;
    },
    result(result) {
    },
    openZestyUrl() {
        let zesty = WL.scene.pp_getComponent("zesty-banner");
        if (zesty != null) {
            if (WL.xrSession) {
                WL.xrSession.end();
            }

            Global.myZestyComponent = zesty;

            let onSuccess = function () {
                if (WL.xrSession) {
                    WL.xrSession.end();
                }

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
            }.bind(this);

            let onError = function () {
                this._myChange = 10;
            }.bind(this);

            if (zesty.banner != null) {
                let onZestySuccess = function () {
                    onSuccess();
                    zesty.executeClick();
                }.bind(this);
                Global.windowOpen(zesty.banner.url, onZestySuccess, onError);
            } else {
                Global.windowOpen("https://app.zesty.market/space/11457541-0720-4287-a2a7-e3adfe7426a9", onSuccess, onError);
            }
        }
    }
});

Global.myZestyComponent = null;