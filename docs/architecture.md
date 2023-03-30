# Architecture

JKAN is a [Jekyll](http://jekyllrb.com/) site that uses JavaScript for enhanced functionality. It also uses [Decap CMS](https://decapcms.org) to provide an editor UI.

## Jekyll

### Directory structure
```
.
├── _config.yml
├── data.json
├── datasets.json
├── _data
|   ├── schemas
|   └── licenses.yml
├── _dataset_categories
├── _datasets
├── _includes
|   ├── addons
|   └── display
├── _layouts
├── _organizations
├── editor
└── scripts
```

| File / Directory | Description |
|---|---|
| `_config.yml` | [Jekyll config file](http://jekyllrb.com/docs/configuration/) |
| `data.json` | Generates a [project open data](https://project-open-data.cio.gov/v1.1/schema/)-compliant `data.json` file that can be used to harvest the JKAN site into other data catalogs. |
| `datasets.json` | Generates a list of datasets used to populate the `datasets-list` component (as seen on the `/datasets/` page). |
| `_data/schemas` | [Schema definition files](/docs/configuration.md), which list the fields each dataset, category, and organization should have. |
| `_data/licenses.yml` | A list of licenses that datasets can be associated with |
| `_datasets` | A directory of `.md` files containing dataset information in YAML front-matter |
| `_dataset_categories` | A directory of `.md` files containing dataset categories in YAML front-matter |
| `_includes` | HTML partials that are included in layouts. `display` is used by [schema files](/docs/configuration.md) |
| `_layouts` | Page templates |
| `_organizations` | A directory of `.md` files containing organization information in YAML front-matter |
| `editor` | Configuration for the Editor UI, described below |
| `scripts` | JavaScript files, described below |

## JavaScript

### Directory structure
The `scripts/dist` directory contains only the compiled/minified JavaScript files. The source resides inside the `scripts/src` directory:
```
scripts/src
├── index.js
├── util.js
├── components
└── templates
```

| File / Directory | Description |
|---|---|
| `index.js` | Main JavaScript entry point. Initializes the user/authentication mechanism and searches the page for components, initializing each one and passing them a few shared variables. |
| `util.js` | Common/shared helper functions |
| `components` | A directory of components, described below. |
| `templates` | Tiny JavaScript modules used for dynamic templates. Should probably be folded into `components`. |

### Components
JKAN contains many different `.html` files as a static site, and the JavaScript needs to know which code to execute depending on what's on the page. Rather than having distinct JavaScript files for each page, JKAN's JavaScript architecture searches each page for HTML elements with a `data-component` attribute it recognizes, and initializes each component present on the page.

For example, if there is a `<div data-component="navigation">` on the page, `components/navigation.js` is initialized. Each component that is initialized is passed a handful of shared variables such as its HTML element and the current querystring `params`. Some components may require the contents of `datasets.json`, so it's fetched first and shared by any component that needs it.

A component is just an [ES6 class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes). They typically have a `constructor` method so they can use the variables they are passed. They can extend other components, but they don't have to.

By convention, elements within a component's HTML markup that need to be referenced by JavaScript are designated using a `data-hook` attribute, an idea [borrowed from ampersand.js](https://ampersandjs.com/learn/data-hook-attribute/) that helps keep styling and JavaScript concerns separate. For example, the `datasets-list` component looks for 3 elements within it: a place to put the count of datasets, a search box, and the place to list the dataset items themselves.

```html
<div data-component="datasets-list">
  <h3 data-hook="datasets-count"></h3>
  <input data-hook="search-query" type="text" placeholder="Search">
  <div data-hook="datasets-items"></div>
</div>
```
`util.js` provides a helper function for querying by hook, `queryByHook`, which takes the hook as its first parameter and, optionally, an element to limit the search within as its second parameter (such as the component's `el`). This helper function also lets an element be of more than one component (ie. `data-component="foo bar"`).

## Decap CMS

[Decap CMS](https://decapcms.org) (formerly Decap CMS) is a headless content management system for static sites. JKAN used to have its own built-in editing UI, but now we use Decap. There are only two files involved in configuring Decap CMS, and they're both in the `editor` directory:
```
editor
├── index.html
└── decap-cms.yml
```

| File / Directory | Description |
|----|----|
| `index.html` | Single-page Application which primarily just loads Decap CMS and passes it `decap-cms.yml`, but it also has a bit of config on it, itself. |
| `decap-cms.yml` | Configuration file for Decap CMS |

`index.html` has a bit of config on it - namely just passing variables from Jekyll to Decap CMS. This is because Jekyll and Decap CMS both use `{{ }}` for template interpolation, so it's tricky to pass these in the yaml file.

Also note there is some redundancy between the schema definitions in `decap-cms.yml` and those in `data/schemas/default.yml`, so be sure to keep those in sync.