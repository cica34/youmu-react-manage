import React, { Component } from 'react'
import { Modal, Form, Input, Button, message,Typography, Spin, Radio,Image  } from 'antd';
import './style.less'
import { connectAlita } from 'redux-alita';
import { VCloudAPI } from 'myaxios/api';
import urlChk from './CheckUrl'

const { Text } = Typography;
const { confirm } = Modal;

class DoVerify extends Component {

    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.handlePass = this.handlePass.bind(this);
        this.handleFail = this.handleFail.bind(this);
        this.handleOK = this.handleFail.bind(this);
    }
    handleCancel() {
        this.props.setAlitaState({
            stateName: 'do_verify',
            data: {
                loading: false,
                visible: false
            }
        })
    }

    handlePass()
    {
        const { do_verify = {} } = this.props.alitaState;
        const { data } = do_verify;
        const {  verifyData={} } = data || {};
        const {comp_cert_info={},pers_cert_info={}}=verifyData;
        const finalID=comp_cert_info.id?comp_cert_info.id:pers_cert_info.id;
        VCloudAPI.put('/verify/pass/?id=' + finalID
        ).then(response => {
            if (response.status === 200 && response.data.code === 200) {
                message.success('提交成功');
            } else {
                message.error('提交失败!');
            }
        }).catch((e) => {
            message.error('提交失败!');
        })
        this.props.setAlitaState({
            stateName: 'do_verify',
            data: {
                loading: false,
                visible: false
            }
        })
    }
    handleFail(reason="")
    {
        console.log("REASON:",reason);
        const { do_verify = {} } = this.props.alitaState;
        const { data } = do_verify;
        const {  verifyData={} } = data || {};
        const {comp_cert_info={},pers_cert_info={}}=verifyData;
        const finalID=comp_cert_info.id?comp_cert_info.id:pers_cert_info.id;
        VCloudAPI.put('/verify/fail/?id=' + finalID, reason
        ).then(response => {
            if (response.status === 200 && response.data.code === 200) {
                message.success('提交成功');
            } else {
                message.error('提交失败!');
            }
        }).catch((e) => {
            message.error('提交失败!');
        })
        this.props.setAlitaState({
            stateName: 'do_verify',
            data: {
                loading: false,
                visible: false
            }
        })
    }

    forMap = tag => {
        console.log(tag);
        const tagElemValid = (
          <Button 
            size="small"
            onClick={()=>
            Modal.info({
                title:'预览图片',
                width:820,
                content:<div className="showing-img"><img alt={tag} src={tag} /></div>
            })
            }
          >
            点击打开图片
          </Button>
        );
        const tagElemInvalid = (
          <Button 
            size="small"
            disabled={true}
          >
            图片URL非法！
          </Button>
        );
        return (
          <span key={tag} style={{ display: 'inline-block' }}>
            {urlChk(tag)?tagElemValid:tagElemInvalid}
          </span>
        );
      };

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { do_verify = {} } = this.props.alitaState;
        const { data } = do_verify;
        const { visible = false, loading=true,verifyData = {} } = data || {};
        const {comp_cert_info={},pers_cert_info={}}=verifyData;
        if(comp_cert_info.cid)
        return (
            <div>
                <Modal
                    visible={visible}
                    title="企业详细信息"
                    onCancel={this.handleCancel}
                    footer={null}
                    width={550}
                >
                <Spin spinning={loading}>
                    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} ref={this.formRef}>
                        <Form.Item label="企业ID">
                            <Text >{comp_cert_info.cid}</Text>
                        </Form.Item>
                        <Form.Item label="邮箱">
                            <Text >{comp_cert_info.email}</Text>
                        </Form.Item>
                        <Form.Item label="真实姓名">
                            <Text >{comp_cert_info.name}</Text>
                        </Form.Item>
                        <Form.Item label="证件号">
                            <Text >{comp_cert_info.license_number}</Text>
                        </Form.Item>
                        <Form.Item label="证件图片网址">
                            <Button size="small" 
                            disabled={urlChk(comp_cert_info.license_pic_url)}
                                    onClick={()=>
                                        Modal.info({
                                            title:'预览图片',
                                            width:820,
                                            content:<div className="showing-img"><img alt={comp_cert_info.license_pic_url} src={comp_cert_info.license_pic_url} /></div>
                                        })
                                    }>点击打开图片
                            </Button>
                        </Form.Item>
                        <Form.Item label="地址">
                            <Text >{comp_cert_info.address}</Text>
                        </Form.Item>
                        <Form.Item label="网址">
                            <Text >{comp_cert_info.website}</Text>
                            <a className="live-link" href={comp_cert_info.website} >&nbsp;&nbsp;&nbsp;&nbsp;访问</a>
                        </Form.Item>
                        <Form.Item label="备注">
                            <Text >{comp_cert_info.note}</Text>
                        </Form.Item>
                        <Form.Item label="时间">
                            <Text >{comp_cert_info.time}</Text>
                        </Form.Item>
                        <Form.Item label="通过">
                            <Button type="primary" onClick={()=>this.handlePass()}>审核通过</Button>
                        </Form.Item>
                        <Form.Item label="不通过">
                            {getFieldDecorator('reason')(
                                <Input placeholder="请填写不通过原因" />
                            )}
                            <Button type="danger" onClick={()=> this.handleFail(this.props.form.getFieldValue('reason'))}>审核不通过</Button>
                        </Form.Item>
                        
                    </Form>
                </Spin>
                </Modal>
            </div>
        )
        else if(pers_cert_info.aid){
            const tagChild = pers_cert_info.picture.map(this.forMap);
        return(
            <div>
                <Modal
                    visible={visible}
                    title="个人详细信息"
                    onCancel={this.handleCancel}
                    footer={null}
                    width={550}
                >
                <Spin spinning={loading}>
                    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} ref={this.formRef}>
                        <Form.Item label="用户ID">
                            <Text >{pers_cert_info.aid}</Text>
                        </Form.Item>
                        <Form.Item label="真实姓名">
                            <Text >{pers_cert_info.name}</Text>
                        </Form.Item>
                        <Form.Item label="身份证号">
                            <Text >{pers_cert_info.pid}</Text>
                        </Form.Item>
                        <Form.Item label="证件图片">
                            {tagChild}
                        </Form.Item>
                        <Form.Item label="申请时间">
                            <Text >{pers_cert_info.time}</Text>
                        </Form.Item>
                        <Form.Item label="备注">
                            <Text >{pers_cert_info.note}</Text>
                        </Form.Item>
                        <Form.Item label="通过">
                            <Button type="primary" onClick={()=>this.handlePass()}>审核通过</Button>
                        </Form.Item>
                        <Form.Item label="不通过">
                            {getFieldDecorator('reason')(
                                <Input placeholder="请填写不通过原因" />
                            )}
                            <Button type="danger" onClick={()=> this.handleFail(this.props.form.getFieldValue('reason'))}>审核不通过</Button>
                        </Form.Item>
                    </Form>
                </Spin>
                </Modal>
            </div>
        )
        }
        else{
            return(
            <div>
                 <Modal
                    visible={visible}
                    title=""
                    onCancel={this.handleCancel}
                    footer={null}
                    width={550}
                >
                </Modal>
            </div>
            )
        }
    }
}

const WrappedApp = Form.create({ name: 'coordinate' })(DoVerify);


export default connectAlita()(WrappedApp);
