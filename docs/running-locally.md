# Running locally

You may want to run JKAN locally to preview your changes, modify your site's layout, or make contributions to JKAN.

## With docker
The quickest way to run JKAN locally is to use docker compose, which comes with [docker desktop][docker-install]. From the project directory, run:

```bash
docker compose up
```

This will bring up a container running JKAN, which you can access at `http://0.0.0.0:4000/`

## Without docker
Alternatively, you can run JKAN locally without docker. You'll need ruby installed, and if you want to make modifications to the JavaScript, you'll also need Node.js installed.

From the project directory, install ruby dependencies via:

```bash
bundle install
```

Then run JKAN via:

```bash
bundle exec jekyll serve
```

This will build the site on the fly and serve it on `http://localhost:4000`. There are various flags you can use to customise this command on [Jekyll's docs][jekyll-serve-flags].

If you'd like to build the site—say, to upload it to a static web host—you can do so via:

```bash
bundle exec jekyll build
```

The built site will be output to the `_site` directory.

## JavaScript
You don't have to build the JavaScript to run JKAN locally, as the built version is already in source control, but you will if you'd like to change the JavaScript. With Node.js installed, and from the project directory, install JavaScript dependencies via:

```bash
npm install
```

While developing, listen for changes to JavaScript files and automatically rebuild using:

```bash
npm run watch
```

(Note that the `watch` command skips the `scripts/dist` directory and puts the built files directly into `_site/scripts/dist` for efficiency while developing)

When you're ready to commit your changes, create a production build using:

```bash
npm run build
```

The built JavaScript is placed in the `scripts/dist` directory and is committed to source control (this part's easy to forget).

If you're running JKAN inside docker, you should just be able to prefix these commands with `docker compose exec jekyll`, e.g. `docker compose exec jekyll npm install`.


[docker-install]: https://www.docker.com/get-started/
[jekyll-serve-flags]: https://jekyllrb.com/docs/configuration/options/#serve-command-options
