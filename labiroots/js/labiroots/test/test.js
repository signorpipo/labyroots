WL.registerComponent("test", {
}, {    
    init: function () {
    },
    start: function () {
        this._myState = 3;
        this._myTimer = 15;
    },
    update: function (dt) {
        var timeLeft = this._myTimer - dt/30;
        console.log(timeLeft + " | " + _myState);
        if(this._myState == 3 && timeLeft <= 10){
            console.log(this._myState + " --> " + --this._myState);
            console.log(timeLeft + "secondi rimanenti");
        }else if(this._myState == 2 && timeLeft <= 6){
            console.log(this._myState + " --> " + --this._myFirstTime);
            console.log(timeLeft + "secondi rimanenti");
        }else if(this._myState == 1 && timeLeft <= 3){
            console.log(this._myState + " --> " + --this._myFirstTime);
            console.log(timeLeft + "secondi rimanenti");
        }else if(this._myState == 0 && timeLeft <= 0){
            console.log(this._myState + " --> " + --this._myFirstTime);
            console.log(timeLeft + "secondi rimanenti");
        }
    }
});