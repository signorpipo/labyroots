// START SERVICE WORKER SETUP

let _myCacheID = "labyroots-cache-v1";



// This is the list of files u want to precache, that means they will be cached on the first load,
// when the service worker is installing and can't still catch the fetch events
//
// Properly filling this list make it so your app is potentially ready to work offline on first load,
// otherwise it might require at least a second load, where the service worker will be able to actually catch
// the fetch events and cache the responses itself
let _myPrecacheFiles = [
    "/",
    "index.html",
    "manifest.json",
    "f0.png",
    "icon192.png",
    "vr-button.svg",
    "ar-button.svg",
    "favicon.ico",
    "labyroots.bin",
    "labyroots-bundle.js",
    "wonderland.min.js",
    "WonderlandRuntime-physx.wasm",
    "WonderlandRuntime-physx.js",
    "WonderlandRuntime-physx-simd.wasm",
    "WonderlandRuntime-physx-simd.js",
    "WonderlandRuntime-physx-threads.wasm",
    "WonderlandRuntime-physx-threads.js",
    "WonderlandRuntime-physx-threads.worker.js",
    "WonderlandRuntime-physx-simd-threads.wasm",
    "WonderlandRuntime-physx-simd-threads.js",
    "WonderlandRuntime-physx-simd-threads.worker.js",
    "setup.json",
    "assets/audio/music/creepy_music.mp3",
    "assets/audio/sfx/Ascia su muro di radici.mp3",
    "assets/audio/sfx/Attacco ascia alberi 1.mp3",
    "assets/audio/sfx/Attacco ascia alberi 2.mp3",
    "assets/audio/sfx/Colpo spada su pietra 1.mp3",
    "assets/audio/sfx/Lamento albero 1.mp3",
    "assets/audio/sfx/Lamento albero 2.mp3",
    "assets/audio/sfx/Lamento albero 3.mp3",
    "assets/audio/sfx/Mangiare frutto 1.mp3",
    "assets/audio/sfx/Passi nel verde 1.mp3",
    "assets/audio/sfx/Passi nel verde 2.mp3",
    "assets/audio/sfx/Passi nel verde 3.mp3",
    "assets/audio/sfx/Raccolta frutto.mp3",
    "fb52aa1b-3917-40ee-a6c8-7fee007b6cba.png",
    "f72d2a43-8590-4974-84d8-909cec241927.png",
    "eff7edfc-888b-4815-9d8c-a080d5dd56b4.png",
    "eada4133-13e6-40ab-88c2-eb7e799e1528.png",
    "e595da84-bfff-4a5c-bfda-035395bf58bf.png",
    "e49b3dfe-981f-4d39-abf7-76e1a36155d6.png",
    "deb95d87-2eff-45f9-ad78-d79824fbfcf6.png",
    "d1343922-519e-449f-931b-4207d62acec9.png",
    "c7260ead-9c27-46e3-8fa5-ab84e3cc6eb7.png",
    "bfe74a14-e11e-4aac-ab4d-73e3772b2ca3.png",
    "b23a0af9-b124-497e-8aed-3665ec223ad7.png",
    "b2ddbfee-7e65-493f-946f-959c49f1f652.png",
    "ae52868a-d640-474a-bf27-098700df42bd.png",
    "ac0e78dd-b39b-4e8c-8848-7a4945793e80.png",
    "a3ae8de9-94a0-4d9c-aa00-5d9c137fae58.png",
    "a2e331db-9f9e-48a7-97c4-077400ec5b2a.png",
    "a01a037e-3c11-4b09-974b-54b3c1fec2aa.png",
    "4453731a-9407-4bfe-8c79-535f542dccd3.png",
    "981534ae-abe1-4192-a781-3ec615a49c87.png",
    "708253f0-da1b-4a79-8e2f-167448d0e2d5.png",
    "510548d5-a317-4206-805e-f14e87364c4e.png",
    "19038d66-4612-403a-8dd2-2eb13b1dc196.png",
    "7768feaf-9669-4cf9-9a73-c9ba7c0ffbde.png",
    "6906fbb6-13c5-4ebf-b1c5-f56c0d3187d5.png",
    "871c20fd-fee3-45d3-912b-bfb4d5824efb.png",
    "256c9c93-aaeb-414c-aa81-78de15a2e445.png",
    "93a39555-5abb-44da-9f17-f22570276e8f.png",
    "37a5e91d-11cd-41cb-9c33-e0e640dff6a4.png",
    "36da58c3-e144-4179-8dab-4d4d1ace012a.png",
    "8df391ae-b8c5-4cf8-9ca9-fc2a9d0c4f64.png",
    "8c9704c3-5f62-4e05-ae92-15acf4e2f982.png",
    "7f648475-da4e-40ed-974a-6c01da5ed296.png",
    "7f7327bb-de83-4205-9d6f-bfc722bb2f76.png",
    "6a315f98-dd96-4246-9ac1-681d21b8d41f.png",
    "5d76c448-4b4e-469b-9afd-39cd373d4284.png",
    "5b145eb5-8c8a-431e-8259-0bc141380205.png",
    "3e925291-702c-4390-ab16-223d3592c886.png",
    "3a4b6111-7f99-413e-a55b-789c13cfbdd5.png",
    "1a12637b-0f5b-48ce-90d8-35460859d122.png",
    "00b6ab52-a892-4c6f-a4d8-f0f0960c876b.png",
    "c973a9dd-ce1c-458b-9b02-97c129d9f321.png",
    //"ipns/lib.zesty.market/zesty-formats.js",
    //"ipfs/QmRiTKTFNDbe8tq7xXdWcyXqRAWsKKgbGdiz6wofrCceua",
    //"subgraphs/name/zestymarket/zesty-market-graph-matic",
    //"api/v1/space/223"
];



