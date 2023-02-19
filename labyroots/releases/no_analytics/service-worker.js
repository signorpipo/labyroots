const CACHE = "labyroots-cache-v1";

const files = [
    "/",
    "index.html",
    "manifest.json",
    "f0.png",
    "icon192.png",
    "wonderland.min.js",
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

// This force using the cache first if the network is failing for cached resources
var forceTryCacheFirst = false;

self.addEventListener("install", function (event) {
    event.waitUntil(precacheResources());
});

self.addEventListener("fetch", function (event) {
    event.respondWith(getResource(event.request, true, true));
});

async function precacheResources() {
    const cache = await caches.open(CACHE);

    for (const file of files) {
        try {
            await cache.add(file);
        } catch (error) {
            console.error("Can't precache " + file);
        }
    }
}

/**
 * @param {Request} request 
 * 
 * @param {boolean} tryCacheFirst With tryCacheFirst you can specify if you want to first try the cache or always check the network for updates.
 *                                If cache is checked first, you could have an updated resources not being downloaded until cache is cleaned.
 * 
 * @param {boolean} fetchFromNetworkInBackground If tryCacheFirst is true, you can enable this flag to also fetch from network.
 *                                               This will update the cache for the next page load, not the current one.
 * 
 * @param {boolean} disableForceTryCacheFirst If tryCacheFirst is false and the network fails to get a resource that is already in the cache,
 *                                            it will, by default, start using the cache as first option.
 *                                            With this flag u can prevent that and keep using the network first.
 * 
 * @returns {Response}
 */
async function getResource(request, tryCacheFirst = true, fetchFromNetworkInBackground = false, disableForceTryCacheFirst = false) {
    if (tryCacheFirst || (forceTryCacheFirst && !disableForceTryCacheFirst)) {
        // Try to get the resource from the cache
        const responseFromCache = await getFromCache(request.url);
        if (responseFromCache != null) {
            if (fetchFromNetworkInBackground) {
                fetch(request).then(function (responseFromNetwork) {
                    if (responseFromNetwork != null && responseFromNetwork.status == 200) {
                        putInCache(request, responseFromNetwork.clone());
                    }
                }).catch(function () { /* do nothing, we tried to update cache, it's ok if fail*/ });
            }

            return responseFromCache;
        }
    }

    // Try to get the resource from the network
    try {
        const responseFromNetwork = await fetch(request);

        if (responseFromNetwork == null) {
            throw new Error("Can't fetch: " + request.url + " - Response is null");
        } else if (responseFromNetwork.status != 200) {
            throw new Error("Can't fetch: " + request.url + " - Error Code: " + responseFromNetwork.status);
        }

        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        putInCache(request, responseFromNetwork.clone());
        return responseFromNetwork;
    } catch (error) {
        if (!tryCacheFirst) {
            const responseFromCache = await getFromCache(request.url);
            if (responseFromCache != null) {
                if (!forceTryCacheFirst) {
                    console.error("Forcing cache first because of possible network issues");
                    forceTryCacheFirst = true;
                }

                return responseFromCache;
            }
        }

        // WLE use ? url params to make it so the bundle is not cached
        // but if network fails we can still try to use the cached one
        if (request.url != null) {
            const requestWithoutParamsURL = request.url.split("?")[0];

            const responseFromCacheWithoutParams = await getFromCache(requestWithoutParamsURL);
            if (responseFromCacheWithoutParams != null) {
                return responseFromCacheWithoutParams;
            }
        }

        return new Response("Network error happened", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
        });
    }
}

async function getFromCache(requestURL) {
    return caches.match(requestURL);
}

async function putInCache(request, response) {
    try {
        // return if request is not GET
        if (request.method !== "GET") return;

        const cache = await caches.open(CACHE);
        cache.put(request, response);
    } catch (error) {
        // do nothing
    }
}