import axios from 'axios'
const url = 'https://api-sao.onrender.com/'
const AppConfig = {
  async CallNotAuth(api, methods, model) {
    let CallApi = await axios({
      method: methods,
      url: url + api,
      headers: {
        'Content-Type': 'application/json'
      },
      data: model
    })
    return CallApi
  },
  async CallAnouther(api, methods, model) {
    let CallApi = await axios({
      method: methods,
      url: api,
      headers: {
        'Content-Type': 'application/json'
      },
      data: model
    })
    return CallApi
  },
  async CallAuth(api, methods, model, token) {
    if (methods != "DELETE") {
      try {
        let CallApi = await axios({
          method: methods,
          url: url + api,
          headers: {
            'Content-Type': 'application/json',
            'token': token
          },
          data: model
        })
        return CallApi
      } catch {
        let CallApi = await axios({
          method: methods,
          url: url + api,
          headers: {
            'token': token
          },
          data: model
        })
        return CallApi
      }
    } else {
      
      let CallApi = await axios({
        method: methods,
        url: url + api,
        headers: {
          // 'accept': 'application/json',
          'token': token
        },
        data: model
      })
      return CallApi
    }
  }
}

export default AppConfig
