import React, { Component } from 'react'
import { Statistic, } from 'antd';
import { VCloudAPI } from 'myaxios/api';
import './style.less';
import { connectAlita } from 'redux-alita';

class HeaderPanel extends Component {

    handleCreateLive(e) {
        console.log('click create button')
        this.props.setAlitaState({
            stateName: 'create_live_modal',
            data: {
                visible: true,
                loading: false
            }
        })
    }

    componentDidMount()
    {
        VCloudAPI.get('/verify/getUnverify/'
        ).then(response => {
            if (response.status === 200) {
                const { code = 0, data = {}, msg = {} } = response.data || {};
                if (code === 200) {
                    console.log('success：', response.data)
                    this.props.setAlitaState({
                        stateName: 'my_certification_list',
                        data: data
                    });
                } 
            } 
        }).catch((e) => {
        })
        VCloudAPI.get('/verify/getVerified/'
        ).then(response => {
            console.log('success：', response.data)
            if (response.status === 200) {
                const { code = 0, data = {}, msg = {} } = response.data || {};
                if (code === 200) {
                    console.log('success：', response.data)
                    this.props.setAlitaState({
                        stateName: 'my_verified_list',
                        data: data
                    });
                } 
            } 
        }).catch((e) => {
        })
    }

    render() {
        const { my_certification_list, my_verified_list} = this.props.alitaState;
        var count1 = -1;
        var count2 = -1;
        if (my_certification_list) {
            if(my_certification_list.data)
            count1 = my_certification_list.data.length;
            else count1=0;
            console.log('header_1',my_certification_list);
        }
        if (my_verified_list) {
            if(my_verified_list.data)
            count2 = my_verified_list.data.length;
            else count2=0;
            console.log('header_2',my_verified_list);
        }
        console.log('alitastate in panel', this.props.alitaState)
        return (
            <div className="header-panel">
                <Statistic className="current-number" title="待审核数目" value={count1==-1?"获取中...":count1} />
                <Statistic className="current-number" title="已审核数目" value={count2==-1?"获取中...":count2} />
            </div>
        )
    }
}

export default connectAlita()(HeaderPanel);