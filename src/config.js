const config = {}

// PUT body position
// const body = {
//   pid: this.props.pid,
//   deal: this.state.deal,
//   deal_index: this.props.index,
// }


if (window.apiConfig) {
  config.api = {
    position: window.apiConfig.position,
    deal: window.apiConfig.deal
  }
} else if (process.env.NODE_ENV === 'production') {
  config.api = {
    position: '/api/position',
    deal: '/api/position/deal',
  }
} else {
  config.api = {
    position: 'http://127.0.0.1:3001/api/position',
    deal: 'http://127.0.0.1:3001/api/position/deal',
  }
}

export const { api } = config
