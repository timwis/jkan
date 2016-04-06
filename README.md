<<<<<<< HEAD
Questo portale è stato creato a partire dal framework JKAN Registrandoti su Github puoi farne uno anche tu procedendo in questo modo. Ti consiglio di riusare il codice di questo progetto che si basa su JKAN ma è stato già tradotto in lingua italiana ed in parte adattato. Procedi in questo modo:

Iscriviti a Github
Crea un repository e chiamalo come vuoi. Sarebbe auspicabile che il nome fosse "OpendataGentedi+NomedeltuoComune"
Effettua un fork di questo repository nel tuo repository
Apri il file _config.yml puoi usare direttamente il pulsante edit su Github ed impostare il titolo del tuo sito e la descrizione, quindi fai click su "Commit changes" in basso.
Tu puoi quindi accedere al tuo sito al link your_github_username.github.io/nomerepository
A questo punto tu puoi aggiungere o editare gli archivi dei dati direttamente nella cartella _dataset. In alternativa puoi editare i dati dal portale tramite la schermata di EDIT, ma per fare questo devi creare una procedura di LOGIN del portale in modo che sia possibile autenticarsi. Fortunatamente esiste una pagina che ti guiderà in questo, ti basta recarti all'indirizzo .github.io/nomerepository/setup e seguire la procedura. Se non riesci a salvare il codice e il nome della APP memorizzali e inseriscili nel file _config.yml sui tag github_client_id e gatekeeper_host


Istruzioni originali di JKAN
![JKAN logo, made by @JJediny](https://raw.githubusercontent.com/timwis/jkan/gh-pages/img/jkan.png)

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
See [Get Started](https://jkan.io/#get-started) on [jkan.io](https://jkan.io)

For configuration details, see the [wiki](https://github.com/timwis/jkan/wiki)

## Development
* Requires [Jekyll](http://jekyllrb.com), a ruby thing
* Run a web server that recompiles on changes using `jekyll serve --baseurl ""`. Add the experimental `--incremental`
flag for faster recompilation.
* Committing to the `gh-pages` branch will automatically compile the jekyll site 
