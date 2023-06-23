// #region Service Worker Constants

let _ANY_RESOURCE = [".*"];
let _NO_RESOURCE = [];

let _ANY_RESOURCE_FROM_CURRENT_LOCATION = [_escapeRegex(self.location.href.slice(0, self.location.href.lastIndexOf("/"))) + ".*"];
let _ANY_RESOURCE_FROM_CURRENT_HOST = [_escapeRegex(self.location.origin) + ".*"];

// #endregion Service Worker Constants



// #region Service Worker Setup

// #region BASE SETUP -----------------------------------------------------------------------------------------------------------



// The service worker name, used, for example, to identify the caches
//
// This should not be changed once u have chosen one, since it could be used, for example, to look for previous caches
let _myServiceWorkerName = "labyroots";



// U should increment this everytime u update the service worker, since it is used by some features to not collide
// with previous service workers
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
// The resources URLs can be relative to the service worker location, so, for example,
// for "https://signor-pipo.itch.io/assets/wondermelon.png" u can just specify "assets/wondermelon.png"
// The resources URLs can't be a regex in this case, since it needs to know the specific resource to fetch
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
    "https://ipfs.io/ipns/libv2.zesty.market/zesty-formats.js",
    "https://ipfs.io/ipns/libv2.zesty.market/zesty-networking.js",
    "https://www.googletagmanager.com/gtag/js?id=G-MMJPQVRVQD",
    "https://zesty-storage-prod.s3.amazonaws.com/images/zesty/zesty-banner-tall-transparent.png",
    "https://api.zesty.market/api/ad?ad_unit_id=27daa80b-a8f9-4293-85b1-94174f4484ef"
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



// Enable some extra logs to better understand what's going on and why things might not be working
let _myLogEnabled = false;



// #endregion BASE SETUP --------------------------------------------------------------------------------------------------------



// #region ADVANCED SETUP -------------------------------------------------------------------------------------------------------



// If a network error happens on any request, this enables the force try cache first on network error feature
//
// The resources URLs can also be a regex
let _myEnableForceTryCacheFirstOnNetworkErrorResourceURLsToInclude = _ANY_RESOURCE_FROM_CURRENT_HOST;
let _myEnableForceTryCacheFirstOnNetworkErrorResourceURLsToExclude = _NO_RESOURCE;



// If a network error happens on any request, this make it so
// that the cache will be tried first by default for these resources
// Useful as a fallback to avoid waiting for all the requests to fail and instead starting to use the cache
//
// The resources URLs can also be a regex
let _myForceTryCacheFirstOnNetworkErrorResourceURLsToInclude = _ANY_RESOURCE_FROM_CURRENT_HOST;
let _myForceTryCacheFirstOnNetworkErrorResourceURLsToExclude = _NO_RESOURCE;



// This is a bit specific, but, for example, even if with wonderland u can cache the bundle.js file and the wonderland.min.js file,
// wonderland normally try to fetch it using URL params and the time of the deploy (possibly to force a cache reload for a new version)
//
// This make it so that u can't precache those files (even if they will be cached on the second load anyway),
// but since u can precache the bundle.js / wonderland.min.js anyway without URL params,
// if u put the bundle.js/wonderland.min.js URLs here, the service worker will try to look in the cache for the requested URL ignoring the URL params
//
// Beware that using this could make u use an old resource which might not be compatible with the new ones
// U should use this only when u know it would not make a difference to use the URL params or if the old resource
// is still ok to use and better than a network error
//
// If u want to use this just to fix the precache issue, but are afraid of the issues related to this feature,
// it might be better to just specify in the precache resource URL the URL params that u know will be used for that resource,
// if that is possible to know (for bundle.s / wonderland.min.js u just have to check out the index.html file)
//
// The resources URLs can also be a regex
let _myTryCacheIgnoringURLParamsResourceURLsToInclude = [
    "bundle\\.js",
    "wonderland.min\\.js"
];
let _myTryCacheIgnoringURLParamsResourceURLsToExclude = _NO_RESOURCE;



// A vary header is used to specify that the resource might be different based on some factors,
// like if the resource is being requested from desktop or mobile
// This could prevent those resources to be retrieved from the cache, since the vary header of the request
// and the cached resource might not match
//
// If u are sure that this does not matter, u can use this to ignore the vary header
//
// The resources URLs can also be a regex
let _myTryCacheIgnoringVaryHeaderResourceURLsToInclude = _NO_RESOURCE;
let _myTryCacheIgnoringVaryHeaderResourceURLsToExclude = _NO_RESOURCE;



