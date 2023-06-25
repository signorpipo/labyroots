LR.BigTreeDie = class BigTreeDie {
    constructor() {
        this._myTimer = new PP.Timer(0);
        this._myMaxCounter = 7;
        this._myCounter = this._myMaxCounter;

        this._myLamenti = [];
        this._myLamenti[0] = PP.myAudioManager.createAudioPlayer(AudioID.LAMENTO_1);
        this._myLamenti[1] = PP.myAudioManager.createAudioPlayer(AudioID.LAMENTO_2);
        this._myLamenti[2] = PP.myAudioManager.createAudioPlayer(AudioID.LAMENTO_3);

        this._mySecretWallDie = PP.myAudioManager.createAudioPlayer(AudioID.SECRET_WALL_OPEN);

        this._myAudioColpi = PP.myAudioManager.createAudioPlayer(AudioID.BIG_TREE_DIE_HIT);

        this._myLamentoPitch = 1.4;
    }

    update(dt) {
        let tempoBase = 1.0;
        if (this._myCounter > 0) {
            this._myTimer.update(dt);
            if (this._myTimer.isDone()) {
                if (this._myCounter > 1) {
                    this._myTimer.start(tempoBase);
                    let player = Math.pp_randomPick(this._myLamenti);
                    let position = Global.myBigTree.object.pp_getPosition().vec3_add([Math.pp_random(-1, 1), Math.pp_random(1.75, 3), 0]);
                    player.setPosition(position);
                    player.setPitch(Math.pp_random(this._myLamentoPitch - 0.15, this._myLamentoPitch + 0.05));
                    player.play();

                    if (this._myCounter != this._myMaxCounter) {
                        let playerColpo = this._myAudioColpi;
                        playerColpo.setPosition(position);
                        let pitch = 0.6;
                        playerColpo.setPitch(Math.pp_random(pitch - 0.15, pitch + 0.05));
                        //playerColpo.play();
                    }

                    PP.myLeftGamepad.pulse(0.5, 0.5);
                    PP.myRightGamepad.pulse(0.5, 0.5);

                    if (this._myCounter == 2) {
                        this._myTimer.start(tempoBase + 0.5);
                    }
                } else if (Global.mySecretWall != null) {
                    let wallPosition = Global.mySecretWall.pp_getPosition();
                    this._mySecretWallDie.setPosition(wallPosition.vec3_add([0, 1.5, 0]));

                    this._mySecretWallDie.play();
                    Global.mySecretWall.pp_setActive(false);

                    PP.myLeftGamepad.pulse(0.75, 0.75);
                    PP.myRightGamepad.pulse(0.75, 0.75);
                }

                this._myCounter--;
            }
        }

    }
};