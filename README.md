# JKAN [![Build Status](https://travis-ci.org/timwis/jkan.svg?branch=gh-pages)](https://travis-ci.org/timwis/jkan) [![Join the chat at https://gitter.im/timwis/jkan](https://badges.gitter.im/timwis/jkan.svg)](https://gitter.im/timwis/jkan?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
A lightweight, backend-free open data portal, powered by Jekyll

Open-source data portals can be [really](https://twitter.com/waldojaquith/status/282599673569619969).
[hard](https://twitter.com/chris_whong/status/669207423719235584). to install and maintain. But their
basic purpose of providing links to download data really isn't that complicated. JKAN is a proof-of-concept
that allows a small, resource-strapped government agency to stand-up an open data portal by simply
[clicking the fork button](https://help.github.com/articles/fork-a-repo/).

Please note this is still a work in progress! Check out the [issues](https://github.com/timwis/jkan/issues) to help
out or give feedback.

[Demo site](https://demo.jkan.io)

## Installation
See [Get Started](https://jkan.io/#get-started) on [jkan.io](https://jkan.io) for an installation wizard,
or follow the [manual installation](https://github.com/timwis/jkan/wiki/Manual-Installation) instructions yourself.

For configuration details, see the [wiki](https://github.com/timwis/jkan/wiki)

## Development
Please see the [Architecture](https://github.com/timwis/jkan/wiki/Architecture) page in the wiki.

# Custom notes

### Installation

```sh
bundle install
npm install # Optional, for JS
```
### Local development

```sh
bundle exec jekyll serve --incremental
```

### Building

```sh
npx npx parcel build scripts/src/index.js --out-file scripts/dist --no-source-maps # Optional, for JS
bundle exec jekyll build
# Built site is available at _site
```
