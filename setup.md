---
title: Setup
permalink: /setup/
layout: default
---
{% include breadcrumbs.html parent="Administration" %}

<div class="alert alert-success" role="alert" data-hook="alert-success" style="display: none;">
  La configurazione è stata <a href="#" data-hook="commit-url">salvata</a> e il sito è in fase di aggiornamento.
</div>

<div class="alert alert-danger" role="alert" data-hook="alert-error" style="display: none;">
C'è stato un errore nel salvataggio della pagina
</div>

# Setup

## Step 1
[Registra una tua applicazione](https://github.com/settings/applications/new) con GitHub. Imposta `Callback URL`
nel URL del tuo portale JKAN (esempio. `http://<your_github_username>.github.io/portale`. Dopo cliccando su `Register`,  ti sarà fornito 
un codice `Client ID` e un `Client Secret`. Inserisci il `Client ID` qui sotto.

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
Per effettuare una procedura di login con Github, fai un setup di [Gatekeeper](https://github.com/prose/gatekeeper), un tool
open-source per autenticazione. [Heroku](http://heroku.com) fornisce hosting libero per questo.

[![Fai setup su Heroku](https://www.herokucdn.com/deploy/button.png)](https://dashboard.heroku.com/new?button-url=https%3A%2F%2Fgithub.com%2Fprose%2Fgatekeeper&template=https%3A%2F%2Fgithub.com%2Fprose%2Fgatekeeper)

Fornisci un nome  all'applicazione in `App Name`, e riempi solo il settaggi HEROKU `Client ID` e `Client Secret` con i codici della applicazione Github creata in precedenza. Inserisci l' `App Name` che hai definito qui sotto. 

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
Fai un login in questo sito con GitHub per salvare i settaggi.

<a href="#" class="btn btn-success" data-hook="login-link"><i class="fa fa-github"></i> Sign in with GitHub</a>

## Step 4
Salva questa configurazione nel tuo file `_config.yml`.

<a href="#" class="btn btn-primary disabled" data-hook="save"><i class="fa fa-save"></i> Salva</a>