// This is the same as @_myTryCacheIgnoringURLParamsAsFallbackResourceURLsToInclude but as a fallback
// for when the requested URL can't be found in any other way
//
// One of the reasons to use @_myTryCacheIgnoringURLParamsAsFallbackResourceURLsToInclude instead of the fallback version,
// is that if u use it as fallback u first have to wait for the fetch to fail, while otherwise it can get it from the cache "instantly",
// even though it is unsafer, due to not even checking if a properly matching version could be fetched from the network
//
// The resources URLs can also be a regex
let _myTryCacheIgnoringURLParamsAsFallbackResourceURLsToInclude = _NO_RESOURCE;
let _myTryCacheIgnoringURLParamsAsFallbackResourceURLsToExclude = _NO_RESOURCE;



// This is the same as @_myTryCacheIgnoringVaryHeaderResourceURLsToInclude but as a fallback
// for when the requested URL can't be found in any other way
//
// One of the reasons to use @_myTryCacheIgnoringVaryHeaderResourceURLsToInclude instead of the fallback version,
// is that if u use it as fallback u first have to wait for the fetch to fail, while otherwise it can get it from the cache "instantly",
// even though it is unsafer, due to not even checking if a properly matching version could be fetched from the network
//
// The resources URLs can also be a regex
let _myTryCacheIgnoringVaryHeaderAsFallbackResourceURLsToInclude = _NO_RESOURCE;
let _myTryCacheIgnoringVaryHeaderAsFallbackResourceURLsToExclude = _NO_RESOURCE;



// Use this if u:
// - have updated your app
// - are trying cache first
// - do not feel the need to update the cache version since the new update is compatible with the previous version
// - would like the new resources to be available as soon as possible, without waiting for the cache to be updated in background
// or
// - u are not updating the cache in background, which would mean the new resources will never be fetched again
//
// This feature makes it so that when the new service worker is installed, these resources will not try the cache first
// until they have been fetched again from the network with success
// Basically, this is a way to avoid trying the cache first as long as the resources have not been updated, but still give u
// the chance to use the cache if the fetch fails, since u are not updating the cache version
//
// In general, u should just update the cache version, but if just a few resources have been updated, u don't want
// to make the user wait for everything to be fetched again, and u want the new resources to be available as soon as possible,
// u might want to use this
//
// This is safe to use as long as the new resources are compatible with the current cached ones
// Beware that, until u increase the cache version, the included resource URLs should only "grow",
// because a user might be coming from an even older service worker version which still has the same cache version,
// and should therefore able to refetch every needed resources, not just the one changed between the current and the very last version
//
// The resources URLs can also be a regex
let _myRefetchFromNetworkResourceURLsToInclude = _NO_RESOURCE;
let _myRefetchFromNetworkResourceURLsToExclude = _NO_RESOURCE;



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



// #endregion ADVANCED SETUP ----------------------------------------------------------------------------------------------------

// #endregion Service Worker Setup






// #region Service Worker Variables

let _myForceTryCacheFirstOnNetworkErrorEnabled = false; // As of now this is not reset on page reload, but only when using a new tab

// #endregion Service Worker Variables



// #region Service Worker Events

self.addEventListener("install", function (event) {
    event.waitUntil(_install());
});

self.addEventListener("activate", function (event) {
    event.waitUntil(_activate());
});

self.addEventListener("fetch", function (event) {
    event.respondWith(_fetch(event.request));
});

async function _install() {
    if (_myImmediatelyActivateNewServiceWorker) {
        self.skipWaiting();
    }

    await _precacheResources();
}

async function _activate() {
    if (_myDeletePreviousCacheOnNewServiceWorkerActivation) {
        await _deletePreviousCaches();
    }

    await _deletePreviousRefetchFromNetworkChecklists();

    if (_myImmediatelyTakeControlOfThePageWhenNotControlled) {
        self.clients.claim();
    }
}

