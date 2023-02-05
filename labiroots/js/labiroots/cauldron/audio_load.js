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
            let audioSetup = new PP.AudioSetup("assets/audio/music/temp_music.wav");
            audioSetup.myLoop = true;
            audioSetup.mySpatial = false;
            audioSetup.myVolume = 0.45;
            manager.addAudioSetup(AudioID.MUSIC, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/temp_sound.wav");
            audioSetup.myReferenceDistance = 1000000;
            manager.addAudioSetup(AudioID.CHANGE_HUMAN_PHASE, audioSetup);
        }

        manager.createAudioPlayer(AudioID.AXE_HIT);
        for (let i = 0; i <= AudioID.VICTORY; i++) {
            manager.createAudioPlayer(i);
        }
    }
});

AudioID = {
    MUSIC: 0,
    AXE_HIT: 1,
    AXE_SWOOSH: 2,
    CHANGE_HUMAN_PHASE: 3,
    DIE: 4,
    RESPAWN: 5,
    ROOT_DIE: 6,
    ROOT_HIT: 7,
    BIG_TREE_HIT: 8,
    GRAB_FRUIT: 9,
    GRAB_AXE: 10,
    EAT_FRUIT: 11,
    METEOR_FALL: 12,
    METEOR_IMPACT: 13,
    WALL_ROOT_DIE: 14,
    HUMAN_TREE_DIE: 15,
    VICTORY: 16,
};