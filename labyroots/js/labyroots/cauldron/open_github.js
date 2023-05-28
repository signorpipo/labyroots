WL.registerComponent('open-github', {
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
                if (WL.xrSession) {
                    WL.xrSession.end();
                }

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
                        gtag("event", "open_github_success", {
                            "value": 1
                        });
                    }
                }.bind(this);

                let onError = function () {
                    this._myChange = 10;
                }.bind(this);

                Global.windowOpen("https://github.com/SignorPipo/labyroots", onSuccess, onError);
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
        this._myChange = 1;

        if (Global.myGoogleAnalytics) {
            gtag("event", "open_github", {
                "value": 1
            });
        }
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        clonedComponent.active = this.active;
        return clonedComponent;
    }
});