# Upgrading
See [release notes](/releases) for details of what's changed between versions.

## For every upgrade
If your JKAN repository is a fork, you should see a banner at the top of the repository saying, e.g. "This branch is 20 commits ahead, 32 commits behind timwis:gh-pages". Clicking on the "X commits behind" link should take you to a page where you can initiate a pull request, which should show you the changes that will be applied to your repository. It should take you to:

```
https://github.com/<your-username>/jkan/compare/gh-pages...timwis:jkan:gh-pages
```

If there are no conflicting changes in your fork, you'll be able to merge the pull request in the UI. But it's likely that there will be a conflict somewhere, and you'll need to resolve it. At the bottom of the page, click "Use the command line to resolve conflicts", and follow the instructions provided.

## v1.x to v2.0
- If you use the editing UI
  - You'll need to switch to the new editing UI, powered by Decap CMS. You don't need to host your JKAN site on Netlify to do so. Follow the [installation](installation) instructions to setup the OAuth integration.
- If you have custom categories
  - You'll need to convert `_data/categories.yml` into a collection (a directory of files) in the `_dataset_categories` directory. See the [sample categories](/_dataset_categories) for the format. You should delete `_data/categories.yml` afterwards.
- If you have custom licenses
  - We've also changed the structure of `_data/licenses.yml`. If you've customised that file at all, you'll need to update the structure to match the [new format](/_data/licenses.yml) as well.
- If you have customised templates
  - Replace any references to `site.data.categories` with `site.dataset_categories`
  - Replace any references to `site.data.licenses` with `site.data.licenses.items`
- If you host JKAN on GitHub Pages
  - You'll need to switch on GitHub Actions in your repository settings to use the new deployment workflow.
- If you self-host JKAN
  - Be aware that the default `baseurl` setting has been removed from `_config.yml`. You can add this back if you need it, or add `--baseurl "..."` to your build command.
