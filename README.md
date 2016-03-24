# JKAN [![Build Status](https://travis-ci.org/timwis/jkan.svg?branch=gh-pages)](https://travis-ci.org/timwis/JKAN) [![Join the chat at https://gitter.im/timwis/jkan](https://badges.gitter.im/timwis/jkan.svg)](https://gitter.im/timwis/jkan?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
A lightweight, backend-free open data portal, powered by Jekyll

Open-source data portals can be [really](https://twitter.com/waldojaquith/status/282599673569619969).
[hard](https://twitter.com/chris_whong/status/669207423719235584). to install and maintain. But their
basic purpose of providing links to download data really isn't that complicated. JKAN is a proof-of-concept
that allows a small, resource-strapped government agency to stand-up an open data portal by simply
[clicking the fork button](https://help.github.com/articles/fork-a-repo/).

Please note this is still a work in progress! Check out the [issues](https://github.com/timwis/jkan/issues) to help
out or give feedback.

[Demo site](http://timwis.com/jkan)

## Installation
Just click "Fork" at the top-right of this page. (You'll need a [GitHub account](https://github.com/join?return_to=%2Ftimwis%2Fjkan&source=login)).
You can then access it at `<your_github_username>.github.io/jkan`.

From there, you can use the [built-in edit button](https://help.github.com/articles/editing-files-in-your-repository/) 
on github to edit [`_config.yml`](_config.yml) and the datasets in the [`_datasets`](_datasets) directory to manage
your site.

Alternatively, you can use JKAN's user-friendly editing pages.

![Screenshot of user-friendly editing page](http://i.imgur.com/e12N0oQ.png)

But doing so requires one more installation step: setting up authentication. Fortunately there's a user-friendly page
for doing that too. Just go to your setup page (ie. `<your_github_username>.github.io/jkan/setup`)

![Screenshot of setup page](http://i.imgur.com/PARLkvU.png)

## Development
* Requires [Jekyll](http://jekyllrb.com), a ruby thing
* Run a web server that recompiles on changes using `jekyll serve --baseurl ""`. Add the experimental `--incremental`
flag for faster recompilation.
* Committing to the `gh-pages` branch will automatically compile the jekyll site 
