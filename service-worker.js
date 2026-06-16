const CACHE_NAME =
"typemaster-v1";

const urlsToCache = [

    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json"

];

/* ==========================
   INSTALL
========================== */

self.addEventListener(
"install",
event=>{

    event.waitUntil(

        caches.open(
        CACHE_NAME
        )

        .then(cache=>{

            return cache.addAll(
            urlsToCache
            );

        })

    );

});

/* ==========================
   ACTIVATE
========================== */

self.addEventListener(
"activate",
event=>{

    event.waitUntil(

        caches.keys()
        .then(keys=>{

            return Promise.all(

                keys.map(key=>{

                    if(
                        key !== CACHE_NAME
                    ){

                        return caches.delete(
                        key
                        );

                    }

                })

            );

        })

    );

});

/* ==========================
   FETCH
========================== */

self.addEventListener(
"fetch",
event=>{

    event.respondWith(

        caches.match(
        event.request
        )

        .then(response=>{

            return (
                response ||
                fetch(event.request)
            );

        })

    );

});
const OFFLINE_PAGE = `
<!DOCTYPE html>
<html>
<head>
<title>Offline</title>
<style>
body{
background:#070b16;
color:white;
display:flex;
justify-content:center;
align-items:center;
height:100vh;
font-family:sans-serif;
}
</style>
</head>
<body>
<h1>⚡ TypeMaster Pro Offline Mode</h1>
</body>
</html>
`;