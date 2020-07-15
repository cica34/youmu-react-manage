import { Table, Divider, message, Dropdown, Menu, Icon, Popconfirm } from 'antd';
import React from 'react';
import { connectAlita } from 'redux-alita';
import { VCloudAPI } from 'myaxios/api';
import { withRouter, link } from 'react-router-dom';
import { checkUserInfo } from 'myutils/UserUtils';
import { getLocalStorage } from 'myutils/index';
import './style.less';


class UserAdminTable extends React.Component{


    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            SelectedRecord: {}
        }

        this.columns = [
            {
                title: '注册邮箱',
                dataIndex: 'mail',
                align: 'center',
                render: (text) =>  {return text}
            },
            {
                title: '主管理员id',
                dataIndex: 'mid',
                align: 'center',
                render: (text) => {return text}
            },
            {
                title: '注册手机号',
                dataIndex: 'phone',
                align: 'center',
                render: (text) => {return text}
            },

            {
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            render: (text, record) =>
            <div className="operation-item">
                <Dropdown className="account-link" onClick={(e) => this.handleDropdownClick(e, record)} overlay={this.menu} trigger={['click']}>
                    <a className="ant-dropdown-link" href="#">
                        更多<Icon type="down" />
                    </a>
                </Dropdown>
            </div>
            },
        ]
        this.menu = (
            <Menu className="account-link" >
                <Menu.Item>
                    <a className="account-link" onClick={(e,record) => this.handleViewAdmin(e, record)}>子管理员</a>
                </Menu.Item>
                <Menu.Item>
                    <a className="account-link" onClick={(e,record) => this.handleViewInfo(e, record)}>详细信息</a>
                </Menu.Item>
                <Menu.Item>
                    <a className="account-link" onClick={(e,record) => this.handleViewVideo(e, record)}>点播</a>
                </Menu.Item>
                <Menu.Item>
                    <a className="account-link" onClick={(e,record) => this.handleViewLive(e, record)}>直播</a>
                </Menu.Item>
                <Menu.Item>
                    <Popconfirm
                        title="删除后将无法恢复，确认删除该子管理员账户?"
                        onConfirm={(e, record) => this.handleDelete(e, this.state.selectedRecord)}
                        okText="确认"
                        cancelText="取消"
                    > </Popconfirm>
                    <a className="account-link" href="http://">删除账户</a>
                </Menu.Item>
            </Menu>
        );
    }

    componentDidMount() {
        if (!checkUserInfo(this.props.history)) {
            return;
        }
        var user = getLocalStorage('user');
        this.setState({
            isLoading: true
        })
        VCloudAPI.get('/com/' + user.cid + '/admin/all/?aid=' + user.aid
        ).then(response => {
            console.log('success：', response.data)
            if (response.status === 200) {
                const { code = 0, data = {}, msg = {} } = response.data || {};
                if (code === 200) {
                    this.props.setAlitaState({
                        stateName: 'my_account_list',
                        data: data
                    });
                } else {
                    message.error('获取直播列表失败!');
                }
            } else {
                message.error('获取直播列表失败!');
            }
        }).catch((e) => {
            message.error('获取直播列表失败!');
        }).finally(() => {
            this.setState({
                isLoading: false
            })
        })
    }

    handleViewAdmin(e, record){
        e.preventDefault();
        this.props.history.push('/app/enterprise/submanager/management' + record.aid);
        this.props.setAlitaState({
            stateName: 'sub_admin',
            data: record,
        })
    }

    handleViewInfo(e, record){
        e.preventDefault();
        this.props.history.push('/app/admin/admincenter' + record.aid);
        this.props.setAlitaState({
            stateName: "user_info",
            data: record,
        })
    }

    handleViewVideo(e, record){
        e.preventDefault();
        this.props.history.push('/app/vodmanage/overview' + record.aid);
        this.props.setAlitaState(
            {
                stateName: "admin_vod",
                data: record,
            }
        )
    }

    handleViewLive(e, record){
        e.preventDefault();
        this.props.history.push('/app/livemanage/overview' + record.aid);
        this.props.setAlitaState(
            {
                stateName: "admin_live",
                data: record,
            }
        )
    }

    handleDropdownClick(e, record) {
        e.preventDefault();
        console.log('record', record)
        this.setState({
            selectedRecord: record
        })
    }

    handleDelete = (e, record) => {
        e.preventDefault();
        console.log(e);
        console.log('record', record);
        if (!checkUserInfo(this.props.history)) {
            return;
        }
        var user = getLocalStorage('user');
        VCloudAPI.delete('/com/' + user.cid + '/admin/delete/?aid=' + user.aid
            + '&said=' + record.aid,
        ).then(response => {
            if (response.status === 200 && response.data.code === 200) {
                message.success('删除成功');
                var { my_account_list } = this.props.alitaState|| {};
                const accountList = my_account_list.data;
                let index=accountList.indexOf(record);
                accountList.splice(index,1)
                console.log(index);
                //向用户子账户列表中删除一个记录
                this.props.setAlitaState({
                    stateName: 'my_account_list',
                    data: accountList
                });
            } else {
                message.error('删除子账户失败!');
            }
        }).catch((e) => {
            message.error('删除子账户失败!');
        })
    }

    handleResetPWD = (e, record) => {

        e.preventDefault();
    }

    compare = (property) => {
        return function (obj1, obj2) {
            var value1 = Date.parse(obj1[property]);
            var value2 = Date.parse(obj2[property]);
            return value2 - value1;// 升序
        }
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

export default connectAlita()(withRouter(UserAdminTable));