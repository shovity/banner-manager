const config = {}

if (process.env.NODE_ENV === 'production') {
  config.api = {
    position: '/api/position',
    deal: '/api/position/deal',
    uploads: '/api/uploads/',
    base: ''
  }
} else {
  config.api = {
    position: 'http://127.0.0.1:3001/api/position',
    deal: 'http://127.0.0.1:3001/api/position/deal',
    uploads: 'http://127.0.0.1:3001/api/uploads/',
    base: 'http://127.0.0.1:3001'
  }
}

export const { api } = config
