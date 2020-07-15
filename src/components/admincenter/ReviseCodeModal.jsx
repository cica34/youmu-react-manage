import React, { Component } from 'react'
import { Button, Modal, Form, Input, message, } from 'antd';
import { connectAlita } from 'redux-alita';
import { VCloudAPI } from 'myaxios/api';
import { getLocalStorage } from 'myutils/index';
import { checkUserInfo } from 'myutils/UserUtils';
import { withRouter } from 'react-router-dom';

class ReviseCodeModal extends Component {

    constructor(props) {
        super(props)
        this.handleCancel = this.handleCancel.bind(this);
        this.handleOk = this.handleOk.bind(this);
    }
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };
    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次输入密码不一致！');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };
    handleCancel() {
        this.props.setAlitaState({
            stateName: 'create_code_modal',
            data: {
                visible: false,
                loading: false
            }
        })
    }

    handleOk() {
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            //读取表单数据
            const data = fieldsValue
            console.log('data from form: ', data);
            this.setModalState(true, true);
            if (!checkUserInfo(this.props.history)) {   //检查用户信息是否完整
                return;
            }
            const user = getLocalStorage('user');
            VCloudAPI.post("/com/" + user.cid + '/admin/?aid=' + user.aid, {
                ...data
            }).then(response => {
                if (response.status === 200) {
                    const { code = 0, data = {}, msg = {} } = response.data || {};
                    console.log(data);
                    if (code === 200) {
                        message.success('创建成功!');
                        this.props.form.resetFields();
                        this.setModalState(false, false);
                    } else {
                        message.error('创建失败!')
                    }
                } else {
                    message.error('网络请求失败！')
                }
            }).catch(r => {
            })
        })
    }

    setModalState(visible, loading) {
        this.props.setAlitaState({
            stateName: 'create_code_modal',
            data: {
                visible: visible,
                loading: loading
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { create_code_modal = {} } = this.props.alitaState;
        const { data } = create_code_modal;
        const { visible = false, loading = false } = data || {};

        return (
            <div>
                <Modal
                    visible={visible}
                    title="修改密码"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="cancel" onClick={this.handleCancel}>
                            取消</Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                            确认</Button>,
                    ]}>

                    <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onSubmit={this.handleOk}>
                        <Form.Item label="原密码">
                            {getFieldDecorator('原密码', {
                                rules: [{ required: true, message: '请输入原密码' }],
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="新密码" hasFeedback>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入新密码' }, {
                                    validator: this.validateToNextPassword,
                                },],
                            })(<Input.Password />)}
                        </Form.Item>

                        <Form.Item label="确认密码" hasFeedback>
                            {getFieldDecorator('confirm', {
                                rules: [{ required: true, message: '请确认新确认密码' }, {
                                    validator: this.compareToFirstPassword,
                                },],
                            })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                        </Form.Item>

                    </Form>
                </Modal>
            </div>
        )
    }
}
const WrappedApp = Form.create({ name: 'coordinated' })(ReviseCodeModal);
export default withRouter(connectAlita()(WrappedApp));
