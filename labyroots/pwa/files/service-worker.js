const CACHE = 'labyroots-cache';

const files = [
    "/",
    "/index.html",
    "/wasm-featuredetect.js",
    "/icon192.png",
    "/manifest.json",
    "/f0.png",
    "/wonderland.min.js",
    "/vr-button.svg",
    "/ar-button.svg",
    "/favicon.ico",
    "/labyroots.bin",
    "/labyroots-bundle.js",
    "/WonderlandRuntime-physx.wasm",
    "/WonderlandRuntime-physx.js",
    "/WonderlandRuntime-physx-simd.wasm",
    "/WonderlandRuntime-physx-simd.js",
    "/WonderlandRuntime-physx-threads.wasm",
    "/WonderlandRuntime-physx-threads.js",
    "/WonderlandRuntime-physx-threads.worker.js",
    "/WonderlandRuntime-physx-simd-threads.wasm",
    "/WonderlandRuntime-physx-simd-threads.js",
    "/WonderlandRuntime-physx-simd-threads.worker.js",
    "favicon.ico",
    "setup.json",
    "assets/audio/music/creepy_music.wav",
    "assets/audio/sfx/Ascia su muro di radici.wav",
    "assets/audio/sfx/Attacco ascia alberi 1.wav",
    "assets/audio/sfx/Attacco ascia alberi 2.wav",
    "assets/audio/sfx/Colpo spada su pietra 1.wav",
    "assets/audio/sfx/Lamento albero 1.wav",
    "assets/audio/sfx/Lamento albero 2.wav",
    "assets/audio/sfx/Lamento albero 3.wav",
    "assets/audio/sfx/Mangiare frutto 1.wav",
    "assets/audio/sfx/Passi nel verde 1.wav",
    "assets/audio/sfx/Passi nel verde 2.wav",
    "assets/audio/sfx/Passi nel verde 3.wav",
    "assets/audio/sfx/Raccolta frutto.wav",
];

self.addEventListener('install', event => {
    precache().then(() => self.skipWaiting());
});

self.addEventListener('fetch', evt => {
    if (evt.request.url.match(/^.*(\?nocache)$/)) {
        return false;
    }
    evt.respondWith(fromNetwork(evt.request, 400).catch(() => {
        return fromCache(evt.request);
    }));

    evt.waitUntil(update(evt.request));
});

function precache() {
    return caches.open(CACHE).then(cache => {
        return cache.addAll(files);
    });
}

function fromNetwork(request, timeout) {

    return new Promise(function (fulfill, reject) {
        var timeoutId = setTimeout(reject, timeout);
        fetch(request.clone()).then(function (response) {
            clearTimeout(timeoutId);
            fulfill(response);
        }, reject);
    });
}

function fromCache(request) {
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request).then(function (matching) {
            return matching || Promise.reject('no-match');
        });
    });
}

function update(request) {
    // return if request is not GET
    if (request.method !== 'GET') return;
    // return if scheme is not http or https
    if (request.url.indexOf('http') !== 0) return;

    return new Promise((fulfill, reject) =>
        caches.open(CACHE).then(
            (cache) => fetch(request.clone()).then(
                (response) => cache.put(request, response).then(fulfill),
                function () {
                    console.error("Fail to fetch:", request.url);
                    reject(...arguments);
                }
            ))
    )
}