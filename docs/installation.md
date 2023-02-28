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

### Running on GitHub Pages (or self-hosting)
Before you start, make sure you have a [GitHub][github-signup] account.

1. Create your own copy of JKAN by clicking [fork][jkan-fork]

GitHub will automatically deploy your JKAN site. You can find its URL and set a custom domain by going to **Settings**, then **Pages** on your forked repository.

If you're happy to build your JKAN site by editing YAML files directly, you're finished! If you'd like to use JKAN's Editing UI, you'll need a couple more steps. In order to let your site's users sign in with their GitHub account, you'll need to register an OAuth application with GitHub, and then run a tiny OAuth server to handle the sign in process. There are [plenty of options][oauth-server-list], but we'll use one that runs on Vercel's free tier, so make sure you have a [Vercel][vercel-signup] account before you start.

2. [Register an OAuth application][github-new-oauth] on GitHub

> - Application name: Whatever your site will be called (e.g. JKAN)
> - Homepage URL: The URL of your site, e.g. `https://username.github.io/jkan` or your custom domain
> - Application description: Whatever you like - users will see this when they sign in to your JKAN site
> - Authorization callback URL: `https://github.com` (Note: This is a temporary value - we'll come back and change this)

3. On the next page, take note of the **Client ID**, as you'll need that in a moment.
4. Under the **Client secrets** header, click **Generate a new client secret**. You'll need this in a moment as well, but be careful where you copy and paste it because it should be _treated like a password_.
5. In a new browser tab, navigate to the OAuth server repository we'll be deploying, [ublabs/netlify-cms-auth][oauth-server], and click the big blue **Deploy** button.
6. In Vercel's **Get Started** section, click the **GitHub** button. Vercel will then want to copy the repository to your GitHub account, and ask you to name the repository. Fill in a name, e.g. `netlify-cms-oauth`.
7. In the next section, copy your **Client ID** from an earlier step into the box next to `OAUTH_GITHUB_CLIENT_ID`, and copy your **Client Secret** into `OAUTH_GITHUB_CLIENT_SECRET`.
8. The other two boxes are not relevant, but they're required to have a value, so enter any value into them, such as what you had for breakfast this morning, then click **Deploy**.
9. Once your server is deployed, click on the image preview of the site to navigate to it, and make a note of the URL.
10. Back in the tab with your [GitHub OAuth application][github-oauth-list], edit your app and change the `Authorization callback URL` to your vercel app URL.
11. In your JKAN repository, edit the file `editor/decap-cms.yml` to add `base_url: <your vercel app url>` under the `backend` section:

```yaml
backend:
  name: github
  base_url: https://your-netlify-cms-oauth-app.vercel.app
```

11. Click **Commit changes** (directly to the branch)

You should now be able to sign in to your JKAN site's Editor UI by going to `/editor`, and signing in with your GitHub account.

[github-signup]: https://github.com/signup
[netlify-signup]: https://app.netlify.com/signup
[vercel-signup]: https://vercel.com/signup
[netlify-new-site]: https://app.netlify.com/start
[jkan-fork]: https://github.com/timwis/jkan/fork
[github-new-oauth]: https://github.com/settings/applications/new
[github-oauth-list]: https://github.com/settings/developers
[oauth-server-list]: https://decapcms.org/docs/external-oauth-clients/
[oauth-server]: https://github.com/ublabs/netlify-cms-oauth
[oauth-server-fork]: https://github.com/ublabs/netlify-cms-oauth/fork

