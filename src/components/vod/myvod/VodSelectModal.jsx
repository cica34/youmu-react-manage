import React from 'react';
import { connectAlita } from 'redux-alita';
import { Modal, Tabs } from 'antd';

import SelectFromVod from './SourceSelectFromVod';
const { TabPane } = Tabs;



class SourceSelectModal extends React.Component {

    handleCancel = () => {
        this.setVisible(false);
    }

    handleOk = () => {

    }

    getAlitaStateDate() {
        const { vod_add_modal } = this.props.alitaState || {};
        const alitaData = vod_add_modal ? vod_add_modal.data : {};
        return alitaData;
    }

    setVisible = (value) => {
        this.props.setAlitaState({
            stateName: "vod_add_modal",
            data: {
                ...this.getAlitaStateDate(),
                visible: value
            }
        })
    }


    render() {
        const alitaData = this.getAlitaStateDate();
        return (
            <div>
                <Modal
                    title="添加条目"
                    visible={alitaData.visible}
                    onOk={() => this.handleOk()}
                    onCancel={() => this.handleCancel()}
                    footer={null}
                    width={"70%"}
                >
                    <Tabs defaultActiveKey="1">
                        {/* <TabPane tab="选择已有直播" key="1">
                            <SelectFromLive></SelectFromLive>
                        </TabPane> */}
                        <TabPane tab="媒体库资源" key="2">
                            <SelectFromVod></SelectFromVod>
                        </TabPane>
                    </Tabs>
                </Modal>
            </div >
        )
    }
}

export default connectAlita()(SourceSelectModal);