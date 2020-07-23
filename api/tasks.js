import assert from 'assert'
import axios from 'axios'

assert.ok(process.env.TASK_API, 'env.TASK_API not defined!')

export default { add }

function add (alert, cPoint) {
  const data = {
    message: `vymen vodomer s id: ${cPoint.id}`
  }
  return axios.post(process.env.TASK_API, data)
    .catch(err => console.error(err))
}
