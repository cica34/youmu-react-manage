import axios from 'axios';
import { message } from 'antd';
import history from '../routes/history';

//视频云后端接口
export const VCloudAPI = createVCloudAPI();

function createVCloudAPI() {
    var Axios = axios.create({
        baseURL: "http://114.116.180.115:9000/",
        // baseURL: "http://10.128.231.75:9000/",

        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    });
    // 添加请求拦截器
    Axios.interceptors.request.use(function (config) {
        // 在发送请求之前做些什么
        // 向头部添加session-id
        const session_id = window.localStorage.getItem('session_id');
        if (session_id) {
            config.headers['X-Session-Id'] = session_id;
        }
        return config;
    }, function (error) {
        // 对请求错误做些什么
        message.error("网络失败,请稍后重试");
        return Promise.reject(error);
    });
    // 添加响应拦截器
    Axios.interceptors.response.use(function (response) {
        // 对响应数据做点什么
        if (response.status === 200) {
            const { data } = response;
            if (data.code === 401) {
                // 携带参数redirect,表明从哪个界面跳转到登录界面
                window.localStorage.removeItem('session_id');
                window.localStorage.removeItem('user');
                history.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
            }
            return response;
        } else {
            message.error("请求失败，状态码：" + response.status);
        }
    }, function (error) {
        // 对响应错误做点什么
        message.error("网络失败,请稍后重试");
        return Promise.reject(error);
    });
    return Axios;
}


/**
 *  YAPI Mock 开发测试接口
 *  注意，仅在后端接口未完成的时候，临时开发测试使用
 *  后端开发完成之后，需要切换到VCloudApi并与后端进行联调。
 */
export const YMOCKAPI = axios.create({
    baseURL: 'http://114.116.180.115:3001/mock/11',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
})

export const TESTJYLAPI = axios.create({
    baseURL: 'http://114.116.180.115:9000/',
    // baseURL: 'http://192.168.137.140:9000/',
    headers: {
        'Content-Type': 'application/json',
    }
})

export const MediaAPI = axios.create({
    baseURL: 'http://39.106.194.43:3000/',
    headers: {
        'Content-Type': 'application/json',
    }
})
