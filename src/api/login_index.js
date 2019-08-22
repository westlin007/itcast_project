// 引入封装好的axios
import axios from '@/utils/myaxios.js'

export const login = (data) => {
  return axios({
    url: 'login',
    method: 'post',
    data
  })
}
