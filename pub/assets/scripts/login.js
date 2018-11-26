// login.js
// Copyright © 2018 Joel Mussman. All rights reserved.
//
// This code for the login form is a little more complicated than it needs to be, just to demonstrate how
// we could block the document from loading (and replace it with an error message) if a parent document
// tried to load it into an IFrame.
//

(() => {

    const allowIFrame = true; // change this to false to disallow iframes.

    if (allowIFrame) {

        initializeFrame()

    } else {

        // Block the frame from loading and working if we are not in a top-level window.

        let success = false

        try {

            if (window.self === window.top) {

                // We are in a top-most window, so the best we can do is hope the same-origin works and
                // no other window can muck around in our DOM :)

                success = true

                initializeFrame()
            }
        }

        catch {

            // Same-origin blocked access to window.top, so we must be in an iframe :)
        }

        if (!success) {

            window.addEventListener('load', (event) => {

                document.body.innerHTML = '<div class="bad-frame">Sorry, this looks like I\'m loading in an iframe :(</div>'
            })
        }
    }

    function initializeFrame() {               

        window.addEventListener('load', () => {

            let submit = document.getElementById('login')

            submit.addEventListener('click', (event) => {

                let username = document.getElementsByName('username')[0]
                let password = document.getElementsByName('password')[0]

                console.log(`login.js: username = "${username.value}"`)
                console.log(`login.js: password = "${password.value}"`)
            })
        })

    }

}).call(this)