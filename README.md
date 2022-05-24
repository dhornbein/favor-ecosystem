# Favor Solutions Network Serverless API - Auth - Operations

This is the main API and webapp for the [Favors Solutions Network](https://favor.solutions/).

# Development

This project uses [Nuxt.js](https://nuxtjs.org/) and [Vue.js](https://vuejs.org/) for the frontend and the API.

## Getting Started

Clone the repo and run `npm install` to install the dependencies.

### ENV setup

You'll need to configure a `.env` file with the following variables:

```
LOCAL_URL= # local url for the API, e.g. http://localhost:3000
BASE_URL= # a base url for running the app using dev:host, e.g. http://172.31.229.43:3000

# Google spreadsheet id
SPREADSHEET_ID= # the id of the google spreadsheet used as the database (i know)

# JSON Web Token salt secrets
JWT_AUTH_SECRET= # the secret salt used to sign the JWT used in authentication (JSON Web Token)
JWT_INVITE_SECRET= # the secret salt used to sign the JWT used in inviting users

# Google Service Account details
# see https://developers.google.com/identity/protocols/oauth2/service-account
# This is for connecting to the spreadsheet
GOOGLE_PROJECT_ID=
GOOGLE_PRIVATE_KEY_ID=
GOOGLE_PRIVATE_KEY=
GOOGLE_CLIENT_EMAIL=
GOOGLE_CLIENT_ID=
```

a example env file can be found in the repo (`/example.env`).
### NPM Commands

| Command             | Description                                                                                                                               |
| -------------       | ----------------------------------------------------------------------------------------------------------------------------------------- |
| npm run dev         | Start ExpressJS server in development with Nuxt.js in dev mode (hot reloading). Listen on [http://localhost:3000](http://localhost:3000). |
| npm run dev:host    | Same as dev, but exposes app at a URL in case you need that for accessing on the local Network                                            |
| npm run build       | Build the nuxt.js web application for production.                                                                                         |
| npm start           | Start ExpressJS server in production.                                                                                                     |
| npm start:host      | Start ExpressJS server in production at a local IP addess.                                                                                |

Once you're ready do run the website use `npm run dev` to start the server. Then navigate to the localhost:3000 address to see the website.

## Web App Structure

Let's take a look at how the web app is structured. You can get more in-depth details about [NUXT in general from their documentation](https://nuxtjs.org/docs/get-started/directory-structure).

- `/nuxt.config.js` - Nuxt configuration file.
- `/api` - code handling the API endpoints. Check out the schema at `/api/favor-solutions-network-api.json`. We use a model, view, controller pattern.
- `/assets` - un-compiled assets.
- `/components` - Vue components.
- `/layouts` - Vue layouts.
- `/middleware` - Application middleware. Middleware lets you define custom functions that can be run before rendering either a page or a group of pages (layout).
- `/pages` - Vue pages, this is where most of the action happens.
- `/plugins` - Vue plugins.
- `/static` - Static assets.
- `/store` - Vuex store. This is where global data is managed.

### Tailwind CSS

We use the [Tailwind CSS](https://tailwindcss.com/) framework to style the web app. It uses utility classes to apply css styles. It's weird at first but really powerful once you get used to it.

You'll notice lots of classes like `.text-gray-600` and `.bg-gray-100` which apply css styles to the text and background.

You'll also notice the use of `@apply` within style sheets. This is a method to apply Tailwind CSS classes to an element in SCSS.

In the rare event that you need to write custom global styles you can add them to `/assets/scss/tailwind.scss`.

## Licenses

- [ExpressJS license](https://github.com/expressjs/express/blob/master/LICENSE)
- [NuxtJS license](https://github.com/nuxt/nuxt.js/blob/master/LICENSE.md)
- [VueJS license](https://github.com/vuejs/vue/blob/master/LICENSE)
