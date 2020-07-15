import { Table,  message, Button } from 'antd'
import React from 'react';
import { connectAlita } from 'redux-alita';
import { VCloudAPI } from 'myaxios/api';
import { withRouter } from 'react-router-dom';
import { checkUserInfo } from 'myutils/UserUtils';

const fafDataPers=
{
    pers_cert_info:{
    aid:'faf',
    name:'faf',
    pid:'faf',
    picture: ['http://a.jpg','https://www.baidu.com/img/bd_logo1.png','fafff'],
    note:'faf',
    time:'faf',
    }
};

const fafDataComp=
{
    comp_cert_info:{
    cid:'faf',
    email:'faf',
    name:'faf',
    license_number:'faf',
    license_pic_url:'faf',
    address:'faf',
    website:'faf',
    note:'faf',
    time:'faf',
    }
};

class UserTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            selectedRecord: {} //操作的record
        }
        
        this.handleCertification = this.handleCertification.bind(this);

        this.columns = [
            {
                title: '审核单号id',
                dataIndex: 'id',
                align: 'center',
                render: (text) => { return text }
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
                        <a className="live-link" href="http://" onClick={(e) => this.handleCertification(e, record)}>进行审核</a>
                    </div>
            },
        ]
    }

    handleCertification(e, record)
    {
        this.props.setAlitaState({
            stateName: 'do_verify',
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
                stateName: 'do_verify',
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
        VCloudAPI.get('/verify/getUnverify/'
        ).then(response => {
            console.log('success：', response.data)
            if (response.status === 200) {
                const { code = 0, data = {}, msg = {} } = response.data || {};
                if (code === 200) {
                    console.log('success：', response.data)
                    this.props.setAlitaState({
                        stateName: 'my_certification_list',
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
        const { my_certification_list } = this.props.alitaState;
        var { data = [] } = my_certification_list || {};
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
                {/*<Button
                    onClick={() => {
                        this.props.setAlitaState({
                            stateName: 'do_verify',
                            data: {
                                visible: true,
                                loading: false,
                                verifyData: fafDataPers
                            }
                        })
                    }}
                >FakePers</Button> 
                <Button
                    onClick={() => {
                        this.props.setAlitaState({
                            stateName: 'do_verify',
                            data: {
                                visible: true,
                                loading: false,
                                verifyData: fafDataComp
                            }
                        })
                    }}
                >FakeComp</Button> */}
            </div>
        );
    }
}

export default connectAlita()(withRouter(UserTable));