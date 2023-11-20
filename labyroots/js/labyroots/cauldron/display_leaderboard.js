WL.registerComponent("display-leaderboard", {
    _myName: { type: WL.Type.String, default: '' },
    _myIsLocal: { type: WL.Type.Bool, default: false }
}, {
    init: function () {
    },
    start: function () {
        this._myStarted = false;
    },
    update: function (dt) {
        if (!this._myStarted) {
            this._myStarted = true;
            this._myNamesTextComponent = this.object.pp_getObjectByName("Names").pp_getComponent("text");
            this._myScoresTextComponent = this.object.pp_getObjectByName("Scores").pp_getComponent("text");

            if (this._myNamesTextComponent != null && this._myScoresTextComponent != null) {
                this._myNamesTextComponent.text = "";
                this._myScoresTextComponent.text = "";
            }

            this.updateLeaderboard();
        }
    },
    updateLeaderboard: function () {
        PP.CAUtils.getLeaderboard(this._myName, true, this._myIsLocal, 10, this._onLeaderboardRetrieved.bind(this));
    },
    _onLeaderboardRetrieved(leaderboard) {
        let namesText = "";
        let scoresText = "";

        let maxRankDigit = 0;
        for (let value of leaderboard) {
            let rank = value.rank + 1;
            if (rank.toFixed(0).length > maxRankDigit) {
                maxRankDigit = rank.toFixed(0).length;
            }
        }

        for (let value of leaderboard) {
            let rank = value.rank + 1;
            let fixedRank = rank.toFixed(0);
            while (fixedRank.length < maxRankDigit) {
                fixedRank = "0".concat(fixedRank);
            }

            namesText = namesText.concat(fixedRank, " - ", value.displayName, "\n\n");

            let convertedScore = this._convertTime(value.score);
            scoresText = scoresText.concat(convertedScore, "\n\n");
        }

        if (this._myNamesTextComponent != null && this._myScoresTextComponent != null) {
            this._myNamesTextComponent.text = namesText;
            this._myScoresTextComponent.text = scoresText;
        }
    },
    _convertTime(score) {
        let time = Math.floor(score / 1000);

        let hours = Math.floor(time / 3600);
        time -= hours * 3600;
        let minutes = Math.floor(time / 60);
        time -= minutes * 60;
        let seconds = Math.floor(time);


        let secondsText = (seconds.toFixed(0).length < 2) ? "0".concat(seconds.toFixed(0)) : seconds.toFixed(0);
        let minutesText = (minutes.toFixed(0).length < 2) ? "0".concat(minutes.toFixed(0)) : minutes.toFixed(0);
        let hoursText = (hours.toFixed(0).length < 2) ? "0".concat(hours.toFixed(0)) : hours.toFixed(0);

        let convertedTime = hoursText.concat(":", minutesText, ":", secondsText);

        return convertedTime;
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        clonedComponent.active = this.active;

        clonedComponent._myName = this._myName;
        clonedComponent._myIsLocal = this._myIsLocal;

        return clonedComponent;
    },
});