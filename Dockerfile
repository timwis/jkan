FROM ruby:3.4-trixie

RUN apt-get update \
 && apt-get install -y --quiet --no-install-recommends \
 npm jekyll ruby-jekyll-github-metadata ruby-jekyll-relative-links ruby-jekyll-paginate-v2 ruby-jekyll-titles-from-headings

WORKDIR /srv/jekyll

# Add so gh-pages can detect git remotes
RUN git config --global --add safe.directory /srv/jekyll

CMD ["/bin/bash"]
