# JKAN [![Build Status](https://travis-ci.org/timwis/jkan.svg?branch=gh-pages)](https://travis-ci.org/timwis/jkan) [![Join the chat at https://gitter.im/timwis/jkan](https://badges.gitter.im/timwis/jkan.svg)](https://gitter.im/timwis/jkan?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
A lightweight, backend-free open data portal, powered by Jekyll

Open-source data portals can be really hard to install and maintain. But their
basic purpose of providing links to download data really isn't that complicated. JKAN is a proof-of-concept
that allows a small, resource-strapped government agency to stand-up an open data portal by simply
[clicking the fork button](https://help.github.com/articles/fork-a-repo/).

[Demo site](https://demo.jkan.io)

## Installation Options
We recommend running JKAN on Netlify, but you can also run it on GitHub Pages,
Vercel, or any other static website host.

### Running on Netlify
Before you start, make sure you have a [GitHub][github-signup] account and a [Netlify][netlify-signup] account. JKAN runs fine on the free tier of both.

1. Create your own copy of JKAN by clicking [fork][jkan-fork]
2. [Create a new site][netlify-new-site] on Netlify. Click the **GitHub** button, then select your JKAN copy from the list.
3. Netlify will pre-fill the basic site settings for you. Click **Deploy site.**

Netlify will then deploy your site, and generate a random URL for it, e.g. `https://genuine-tapioca-7d69fa.netlify.app`. You can change the URL or add a custom domain in the Netlify settings.

If you're happy to build your JKAN site by editing YAML files directly, you're finished! If you'd like to use JKAN's Editing UI, you'll need a couple more steps. In order to let your site's users sign in with their GitHub account, you'll need to register an OAuth application with GitHub, and then give Netlify those application credentials.

4. In a new browser tab, [register an OAuth application][github-new-oauth] on GitHub

> - Application name: Whatever your site will be called (e.g. JKAN)
> - Homepage URL: The URL of your site, e.g. `https://genuine-tapioca-7d69fa.netlify.app` or your custom domain
> - Application description: Whatever you like - users will see this when they sign in to your JKAN site
> - Authorization callback URL: `https://api.netlify.com/auth/done` (Note: it won't work if this one is wrong)

5. On the next page, take note of the **Client ID**, as you'll need that in a moment.
6. Under the **Client secrets** header, click **Generate a new client secret**. You'll need this in a moment as well, but be careful where you copy and paste it because it should be _treated like a password_.
7. Back in your Netlify browser tab, go to your **Site settings**, then select **Access control**, then **OAuth**.
8. Click **Install provider**, select `GitHub` as the Provider, and copy your **Client ID** and **Client Secret** from your GitHub browser tab, then click Install.

You should now be able to sign in to your JKAN site's Editor UI by going to `/editor`, e.g. `https://genuine-tapioca-7d69fa.netlify.app/editor` and signing in with your GitHub account.

## Configuration
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

[github-signup]: https://github.com/signup
[netlify-signup]: https://app.netlify.com/signup
[netlify-new-site]: https://app.netlify.com/start
[jkan-fork]: https://github.com/timwis/jkan/fork
[github-new-oauth]: https://github.com/settings/applications/new