// Which files should be cached
//
// The entries can also be regexes, so u can, for example, specify ".*" to include/exclude every file
let _myCacheFilesToInclude = [".*"];
let _myCacheFilesToExclude = [];



// Used to specify if you want to first try the cache or always check the network for updates
//
// The entries can also be regexes, so u can, for example, specify ".*" to include/exclude every file
let _myTryCacheFirstFilesToInclude = [".*"];
let _myTryCacheFirstFilesToExclude = [];



// If the request tries the cache first, this make it so the cache will be updated (even thought the old cached resource is returned)
// It's important to note that the updated changes will be available starting from the next page load
//
// The entries can also be regexes, so u can, for example, specify ".*" to include/exclude every file
let _myUpdateCacheInBackgroundFilesToInclude = [".*"];
let _myUpdateCacheInBackgroundFilesToExclude = [];



// If a network error happens on any request, this make it so
// that the cache will be tried first by default for these files
// Useful as a fallback to avoid waiting for all the requests to fail and instead starting to use the cache
//
// The entries can also be regexes, so u can, for example, specify ".*" to include/exclude every file
let _myForceTryCacheOnNetworkErrorFilesToInclude = [".*"];
let _myForceTryCacheOnNetworkErrorFilesToExclude = [];



// This is a bit specific, but, for example, even if with wonderland u can cache the bundle.js file and the wonderland.min.js file,
// wonderland normally try to fetch it using url params and the time of the deploy (possibly to force a cache reload for a new version)
//
// This make it so that u can't precache those files (even if they will be cached on the second load anyway),
// but since u can precache the bundle.js / wonderland.min.js anyway without url params,
// if u put the bundle.js/wonderland.min.js files here, the service worker will try to look in the cache for the requested url without the url params,
// as last resort if the requested url can't be found in any other way
//
// The entries can also be regexes, so u can, for example, specify ".*" to include/exclude every file
let _myGetFromCacheWithoutURLParamsAsLastResortFilesToInclude = [
    "bundle\.js",
    "wonderland.min\.js"
];
let _myGetFromCacheWithoutURLParamsAsLastResortFilesToExclude = [
];



// Used to cache opaque responses
// Caching opaque responses can lead to a number of issues so use this with caution
// I also advise u to enable the cache update in background when caching opaque responses,
// so to avoid caching a bad opaque response forever
//
// The entries can also be regexes, so u can, for example, specify ".*" to include/exclude every file
let _myCacheOpaqueResponseFilesToInclude = [];
let _myCacheOpaqueResponseFilesToExclude = [];



let _myLogEnabled = false;

// END SERVICE WORKER SETUP






// Used to track if a network error happened
// As of now this is not reset on page reload, but only when using a new tab
let _myNetworkError = false;

self.addEventListener("install", function (event) {
    event.waitUntil(_precacheResources());
});

self.addEventListener("fetch", function (event) {
    event.respondWith(_getResource(event.request));
});

async function _precacheResources() {
    let cache = await caches.open(_myCacheID);

    for (let fileToPrecache of _myPrecacheFiles) {
        try {
            await cache.add(fileToPrecache);
        } catch (error) {
            if (_myLogEnabled) {
                console.error("Can't precache " + fileToPrecache);
            }
        }
    }
}

