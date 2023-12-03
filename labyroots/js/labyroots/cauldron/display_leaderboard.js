WL.registerComponent("display-leaderboard", {
    _myName: { type: WL.Type.String, default: '' },
    _myIsLocal: { type: WL.Type.Bool, default: false }
}, {
    init: function () {
        this._myCharacterWeightMap = new Map();

        this._myCharacterWeightMap.set("W", 1.3);
        this._myCharacterWeightMap.set("m", 1.3);
        this._myCharacterWeightMap.set("@", 1.3);
        this._myCharacterWeightMap.set("#", 1.3);
        this._myCharacterWeightMap.set("M", 1.2);
        this._myCharacterWeightMap.set("D", 1.1);
        this._myCharacterWeightMap.set("G", 1.1);
        this._myCharacterWeightMap.set("O", 1.1);
        this._myCharacterWeightMap.set("Q", 1.1);
        this._myCharacterWeightMap.set("w", 1.1);

        this._myCharacterWeightMap.set("I", 0.75);
        this._myCharacterWeightMap.set("f", 0.75);
        this._myCharacterWeightMap.set("i", 0.75);
        this._myCharacterWeightMap.set("j", 0.75);
        this._myCharacterWeightMap.set("l", 0.75);
        this._myCharacterWeightMap.set("t", 0.75);
        this._myCharacterWeightMap.set(" ", 0.75);
        this._myCharacterWeightMap.set(".", 0.75);
        this._myCharacterWeightMap.set("-", 0.75);

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
                this._myNamesTextComponent.text = " ";
                this._myNamesTextComponent.text = "";
                this._myScoresTextComponent.text = " ";
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
            if (value != null && value.rank != null && value.displayName != null && value.score != null) {
                let rank = value.rank + 1;
                if (rank.toFixed(0).length > maxRankDigit) {
                    maxRankDigit = rank.toFixed(0).length;
                }
            }
        }

        for (let value of leaderboard) {
            if (value != null && value.rank != null && value.displayName != null && value.score != null) {
                let rank = value.rank + 1;
                let fixedRank = rank.toFixed(0);
                while (fixedRank.length < maxRankDigit) {
                    fixedRank = "0".concat(fixedRank);
                }

                let clampedDisplayName = this._clampDisplayName(value.displayName);

                namesText = namesText.concat(fixedRank, " - ", clampedDisplayName, "\n\n");

                let convertedScore = this._convertTime(value.score);
                scoresText = scoresText.concat(convertedScore, "\n\n");
            }
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
    _clampDisplayName(displayName) {
        let nameCharactersToShow = 0;

        let currentWeight = 0;
        for (let i = 0; i < displayName.length; i++) {
            let currentCharacter = displayName.charAt(i);
            let characterWeight = this._myCharacterWeightMap.get(currentCharacter);
            characterWeight = characterWeight != null ? characterWeight : 1;

            currentWeight += characterWeight;

            if (currentWeight > 15) {
                break;
            }

            nameCharactersToShow++;
        }

        nameCharactersToShow = Math.min(nameCharactersToShow, displayName.length);

        if (nameCharactersToShow < displayName.length) {
            return displayName.slice(0, nameCharactersToShow) + "...";
        }

        return displayName;
    }
});