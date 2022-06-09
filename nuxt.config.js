export default {
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',

  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: 'Favor Solutions Network',
    titleTemplate: '%s | Favor App',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Favor Solutions Network web app for exchanging Favor' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
    bodyAttrs: {
      class: process.env.NODE_ENV === 'dev' || process.env.STAGE ? 'development' : 'production',
    }
  },

  /*
  ** Global CSS
  */
  css: [
    '~assets/css/tailwind.scss',
  ],

  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    '@/plugins/global.js',
    '@/plugins/vee-validate'
  ],

  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,

  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module', // this stupid thing keeps throwing errors
    // see https://tailwindcss.nuxtjs.org/
    '@nuxtjs/tailwindcss',
    // see: https://google-fonts.nuxtjs.org/
    '@nuxtjs/google-fonts',
    // see: https://pwa.nuxtjs.org/
    '@nuxtjs/pwa',
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
  ],

  router: {
    middleware: ['auth','load']
  },

  auth: {
    strategies: {
      local: {
        token: {
          property: 'data.access_token',
          global: true,
          // required: true,
          // type: 'Bearer'
        },
        user: {
          property: 'data',
          // autoFetch: true
        },
        endpoints: {
          login: { url: '/api/auth', method: 'post' },
          logout: false,
          user: { url: '/api/auth/me', method: 'get' }
        }
      }
    },
    redirect: {
      login: '/login',
      logout: '/login',
      callback: '/login',
      home: '/'
    }
  },

  pwa: {
    meta: {
      theme_color: '#601d46',
    },
    manifest: {
      background_color: "#601d46",
      short_name: "Favor",
      name: "Favor Solutions Network Exchange",
      description: "Make your own money with Favor",
      start_url: '/',
      lang: 'en',
      display: 'standalone',
    },
    workbox: {
      enabled: true,
    }
  },

  /*
  ** Server Middleware
  */
  serverMiddleware: {
    '/api': '~/api'
  },

  /*
  ** For deployment you might want to edit host and port
  */
  // server: {
  //  port: 8000, // default: 3000
  //  host: '0.0.0.0' // default: localhost
  // },

  // config for server and client
  publicRuntimeConfig:
    process.env.NODE_ENV === 'dev'
    ? { // dev env
        axios: {
          baseURL: process.env.LOCAL_URL
        }
      }
    : { // production env
        axios: {
          baseURL: process.env.BASE_URL
        }
      },
  
  // config for server only
  privateRuntimeConfig:
    process.env.NODE_ENV === 'dev'
    ? { // dev env
      }
    : { // production env
      },

  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    transpile: ["vee-validate/dist/rules"],
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }
    }
  },

  // Cormorant+SC:300,700
  // Cormorant+Upright:400,700
  // Montserrat:300,300i,600,600i,900,900
  // https://fonts.googleapis.com/css?family=Cormorant+SC:300,700|Cormorant+Upright:400,700|Montserrat:300,300i,600,600i,900,900i&display=swap
  // https://fonts.googleapis.com/css2?family=Cormorant+SC:wght@300&family=Cormorant+Upright:wght@400;700&family=Montserrat:wght@300;300i;600;600i;900;900i
  googleFonts: {
    families: {
      'Cormorant+SC': [300],
      'Cormorant+Upright': [400,700],
      'Montserrat': {
        ital: [300, 600, 700], 
        wght: [300, 600, 700]
      },
    }
  }
}
