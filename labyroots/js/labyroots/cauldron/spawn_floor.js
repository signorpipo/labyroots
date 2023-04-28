WL.registerComponent('spawn-floor', {
    _myOnlyIfFromAbove: { type: WL.Type.Bool, default: false },
    _myFloor: { type: WL.Type.Object },
    _myStartTile: { type: WL.Type.Object }
}, {
    start: function () {
        if (!this._myOnlyIfFromAbove || Global.myFromAbove) {
            let spawnedFloorObject = this.object.pp_addObject();

            let spawnedTile = this._myStartTile.pp_clone();
            spawnedTile.pp_setParent(spawnedFloorObject);

            this._myFloor.pp_setActive(false);

            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    if (i != 0) {
                        newTile = spawnedTile.pp_clone();
                        newTile.pp_translate([i * 5, 0, j * -5]);
                        //[i * 5, 0, j * -5].vec_error();

                        newTile = spawnedTile.pp_clone();
                        newTile.pp_translate([i * -5, 0, j * 5]);
                        //[i * -5, 0, j * 5].vec_error();
                    }

                    if (j != 0) {
                        let newTile = spawnedTile.pp_clone();
                        newTile.pp_translate([i * 5, 0, j * 5]);
                        //[i * 5, 0, j * 5].vec_error();

                        newTile = spawnedTile.pp_clone();
                        newTile.pp_translate([i * -5, 0, j * -5]);
                        //[i * -5, 0, j * -5].vec_error();
                    }

                    //console.error("");
                }
            }
        }
    }
});