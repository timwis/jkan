# Install

Add this file to `_plugins` in the root of your Jekyll site.

Add dependencies these dependencie to your sites Gemfile

```
gem 'json'
gem 'hash-joiner'
gem 'open-uri-cached'
```

# Run
`bundle install`
`jekyll build`
`jekyll

# Configure

This plugin reads settings from the `_config.yml` file. Add settings as attributes or an array of attributes for multiple files.

## Example

```yml
jekyll_get:
  data: team
  json: 'https://18f.gsa.gov/hub/api/team/'
```

Or

```yml
jekyll_get:
  - data: team
    json: 'https://18f.gsa.gov/hub/api/team/'
  - data: projects
    json: 'https://18f.gsa.gov/hub/api/projects/'
```

Use in a liquid template as if it were a local data file:

```liquid
{% for member in site.data.team %}
  Hello {{member[1].first_name}}
{% endfor %}
```

Optionally, set a cache attribute to save a local copy of the data in the `_data` directory:

```yml
jekyll_get:
  - data: team
    json: 'https://18f.gsa.gov/hub/api/team/'
    cache: true
  - data: projects
    json: 'https://18f.gsa.gov/hub/api/projects/'
    cache: true
  - data: pif_team
    json: 'https://18f.gsa.gov/hub/api/pif_team/'
    cache: true
  - data: pif_projects
    json: 'https://18f.gsa.gov/hub/api/pif_projects/'
    cache: true
```

## Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
