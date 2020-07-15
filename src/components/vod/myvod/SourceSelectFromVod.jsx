import React from 'react';
import { connectAlita } from 'redux-alita';
import { VCloudAPI } from 'myaxios/api';
import { getLocalStorage } from 'myutils/index';
import { checkUserInfo } from 'myutils/UserUtils';
import { Table, message,Select } from 'antd'
const { Option } = Select;
class SourceSelectFromVod extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            selectedRecord: {} //操作的record
        }
        this.handleOk = this.handleOk.bind(this);
        this.columns = [
            {
                title: '文件id',
                dataIndex: 'media_id',
                align: 'center',
                render: (text) => { return text }
            },
            {
                title: '视频文件名',
                dataIndex: 'media_name',
                align: 'center',
                render: (text) => { return text }
            },
            {
                title: '视频文件类型',
                dataIndex: 'media_type',
                align: 'center',
                render: (text) => { return text }
            },
            {
                title: '视频文件缩略图',
                dataIndex: 'pic_url',
                align: 'center',
                render: pic_url => { 
                    if(pic_url)
                    return <span><img src={pic_url} alt="avatar" style={{ width: '80px',height: '50px' }} /></span>
                }
                
            },
            {
                title: '视频文件大小',
                dataIndex: 'size',
                align: 'center',
                render: (text) => { return text }
            }, {
                title: '创建者',
                dataIndex: 'creator_name',
                align: 'center',
                render: (text) => { return text }
            },
            
            {
                title: '创建时间',
                dataIndex: 'create_time',
                align: 'center',
                render: (text) => { return text }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                align: 'center',
                render: (text, record) =>
                    <div className="operation-item">
                        <a className="source-link" href="http://" onClick={(e) => this.handleOk(e, record)}>选择</a>
                    </div>
            }
        ];
    }
    componentDidMount() {
        if (!checkUserInfo(this.props.history)) {
            return;
        }
        var user = getLocalStorage('user');
        this.setState({
            isLoading: true
        })

        VCloudAPI.get("/com/" + user.cid + '/media_lib/get/'
        ).then(response => {
            console.log('success：', response)
            
            if (response.status === 200) {
                const { code, data = {}, msg = {} } = response.data || {};
                console.log("ddata",data)
                if (code === 200) {
                    this.props.setAlitaState({
                        stateName: 'my_source_list',
                        data: data
                    });
                } else {
                    message.error('获取资源列表失败!');
                }
            } else {
                message.error('获取资源列表失败!');
            }
        }).catch((e) => {
            message.error('获取资源列表失败!');
        }).finally(() => {
            this.setState({
                isLoading: false
            })
        })
    }
    handleOk = (e, record) => {
        e.preventDefault();
        console.log('record', record);
        if (!checkUserInfo(this.props.history)) {
            return;
        }
        this.props.setAlitaState({
            stateName: 'vod_select_info',
            data: record
        });
        this.props.setAlitaState({
            stateName: 'vod_add_modal',
            data: {
                visible: false,
                loading: false
            }
        })
    }
    handleAll(){
        if (!checkUserInfo(this.props.history)) {
            return;
        }
        var user = getLocalStorage('user');
        this.setState({
            isLoading: true
        })
        VCloudAPI.get("/com/" + user.cid + '/media_lib/get/'
        ).then(response => {
            console.log('success：', response)
            
            if (response.status === 200) {
                const { code, data = {}, msg = {} } = response.data || {};
                console.log("ddata",data)
                if (code === 200) {
                    this.props.setAlitaState({
                        stateName: 'my_source_list',
                        data: data
                    });
                } else {
                    message.error('获取资源列表失败!');
                }
            } else {
                message.error('获取资源列表失败!');
            }
        }).catch((e) => {
            message.error('获取资源列表失败!');
        }).finally(() => {
            this.setState({
                isLoading: false
            })
        }) 
    }
    handleType(){
        if (!checkUserInfo(this.props.history)) {
            return;
        }
        var user = getLocalStorage('user');
        this.setState({
            isLoading: true
        })
        ///com/:cid/media_lib/get/stype/?mtype=
        VCloudAPI.get("/com/" + user.cid + '/media_lib/get/stype/?mtype=video'
        ).then(response => {
            console.log('success：', response)
            
            if (response.status === 200) {
                const { code, data = {}, msg = {} } = response.data || {};
                console.log("ddata",data)
                if (code === 200) {
                    this.props.setAlitaState({
                        stateName: 'my_source_list',
                        data: data
                    });
                } else {
                    message.error('获取资源列表失败!');
                }
            } else {
                message.error('获取资源列表失败!');
            }
        }).catch((e) => {
            message.error('获取资源列表失败!');
        }).finally(() => {
            this.setState({
                isLoading: false
            })
        }) 
    }
    handle3D(){
        if (!checkUserInfo(this.props.history)) {
            return;
        }
        var user = getLocalStorage('user');
        this.setState({
            isLoading: true
        })
        VCloudAPI.get("/com/" + user.cid + '/media_lib/get/3d_type/?is_3d=1'
        ).then(response => {
            console.log('success：', response)
            
            if (response.status === 200) {
                const { code, data = {}, msg = {} } = response.data || {};
                console.log("ddata",data)
                if (code === 200) {
                    this.props.setAlitaState({
                        stateName: 'my_source_list',
                        data: data
                    });
                } else {
                    message.error('获取资源列表失败!');
                }
            } else {
                message.error('获取资源列表失败!');
            }
        }).catch((e) => {
            message.error('获取资源列表失败!');
        }).finally(() => {
            this.setState({
                isLoading: false
            })
        }) 
    }
    handleBoth(){
        if (!checkUserInfo(this.props.history)) {
            return;
        }
        var user = getLocalStorage('user');
        this.setState({
            isLoading: true
        })
        VCloudAPI.get("/com/" + user.cid + '/media_lib/get/ctype/?mtype=video&is_3d=1'
        ).then(response => {
            console.log('success：', response)
            
            if (response.status === 200) {
                const { code, data = {}, msg = {} } = response.data || {};
                console.log("ddata",data)
                if (code === 200) {
                    this.props.setAlitaState({
                        stateName: 'my_source_list',
                        data: data
                    });
                } else {
                    message.error('获取资源列表失败!');
                }
            } else {
                message.error('获取资源列表失败!');
            }
        }).catch((e) => {
            message.error('获取资源列表失败!');
        }).finally(() => {
            this.setState({
                isLoading: false
            })
        }) 
    }
                
    render() {
        const { my_source_list } = this.props.alitaState;
        var { data = [] } = my_source_list || {};
        return (
            <div> 
                &nbsp;&nbsp;筛选指定类型的资源：&nbsp;&nbsp;
                <Select placeholder="不限" style={{ width: 180 }}>
                                    <Option value={1} onClick={(e) => this.handleAll(this)}>不限</Option>
                                    <Option value={2} onClick={(e) => this.handleType(this)}>仅筛选类型</Option>
                                    <Option value={3} onClick={(e) => this.handle3D(this)}>仅筛选3d</Option>
                                    <Option value={4} onClick={(e) => this.handleBoth(this)}>同时筛选3d和类型</Option>
                </Select>
                <br/>
                <br/>
                <Table
                    dataSource={data}
                    columns={this.columns}
                    bordered
                    size="large"
                    rowKey="lid"
                />
            </div>
        );
    }

}

export default connectAlita()(SourceSelectFromVod);