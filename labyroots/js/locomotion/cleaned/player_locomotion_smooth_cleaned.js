CleanedPlayerLocomotionSmooth = class CleanedPlayerLocomotionSmooth extends PlayerLocomotionMovement {
    constructor(params, locomotionRuntimeParams) {
        super(locomotionRuntimeParams);

        this._myParams = params;

        this._myDirectionReference = PP.myPlayerObjects.myHead;

        this._myStickIdleTimer = new PP.Timer(0.25, false);

        let directionConverterNonVRParams = new PP.Direction2DTo3DConverterParams();
        directionConverterNonVRParams.myAutoUpdateFlyForward = this._myParams.myFlyEnabled;
        directionConverterNonVRParams.myAutoUpdateFlyRight = this._myParams.myFlyEnabled;
        directionConverterNonVRParams.myMinAngleToFlyForwardUp = this._myParams.myMinAngleToFlyUpNonVR;
        directionConverterNonVRParams.myMinAngleToFlyForwardDown = this._myParams.myMinAngleToFlyDownNonVR;
        directionConverterNonVRParams.myMinAngleToFlyRightUp = this._myParams.myMinAngleToFlyRight;
        directionConverterNonVRParams.myMinAngleToFlyRightDown = this._myParams.myMinAngleToFlyRight;

        let directionConverterVRParams = new PP.Direction2DTo3DConverterParams();
        directionConverterVRParams.myAutoUpdateFlyForward = this._myParams.myFlyEnabled;
        directionConverterVRParams.myAutoUpdateFlyRight = this._myParams.myFlyEnabled;
        directionConverterVRParams.myMinAngleToFlyForwardUp = this._myParams.myMinAngleToFlyUpVR;
        directionConverterVRParams.myMinAngleToFlyForwardDown = this._myParams.myMinAngleToFlyDownVR;
        directionConverterVRParams.myMinAngleToFlyRightUp = this._myParams.myMinAngleToFlyRight;
        directionConverterVRParams.myMinAngleToFlyRightDown = this._myParams.myMinAngleToFlyRight;

        this._myDirectionConverterNonVR = new PP.Direction2DTo3DConverter(directionConverterNonVRParams);
        this._myDirectionConverterVR = new PP.Direction2DTo3DConverter(directionConverterVRParams);
        this._myCurrentDirectionConverter = this._myDirectionConverterNonVR;

        if (Global.myFromAbove) {
            this._myLocomotionRuntimeParams.myIsFlying = true;
        }

        this._myGravitySpeed = 0;

        if (WL.xrSession) {
            this._onXRSessionStart(WL.xrSession);
        }
        WL.onXRSessionStart.push(this._onXRSessionStart.bind(this));
        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));

        this._myStepDelay = 0.8;
        this._myStepTimer = new PP.Timer(this._myStepDelay);
        let delay = this._myStepDelay / 5;
        this._myStepTimer.start(Math.max(0, Math.pp_random(delay - 0.1, delay + 0.05)));
        this._StepRemove = false;

        this._mySteps = [];
        this.stepCounter = 0;
        //this._mySteps[1] = PP.myAudioManager.createAudioPlayer(AudioID.PASSO_3);        

        this._myNonVRPlayingTimer = new PP.Timer(30);
        this._myTimeMoving = 0;
        this._myTimeMovingStep = [1, 2, 3, 5, 10, 20, 30, 60];
        this._myTimeMovingStepIndex = 0;
    }

    update(dt) {
        // implemented outside class definition
    }
};

