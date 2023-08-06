WL.registerComponent('wondermelon', {
}, {
    start: function () {
        this._myGathered = false;
        this._myUsed = false;
        this._myGrabbable = this.object.pp_getComponent("pp-grabbable");
        this._myIsGrabbed = false;

        this._myStarted = false;

        this._myChange = 0;
        this._myEnd = 0;

        this._myPhysx = this.object.pp_getComponent("physx");
        if (this._myPhysx != null) {
            this._myPhysx.kinematic = true;
            this._myPulseCounter = 90;
        }

        this._myDisable = false;
    },
    update: function (dt) {
        if (!this._myStarted) {
            if (Global.myStoryReady) {
                this.object.pp_translate([0, 0.5, 0]);
                this._myStarted = true;
                this._myAudioMangia = PP.myAudioManager.createAudioPlayer(AudioID.MANGIA_FRUTTO);
            }
        } else {
            if (this._myDisable) {
                this._myDisable = false;
                this.object.pp_setActive(false);
                this.active = true;
            }

            if (this._myGrabbable != null) {
                if (this._myGrabbable.isGrabbed()) {
                    if (!this._myGathered) {
                        Global.sendAnalytics("event", "collect_wondermelon", {
                            "value": 1
                        });
                    }

                    this._myGathered = true;
                    this._myIsGrabbed = true;
                } else {
                    this._myIsGrabbed = false;
                }
            } else {
                this._myGrabbable = this.object.pp_getComponent("pp-grabbable");
            }

            if (Global.myStoryReady) {
                if (this._myPulseCounter > 0) {
                    this._myPulseCounter--;
                    this._myPhysx.kinematic = false;

                    if (this._myPulseCounter == 0) {
                        let maxLinear = 2;
                        let maxAngular = 1;
                        this._myPhysx.linearVelocity = [Math.pp_random(maxLinear / 2, maxLinear) * Math.pp_randomSign(), 1, Math.pp_random(maxLinear / 2, maxLinear) * Math.pp_randomSign()];
                        this._myPhysx.angularVelocity = [Math.pp_random(maxAngular / 2, maxAngular) * Math.pp_randomSign(), Math.pp_random(maxAngular / 2, maxAngular) * Math.pp_randomSign(), Math.pp_random(maxAngular / 2, maxAngular) * Math.pp_randomSign()];
                    }
                }
            }

            this._updateOpenLink(dt);
        }
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        clonedComponent.active = this.active;

        return clonedComponent;
    },
    pp_clonePostProcess(clonedComponent) {
        clonedComponent.start();
    },
    activateEffect() {
        if (!this._myUsed && this._myGrabbable != null && this._myGrabbable.isGrabbed()) {

            this._myEnd = 90;
            this._myChange = 1;

            Global.sendAnalytics("event", "open_wondermelon", {
                "value": 1
            });

            this._myUsed = true;

            //this._myAudioMangia.setPosition(this.object.pp_getPosition());
            this._myAudioMangia.setPitch(Math.pp_random(1.25 - 0.15, 1.25 + 0.05));
            this._myAudioMangia.play();

            this._myDisable = true;
        }
    },
    _updateOpenLink(dt) {
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

                    Global.sendAnalytics("event", "open_wondermelon_success", {
                        "value": 1
                    });

                    this.active = false;
                }.bind(this);

                let onError = function () {
                    this._myChange = 10;
                }.bind(this);

                Global.windowOpen("https://signor-pipo.itch.io", onSuccess, onError);
            }
        }
    }
});
