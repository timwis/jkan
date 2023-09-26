FROM ruby:3.2-bookworm

RUN apt-get update \
 && apt-get install -y --quiet --no-install-recommends \
 nodejs npm

ENV GEM_HOME=/usr/gem
ENV PATH="$GEM_HOME/bin/:$PATH" 

RUN gem install bundler -v '2.4.12'
# throw errors if Gemfile has been modified since Gemfile.lock
RUN bundle config --global frozen 1

WORKDIR /srv/jekyll
COPY Gemfile Gemfile.lock ./
RUN bundle install

# Add so gh-pages can detect git remotes
RUN git config --global --add safe.directory /srv/jekyll

CMD ["/bin/bash"]
