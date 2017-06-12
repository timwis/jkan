---
title: Setup
permalink: /setup/
layout: default
---
{% include breadcrumbs.html parent="Administration" %}

<div class="alert alert-success" role="alert" data-hook="alert-success" style="display: none;">
  These settings have been <a href="#" data-hook="commit-url">saved</a> and the site is currently regenerating.
</div>

<div class="alert alert-danger" role="alert" data-hook="alert-error" style="display: none;">
  There was an error saving this page
</div>

# Setup

## Step 1
[Register your application](https://github.com/settings/applications/new) with GitHub. Set the `Callback URL`
to the URL of your JKAN site (ie. `https://<your_github_username>.github.io/jkan`. After clicking `Register`, you'll
be given a `Client ID` and a `Client Secret`. Enter the `Client ID` below.

<div class="row">
  <div class="col-sm-6 col-sm-offset-3">
    <div class="form-group">
      <label class="control-label" for="github_client_id">Client ID</label>
      <input type="text" class="form-control" id="github_client_id" data-hook="github-client-id" placeholder="ie. 777ae16009a6f9e6d451">
      <p class="help-block"></p>
    </div>
  </div>
</div>

## Step 2
In order to authenticate with GitHub, setup [Gatekeeper](https://github.com/prose/gatekeeper), an
open-source authentication tool. [Heroku](http://heroku.com) provides free hosting.

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://dashboard.heroku.com/new?button-url=https%3A%2F%2Fgithub.com%2Fprose%2Fgatekeeper&template=https%3A%2F%2Fgithub.com%2Fprose%2Fgatekeeper)

Pick an `App Name`, and fill in your `Client ID` and `Client Secret`. Enter the `App Name` you chose below. 

<div class="row">
  <div class="col-sm-6 col-sm-offset-3">
    <div class="form-group">
      <label class="control-label" for="app_name">App Name</label>
      <input type="text" class="form-control" id="app_name" data-hook="app-name" placeholder="ie. jkan-gatekeeper">
      <p class="help-block"></p>
    </div>
  </div>
</div>

## Step 3
Login to this site via GitHub to save these settings.

<a href="#" class="btn btn-success" data-hook="login-link"><i class="fa fa-github"></i> Sign in with GitHub</a>

## Step 4
Save these settings to `_config.yml`.

<a href="#" class="btn btn-primary disabled" data-hook="save"><i class="fa fa-save"></i> Save</a>
