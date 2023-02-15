import { Howler } from 'howler';

WL.registerComponent('audio-load', {
}, {
    init() {
    },
    start() {
        this._myStarted = false;
    },
    update(dt) {
        if (!this._myStarted) {
            if (Global.myStoryReady) {
                this._myStarted = true;
                this.prepareSFXSetups();
            }
        }
    },
    prepareSFXSetups() {
        let manager = PP.myAudioManager;

        {
            let audioSetup = new PP.AudioSetup("assets/audio/music/creepy_music.mp3");
            audioSetup.myLoop = true;
            audioSetup.mySpatial = false;
            audioSetup.myVolume = 0.1;
            manager.addAudioSetup(AudioID.MUSIC, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Lamento albero 1.mp3");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 1;
            audioSetup.myReferenceDistance = 0.3;
            audioSetup.myPreventPlayWhenAudioContextNotRunning = true;
            manager.addAudioSetup(AudioID.LAMENTO_UMANO_1, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Lamento albero 2.mp3");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 1;
            audioSetup.myReferenceDistance = 0.3;
            audioSetup.myPreventPlayWhenAudioContextNotRunning = true;
            manager.addAudioSetup(AudioID.LAMENTO_UMANO_2, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Lamento albero 3.mp3");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 1;
            audioSetup.myReferenceDistance = 0.3;
            audioSetup.myPreventPlayWhenAudioContextNotRunning = true;
            manager.addAudioSetup(AudioID.LAMENTO_UMANO_3, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Lamento albero 1.mp3");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 1.5;
            audioSetup.myReferenceDistance = 0.3;
            audioSetup.myPreventPlayWhenAudioContextNotRunning = true;
            manager.addAudioSetup(AudioID.LAMENTO_UMANO_1_MORTE, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Lamento albero 2.mp3");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 1.5;
            audioSetup.myReferenceDistance = 0.3;
            audioSetup.myPreventPlayWhenAudioContextNotRunning = true;
            manager.addAudioSetup(AudioID.LAMENTO_UMANO_2_MORTE, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Lamento albero 3.mp3");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 1.5;
            audioSetup.myReferenceDistance = 0.3;
            audioSetup.myPreventPlayWhenAudioContextNotRunning = true;
            manager.addAudioSetup(AudioID.LAMENTO_UMANO_3_MORTE, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Lamento albero 1.mp3");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 2.5;
            audioSetup.myReferenceDistance = 2;
            audioSetup.myPreventPlayWhenAudioContextNotRunning = true;
            manager.addAudioSetup(AudioID.LAMENTO_1, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Lamento albero 2.mp3");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 2.5;
            audioSetup.myReferenceDistance = 2;
            audioSetup.myPreventPlayWhenAudioContextNotRunning = true;
            manager.addAudioSetup(AudioID.LAMENTO_2, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Lamento albero 3.mp3");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 2.5;
            audioSetup.myReferenceDistance = 2;
            audioSetup.myPreventPlayWhenAudioContextNotRunning = true;
            manager.addAudioSetup(AudioID.LAMENTO_3, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Ascia su muro di radici.mp3");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 2.5;
            audioSetup.myReferenceDistance = 0.3;
            audioSetup.myPreventPlayWhenAudioContextNotRunning = true;
            manager.addAudioSetup(AudioID.COLPO_FINALE, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Attacco ascia alberi 1.mp3");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 2;
            audioSetup.myReferenceDistance = 0.3;
            audioSetup.myPreventPlayWhenAudioContextNotRunning = true;
            manager.addAudioSetup(AudioID.COLPO_NORMALE_1, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Attacco ascia alberi 2.mp3");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 2;
            audioSetup.myReferenceDistance = 0.3;
            audioSetup.myPreventPlayWhenAudioContextNotRunning = true;
            manager.addAudioSetup(AudioID.COLPO_NORMALE_2, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Mangiare frutto 1.mp3");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 3;
            audioSetup.myReferenceDistance = 0.3;
            audioSetup.myPreventPlayWhenAudioContextNotRunning = true;
            manager.addAudioSetup(AudioID.MANGIA_FRUTTO, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Passi nel verde 3.mp3");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 2;
            audioSetup.myReferenceDistance = 0.3;
            audioSetup.myPreventPlayWhenAudioContextNotRunning = true;
            manager.addAudioSetup(AudioID.PRENDI_FRUTTO, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Passi nel verde 3.mp3");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 2;
            audioSetup.myReferenceDistance = 2;
            audioSetup.myPreventPlayWhenAudioContextNotRunning = true;
            manager.addAudioSetup(AudioID.TREE_UMANO_SPAWN, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Passi nel verde 1.mp3");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 1.5;
            audioSetup.myReferenceDistance = 1.25;
            audioSetup.myPreventPlayWhenAudioContextNotRunning = true;
            manager.addAudioSetup(AudioID.PASSO_1, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Passi nel verde 2.mp3");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 0.75;
            audioSetup.myReferenceDistance = 1.5;
            audioSetup.myPreventPlayWhenAudioContextNotRunning = true;
            manager.addAudioSetup(AudioID.PASSO_2, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Passi nel verde 3.mp3");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 0.75;
            audioSetup.myReferenceDistance = 1.5;
            audioSetup.myPreventPlayWhenAudioContextNotRunning = true;
            manager.addAudioSetup(AudioID.PASSO_3, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Attacco ascia alberi 2.mp3");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 0.75;
            audioSetup.myReferenceDistance = 0.3;
            audioSetup.myPreventPlayWhenAudioContextNotRunning = true;
            manager.addAudioSetup(AudioID.HEAL, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Attacco ascia alberi 2.mp3");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 0.75;
            audioSetup.myReferenceDistance = 0.3;
            audioSetup.myPreventPlayWhenAudioContextNotRunning = true;
            manager.addAudioSetup(AudioID.HEAL2, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Colpo spada su pietra 1.mp3");
            audioSetup.myRate = 0.25;
            audioSetup.myVolume = 1;
            audioSetup.myReferenceDistance = 2;
            audioSetup.myPreventPlayWhenAudioContextNotRunning = true;
            manager.addAudioSetup(AudioID.SECRET_WALL_OPEN, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Colpo spada su pietra 1.mp3");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 2;
            audioSetup.myReferenceDistance = 0.3;
            audioSetup.myPreventPlayWhenAudioContextNotRunning = true;
            manager.addAudioSetup(AudioID.INVINCIBLE, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Attacco ascia alberi 2.mp3");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 0.5;
            audioSetup.myReferenceDistance = 1;
            audioSetup.myPreventPlayWhenAudioContextNotRunning = true;
            manager.addAudioSetup(AudioID.BIG_TREE_DIE_HIT, audioSetup);
        }

        for (let i = 0; i <= AudioID.INVINCIBLE; i++) {
            manager.createAudioPlayer(i);
        }
    }
});

AudioID = {
    MUSIC: 0,
    LAMENTO_1: 1,
    LAMENTO_2: 2,
    LAMENTO_3: 3,
    COLPO_FINALE: 4,
    COLPO_NORMALE_1: 5,
    COLPO_NORMALE_2: 6,
    MANGIA_FRUTTO: 7,
    PRENDI_FRUTTO: 8,
    PASSO_1: 10,
    PASSO_2: 11,
    PASSO_3: 12,
    HEAL: 13,
    HEAL2: 14,
    LAMENTO_UMANO_1: 15,
    LAMENTO_UMANO_2: 16,
    LAMENTO_UMANO_3: 17,
    LAMENTO_UMANO_1_MORTE: 18,
    LAMENTO_UMANO_2_MORTE: 19,
    LAMENTO_UMANO_3_MORTE: 20,
    TREE_UMANO_SPAWN: 21,
    SECRET_WALL_OPEN: 22,
    BIG_TREE_DIE_HIT: 23,
    INVINCIBLE: 24
};