const HTTPS = (process.env.HTTPS === 'true')
const PROD = (process.env.ENV === 'production')
const SERVER = (HTTPS ? 'https://' : 'http://') + process.env.HOST + (PROD ? '' : ':' + process.env.PORT_SERVER)
const API = SERVER + '/api'

import axios from 'axios'

const getFile = (params) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: API + '/files/analyze',
      params: params
    })
    .then((res) => {
      if (res.status === 200) {
        resolve(res.data)
      }
      else {
        reject('unknown error')
      }
    })
    .catch((error) => {
      if (error.response) {
        reject(error.response.data.message)
      } else if (error.request) {
        reject('no response received')
      } else {
        reject('request failed')
      }
    })
  })
}	

export { getFile }