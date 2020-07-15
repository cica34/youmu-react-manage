import React, { Component } from 'react'
import { Button, Statistic,Col,Row } from 'antd';
import './style.less';
import { connectAlita } from 'redux-alita';
import SelectModal from './VodSelectModal';

/**
 * 我的点播页面头部展示信息,包括当前点播数目和创建点播按钮
 */

class HeaderPanel extends Component {


    handleCreateLive(e) {
        console.log('click create button')
        this.props.setAlitaState({
            stateName: 'create_vod_modal',
            data: {
                visible: true,
                loading: false
            }
        })
    }

    render() {
        const { vod_list_content = {} } = this.props.alitaState || {};
        const { data = {} } = vod_list_content || {}
        const { videoInfo } = data;
        const count = videoInfo ? videoInfo.length : 0;//获取当前点播数目
        return (
            <div className="header-panel">
                <Statistic className="current-number" title="当前数目" value={count} />
                <Button  type="primary"
                    onClick={(e) => this.handleCreateLive(this)}
                >创建点播</Button>
               {/* <div>
                <SelectModal/></div> */}
                </div>
 
       
             
            
        )
    }
}

export default connectAlita()(HeaderPanel);