CleanedPlayerLocomotionSmooth.prototype.update = function () {
    let playerUp = PP.vec3_create();
    let headMovement = PP.vec3_create();
    let direction = PP.vec3_create();
    let directionOnUp = PP.vec3_create();
    let verticalMovement = PP.vec3_create();
    let feetTransformQuat = PP.quat2_create();

    let directionReferenceTransformQuat = PP.quat2_create();
    return function update(dt) {
        this._myParams.myMaxSpeed = Global.mySetup.myLocomotionSetup.mySpeed;

        playerUp = this._myParams.myPlayerHeadManager.getPlayer().pp_getUp(playerUp);

        headMovement.vec3_zero();

        let axes = PP.myGamepads[this._myParams.myHandedness].getAxesInfo().getAxes();
        axes[0] = Math.abs(axes[0]) > this._myParams.myMovementMinStickIntensityThreshold ? axes[0] : 0;
        axes[1] = Math.abs(axes[1]) > this._myParams.myMovementMinStickIntensityThreshold ? axes[1] : 0;

        let horizontalMovement = false;
        let speedUsed = 0;
        if (!axes.vec2_isZero()) {
            this._myStickIdleTimer.start();

            direction = this._myCurrentDirectionConverter.convertTransformQuat(axes, this._myDirectionReference.pp_getTransformQuat(directionReferenceTransformQuat), playerUp, direction);

            if (!direction.vec3_isZero()) {
                this._myLocomotionRuntimeParams.myIsFlying = this._myLocomotionRuntimeParams.myIsFlying || direction.vec3_componentAlongAxis(playerUp, directionOnUp).vec3_length() > 0.000001;
                if (!this._myLocomotionRuntimeParams.myIsFlying) {
                    direction = direction.vec3_removeComponentAlongAxis(playerUp, direction);
                }

                let movementIntensity = axes.vec2_length();
                let speed = Math.pp_lerp(0, this._myParams.myMaxSpeed, movementIntensity);
                if (this._myParams.myFlyEnabled && PP.myGamepads[this._myParams.myHandedness].getButtonInfo(PP.GamepadButtonID.SELECT).isPressed()) {
                    speed = 20;

                    if (!Global.myDebugMoveUsed) {
                        Global.myDebugMoveUsed = true;

                        if (Global.myGoogleAnalytics) {
                            gtag("event", "debug_movement_used", {
                                "value": 1
                            });
                        }
                    }
                }

                headMovement = direction.vec3_scale(speed * dt, headMovement);

                horizontalMovement = true;
                speedUsed = speed;
            }
        } else {
            if (this._myStickIdleTimer.isRunning()) {
                this._myStickIdleTimer.update(dt);
                if (this._myStickIdleTimer.isDone()) {
                    this._myCurrentDirectionConverter.resetFly();
                }
            }
        }

        if (this._myParams.myFlyEnabled) {
            if (PP.myGamepads[this._myParams.myHandedness].getButtonInfo(PP.GamepadButtonID.TOP_BUTTON).isPressed()) {
                if (!Global.myDebugFlyUsed) {
                    Global.myDebugFlyUsed = true;

                    if (Global.myGoogleAnalytics) {
                        gtag("event", "debug_fly_used", {
                            "value": 1
                        });
                    }
                }

                let speed = Math.pp_lerp(0, this._myParams.myMaxSpeed, 1);
                if (this._myParams.myFlyEnabled && PP.myGamepads[this._myParams.myHandedness].getButtonInfo(PP.GamepadButtonID.SELECT).isPressed()) {
                    speed = 20;
                }
                verticalMovement = playerUp.vec3_scale(speed * dt, verticalMovement);
                headMovement = headMovement.vec3_add(verticalMovement, headMovement);
                this._myLocomotionRuntimeParams.myIsFlying = true;
            } else if (PP.myGamepads[this._myParams.myHandedness].getButtonInfo(PP.GamepadButtonID.BOTTOM_BUTTON).isPressed()) {
                let speed = Math.pp_lerp(0, this._myParams.myMaxSpeed, 1);
                if (this._myParams.myFlyEnabled && PP.myGamepads[this._myParams.myHandedness].getButtonInfo(PP.GamepadButtonID.SELECT).isPressed()) {
                    speed = 20;
                }
                verticalMovement = playerUp.vec3_scale(-speed * dt, verticalMovement);
                headMovement = headMovement.vec3_add(verticalMovement, headMovement);
                this._myLocomotionRuntimeParams.myIsFlying = true;
            }

            if (PP.myGamepads[this._myParams.myHandedness].getButtonInfo(PP.GamepadButtonID.BOTTOM_BUTTON).isPressEnd(2)) {
                this._myLocomotionRuntimeParams.myIsFlying = false;
            }
        }

        if (true || !PP.myGamepads[this._myParams.myHandedness].getButtonInfo(PP.GamepadButtonID.THUMBSTICK).isPressed()) {
            if (!this._myLocomotionRuntimeParams.myIsFlying) {
                this._myGravitySpeed += this._myParams.myGravityAcceleration * dt;
                verticalMovement = playerUp.vec3_scale(this._myGravitySpeed * dt, verticalMovement);
                headMovement = headMovement.vec3_add(verticalMovement, headMovement);
            }

            feetTransformQuat = this._myParams.myPlayerTransformManager.getTransformQuat(feetTransformQuat);

            globalDT = dt;
            this._myParams.myPlayerTransformManager.move(headMovement, this._myLocomotionRuntimeParams.myCollisionRuntimeParams);
            if (horizontalMovement) {
                this._myParams.myPlayerTransformManager.resetReal(true, false, false);
                Global.myPlayer.resetHeadToReal();
            }

            if (horizontalMovement && this._myLocomotionRuntimeParams.myCollisionRuntimeParams.myFixedMovement.vec3_length() > 0.00001) {

                this._myTimeMoving += dt;
                if (this._myTimeMovingStepIndex < this._myTimeMovingStep.length && this._myTimeMoving > this._myTimeMovingStep[this._myTimeMovingStepIndex] * 60) {
                    if (Global.myGoogleAnalytics) {
                        gtag("event", "moving_for_" + this._myTimeMovingStep[this._myTimeMovingStepIndex] + "_minutes_" + (Global.mySessionStarted ? "vr" : "non_vr"), {
                            "value": 1
                        });
                    }
                    this._myTimeMovingStepIndex++;
                }

                if (this._myNonVRPlayingTimer.isRunning()) {
                    this._myNonVRPlayingTimer.update(dt);
                    if (this._myNonVRPlayingTimer.isDone()) {
                        if (Global.myGoogleAnalytics) {
                            if (!Global.mySessionStarted) {
                                gtag("event", "moving_non_vr", {
                                    "value": 1
                                });
                            }
                        }
                    }
                }

                this._myStepTimer.update(dt);

                if (this._myStepTimer.isDone()) {
                    this._StepRemove = true;
                    let delay = Math.pp_lerp(this._myStepDelay * 2, this._myStepDelay, speedUsed / this._myParams.myMaxSpeed);
                    this._myStepTimer.start(Math.pp_random(delay - 0.1, delay + 0.05));

                    if (this._mySteps.length == 0) {
                        this._mySteps[0] = PP.myAudioManager.createAudioPlayer(AudioID.PASSO_1);
                    }

                    this.stepCounter = this.stepCounter + 1;
                    this.stepCounter = this.stepCounter % this._mySteps.length;
                    let player = this._mySteps[this.stepCounter];
                    player = Math.pp_randomPick(this._mySteps);
                    let horizontalDirection = this._myLocomotionRuntimeParams.myCollisionRuntimeParams.myFixedMovement.vec3_removeComponentAlongAxis([0, 1, 0]).vec3_normalize();
                    player.setPosition(this._myParams.myPlayerTransformManager.getPosition().vec3_add(horizontalDirection.vec3_scale(0.2)));
                    player.setPitch(Math.pp_random(1 - 0.35, 1 + 0.15));
                    player.play();
                }

                if (Global.myUnmute) {
                    Global.myUnmute = false;
                    Howler.mute(false);
                }
            } else {
                if (this._StepRemove) {
                    this._myStepTimer.update(dt);
                    if (this._myStepTimer.isDone()) {
                        this._StepRemove = false;
                        let delay = this._myStepDelay / 5;
                        this._myStepTimer.start(Math.max(0, Math.pp_random(delay - 0.1, delay + 0.05)));
                    }
                }
            }

            if (this._myGravitySpeed > 0 && this._myLocomotionRuntimeParams.myCollisionRuntimeParams.myIsOnCeiling ||
                this._myGravitySpeed < 0 && this._myLocomotionRuntimeParams.myCollisionRuntimeParams.myIsOnGround) {
                this._myGravitySpeed = 0;
            }
        }

        if (this._myLocomotionRuntimeParams.myCollisionRuntimeParams.myIsOnGround) {
            this._myLocomotionRuntimeParams.myIsFlying = false;
            this._myCurrentDirectionConverter.resetFly();
        }
    };
}();

