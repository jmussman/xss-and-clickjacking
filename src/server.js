// server.js
// Copyright © 2018 NextStep IT Training. All rights reserved.
//
// This application launches two express servers on different ports, to demonstrate the built-in
// safeguards of the same-origin policy in the browser. Both serve exactly the same content,
// but the html file loads specific scripts from specific sources. There is no application logic
// on the server side.
//

(() => {

    const portOne = 3000
    const portTwo = 3001

    let express = require('express')

    startService('./pub', portOne)
    startService('./pub', portTwo)

    function startService(path, port) {

        let app = express();

        app.use(express.static(path))
        
        app.get('/', (req, res) => {

            res.sendFile('index.html', { root: path })
        })

        app.listen(port, () => {

            console.log(`app listening on port ${port}`)
        })
    }

}).call(this)