async function _getResource(request) {
    let tryCacheFirst = _filterFile(request.url, _myTryCacheFirstFilesToInclude, _myTryCacheFirstFilesToExclude);
    let forceTryCacheFirstOnNetworkError = _myNetworkError && _filterFile(request.url, _myForceTryCacheOnNetworkErrorFilesToInclude, _myForceTryCacheOnNetworkErrorFilesToExclude);

    if (tryCacheFirst || forceTryCacheFirstOnNetworkError) {
        // Try to get the resource from the cache
        try {
            let responseFromCache = await _getFromCache(request.url);
            if (responseFromCache != null) {
                let updateCacheInBackground = _filterFile(request.url, _myUpdateCacheInBackgroundFilesToInclude, _myUpdateCacheInBackgroundFilesToExclude);
                if (updateCacheInBackground) {
                    _fetchFromNetworkAndUpdateCache(request);
                }

                return responseFromCache;
            }
        } catch (error) {
            // Do nothing, possibly get from cache failed so we should go on and try with the network
        }
    }

    // Try to get the resource from the network
    let responseFromNetwork = await _fetchFromNetwork(request);
    if (_isResponseOk(responseFromNetwork) || _isResponseOpaque(responseFromNetwork)) {
        if (_shouldResponseBeCached(request, responseFromNetwork)) {
            _putInCache(request, responseFromNetwork);
        }

        return responseFromNetwork;
    } else {
        _myNetworkError = true;

        if (!tryCacheFirst) {
            let responseFromCache = await _getFromCache(request.url);
            if (responseFromCache != null) {
                return responseFromCache;
            }
        }

        if (request.url != null) {
            let requestURLWithoutURLParams = request.url.split("?")[0];
            let getWithoutURLParams = _filterFile(requestURLWithoutURLParams, _myGetFromCacheWithoutURLParamsAsLastResortFilesToInclude, _myGetFromCacheWithoutURLParamsAsLastResortFilesToExclude);
            if (getWithoutURLParams) {
                let responseFromCacheWithoutParams = await _getFromCache(requestURLWithoutURLParams);
                if (responseFromCacheWithoutParams != null) {
                    return responseFromCacheWithoutParams;
                }
            }
        }

        if (responseFromNetwork != null) {
            return responseFromNetwork;
        } else {
            return new Response("Network Error", {
                status: 408,
                headers: { "Content-Type": "text/plain" },
            });
        }
    }
}

async function _fetchFromNetworkAndUpdateCache(request) {
    let responseFromNetwork = await _fetchFromNetwork(request);

    if (_isResponseOk(responseFromNetwork) || _isResponseOpaque(responseFromNetwork)) {
        if (_shouldResponseBeCached(request, responseFromNetwork)) {
            _putInCache(request, responseFromNetwork);
        }
    }

    return responseFromNetwork;
}

async function _fetchFromNetwork(request) {
    let networkResponse = null;

    try {
        networkResponse = await fetch(request);
    } catch (error) {
        networkResponse = null;
    }

    return networkResponse;
}

async function _getFromCache(requestURL) {
    let cachedResponse = null;

    try {
        cachedResponse = await caches.match(requestURL);
    } catch (error) {
        cachedResponse = null;
    }

    return cachedResponse;
}

async function _putInCache(request, response) {
    try {
        let clonedResponse = response.clone();
        let cache = await caches.open(_myCacheID);
        cache.put(request, clonedResponse);
    } catch (error) {
        // Do nothing
    }
}

function _isResponseOk(response) {
    return response != null && response.status == 200;
}

function _isResponseOpaque(response) {
    return response != null && response.status == 0 && response.type.includes("opaque");
}

function _shouldResponseBeCached(request, response) {
    let shouldResponseBeCached = _filterFile(request.url, _myCacheFilesToInclude, _myCacheFilesToExclude);
    let shouldOpaqueResponseBeCached = _filterFile(request.url, _myCacheOpaqueResponseFilesToInclude, _myCacheOpaqueResponseFilesToExclude);
    return shouldResponseBeCached && (request.method == "GET" && (_isResponseOk(response) || (shouldOpaqueResponseBeCached && _isResponseOpaque(response))));
}

function _filterFile(file, includeList, excludeList) {
    let validFile = false;
    for (let includeFile of includeList) {
        if (file.match(new RegExp(includeFile)) != null) {
            validFile = true;
            break;
        }
    }

    if (validFile) {
        for (let excludeFile of excludeList) {
            if (file.match(new RegExp(excludeFile)) != null) {
                validFile = false;
                break;
            }
        }
    }

    return validFile;
}