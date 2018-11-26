<img src="resources/graphics/Spy_vs._Spy_Logotipe.png" /><br />

# Cross-Site Scripting and Clickjacking

I needed a very simple and crystal-clear example of cross-site scripting and clickjacking for a course, so I built this. While I maintain a copyright on the code, it is distributed under the MIT license and you are hereby given written permission in this document to clone this project, extend it, and use it as you see fit as long as attribution is given. To me.

Given my long history of working with security within the DOD, and the episodes that I have been trapped in, I simply cannot resist drawing on the relationship of this topic Mad Magazine's Spy vs Spy: the black-hat using XSS and clickjacking to frustrate the white-hat :)

## Getting Started - What the Example Does

### Embedded Documents

This project demonstrates same-origin and clickjacking with four examples, one after the other on a single page.
The first example is a login form loaded by the index document, from the same source, into an *iframe*.
This would work the same in a popup window, although many browsers now block popup windows, partially because of these exploits.
The login document has JavaScript functionality that shows the contents of the *username* and *password* fields when the *login* button is clicked, by writing those values to the browser console.

<img align="right" width="300" src="./resources/graphics/Clickjacking_description.png" />

### Clickjacking

In the second example the index page overlays the iframe with a div at the same position.
The div has a button in it that is placed in front of the login button on the form.
In a real clickjacking situation you would not be able to see that button, but in this example the div and button are opaque and have a blue border to make them stand out.
The user, seeing the form, provides the login information and clicks on the button, but they are really clicking the button in front of the iframe.
Since the login form was loaded from the same-origin as the the index page, the JavaScript in the index page has access to manipulate the DOM in the login form.
This example captures the information from the form, logs it to the console, and then invokes the click on the actual form button so the user sees that work as it should (which also logs the data to the console)!

### Clickjacking Refined

The third example eliminates the overlay.
Since JavaScript from index can manipulate the DOM in the login document, why not just add another click event handler to the button on the form from outside the loaded document?
That handler will run before the form is submitted, and should be able to get all the data from the form before it happens.
Note that now the JavaScript from the login form runs *before* the JavaScript from the index page, because the index page registered the *second* handler for the button.

### Same-Origin

The fourth example repeats the second, but the document is loaded from another origin and violates the *same-origin* policy.
Many people have a hard time following what the same-origin policy does, and how cross-site scripting works.
And, it doesn't help that the definitions of XSS and same-origin get really, really technical and miss what is really happening.
Or maybe it is just purposely obfuscated to discourage people?

So, it is really simple: **XSS is where script in one container is trying to manipulate the contents of another container!**
The same-origin policy that prevents this from happening affects the document that *loads* the scripts, it does not have anything to do with the source of the scripts (where they come from).
Any scripts loaded in a document, regardless of where they came from, all share the same JavaScript environment and browser document-object model.

When multiple documents are loaded from the same location, then all the scripts in those documents can manipulate each other's environment. But, if any *document* is loaded from another source, even the script that loaded it cannot manipulate it!

So in the fourth example, because the login form is loaded from another location, the JavaScript in the index document cannot get into it!
When you click the login button, the overlaid button masking it fails :)

### Are We In an IFrame?

One more thing that we can do is to not allow something to wrap us in a browser window by loading us into an iframe.
This is not an absolute protection, a browser that does not do same-origin is also likely to to allow us to be loaded in a popup window.
But, it cannot hurt to try.
So if you peek at the code for the login form in *pub/assets/scripts/login.js*, you will find that by changing the value of *allowIFrame* to false, then it will incorporate logic to make sure the document is not loaded into an iframe before it initializes things:

```javascript
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
```

## Prerequisites to running the Project

* [Node.js >= 10](http://www.nodejs.org/) - The web server is built as a Node.js application.

## Installing

Run *npm install* in the project directory for the dependencies.
The Express server uses ports 3000 and 3001 by default.
Edit the ports declared at the top of the *src/server.js* file, and the corresponding links in the *pub/index.html* file, to change this if necessary.

## Running

Run *npm start* to launch the web server.
Browse to http://localhost:3000 to see the index page; remember to change the port number if you modified it during installation.
The Express server serves the same web application up on two ports, so that in example four the login form can be loaded from a second location. Example four proves the browser steps in and prevents the XSS in the loading document from touching the loaded document.

## Built With

* [Express](http://www.github.com/1.0.2/docs/) - The web framework used

## Support

Since I give stuff away for free, and if you would like to keep seeing more stuff like this, then please consider
contributing $10 to *Joel's Coffee Fund* at my company, **Smallrock Internet**, to help keep stuff coming :)<br />

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=XPUGVGZZ8RUAA)

## Contributing to the Project

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors and Contributors

* **Joel Mussman** - *Initial work* - [jmussman](https://github.com/jmussman)

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Here is a link to a somewhat confusing document at the Mozilla Developer Network that explains what is allowed, but pretty much anything that is embedded has the run of the place: https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy.
* OWASP does a great job of defining the terms, and this new attempt at separating different types of XSS is a good place to start: https://www.owasp.org/index.php/Types_of_Cross-Site_Scripting.
* Inspiration: I was asked about delivering a Secure Java Programming course for [Judge Learning Solutions](https://www.judge.com/services/learning-solutions) and [nTier Training](https://ntiertraining.com), and this is a piece of what came out of that. 

<span style="font-size: 8pt;">The logo image is borrowed from Google at https://commons.wikimedia.org/wiki/File:Spy_vs._Spy_Logotipe.png and is in the public domain.<br/>
The overlay image is licensed under creative-commons from </span>