async function _fetch(request) {
    let cacheTried = false;

    let refetchFromNetwork = await _shouldResourceBeRefetchedFromNetwork(request.url);

    if (!refetchFromNetwork) {
        let tryCacheFirst = _shouldResourceURLBeIncluded(request.url, _myTryCacheFirstResourceURLsToInclude, _myTryCacheFirstResourceURLsToExclude);
        let forceTryCacheFirstOnNetworkError = _myForceTryCacheFirstOnNetworkErrorEnabled && _shouldResourceURLBeIncluded(request.url, _myForceTryCacheFirstOnNetworkErrorResourceURLsToInclude, _myForceTryCacheFirstOnNetworkErrorResourceURLsToExclude);

        if (tryCacheFirst || forceTryCacheFirstOnNetworkError) {
            cacheTried = true;

            // Try to get the resource from the cache
            try {
                let ignoreURLParams = _shouldResourceURLBeIncluded(request.url, _myTryCacheIgnoringURLParamsResourceURLsToInclude, _myTryCacheIgnoringURLParamsResourceURLsToExclude);
                let ignoreVaryHeader = _shouldResourceURLBeIncluded(request.url, _myTryCacheIgnoringVaryHeaderResourceURLsToInclude, _myTryCacheIgnoringVaryHeaderResourceURLsToExclude);
                let responseFromCache = await _getFromCache(request.url, ignoreURLParams, ignoreVaryHeader);
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
    }

    // Try to get the resource from the network
    let responseFromNetwork = await _fetchFromNetworkAndUpdateCache(request, refetchFromNetwork);
    if (_isResponseOk(responseFromNetwork) || _isResponseOpaque(responseFromNetwork)) {
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
            let ignoreURLParams = _shouldResourceURLBeIncluded(request.url, _myTryCacheIgnoringURLParamsResourceURLsToInclude, _myTryCacheIgnoringURLParamsResourceURLsToExclude);
            let ignoreVaryHeader = _shouldResourceURLBeIncluded(request.url, _myTryCacheIgnoringVaryHeaderResourceURLsToInclude, _myTryCacheIgnoringVaryHeaderResourceURLsToExclude);
            let responseFromCache = await _getFromCache(request.url, ignoreURLParams, ignoreVaryHeader);
            if (responseFromCache != null) {
                return responseFromCache;
            }
        }

        let ignoreURLParamsAsFallback = _shouldResourceURLBeIncluded(request.url, _myTryCacheIgnoringURLParamsAsFallbackResourceURLsToInclude, _myTryCacheIgnoringURLParamsAsFallbackResourceURLsToExclude);
        let ignoreVaryHeaderAsFallback = _shouldResourceURLBeIncluded(request.url, _myTryCacheIgnoringVaryHeaderAsFallbackResourceURLsToInclude, _myTryCacheIgnoringVaryHeaderAsFallbackResourceURLsToExclude);
        if (ignoreURLParamsAsFallback || ignoreVaryHeaderAsFallback) {
            let fallbackResponseFromCache = await _getFromCache(request.url, ignoreURLParamsAsFallback, ignoreVaryHeaderAsFallback);
            if (fallbackResponseFromCache != null) {
                if (_myLogEnabled) {
                    console.warn("Get from cache using a fallback: " + request.url);
                }

                return fallbackResponseFromCache;
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

// #endregion Service Worker Events



// #region Service Worker Functions

async function _precacheResources() {
    if (_myResourceURLsToPrecache.length == 0) return;

    let cacheAlreadyExists = await caches.has(_getCacheID());
    let currentCache = null;
    if (cacheAlreadyExists) {
        currentCache = await caches.open(_getCacheID());
    }

    let promisesToAwait = [];
    for (let resourceURLToPrecache of _myResourceURLsToPrecache) {
        promisesToAwait.push(new Promise(async function (resolve) {
            try {
                let precacheResource = false;

                let refetchFromNetwork = await _shouldResourceBeRefetchedFromNetwork(resourceURLToPrecache, true);

                if (refetchFromNetwork) {
                    precacheResource = true
                } else if (!cacheAlreadyExists) {
                    precacheResource = true; // There was no cache so no need to check if u want to refetch or not
                } else {
                    let resourceAlreadyInCache = await currentCache.match(resourceURLToPrecache) != null;
                    if (!resourceAlreadyInCache) {
                        precacheResource = true;
                    }
                }

                if (precacheResource) {
                    await _fetchFromNetworkAndUpdateCache(new Request(resourceURLToPrecache), refetchFromNetwork, false);
                }
            } catch (error) {
                if (_myLogEnabled) {
                    console.error("Failed to fetch resource to precache: " + resourceURLToPrecache);
                }
            }

            resolve();
        }));
    }

    await Promise.all(promisesToAwait);
}

async function _fetchFromNetworkAndUpdateCache(request, refetchFromNetwork = false, awaitOnlyFetchFromNetwork = true) {
    let responseFromNetwork = await _fetchFromNetwork(request);

    if (_isResponseOk(responseFromNetwork) || _isResponseOpaque(responseFromNetwork)) {
        if (_shouldResourceBeCached(request, responseFromNetwork)) {
            if (!awaitOnlyFetchFromNetwork) {
                await _putInCache(request, responseFromNetwork);
            } else {
                _putInCache(request, responseFromNetwork);
            }

            if (refetchFromNetwork) {
                if (!awaitOnlyFetchFromNetwork) {
                    await _tickOffFromRefetchFromNetworkChecklist(request.url);
                } else {
                    _tickOffFromRefetchFromNetworkChecklist(request.url);
                }
            }
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

async function _getFromCache(requestURL, ignoreURLParams = false, ignoreVaryHeader = false) {
    let cachedResponse = null;

    try {
        let currentCacheID = _getCacheID();
        let hasCache = await caches.has(currentCacheID); // Avoid creating the cache when opening it if it has not already been created
        if (hasCache) {
            let currentCache = await caches.open(currentCacheID);
            cachedResponse = await currentCache.match(requestURL, { ignoreSearch: ignoreURLParams, ignoreVary: ignoreVaryHeader });
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
        await currentCache.put(request, clonedResponse);
    } catch (error) {
        if (_myLogEnabled) {
            console.error("An error occurred when trying to put the response in the cache: " + request.url);
        }
    }
}

async function _deletePreviousCaches() {
    for (let i = 1; i < _myCacheVersion; i++) {
        try {
            await caches.delete(_getCacheID(i));
        } catch (error) {
            // Do nothing
        }
    }
}

async function _tickOffFromRefetchFromNetworkChecklist(resourceURL) {
    try {
        let refetchChecklist = await caches.open(_getRefetchFromNetworkChecklistID());
        await refetchChecklist.put(new Request(resourceURL), new Response(null));
    } catch (error) {
        if (_myLogEnabled) {
            console.error("An error occurred when trying to put the response in the cache: " + request.url);
        }
    }
}

async function _deletePreviousRefetchFromNetworkChecklists() {
    for (let i = 1; i < _myServiceWorkerVersion; i++) {
        try {
            await caches.delete(_getRefetchFromNetworkChecklistID(i));
        } catch (error) {
            // Do nothing
        }
    }
}

// #endregion Service Worker Functions



// #region Service Worker Utils

function _isResponseOk(response) {
    return response != null && response.status == 200;
}

function _isResponseOpaque(response) {
    return response != null && response.status == 0 && response.type.includes("opaque");
}

function _shouldResourceBeCached(request, response) {
    let cacheResource = _shouldResourceURLBeIncluded(request.url, _myCacheResourceURLsToInclude, _myCacheResourceURLsToExclude);
    let cacheResourceWithOpaqueResponse = _shouldResourceURLBeIncluded(request.url, _myCacheOpaqueResponseResourceURLsToInclude, _myCacheOpaqueResponseResourceURLsToExclude);
    return cacheResource && (request.method == "GET" && (_isResponseOk(response) || (cacheResourceWithOpaqueResponse && _isResponseOpaque(response))));
}

function _getCacheID(cacheVersion = _myCacheVersion) {
    return _myServiceWorkerName + "_cache_v" + cacheVersion.toFixed(0);
}

async function _shouldResourceBeRefetchedFromNetwork(resourceURL, skipChecklistCheck = false) {
    let refetchResourceFromNetwork = false;

    try {
        refetchResourceFromNetwork = _shouldResourceURLBeIncluded(resourceURL, _myRefetchFromNetworkResourceURLsToInclude, _myRefetchFromNetworkResourceURLsToExclude);

        if (refetchResourceFromNetwork && !skipChecklistCheck) {
            let refetechChecklistID = _getRefetchFromNetworkChecklistID();

            let hasChecklist = await caches.has(refetechChecklistID); // Avoid creating the checklist when opening it if it has not already been created
            if (hasChecklist) {
                let refetchChecklist = await caches.open(refetechChecklistID);
                let refetchChecklistResult = await refetchChecklist.match(resourceURL);

                if (refetchChecklistResult != null) {
                    refetchResourceFromNetwork = false; // It has already been ticked off since it is in the checklist "cache"
                }
            }
        }
    } catch (error) {
        refetchResourceFromNetwork = false;

        if (_myLogEnabled) {
            console.error("An error occurred when trying to check if the resource should be refetched: " + request.url);
        }
    }

    return refetchResourceFromNetwork;
}

function _getRefetchFromNetworkChecklistID(serviceWorkerVersion = _myServiceWorkerVersion) {
    return _myServiceWorkerName + "_refetch_checklist_v" + serviceWorkerVersion.toFixed(0);
}

// #endregion Service Worker Utils



// #region Cauldron Utils

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

function _escapeRegex(regexToEscape) {
    return regexToEscape.replace(new RegExp("[/\\-\\\\^$*+?.()|[\\]{}]", "g"), "\\$&");
}

// #endregion Cauldron Utils