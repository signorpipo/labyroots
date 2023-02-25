WL.registerComponent('send-all-events', {
}, {
    init: function () {
    },
    start: function () {
        this._myStarted = false;
    },
    update: function (dt) {
        if (!this._myStarted) {
            if (Global.myReady) {
                this._myStarted = true;
                if (Global.myGoogleAnalytics) {
                    gtag("event", "button_pressed", {
                        "value": 1
                    });
                    gtag("event", "enter_vr", {
                        "value": 1
                    });
                    gtag("event", "open_ggj_success", {
                        "value": 1
                    });
                    gtag("event", "open_ggj", {
                        "value": 1
                    });
                    gtag("event", "open_github_success", {
                        "value": 1
                    });
                    gtag("event", "open_github", {
                        "value": 1
                    });
                    gtag("event", "open_zesty", {
                        "value": 1
                    });
                    gtag("event", "open_zesty_success", {
                        "value": 1
                    });
                    gtag("event", "enter_secret_zone", {
                        "value": 1
                    });
                    gtag("event", "zesty_load_fail", {
                        "value": 1
                    });
                    gtag("event", "intro_skipped", {
                        "value": 1
                    });
                    gtag("event", "intro_watched", {
                        "value": 1
                    });
                    gtag("event", "playing_signed_in", {
                        "value": 1
                    });
                    gtag("event", "is_wedding_maze", {
                        "value": 1
                    });
                    gtag("event", "is_normal_maze", {
                        "value": 1
                    });
                    gtag("event", "collect_axe", {
                        "value": 1
                    });
                    gtag("event", "collect_axe_after_death", {
                        "value": 1
                    });
                    gtag("event", "collect_axe_before_death", {
                        "value": 1
                    });
                    gtag("event", "secret_code_wedding_success", {
                        "value": 1
                    });
                    gtag("event", "secret_code_human_tree_success", {
                        "value": 1
                    });
                    gtag("event", "secret_code_human_tree", {
                        "value": 1
                    });
                    gtag("event", "secret_code_wedding", {
                        "value": 1
                    });
                    gtag("event", "death", {
                        "value": 1
                    });
                    gtag("event", "survive_for_seconds", {
                        "value": 1
                    });
                    gtag("event", "survive_bear_grills", {
                        "value": 1
                    });
                    gtag("event", "survive_a_lot", {
                        "value": 1
                    });
                    gtag("event", "survive_more", {
                        "value": 1
                    });
                    gtag("event", "defeat_mother_tree", {
                        "value": 1
                    });
                    gtag("event", "defeat_mother_tree_seconds", {
                        "value": 1
                    });
                    gtag("event", "collect_fruit", {
                        "value": 1
                    });
                    gtag("event", "eat_fruit", {
                        "value": 1
                    });
                    gtag("event", "eat_fruit_perfect", {
                        "value": 1
                    });
                    gtag("event", "eat_fruit_good", {
                        "value": 1
                    });
                    gtag("event", "eat_fruit_evil", {
                        "value": 1
                    });
                    gtag("event", "eat_fruit_bad", {
                        "value": 1
                    });
                    gtag("event", "defeat_human_tree", {
                        "value": 1
                    });
                    gtag("event", "defeat_bride_tree", {
                        "value": 1
                    });
                    gtag("event", "defeat_root_wall", {
                        "value": 1
                    });
                    gtag("event", "defeat_root", {
                        "value": 1
                    });
                    gtag("event", "switch_teleport", {
                        "value": 1
                    });
                    gtag("event", "switch_smooth", {
                        "value": 1
                    });
                    gtag("event", "moving_non_vr", {
                        "value": 1
                    });
                    gtag("event", "audio_load_error", {
                        "value": 1
                    });
                    gtag("event", "defeat_root_axe_spawn", {
                        "value": 1
                    });
                    gtag("event", "defeat_root_normal", {
                        "value": 1
                    });
                    gtag("event", "mother_tree_hit_invincible", {
                        "value": 1
                    });
                    gtag("event", "mother_tree_hit", {
                        "value": 1
                    });
                    gtag("event", "root_hit_normal", {
                        "value": 1
                    });
                    gtag("event", "root_hit_axe_spawn", {
                        "value": 1
                    });
                    gtag("event", "root_hit", {
                        "value": 1
                    });

                    let timeMovingSteps = [1, 2, 3, 5, 10, 20, 30, 60];
                    for (let timeMovingStep of timeMovingSteps) {
                        gtag("event", "playing_for_" + timeMovingStep + "_minutes_vr", {
                            "value": 1
                        });

                        gtag("event", "moving_for_" + timeMovingStep + "_minutes_vr", {
                            "value": 1
                        });

                        gtag("event", "moving_for_" + timeMovingStep + "_minutes_non_vr", {
                            "value": 1
                        });
                    }

                    let timeGrabbedSteps = [5, 10, 15, 30];
                    for (let timeGrabbedStep of timeGrabbedSteps) {
                        gtag("event", "fruit_grab_for_" + timeGrabbedStep + "_seconds", {
                            "value": 1
                        });
                    }

                    for (let i = 0; i <= 4; i++) {
                        gtag("event", "root_hit_normal_" + i, {
                            "value": 1
                        });
                        gtag("event", "root_hit_axe_spawn_" + i, {
                            "value": 1
                        });
                        gtag("event", "root_hit_" + i, {
                            "value": 1
                        });

                        gtag("event", "defeat_root_axe_spawn_" + i, {
                            "value": 1
                        });

                        gtag("event", "defeat_root_normal_" + i, {
                            "value": 1
                        });

                        gtag("event", "defeat_root_" + i, {
                            "value": 1
                        });
                    }
                }
            }
        }
    }
});