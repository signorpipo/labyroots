let _ANY_RESOURCE = [".*"];
let _NO_RESOURCE = [];



//----------------------------
//----------------------------
//----------------------------
// START SERVICE WORKER SETUP
//----------------------------
//----------------------------
//----------------------------

//------------
//------------
//------------
// BASE SETUP
//------------
//------------
//------------



// The service worker name, used, for example, to identify the caches
//
// This should not be changed once u have chosen one, since it could be used, for example, to look for previous caches
let _myServiceWorkerName = "labyroots";



// U can increment this to specify that this is a new service worker and should replace the previous one
//
// Normally this automatically happens if there is at least a change to the service worker file, but if u just want it
// to activate again (for example, to trigger a feature that works on activation) and don't have any other changes to apply on it,
// u can increment this version number to make it seems it's a new oneù
//
// It must be an incremental integer greater than 0
let _myServiceWorkerVersion = 1;



// The cache version
//
// U can increment this when the previous cache is no longer valid due to some changes to your app,
// which might not be compatible anymore with the previous version and could create unpredictable behaviors,
// since u could get a mix of old (from the cache) and new (from the network) resources
//
// It must be an incremental integer greater than 0
let _myCacheVersion = 1;



// This is the list of the resources u want to precache, that means they will be cached on the first load,
// when the service worker is installing and can't still catch the fetch events
//
// Properly filling this list can potentially make it so your app is ready to work offline on first load,
// otherwise it might require at least a second load, where the service worker will be able to actually catch
// the fetch events and cache the responses itself
// In general, u should precache at least every static resource u have in your app if u want to make it work offline after the first load
//
// The resources URLs are relative to the service worker location (which means u have to exclude the base URL),
// and must match the exact name of the resource u want to precache
// For example, for "http://localhost:8080/assets/wondermelon.png" u have to specify "assets/wondermelon.png"
let _myResourceURLsToPrecache = [
    "/",
    "index.html",
    "manifest.json",
    "f0.png",
    "icon512.png",
    "icon192.png",
    "icon168.png",
    "icon144.png",
    "icon96.png",
    "icon72.png",
    "icon48.png",
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



// Which resource should be cached
//
// The resources URLs can also be a regex
let _myCacheResourceURLsToInclude = _ANY_RESOURCE;
let _myCacheResourceURLsToExclude = _NO_RESOURCE;



// Used to specify if you want to first try the cache or always check the network for updates
//
// The resources URLs can also be a regex
let _myTryCacheFirstResourceURLsToInclude = _ANY_RESOURCE;
let _myTryCacheFirstResourceURLsToExclude = _NO_RESOURCE;



// If the request tries the cache first, this make it so the cache will be updated (even thought the old cached resource is returned)
// It's important to note that the updated changes will be available starting from the next page load
//
// Beware that this should not be used if the new resources might not be compatible with the old ones, since u could end up
// with a mix of both
// If this is the case, it's better to just increase the cache version, which will cache the new version from scratch
//
// The resources URLs can also be a regex
let _myUpdateCacheInBackgroundResourceURLsToInclude = _ANY_RESOURCE;
let _myUpdateCacheInBackgroundResourceURLsToExclude = _NO_RESOURCE;



// Delete all the previous caches when a new service worker is activated
//
// For this to work properly, the cache name of the new service worker must be the same as the previous ones,
// otherwise there is no way to know which cache should actually be deleted
let _myDeletePreviousCacheOnNewServiceWorkerActivation = true;



//----------------
//----------------
//----------------
// ADVANCED SETUP
//----------------
//----------------
//----------------



// If a network error happens on any request, this enables the force try cache first on network error feature
//
// The resources URLs can also be a regex
let _myEnableForceTryCacheFirstOnNetworkErrorResourceURLsToInclude = _replaceSpecialCharacters(_getResourceURLsLongerThan(_myResourceURLsToPrecache, 3));
let _myEnableForceTryCacheFirstOnNetworkErrorResourceURLsToExclude = _NO_RESOURCE;



// If a network error happens on any request, this make it so
// that the cache will be tried first by default for these resources
// Useful as a fallback to avoid waiting for all the requests to fail and instead starting to use the cache
//
// The resources URLs can also be a regex
let _myForceTryCacheFirstOnNetworkErrorResourceURLsToInclude = _myEnableForceTryCacheFirstOnNetworkErrorResourceURLsToInclude;
let _myForceTryCacheFirstOnNetworkErrorResourceURLsToExclude = _NO_RESOURCE;



// This is a bit specific, but, for example, even if with wonderland u can cache the bundle.js file and the wonderland.min.js file,
// wonderland normally try to fetch it using URL params and the time of the deploy (possibly to force a cache reload for a new version)
//
// This make it so that u can't precache those files (even if they will be cached on the second load anyway),
// but since u can precache the bundle.js / wonderland.min.js anyway without URL params,
// if u put the bundle.js/wonderland.min.js URLs here, the service worker will try to look in the cache for the requested URL without the URL params,
// as a fallback for when the requested URL can't be found in any other way
//
// The resources URLs can also be a regex
let _myTryCacheWithoutURLParamsAsFallbackResourceURLsToInclude = [
    "bundle\\.js",
    "wonderland.min\\.js"
];
let _myTryCacheWithoutURLParamsAsFallbackResourceURLsToExclude = _NO_RESOURCE;



// Used to cache opaque responses
// Caching opaque responses can lead to a number of issues so use this with caution
// I also advise u to enable the cache update in background when caching opaque responses,
// so to avoid caching a bad opaque response forever
//
// The resources URLs can also be a regex
let _myCacheOpaqueResponseResourceURLsToInclude = _NO_RESOURCE;
let _myCacheOpaqueResponseResourceURLsToExclude = _NO_RESOURCE;



// Usually a new service worker is activated when there are no more tabs using the previous one
// This generally happens if the user closes all the tabs or the browser (just refreshing the page does not seem to work)
//
// This flag make it so the service worker is immediately (as soon as possible) activated (without the need to refresh the page), but can cause issues
// due to the fact that the new service worker might be working with data fetched by the previous one in the same session
//
// Beside, when enabling this it would probably be better to also trigger a page reload
// You can add the following js code to your app to achieve the page reload on controller change:
//
// window.navigator.serviceWorker?.addEventListener("controllerchange", function () {
//     window.location.reload();
// });
//
// Note that this js code should be put in your app so that it is executed as soon as possible (for example in the first lines of your index.html),
// so to avoid missing the controller change event
//
// Be aware that the reload might happen while the user is using your app and not just at the beginning,
// which could be annoying (but I'm not sure what the chances are of this actually happening or how to reproduce it)
// Be also aware that this will make every opened page related to this service worker reload, not just the current focused one!
//
// As u can see, handling a service worker activation is a complex topic!
// You might want to look on the internet for solutions that best fit your needs,
// like, for example, asking the user if they want to reload or not
//
// Use this with caution
let _myImmediatelyActivateNewServiceWorker = false;



// When a page is not controlled (usually on the first load), even though the service worker is activated
// it does not actually starts to control the page until it's loaded again,
// since a service worker has to take care of a page from the start
//
// This make it so that the service worker will immediately (as soon as possible) take control over the page even when
// it was not being controlled yet (which basically means that it will be controlled even on the first load)
//
// As for @_myImmediatelyActivateNewServiceWorker, this can cause issues
// due to the fact that the service worker might be fetching the data in a different way compared to not having it,
// and the page fetched at least a bit of data without the service worker, since it was started as soon as possible, but not
// from the beginning
//
// In general this should not be an issue unless u have a very specific service worker logic,
// so you should be able to set this to true without worrying too much
//
// The advantages of using this are:
// 1. If the page goes offline on the first load and u need to fetch data, the service worker can already try to use the cache
// 2. The service worker can already cache some data which might be hard (if not impossible) to precache otherwise
//    This is kind of useful, but not reliable, so u still have to properly fill the precache resource URL list yourself if u want your app
//    to work offline even after the first load
//
// If u want to be 100% sure, u can always add the same js code used for @_myImmediatelyActivateNewServiceWorker to reload the page
// when a new service worker takes control of the page, but, in this case, it will reload the page 100% even for the very first load,
// which is annoying but is also what u are trying to achieve with it in this case
//
// window.navigator.serviceWorker?.addEventListener("controllerchange", function () {
//     window.location.reload();
// });
//
// If u don't feel the need to reload the page if it was not initially controlled (and don't want to make the page reload everytime on first load),
// but still would like to enable @_myImmediatelyActivateNewServiceWorker,
// and would like to reload the page when a new service worker is activated,
// u need to specify a different js code to reload the page,
// so to avoid reloading it when it was not initially controlled
//
// let isBeingControlled = window.navigator.serviceWorker?.controller != null;
// window.navigator.serviceWorker?.addEventListener("controllerchange", function () {
//     if (isBeingControlled) {
//         window.location.reload();
//     } else {
//         isBeingControlled = true;
//     }
// });
//
// Note that this js code should be put in your app so that it is executed as soon as possible (for example in the first lines of your index.html),
// so to avoid missing the controller change event
//
// Be aware that the reload might happen while the user is using your app and not just at the beginning,
// which could be annoying (but I'm not sure what the chances are of this actually happening or how to reproduce it)
// Be also aware that this will make every opened page related to this service worker reload, not just the current focused one!
//
// As u can see, again, handling a service worker activation is a complex topic!
// You might want to look on the internet for solutions that best fit your needs,
// like, for example, asking the user if they want to reload or not
//
// Use this with caution
let _myImmediatelyTakeControlOfThePageWhenNotControlled = false;



// Enable some extra logs to better understand what's going on and why things might not be working
let _myLogEnabled = false;



//--------------------------
//--------------------------
//--------------------------
// END SERVICE WORKER SETUP
//--------------------------
//--------------------------
//--------------------------






// Service Worker Variables

let _myForceTryCacheFirstOnNetworkErrorEnabled = false; // As of now this is not reset on page reload, but only when using a new tab



// Service Worker Events

self.addEventListener("install", function (event) {
    if (_myImmediatelyActivateNewServiceWorker) {
        self.skipWaiting();
    }

    event.waitUntil(_precacheResources());
});

self.addEventListener("activate", function (event) {
    if (_myDeletePreviousCacheOnNewServiceWorkerActivation) {
        event.waitUntil(_deletePreviousCaches())
    }

    if (_myImmediatelyTakeControlOfThePageWhenNotControlled) {
        self.clients.claim();
    }
});

self.addEventListener("fetch", function (event) {
    event.respondWith(_getResource(event.request));
});



// Service Worker Functions

async function _precacheResources() {
    let currentCache = await caches.open(_getCacheID());

    for (let resourceToPrecache of _myResourceURLsToPrecache) {
        try {
            await currentCache.add(resourceToPrecache);
        } catch (error) {
            if (_myLogEnabled) {
                console.error("Can't precache resource: " + resourceToPrecache);
            }
        }
    }
}

async function _getResource(request) {
    let cacheTried = false;

    let tryCacheFirst = _shouldResourceURLBeIncluded(request.url, _myTryCacheFirstResourceURLsToInclude, _myTryCacheFirstResourceURLsToExclude);
    let forceTryCacheFirstOnNetworkError = _myForceTryCacheFirstOnNetworkErrorEnabled && _shouldResourceURLBeIncluded(request.url, _myForceTryCacheFirstOnNetworkErrorResourceURLsToInclude, _myForceTryCacheFirstOnNetworkErrorResourceURLsToExclude);

    if (tryCacheFirst || forceTryCacheFirstOnNetworkError) {
        cacheTried = true;

        // Try to get the resource from the cache
        try {
            let responseFromCache = await _getFromCache(request.url);
            if (responseFromCache != null) {
                let updateCacheInBackground = _shouldResourceURLBeIncluded(request.url, _myUpdateCacheInBackgroundResourceURLsToInclude, _myUpdateCacheInBackgroundResourceURLsToExclude);
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
        if (!_myForceTryCacheFirstOnNetworkErrorEnabled) {
            let enableForceTryCacheFirstOnNetworkError = _shouldResourceURLBeIncluded(request.url, _myEnableForceTryCacheFirstOnNetworkErrorResourceURLsToInclude, _myEnableForceTryCacheFirstOnNetworkErrorResourceURLsToExclude);
            if (enableForceTryCacheFirstOnNetworkError) {
                _myForceTryCacheFirstOnNetworkErrorEnabled = true;

                if (_myLogEnabled) {
                    console.warn("Force try cache on network error enabled");
                }
            }
        }

        if (!cacheTried) {
            let responseFromCache = await _getFromCache(request.url);
            if (responseFromCache != null) {
                return responseFromCache;
            }
        }

        if (request.url != null) {
            let requestURLWithoutURLParams = request.url.split("?")[0];
            let tryCacheWithoutURLParams = _shouldResourceURLBeIncluded(requestURLWithoutURLParams, _myTryCacheWithoutURLParamsAsFallbackResourceURLsToInclude, _myTryCacheWithoutURLParamsAsFallbackResourceURLsToExclude);
            if (tryCacheWithoutURLParams) {
                let responseFromCacheWithoutParams = await _getFromCache(requestURLWithoutURLParams);
                if (responseFromCacheWithoutParams != null) {
                    if (_myLogEnabled) {
                        console.warn("Get from cache without URL params: " + request.url);
                    }

                    return responseFromCacheWithoutParams;
                }
            }
        }

        if (responseFromNetwork != null) {
            return responseFromNetwork;
        } else {
            return new Response("Invalid response for " + request.url, {
                status: 404,
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

        if (_myLogEnabled) {
            console.error("An error occurred when trying to fetch from the network: " + request.url);
        }
    }

    return networkResponse;
}

async function _getFromCache(requestURL) {
    let cachedResponse = null;

    try {
        let currentCacheID = _getCacheID();
        let hasCache = await caches.has(currentCacheID); // Avoid creating the cache when getting from it if it has not already been created
        if (hasCache) {
            let currentCache = await caches.open(currentCacheID);
            cachedResponse = await currentCache.match(requestURL);
        }
    } catch (error) {
        cachedResponse = null;

        if (_myLogEnabled) {
            console.error("An error occurred when trying to get from the cache: " + requestURL);
        }
    }

    return cachedResponse;
}

async function _putInCache(request, response) {
    try {
        let clonedResponse = response.clone();
        let currentCache = await caches.open(_getCacheID());
        currentCache.put(request, clonedResponse);
    } catch (error) {
        if (_myLogEnabled) {
            console.error("An error occurred when trying to put the response in the cache: " + request.url);
        }
    }
}

async function _deletePreviousCaches() {
    let cacheIDs = await caches.keys();
    for (let cacheID of cacheIDs) {
        if (cacheID.startsWith(_getCacheBaseID()) && cacheID != _getCacheID()) {
            await caches.delete(cacheID);
        }
    }
}



// Service Worker Utils

function _isResponseOk(response) {
    return response != null && response.status == 200;
}

function _isResponseOpaque(response) {
    return response != null && response.status == 0 && response.type.includes("opaque");
}

function _shouldResponseBeCached(request, response) {
    let shouldResponseBeCached = _shouldResourceURLBeIncluded(request.url, _myCacheResourceURLsToInclude, _myCacheResourceURLsToExclude);
    let shouldOpaqueResponseBeCached = _shouldResourceURLBeIncluded(request.url, _myCacheOpaqueResponseResourceURLsToInclude, _myCacheOpaqueResponseResourceURLsToExclude);
    return shouldResponseBeCached && (request.method == "GET" && (_isResponseOk(response) || (shouldOpaqueResponseBeCached && _isResponseOpaque(response))));
}

function _getCacheBaseID() {
    return _myServiceWorkerName + "_v";
}

function _getCacheID() {
    return _getCacheBaseID() + _myCacheVersion.toFixed(0);
}



// Cauldron Utils

function _shouldResourceURLBeIncluded(resourceURL, includeList, excludeList) {
    let includeResourseURL = false;
    for (let includeURL of includeList) {
        if (resourceURL.match(new RegExp(includeURL)) != null) {
            includeResourseURL = true;
            break;
        }
    }

    if (includeResourseURL) {
        for (let excludeURL of excludeList) {
            if (resourceURL.match(new RegExp(excludeURL)) != null) {
                includeResourseURL = false;
                break;
            }
        }
    }

    return includeResourseURL;
}

function _getResourceURLsLongerThan(resourceURLs, lengthThreshold) {
    let newResourceURLs = resourceURLs.slice(0);

    let index = 0;
    do {
        index = newResourceURLs.findIndex((resourceURL) => resourceURL.length <= lengthThreshold);

        if (index >= 0 && index < newResourceURLs.length) {
            newResourceURLs.splice(index, 1);
        }
    } while (index >= 0);

    return newResourceURLs;
}

function _replaceSpecialCharacters(resourceURLs) {
    for (let i = 0; i < resourceURLs.length; i++) {
        resourceURLs[i] = resourceURLs[i].replaceAll(".", "\\.");
        resourceURLs[i] = resourceURLs[i].replaceAll(" ", "%20");
    }

    return resourceURLs;
}