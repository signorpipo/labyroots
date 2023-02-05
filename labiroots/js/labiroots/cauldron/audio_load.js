WL.registerComponent('audio-load', {
}, {
    init() {
    },
    start() {
        this.prepareSFXSetups();
    },
    update(dt) {
    },
    prepareSFXSetups() {
        let manager = PP.myAudioManager;

        {
            let audioSetup = new PP.AudioSetup("assets/audio/music/creepy_music.wav");
            audioSetup.myLoop = true;
            audioSetup.mySpatial = false;
            audioSetup.myVolume = 0.75;
            manager.addAudioSetup(AudioID.MUSIC, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Lamento albero 1.wav");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 1.5;
            audioSetup.myReferenceDistance = 0.3;
            manager.addAudioSetup(AudioID.LAMENTO_1, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Lamento albero 2.wav");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 1.5;
            audioSetup.myReferenceDistance = 0.3;
            manager.addAudioSetup(AudioID.LAMENTO_2, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Lamento albero 3.wav");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 1.5;
            audioSetup.myReferenceDistance = 0.3;
            manager.addAudioSetup(AudioID.LAMENTO_3, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Ascia su muro di radici.wav");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 1.5;
            audioSetup.myReferenceDistance = 0.3;
            manager.addAudioSetup(AudioID.COLPO_FINALE, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Attacco ascia alberi 1.wav");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 1.5;
            audioSetup.myReferenceDistance = 0.3;
            manager.addAudioSetup(AudioID.COLPO_NORMALE_1, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Attacco ascia alberi 2.wav");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 1.5;
            audioSetup.myReferenceDistance = 0.3;
            manager.addAudioSetup(AudioID.COLPO_NORMALE_2, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Mangiare frutto 1.wav");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 1.5;
            audioSetup.myReferenceDistance = 0.3;
            manager.addAudioSetup(AudioID.MANGIA_FRUTTO, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Raccolta frutto.wav");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 1.5;
            audioSetup.myReferenceDistance = 0.3;
            manager.addAudioSetup(AudioID.PRENDI_FRUTTO, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Passi nel verde 1.wav");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 3;
            audioSetup.myReferenceDistance = 1.5;
            manager.addAudioSetup(AudioID.PASSO_1, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Passi nel verde 2.wav");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 3;
            audioSetup.myReferenceDistance = 1.5;
            manager.addAudioSetup(AudioID.PASSO_2, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/Passi nel verde 3.wav");
            audioSetup.myRate = 1;
            audioSetup.myVolume = 3;
            audioSetup.myReferenceDistance = 1.5;
            manager.addAudioSetup(AudioID.PASSO_3, audioSetup);
        }

        manager.createAudioPlayer(AudioID.AXE_HIT);
        for (let i = 0; i <= AudioID.VICTORY; i++) {
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
    PASSO_3: 12
};