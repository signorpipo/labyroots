PP.TrackedHandJointPose = class TrackedHandJointPose extends PP.BasePose {

    constructor(handedness, trackedHandJointID, basePoseParams = new PP.BasePoseParams()) {
        super(basePoseParams);

        this._myInputSource = null;

        this._myHandedness = handedness;
        this._myTrackedHandJointID = trackedHandJointID;

        this._myJointRadius = 0;
    }

    getTrackedHandJointID() {
        return this._myTrackedHandJointID;
    }

    setTrackedHandJointID(trackedHandJointID) {
        this._myTrackedHandJointID = trackedHandJointID;
    }

    getJointRadius() {
        return this._myJointRadius;
    }

    _isReadyToGetPose() {
        return this._myInputSource != null;
    }

    _getPose(xrFrame) {
        return xrFrame.getJointPose(this._myInputSource.hand.get(this._myTrackedHandJointID), this._myReferenceSpace);
    }

    _updateHook(dt, updateVelocity, xrPose) {
        if (xrPose != null) {
            this._myJointRadius = xrPose.radius;
        }
    }

    _onXRSessionStartHook(manualStart, session) {
        this._myInputSource = null;

        if (session.inputSources != null && session.inputSources.length > 0) {
            for (let item of session.inputSources) {
                if (item.handedness == this._myHandedness) {
                    if (PP.InputUtils.getInputSourceType(item) == PP.InputSourceType.TRACKED_HAND) {
                        this._myInputSource = item;
                    }
                }
            }
        }

        session.addEventListener("inputsourceschange", function () {
            this._myInputSource = null;

            if (session.inputSources != null && session.inputSources.length > 0) {
                for (let item of session.inputSources) {
                    if (item.handedness == this._myHandedness) {
                        if (PP.InputUtils.getInputSourceType(item) == PP.InputSourceType.TRACKED_HAND) {
                            this._myInputSource = item;
                        }
                    }
                }
            }
        }.bind(this));
    }

    _onXRSessionEndHook() {
        this._myInputSource = null;
    }
};