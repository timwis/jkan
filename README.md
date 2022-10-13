# JKAN [![Build Status](https://travis-ci.org/timwis/jkan.svg?branch=gh-pages)](https://travis-ci.org/timwis/jkan) [![Join the chat at https://gitter.im/timwis/jkan](https://badges.gitter.im/timwis/jkan.svg)](https://gitter.im/timwis/jkan?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
A lightweight, backend-free open data portal, powered by Jekyll

Open-source data portals can be really hard to install and maintain. But their
basic purpose of providing links to download data really isn't that complicated. JKAN is a proof-of-concept
that allows a small, resource-strapped government agency to stand-up an open data portal by simply
[clicking the fork button](https://help.github.com/articles/fork-a-repo/).

Please note this is still a work in progress! Check out the [issues](https://github.com/timwis/jkan/issues) to help
out or give feedback.

[Demo site](https://demo.jkan.io)

## Installation Options

1. See [Get Started](https://jkan.io/#get-started) on [jkan.io](https://jkan.io) for an installation wizard,
2. follow the [manual installation](https://github.com/timwis/jkan/wiki/Manual-Installation) instructions yourself.
3. Do a manual fork and do not install gatekeeper at all (login bits won't work, but Heroku is no longer free)

For configuration details, see the [wiki](https://github.com/timwis/jkan/wiki)

## Development
The recommended to build the site for development or making changes is docker compose.  Just run ```docker compose up```

```bash
$ docker compose up
[+] Running 1/0
 ⠿ Container jkan-jekyll-1  Created                                                                                                                                                                                               0.0s
Attaching to jkan-jekyll-1
jkan-jekyll-1  | ruby 2.6.3p62 (2019-04-16 revision 67580) [x86_64-linux-musl]
jkan-jekyll-1  | Configuration file: /srv/jekyll/_config.yml
jkan-jekyll-1  |             Source: /srv/jekyll
jkan-jekyll-1  |        Destination: /srv/jekyll/_site
jkan-jekyll-1  |  Incremental build: enabled
jkan-jekyll-1  |       Generating... 
jkan-jekyll-1  |                     done in 0.025 seconds.
jkan-jekyll-1  |  Auto-regeneration: enabled for '/srv/jekyll'
jkan-jekyll-1  |     Server address: http://0.0.0.0:4000/jkan/
jkan-jekyll-1  |   Server running... press ctrl-c to stop.
```

Then connect to http://0.0.0.0:4000/jkan/ via a web browser.

Read more about the [Architecture](https://github.com/timwis/jkan/wiki/Architecture) on the Wiki.