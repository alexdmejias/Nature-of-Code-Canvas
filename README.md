# Nature-of-Code-Canvas
Place for me to put my progress in working through the Nature of Code book using the canvas api

Features a grunt workflow to make things easier. `grunt create --path=[chapter-unit]` will create the necessary files to get started with that excercise. Currently the structure is /chapters/chapter/unit. Each unit will have an index file, app.js app.bundle.js. `Index.html` and `app.js` can be automatically generated through `create`. `App.bundle.js` is automatically generated using browserify (using `> grunt`). The bundle is generated using all the files located next to `app.js`, with the exception of `app.bundle.js`.

es6 support coming soon.
