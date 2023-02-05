WL.registerComponent('big-tree', {
    _myPhase1: { type: WL.Type.Object },
    _myPhase2: { type: WL.Type.Object },
    _myPhase3: { type: WL.Type.Object },
    _myPhase4: { type: WL.Type.Object },
    _myPhase5: { type: WL.Type.Object }
}, {
    init: function () {
    },
    start: function () {
        this._myStarted = false;
        this._myBigTreeRoots = 0;
        this._myHit = 0;

        this._myPhases = [];
        this._myPhases.push(this._myPhase1);
        this._myPhases.push(this._myPhase2);
        this._myPhases.push(this._myPhase3);
        this._myPhases.push(this._myPhase4);
        this._myPhases.push(this._myPhase5);

        this._myCurrentPhase = 0;

        for (let phase of this._myPhases) {
            phase.pp_setActive(false);
        }
    },
    update: function (dt) {
        if (!this._myStarted) {
            if (Global.myReady) {
                this._myStarted = true;
                this._myBigTreeRoots = Global.mySetup.myTreeSetup.myBigTreeRoots;
                this._myHit = Global.mySetup.myTreeSetup.myBigTreeHit;

                this._myPhases[0].pp_setActive(false);
            }
        } else {

        }
    },
    rootDie() {
        if (this._myBigTreeRoots > 0) {
            this._myBigTreeRoots--;

            for (let phase of this._myPhases) {
                phase.pp_setActive(false);
            }

            this._myCurrentPhase++;
            this._myPhases[this._myCurrentPhase].pp_setActive(false);
        }
    },
    hit() {
        let hitted = false;

        if (this._myBigTreeRoots == 0) {
            if (this._myHit > 0) {

                this._myHit--;
                hitted = true;
                //suono
            }
        }

        return hitted;
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);

        return clonedComponent;
    },
});