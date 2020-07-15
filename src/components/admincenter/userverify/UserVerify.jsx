import { Tabs, message, Select } from 'antd';
import React from 'react';
import { connectAlita } from 'redux-alita';
import { withRouter } from 'react-router-dom';
import { VCloudAPI } from 'myaxios/api';
import { getLocalStorage } from 'myutils/index';
import { checkUserInfo } from 'myutils/UserUtils';
import BreadcrumbCustom from 'mycomponents/BreadcrumbCustom';
import FactoryVerify from './FactoryVerify';
import IndividualVerify from './IndividualVerify';

const { TabPane } = Tabs;
const { Option, OptGroup } = Select;

class UserVerify extends React.Component {
    constructor(props) {
        super(props)
        this.Change = this.Change.bind(this);
    }

    state = {
        check: false,
    };

    componentDidMount() {
        if (!checkUserInfo(this.props.history)) {//检查用户信息是否完整
            return;
        }
        const rid = this.props.match.params.rid;
        const user = getLocalStorage('user');
        console.log(rid)
        VCloudAPI.get('/com/' + user.cid + '/certification/personal/?aid=' + user.aid, {

        }).then(response => {
            if (response.status === 200) {
                const { code = 0, data = {}, msg = {} } = response.data || {};
                console.log(data)
                if (code === 200) {
                    this.props.setAlitaState({
                        stateName: 'ind_info',
                        data: data
                    });
                } else {
                    
                }
            } else {
                message.error('网络请求失败！')
            }
        }).catch(r => {
        })
        VCloudAPI.get("/com/" + user.cid + '/certification/company/', {

        }).then(response => {
            if (response.status === 200) {
                const { code = 0, data = {}, msg = {} } = response.data || {};
                console.log('find',data)
                if (code === 200) {
                    // 向用户直播列表中添加一个记录
    
                    this.props.setAlitaState({
                        stateName: 'fac_info',
                        data: data
                    });

                } else {
                    
                }
            } else {
                message.error('网络请求失败！')
            }
        }).catch(r => {
        })
        
        const { ind_info = {} } = this.props.alitaState || {};
        const indinfo = ind_info.data || {}
        const INDInfo = indinfo.pers_cert_info || {}
        const { fac_info = {} } = this.props.alitaState || {};
        const facinfo = fac_info.data || {}
        const FACInfo = facinfo.comp_cert_info || {}
        if(FACInfo.state > 0){
            this.setState({ check: false });
        }
        if(INDInfo.state > 0){
            this.setState({ check: true });
        }
        console.log("check",this.state.check);
    }

    Change(value) {
        console.log(`selected ${value}`);
        if(value == '公司认证')
        this.setState({ check: false });
        else
        this.setState({ check: true });
    }

    render() {

        return (
            <div>
                
            <BreadcrumbCustom first="用户中心" second="用户认证" />
            
                <Select defaultValue="公司认证" style={{ width: 200 }} onChange={this.Change}>
                    <Option value="公司认证">公司认证</Option>
                    <Option value="个人认证">个人认证</Option>
                </Select>
                <div>
                    {
                        this.state.check?
                        <IndividualVerify></IndividualVerify>
                        :
                        <FactoryVerify></FactoryVerify>
                    }
                </div>
            </div>   
        );
    }
}
export default withRouter(connectAlita()(UserVerify));

