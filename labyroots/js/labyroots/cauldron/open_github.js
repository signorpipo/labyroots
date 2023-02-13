WL.registerComponent('open-github', {
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
                    Global.myUnmute = true;
                    Howler.mute(true);

                    if (Global.myAxe != null && Global.myAxe._myGrabbable != null) {
                        Global.myAxe._myGrabbable.release();
                    }

                    WL.xrSession.end();
                }
            }
        }

        if (this._myChange > 0) {
            this._myChange--;
            if (this._myChange == 0) {
                let result = Global.windowOpen("https://github.com/SignorPipo/labyroots");

                if (!result) {
                    this._myChange = 10;
                } else {
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

        if (Global.myGoogleAnalytics) {
            gtag("event", "open_github", {
                "value": 1
            });
        }
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        return clonedComponent;
    },
    _onXRSessionEnd() {
        if (this._myChange > 0) {
            this._myChange = 0;
            let result = Global.windowOpen("https://github.com/SignorPipo/labyroots");

            if (!result) {
                this._myChange = 10;
            }
        }
    }
});