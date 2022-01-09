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
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
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
    '@nuxtjs/google-fonts'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  router: {
    middleware: ['auth']
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

  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.BASE_URL
    }
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL
    }
  },

  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    transpile: ["vee-validate/dist/rules"],
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
