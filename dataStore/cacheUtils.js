window.caches.open('my-cache').then(function(cache) {
    cache.addAll([
        'dataStore/cacheUtils.js'
    ])
    console.log('cache ready');
});


