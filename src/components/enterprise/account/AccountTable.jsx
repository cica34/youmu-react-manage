import { Table,  message, Menu, Dropdown } from 'antd';
import React from 'react';
import { connectAlita } from 'redux-alita';
import { VCloudAPI } from 'myaxios/api';
import { withRouter } from 'react-router-dom';
import { checkUserInfo } from 'myutils/UserUtils';

class AccountTable extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            SelectedRecord: {}
        }

        this.columns = [
            {
                title: '子账号ID',
                dataIndex: 'aid',
                align: 'center',
                render: (text) => {return text}
            },

            {
                title: '子账号名',
                dataIndex: 'aname',
                align: 'center',
                render: (text) => {return text}
            },

            {
                title: '子账号邮箱',
                dataIndex: 'aemail',
                align: 'center',
                render: (text) => {return text}
            },

            {
                title: '操作',
                dataIndex: 'operation',
                align: 'center',
            }
        ]

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
                    const { sub_admin } = this.props.alitaState;
                    this.props.setAlitaState({
                        stateName: 'sub_admin',
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

export default connectAlita()(withRouter(AccountTable));