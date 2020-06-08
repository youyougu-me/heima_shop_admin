import { Message } from 'element-ui'
export default {
    install(Vue, options) {
        //这个params是个对象,里面有很多东西
        Vue.prototype.$message2 = (type, message, duration) => {
            Message({
                showClose: true,
                type: type || 'success',
                message: message || 'ok',
                duration: duration || 1000
            })

        }

    }
}