WL.registerComponent("test", {
}, {
    init: function () {
    },
    start: function () {
        this._myState = 3;
        this._myTimer = 15;
    },
    update: function (dt) {
        this._myTimer -= dt;
        //console.log(this._myTimer + " | " + this._myState);
        if (this._myState == 3 && this._myTimer <= 10) {
            console.log(this._myState + " --> " + --this._myState);
            console.log(10 + "secondi rimanenti");
        } else if (this._myState == 2 && this._myTimer <= 6) {
            console.log(this._myState + " --> " + --this._myState);
            console.log(6 + "secondi rimanenti");
        } else if (this._myState == 1 && this._myTimer <= 3) {
            console.log(this._myState + " --> " + --this._myState);
            console.log(3 + "secondi rimanenti");
        } else if (this._myState == 0 && this._myTimer <= 0) {
            console.log(this._myState + " --> " + --this._myState);
            console.log("Sei un albero");
        }
    }
});