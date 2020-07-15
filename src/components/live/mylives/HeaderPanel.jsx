import React, { Component } from 'react'
import { Button, Statistic,message } from 'antd';
import './style.less';
import { connectAlita } from 'redux-alita';
import { joinSafe } from 'upath';
import { VCloudAPI } from '../../../axios/api';
import { getLocalStorage } from '../../../utils/index';
import { checkUserInfo } from '../../../utils/UserUtils';


var i = 0;
class HeaderPanel extends Component {
    componentDidMount(){
        if (!checkUserInfo(this.props.history)) {//检查用户信息是否完整
            return;
        }
        const user = getLocalStorage('user'); 
        VCloudAPI.get("/com/" + user.cid + '/certification/company/', {

        }).then(response => {
            if (response.status === 200) {
                const { code = 0, data = {}, msg = {} } = response.data || {};
                console.log('find',data)
                if (code === 200) {
                    // 向用户直播列表中添加一个记录
                    message.success('成功获取用户信息')
                    this.props.setAlitaState({
                        stateName: 'fac_info',
                        data: data
                    });
                    const { fac_info = {} } = this.props.alitaState || {};
                    const userinfo = fac_info.data || {}
                    const userInfo = userinfo.comp_cert_info || {}
                    if(userInfo.state === 2){
                        i = 1;
                    }
                } else {
                    i = 0;
                }
            } else {
                message.error('网络请求失败！')
            }
        }).catch(r => {
        })
        VCloudAPI.get("/com/" + user.cid + '/certification/personal/?aid=' + user.aid, {

        }).then(response => {
            if (response.status === 200) {
                const { code = 0, data = {}, msg = {} } = response.data || {};
                console.log('find',data)
                if (code === 200) {
                    // 向用户直播列表中添加一个记录
        
                    this.props.setAlitaState({
                        stateName: 'ind_info',
                        data: data
                    });
                    const { ind_info = {} } = this.props.alitaState || {};
                    const userinfo = ind_info.data || {}
                    const userInfo = userinfo.pers_cert_info || {}
                    if(userInfo.state === 2){
                        i = 1;
                    }
                } else {
                    if(i === 1){
                        i = 1;
                    }else{
                        i = 0;
                    }
                }
            } else {
                message.error('网络请求失败！')
            }
        }).catch(r => {
        })
    }

    handleCreateLive(e) {
        if(i === 1){
        console.log('click create button')
        this.props.setAlitaState({
            stateName: 'create_live_modal',
            data: {
                visible: true,
                loading: false
            }
        })}
        else{
            message.error('抱歉，请您先进行实名认证')
        }
    }

    render() {
        const { my_live_list } = this.props.alitaState;
        var { data = [] } = my_live_list || {};
        var count = 0;
        if (data) {
            count = data.length;
        }
        console.log('alitastate in panel', this.props.alitaState)
        return (
            <div className="header-panel">
                {/* <Statistic className="total-number" title="总频道数" value={20} /> */}
                <Statistic className="current-number" title="当前数目" value={count} />
                <Button className="create-button" type="primary"
                    onClick={(e) => this.handleCreateLive(this)}
                >创建直播</Button>
            </div>
        )
    }
}

export default connectAlita()(HeaderPanel);