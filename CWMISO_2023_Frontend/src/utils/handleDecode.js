import jwt_decode from 'jwt-decode'

const useHandleDecode = {
  async DeCodeJWT(token) {
        return typeof token == 'string'
          ? await jwt_decode(token)
          : null;
    },
}

export default useHandleDecode