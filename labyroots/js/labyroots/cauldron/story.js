WL.registerComponent('story', {
    _myOnlyVR: { type: WL.Type.Bool, default: true }
}, {
    init: function () {
    },
    start: function () {
        this._myStarted = false;
        this._myResetPhysx = true;
        this._myResetActive = false;
        this._myTimer2 = new PP.Timer(4);
        this._myTimer = new PP.Timer(30);
        this._myTimerSkipFirstTime = new PP.Timer(10);
        this._myTimerSkipFirstTimeVR = new PP.Timer(5);

        this._mySteps = [];
        this._myStepDelay = 0.8;
        this._myStepTimer = new PP.Timer(0.1);
        let delay = Math.pp_lerp(this._myStepDelay * 2, this._myStepDelay, 0.75);
        this._myStepTimer.start(Math.pp_random(delay - 0.1, delay + 0.05));

        this._mySkip = false;
        this._myCanSkip = false;

        this._mySessionActive = false;

        this._myPhysXResetCompleted = false;
    },
    update: function (dt) {
        if (Global.myReady) return;

        if (PP.myLeftGamepad.getButtonInfo(PP.GamepadButtonID.TOP_BUTTON).myMultiplePressEndCount >= 2 || PP.myLeftGamepad.getButtonInfo(PP.GamepadButtonID.BOTTOM_BUTTON).myMultiplePressEndCount >= 2 ||
            PP.myRightGamepad.getButtonInfo(PP.GamepadButtonID.TOP_BUTTON).myMultiplePressEndCount >= 2 || PP.myRightGamepad.getButtonInfo(PP.GamepadButtonID.BOTTOM_BUTTON).myMultiplePressEndCount >= 2 ||
            PP.myLeftGamepad.getButtonInfo(PP.GamepadButtonID.SELECT).myMultiplePressEndCount >= 2 || PP.myLeftGamepad.getButtonInfo(PP.GamepadButtonID.SQUEEZE).myMultiplePressEndCount >= 2 ||
            PP.myRightGamepad.getButtonInfo(PP.GamepadButtonID.SELECT).myMultiplePressEndCount >= 2 || PP.myRightGamepad.getButtonInfo(PP.GamepadButtonID.SQUEEZE).myMultiplePressEndCount >= 2
        ) {
            if (this._myCanSkip) {
                this._mySkip = true;
            }
        }

        if (!this._myStarted) {
            if (Global.myStoryReady) {
                if (PP.XRUtils.isSessionActive() || !this._myOnlyVR) {
                    let currentVersion = "2.1.0";
                    console.log("Game Version:", currentVersion);

                    this._myStarted = true;
                    this._myCanSkip = Global.mySaveManager.load("can_skip", false);

                    if (Global.myIsWeddingTime || Global.myIsMazeverseTime) {
                        if (Global.myFromAbove) {
                            this._myTimer.start(0);
                        } else {
                            this._myTimer.start(8);
                        }

                        this._myCanSkip = true;
                    }

                    if (Global.myIsMazeverseTime) {
                        Global.mySky.pp_rotateAxis(Math.pp_randomInt(0, 360), [0, 1, 0]);
                        Global.myLights.pp_rotateAxis(Math.pp_randomInt(0, 360), [0, 1, 0]);
                    }

                    Global.mySaveManager.save("is_wedding", false);
                    //Global.mySaveManager.save("is_mazeverse", false); keep mazeverse until switch

                    this._mySessionActive = PP.XRUtils.isSessionActive();
                }
            }
        } else {
            if (this._mySteps.length == 0) {
                this._mySteps[0] = PP.myAudioManager.createAudioPlayer(AudioID.PASSO_1);
            }

            if (this._myResetActive) {
                this._myResetActive = false;
                let physxs = WL.scene.pp_getComponents("physx");
                for (let physx of physxs) {
                    physx.active = true;
                }

                this._myPhysXResetCompleted = true;
            }

            if (this._myResetPhysx) {
                this._myResetPhysx = false;
                this._myResetActive = true;

                let physxs = WL.scene.pp_getComponents("physx");
                for (let physx of physxs) {
                    if (physx.backupExtents != null) {
                        physx.extents = physx.backupExtents;
                        //physx.backupExtents.vec3_error();
                        physx.backupExtents = null;
                    }
                    physx.active = false;
                }
            }


            this._myStepTimer.update(dt);
            if (this._myStepTimer.isDone()) {
                let delay = Math.pp_lerp(this._myStepDelay * 2, this._myStepDelay, 0.75);
                this._myStepTimer.start(Math.pp_random(delay - 0.1, delay + 0.05));

                let player = this._mySteps[0];
                player.setPosition(Global.myPlayer.getPositionReal());
                player.setPitch(Math.pp_random(1 - 0.35, 1 + 0.15));
                player.play();
            }

            this._myTimer.update(dt);
            this._myTimer2.update(dt);

            if (!this._mySessionActive && PP.XRUtils.isSessionActive()) {
                this._mySessionActive = true;

                if (this._myTimer.getTimeLeft() < 6) {
                    this._myTimer.start(6);
                }
            }

            this._myTimerSkipFirstTime.update(dt);
            if (this._myTimerSkipFirstTime.isJustDone()) {
                this._myCanSkip = true;
            }

            if (PP.XRUtils.isSessionActive()) {
                this._myTimerSkipFirstTimeVR.update(dt);
                if (this._myTimerSkipFirstTimeVR.isJustDone()) {
                    this._myCanSkip = true;
                }
            }

            if (this._myPhysXResetCompleted) {
                if (this._myTimer.isDone() || (this._myCanSkip && this._myTimer2.isDone() && this._mySkip)) {
                    if (this._mySkip && this._myTimer2.isDone() && this._myCanSkip) {
                        Global.sendAnalytics("event", "intro_skipped", {
                            "value": 1
                        });

                        if (this._myTimerSkipFirstTime.isDone()) {
                            Global.sendAnalytics("event", "intro_skipped_late", {
                                "value": 1
                            });
                        }
                    } else {
                        Global.sendAnalytics("event", "intro_watched", {
                            "value": 1
                        });
                    }

                    Global.sendAnalytics("event", "intro_done", {
                        "value": 1
                    });

                    PP.CAUtils.getUser(function (user) {
                        if (user != null && user.displayName != null && user.displayName.length != null && user.displayName.length > 0) {
                            Global.sendAnalytics("event", "playing_signed_in", {
                                "value": 1
                            });
                        }
                    }, null, false);

                    this._myTimer.reset();
                    this._myTimer2.reset();
                    Global.myAxe.pp_setActive(true);
                    Global.myFollowAxe.pp_setActive(true);
                    Global.myReady = true;

                    Global.mySaveManager.save("can_skip", true);

                    Global.myMusicPlayer = PP.myAudioManager.createAudioPlayer(AudioID.MUSIC);
                    Global.myMusicPlayer.play();
                }
            }
        }
    }
});

Global.myMusicPlayer = null;