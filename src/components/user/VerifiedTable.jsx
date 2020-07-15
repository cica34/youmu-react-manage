import { Table,  message } from 'antd'
import React from 'react';
import { connectAlita } from 'redux-alita';
import { VCloudAPI } from 'myaxios/api';
import { withRouter } from 'react-router-dom';
import { checkUserInfo } from 'myutils/UserUtils';

class VerifiedTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            selectedRecord: {} //操作的record
        }
        
        this.handleView = this.handleView.bind(this);

        this.columns = [
            {
                title: '审核单号id',
                dataIndex: 'id',
                align: 'center',
                render: (text) => { return text }
            }, {
                title: '状态',
                dataIndex: 'state',
                align: 'center',
                render: (value) => {
                    switch (value) {
                        case 0:
                            return '未提交';
                        case 1:
                            return '待审核';
                        
                        case 2:
                            return '已通过';
                        case 3:
                            return '未通过';
                        default: return '未知'
                    }
                }
            }, {
                title: '认证类型',
                dataIndex: 'type',
                align: 'center',
                render: (value) => {
                    switch (value) {
                        case 0:
                            return '公司认证';
                        case 1:
                            return '个人认证';
                        default: return '未知'
                    }
                }
            }, {
                title: '待认证账号',
                dataIndex: 'uname',
                align: 'center',
                render: (text) => { return text }
            }, {
                title: '姓名/企业名称',
                dataIndex: 'name',
                align: 'center',
                render: (text) => { return text }
            }, {
                title: '认证提交时间',
                dataIndex: 'time',
                align: 'center',
                render: (text) => { return text }
            }, {
                title: '操作',
                dataIndex: 'operation',
                align: 'center',
                render: (text, record) =>
                    <div className="operation-item">
                        <a className="live-link" href="http://" onClick={(e) => this.handleView(e, record)}>查看详细信息</a>
                    </div>
            },
        ]
    }

    handleView(e, record)
    {
        this.props.setAlitaState({
            stateName: 'show_info',
            data: {
                visible: true,
                loading: true
            }
        })
        e.preventDefault();
        var passData={};
        VCloudAPI.get('/verify/getCertInfo/?id=' + record.id+'&type='+record.type
        ).then(response => {
            console.log('success：', response.data)
            if (response.status === 200) {
                const { code = 0, data = {}, msg = {} } = response.data || {};
                if (code === 200) {
                    passData = data;
                } else {
                    message.error('获取详细信息失败!');
                }
            } else {
                message.error('获取详细信息失败!');
            }
        }).catch((e) => {
            message.error('获取详细信息失败!');
        }).finally(() => {
            this.props.setAlitaState({
                stateName: 'show_info',
                data: {
                    visible: true,
                    loading: false,
                    verifyData: passData
                }
            })
        })

        
    }

    componentDidMount() {
        if (!checkUserInfo(this.props.history)) {
            return;
        }
        this.setState({
            isLoading: true
        })
        VCloudAPI.get('/verify/getVerified/'
        ).then(response => {
            console.log('success：', response.data)
            if (response.status === 200) {
                const { code = 0, data = {}, msg = {} } = response.data || {};
                if (code === 200) {
                    this.props.setAlitaState({
                        stateName: 'my_verified_list',
                        data: data
                    });
                } else {
                    message.error('获取待审核列表失败!');
                }
            } else {
                message.error('获取待审核列表失败!');
            }
        }).catch((e) => {
            message.error('获取待审核列表失败!');
        }).finally(() => {
            this.setState({
                isLoading: false
            })
        })
    }

    render() {
        const { my_verified_list } = this.props.alitaState;
        var { data = [] } = my_verified_list || {};
        return (
            <div>
                <Table
                    loading={this.state.isLoading}
                    dataSource={data}
                    columns={this.columns}id
                    bordered
                    size="large"
                    rowKey="id"
                />
            </div>
        );
    }
}

export default connectAlita()(withRouter(VerifiedTable));