import React from 'react';
import { Row, Col, Card, Button, message, Select, Avatar, Tag, Input, Form, Upload, Descriptions } from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import { connectAlita } from 'redux-alita';
import { withRouter } from 'react-router-dom';
import { VCloudAPI } from '../../../axios/api';
import { getLocalStorage } from '../../../utils/index';
import { checkUserInfo } from '../../../utils/UserUtils';
import OssUploader from '../../../utils/OssUploader';


var i = 0;
var c = 0;
class FactoryVerify extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this)
        this.handlerecheck = this.handlerecheck.bind(this)
        this.handleDesc = this.handleDesc.bind(this)
    }

    state = {
        name:'',
        email:'',
        lcode:'',
        add:'',
        web:'',
        cs: 0,
        pic_url: '',
        note: ''
    };
    
    options = {
        config: {
            region: 'oss-cn-beijing',
            accessKeyId: "",
            accessKeySecret: "",
            stsToken: "",
            bucket: 'video-cloud-bupt',
        },
        dirname: '',
        progress: (percent) => {
            console.log('上传进度:', parseInt(percent * 100));
        }
    }

    componentDidMount() {
        if (!checkUserInfo(this.props.history)) {//检查用户信息是否完整
            return;
        }
        const user = getLocalStorage('user');
        VCloudAPI.get('sts/token').then(res => {
            console.log(res)
            this.options.config.accessKeySecret = res.data.AccessKeySecret
            this.options.config.accessKeyId = res.data.AccessKeyId
            this.options.config.stsToken = res.data.SecurityToken
            console.log('options', this.options)
        })
        VCloudAPI.get("/com/" + user.cid + '/certification/company/', {

        }).then(response => {
            if (response.status === 200) {
                const { code = 0, data = {}, msg = {} } = response.data || {};
                console.log('find',data)
                if (code === 200) {
                    // 向用户直播列表中添加一个记录
    
                    this.props.setAlitaState({
                        stateName: 'fac_info',
                        data: data
                    });
                    const { fac_info = {} } = this.props.alitaState || {};
                    const userinfo = fac_info.data || {}
                    const userInfo = userinfo.comp_cert_info || {}
                    console.log("check",userInfo)
                    this.setState({name:userInfo.name});
                    this.setState({email:userInfo.email});
                    this.setState({lcode:userInfo.license_number});
                    this.setState({add:userInfo.address});
                    this.setState({web:userInfo.website});
                    this.setState({cs:userInfo.state});
                    this.setState({note:userInfo.note});
                    this.setState({pic_url:userInfo.license_pic_url});

                } else {
                    VCloudAPI.post("/com/" + user.cid + '/certification/company/', {
                        "name":null,
                        "email": null,
                        "license_number": null,
                        "license_pic_url": 'http://video-cloud-bupt.oss-cn-beijing.aliyuncs.com/2ikrJ2pEiz.jpeg',
                        "address": null,
                        "website": null,
                        "note": null
                    }).then(response => {
                        if (response.status === 200) {
                            const { code = 0, data = {}, msg = {} } = response.data || {};
                            if (code === 200) {
                    
            
                            } else {
                                message.error('认证预设失败!')
                            }
                        } else {
                            message.error('网络请求失败！')
                        }
                    }).catch(r => {
                    });

                    VCloudAPI.get("/com/" + user.cid + '/certification/company/', {

                    }).then(response => {
                        if (response.status === 200) {
                            const { code = 0, data = {}, msg = {} } = response.data || {};
                            console.log('find',data)
                            if (code === 200) {
                                // 向用户直播列表中添加一个记录
                                message.success('成功获取用户信息')
                                this.props.setAlitaState({
                                    stateName: 'fac_info',
                                    data: data
                                });
                                const { fac_info = {} } = this.props.alitaState || {};
                                const userinfo = fac_info.data || {}
                                const userInfo = userinfo.comp_cert_info || {}
                                this.setState({name:userInfo.name});
                                this.setState({email:userInfo.email});
                                this.setState({lcode:userInfo.license_number});
                                this.setState({add:userInfo.address});
                                this.setState({web:userInfo.website});
                                this.setState({cs:userInfo.state});
                                this.setState({note:userInfo.note});
                                this.setState({ pic_url: userInfo.license_pic_url });
            
                            } else {
                                message.error('设置请求失败')
                            }
                        } else {
                            message.error('网络请求失败！')
                        }
                    }).catch(r => {
                    })
                }
            } else {
                message.error('网络请求失败！')
            }
        }).catch(r => {
        })
    }

    
    beforeUpload = file => {
        console.log('beforeuploascover');

        console.log('上传文件名', file.name);
        console.log(file.size);
        //const video_type=file.name.substring(file.name.indexOf('.'),file.name.length);
        // 创建Uploader
        const upload = new OssUploader({
            ...this.options,//与文件无关的一些配置
            file,// 待上传的文件
        });
        console.log('options', this.options)
        // 开始上传
        upload.start(
            res => {
                console.log('OSS上传返回结果', res)
                if (res.res.status === 200) {
                    message.success('文件上传成功');
                    const url = res.res.requestUrls[0].substring(0, res.res.requestUrls[0].indexOf('?'));
                    console.log('上传文件的返回URL为', url);
                    this.setState({ pic_url: url });
                } else {
                    message.error('文件上传失败');
                }
            },
            error => {
                message.error('文件上传失败');
            }
        );
        return false;// 在这里，我们自己通过OSS上传，所以返回false，拦截Upload自己的上传
    }
    
    progress = (percent) => {
        console.log('上传进度:', parseInt(percent * 100));
    }

    handleClick() {
        if (!checkUserInfo(this.props.history)) {//检查用户信息是否完整
            return;
        }
        var c = 0;
        const user = getLocalStorage('user');
        const name = this.props.form.getFieldValue('name')
        const email = this.props.form.getFieldValue('email');
        const lcode = this.props.form.getFieldValue('code');
        const add = this.props.form.getFieldValue('location');
        const web = this.props.form.getFieldValue('web');
        console.log("web",web)
        const {note} = this.state;
        const {pic_url} = this.state;
        if(name === null || name === ""){
            message.error('未输入姓名！')
            c++;
        }
        if(email === null || email === ""){
            message.error('未输入邮箱！')
            c++;
        }
        if(add === null || add === ""){
            message.error('未输入公司地址！')
            c++;
        }
        if(lcode === null || lcode === ""){
            message.error('未输入营业执照号码！')
            c++;
        }
        if(web === null || web === ""){
            message.error('未输入公司邮箱！')
            c++;
        }
        if(pic_url === 'http://video-cloud-bupt.oss-cn-beijing.aliyuncs.com/2ikrJ2pEiz.jpeg'){
            message.error('未上传营业执照照片！')
            c++;
        }
        if(c === 0){
            VCloudAPI.post("/com/" + user.cid + '/certification/company/', {
                "name":name,
                "email":email,
                "license_number": lcode,
                "license_pic_url": pic_url,
                "address": add,
                "website": web,
                "note": note
            }).then(response => {
                if (response.status === 200) {
                    const { code = 0, data = {}, msg = {} } = response.data || {};
                    if (code === 200) {
                        VCloudAPI.put("/com/" + user.cid + '/certification/company/', {
                            "state": 1,
                            "note" : note
                            }).then(response => {
                            if (response.status === 200) {
                                const { code = 0, data = {}, msg = {} } = response.data || {};
                                if (code === 200) {
                                    this.setState({name:name});
                                    this.setState({email:email});
                                    this.setState({lcode:lcode});
                                    this.setState({add:add});
                                    this.setState({web:web});
                                    this.setState({cs:1});
                                } else {
                                    message.error('申请认证失败!')
                                }
                            } else {
                                message.error('网络请求失败！')
                            }
                            }).catch(r => {
                            });
                    } else {
                        message.error('申请认证失败!')
                    }
                } else {
                    message.error('网络请求失败！')
                }
            }).catch(r => {
            });
        }
    }

    handlerecheck() {
        const user = getLocalStorage('user');
        VCloudAPI.put("/com/" + user.cid + '/certification/company/', {
        "state": 0,
        "note" : this.state.note
        }).then(response => {
        if (response.status === 200) {
            const { code = 0, data = {}, msg = {} } = response.data || {};
            if (code === 200) {
                this.setState({cs:0});

            } else {
                message.error('申请认证失败!')
            }
        } else {
            message.error('网络请求失败！')
        }
        }).catch(r => {
        });
    }
    
    handleDesc = e => {
        console.log(e.target.value);
        this.setState({ note: e.target.value });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { fac_info = {} } = this.props.alitaState || {};
        const userinfo = fac_info.data || {}
        const userInfo = userinfo.comp_cert_info || {}
        const { TextArea } = Input;
        console.log('findfac',userInfo)

        let facv=(
            <Row >
                <Form className="form-style" labelCol={{ span: 5 }} wrapperCol={{ span: 14 }} >
                <Col span={20} offset={4}>
                <Descriptions layout="vertical">
                <Descriptions.Item label="注意事项">
                <p>1.证件照不清晰或与输入的信息不匹配,将导致实名认证被驳回</p>

                <p>2.您提供的证件信息将受到严格保护,仅用于身份验证,未经本人许可不会用于其他用途</p>

                <p>3.除原证件无效等特殊情况外，实名认证审核通过后请不能修改。</p>
                </Descriptions.Item>
                </Descriptions>
                
                <Descriptions layout="vertical">
                    <Descriptions.Item label="照片要求">

                    <p>1.证件照上信息需完整且清晰可辨（无反光、遮挡、水印、证件套、logo等）</p>

                    <p>2.申请人填写的“公司名称”和“营业执照号码”需和提交证件照片信息一致</p>

                    <p>3.证件必须真实拍摄，不能使用复印件</p>

                    <p>4.确保照片完整（不缺边角），证件周围不允许加上边角框（如：加上红框等）</p>

                    </Descriptions.Item>
                </Descriptions>
                 </Col>

                                <Form.Item label="公司名称">
                                    {getFieldDecorator('name', {
                                        initialValue: this.state.name || '',
                                        rules: [{ required: true, message: '请输入公司名称' }],

                                    })(
                                        <Input />
                                    )}
                                </Form.Item>

                                <Form.Item label="公司邮箱">
                                    {getFieldDecorator('email', {
                                        initialValue: this.state.email || '',
                                        rules: [{ required: true, message: '请输入邮箱' }],
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>

                                <Form.Item label="公司地址">
                                    {getFieldDecorator('location', {
                                        initialValue: this.state.add || '',
                                        rules: [{ required: true, message: '请输入确切地址' }],
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>

                                <Form.Item label="企业网站">
                                    {getFieldDecorator('web', {
                                        initialValue: this.state.web || '',
                                        rules: [{ required: true, message: '请输入官方网站' }],
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>

                                <Form.Item label="营业执照号码">
                                    {getFieldDecorator('code', {
                                        initialValue: this.state.lcode || '',
                                        rules: [{ required: true, message: '请输入营业执照号码' }],
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>

                                <Form.Item label="营业执照照片">
                                {getFieldDecorator('cover', {
                                    rules: [{ required: true }],
                                })(
                                    <Row>
                                        <Col span={4} offset={4}>
                                    <Upload
                                        beforeUpload={this.beforeUpload}
                                        showUploadList={false}
                                    >
                                        <img src={this.state.pic_url} alt="avatar" style={{ width: '200px' ,height: '300px' }} />
                                    </Upload>
                                </Col>
                                <Col span={15} offset={4}>
                                        <div className="upload-warn-text">请上传正式有效的营业执照相片，为了保证显示效果，请上传 600 x 900 大小的图标，
                                         支持jpg、jpeg、png格式，文件大小不超过 2M</div>
                                    </Col>
                                    </Row>
                                )}
                                 </Form.Item>

                                <Row>
                                    
                                </Row>

                                <Form.Item label="备注">
                                {getFieldDecorator('intro', {
                                    initialValue: this.state.note,
                                })(<TextArea rows={3} onChange={this.handleDesc} placeholder= '若遇到无法上传营业执照的情况，请备注于此，并联系客服' />)}
                                </Form.Item>
                                <Row>
                                    <Col span={2} offset={11}>
                                        <Button type="primary" onClick={this.handleClick}>确认上传</Button>
                                    </Col>
                                </Row>
                            </Form>
                </Row>
        );
        if(this.state.cs === 1){
            facv = (
                <Row>
                <Form className="form-style" labelCol={{ span: 5 }} wrapperCol={{ span: 14 }} >
                    
                <Form.Item label="公司名称">
                {getFieldDecorator('name', {
                        initialValue: this.state.name || '',
    
                })(
                     <Input />
                )}
                </Form.Item>
    
                <Form.Item label="公司邮箱">
                {getFieldDecorator('email', {
                    initialValue: this.state.email || '',
                })(
                <Input />
                )}
                </Form.Item>
    
                <Form.Item label="公司地址">
                {getFieldDecorator('location', {
                    initialValue: this.state.add || '',
                })(
                    <Input />
                )}
                </Form.Item>
    
                <Form.Item label="企业网站">
                {getFieldDecorator('web', {
                    initialValue: this.state.web || '',
                })(
                <Input />
                )}
                </Form.Item>
    
                <Form.Item label="营业执照号码">
                {getFieldDecorator('code', {
                    initialValue: this.state.lcode || '',
                })(
                    <Input />
                )}
                </Form.Item>
    
                <Form.Item label="营业执照照片">
                {getFieldDecorator('cover', {
                })(
                    <Row>
                    <Col span={4} offset={8}>
                    <img src={this.state.pic_url} alt="avatar" style={{ width: '200px' ,height: '300px' }} />
                    </Col>
                    </Row>
                    )}
                     </Form.Item>
                 </Form>
                <Col span={18} offset={8}>
                <font size = '5'>实名认证审核中，请等待3-7个工作日</font>
                 </Col>
                </Row>
            )
        }
        if(this.state.cs === 2){
            facv = (
                <Row>   
            <Col span={18} offset={10}>
            <font size = '5'>实名认证完成</font>
                 </Col>
            <Form className="form-style" labelCol={{ span: 5 }} wrapperCol={{ span: 14 }} >
                
            <Form.Item label="公司名称">
            {getFieldDecorator('name', {
                    initialValue: this.state.name || '',
    
            })(
                 <Input />
            )}
            </Form.Item>
    
            <Form.Item label="公司邮箱">
            {getFieldDecorator('email', {
                initialValue: this.state.email || '',
            })(
            <Input />
            )}
            </Form.Item>
    
            <Form.Item label="公司地址">
            {getFieldDecorator('location', {
                initialValue: this.state.add || '',
            })(
                <Input />
            )}
            </Form.Item>
    
            <Form.Item label="企业网站">
            {getFieldDecorator('web', {
                initialValue: this.state.web || '',
            })(
            <Input />
            )}
            </Form.Item>
    
            <Form.Item label="营业执照号码">
            {getFieldDecorator('code', {
                initialValue: this.state.lcode || '',
            })(
                <Input />
            )}
            </Form.Item>
    
            <Form.Item label="营业执照照片">
            {getFieldDecorator('cover', {
            })(
                <Row>
                <Col span={4} offset={8}>
                <img src={this.state.pic_url} alt="avatar" style={{ width: '200px' ,height: '300px' }} />
                </Col>
                </Row>
                )}
                 </Form.Item>
             </Form>
                </Row>
            )
        }
        if(this.state.cs === 3){
            facv = (
                <Row>
                    <Form className="form-style" labelCol={{ span: 5 }} wrapperCol={{ span: 14 }} >
                        <Col span={20} offset={7}>
                        <Row><font size = '5'>实名认证未通过</font></Row>
                    <Descriptions layout="vertical">
                    <Descriptions.Item label="注意事项">
                    <p>1.证件照不清晰或与输入的信息不匹配,将导致实名认证被驳回</p>
    
                    <p>2.您提供的证件信息将受到严格保护,仅用于身份验证,未经本人许可不会用于其他用途</p>
    
                    <p>3.除原证件无效等特殊情况外，实名认证审核通过后请不能修改。</p>
                    </Descriptions.Item>
                    </Descriptions>
                    
                    <Descriptions layout="vertical">
                        <Descriptions.Item label="照片要求">
    
                        <p>1.证件照上信息需完整且清晰可辨（无反光、遮挡、水印、证件套、logo等）</p>
    
                        <p>2.申请人填写的“公司名称”和“营业执照号码”需和提交证件照片信息一致</p>
    
                        <p>3.证件必须真实拍摄，不能使用复印件</p>
    
                        <p>4.确保照片完整（不缺边角），证件周围不允许加上边角框（如：加上红框等）</p>
    
                        </Descriptions.Item>
                    </Descriptions>
                     </Col>
                     <Row>
                        <Col span={2} offset={11}>
                            <Button type="primary" onClick={this.handlerecheck}>重新上传</Button>
                            </Col>
                    </Row>
                     </Form>
                    </Row>
            )
        }

        return (
            <div className="gutter-example button-demo">
                <div>&nbsp;</div>
                <div>&nbsp;</div>
                {facv}
            </div>
        )
    }
}

const WrappedApp = Form.create({ name: 'coordinated' })(FactoryVerify);

export default withRouter(connectAlita()(WrappedApp));