globalDT = 0;

CleanedPlayerLocomotionSmooth.prototype._onXRSessionStart = function () {
    return function _onXRSessionStart(session) {
        switch (this._myParams.myVRDirectionReferenceType) {
            case 0:
                this._myDirectionReference = PP.myPlayerObjects.myHead;
                break;
            case 1:
                this._myDirectionReference = PP.myPlayerObjects.myHands[this._myParams.myHandedness];
                break;
            case 2:
                this._myDirectionReference = this._myParams.myVRDirectionReferenceObject;
                break;
        }

        this._myCurrentDirectionConverter = this._myDirectionConverterVR;
        this._myCurrentDirectionConverter.resetFly();
    };
}();

CleanedPlayerLocomotionSmooth.prototype._onXRSessionEnd = function () {
    let playerUp = PP.vec3_create();
    return function _onXRSessionEnd(session) {
        this._myDirectionReference = PP.myPlayerObjects.myHead;
        this._myCurrentDirectionConverter = this._myDirectionConverterNonVR;

        this._myCurrentDirectionConverter.resetFly();
    };
}();



Object.defineProperty(CleanedPlayerLocomotionSmooth.prototype, "update", { enumerable: false });
Object.defineProperty(CleanedPlayerLocomotionSmooth.prototype, "_onXRSessionStart", { enumerable: false });
Object.defineProperty(CleanedPlayerLocomotionSmooth.prototype, "_onXRSessionEnd", { enumerable: false });