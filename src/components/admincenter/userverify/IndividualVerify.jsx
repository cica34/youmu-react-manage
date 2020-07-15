import React, { Component } from 'react';
import { Row, Col, Card, Button, message, Select, Avatar, Tag, Input, Form, Upload, Descriptions } from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import { connectAlita } from 'redux-alita';
import { withRouter } from 'react-router-dom';
import { VCloudAPI } from '../../../axios/api';
import { getLocalStorage } from '../../../utils/index';
import { checkUserInfo } from '../../../utils/UserUtils';
import OssUploader from '../../../utils/OssUploader';

class IndividualVerify extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this)
        this.handlerecheck = this.handlerecheck.bind(this)
        this.handleDesc = this.handleDesc.bind(this)
    }

    state = {
        name:'',
        id:'',
        cs: 0,
        pic_url1: '',
        pic_url2: '',
        pic_url3: '',
        note: ''
    };

    componentDidMount() {
        VCloudAPI.get('sts/token').then(res => {
            console.log(res)
            this.options.config.accessKeySecret = res.data.AccessKeySecret
            this.options.config.accessKeyId = res.data.AccessKeyId
            this.options.config.stsToken = res.data.SecurityToken
            console.log('options', this.options)
        })
        if (!checkUserInfo(this.props.history)) {//检查用户信息是否完整
            return;
        }
        const user = getLocalStorage('user'); 
        VCloudAPI.get('/com/' + user.cid + '/certification/personal/?aid=' + user.aid, {

        }).then(response => {
            if (response.status === 200) {
                const { code = 0, data = {}, msg = {} } = response.data || {};
                console.log(data)
                if (code === 200) {
                    this.props.setAlitaState({
                        stateName: 'ind_info',
                        data: data
                    });
                    const { ind_info = {} } = this.props.alitaState || {};
                    const userinfo = ind_info.data || {}
                    const userInfo = userinfo.pers_cert_info || {}
                    console.log("try",userInfo.picture[0].pic_url)
                    this.setState({name:userInfo.name});
                    this.setState({id:userInfo.pid});
                    this.setState({cs:userInfo.state});
                    this.setState({note:userInfo.note});
                    this.setState({pic_url1:userInfo.picture[0]});
                    this.setState({pic_url2:userInfo.picture[1]});
                    this.setState({pic_url3:userInfo.picture[2]});
                    console.log("sta",this.state)
                } else {
                    VCloudAPI.post("/com/" + user.cid + '/certification/personal/?aid=' + user.aid, {
                        "aid": user.aid,
                        "pid": null,
                        "name": null,
                        "picture": [
                            "http://video-cloud-bupt.oss-cn-beijing.aliyuncs.com/2fBQf7ccPQ.png",
                            "http://video-cloud-bupt.oss-cn-beijing.aliyuncs.com/2fBQf7ccPQ.png",
                            "http://video-cloud-bupt.oss-cn-beijing.aliyuncs.com/2fBQf7ccPQ.png"],
                        "note": null,
                        "state": 0
                    }).then(response => {
                        if (response.status === 200) {
                            const { code = 0, data = {}, msg = {} } = response.data || {};
                            if (code === 200) {
                                message.success('认证预设成功');
            
                            } else {
                                message.error('认证预设失败!')
                            }
                        } else {
                            message.error('网络请求失败！')
                        }
                    }).catch(r => {
                    });

                    VCloudAPI.get("/com/" + user.cid + '/certification/personal/?aid=' + user.aid, {

                    }).then(response => {
                        if (response.status === 200) {
                            const { code = 0, data = {}, msg = {} } = response.data || {};
                            console.log('find',data)
                            if (code === 200) {
                                // 向用户直播列表中添加一个记录
                        
                                this.props.setAlitaState({
                                    stateName: 'ind_info',
                                    data: data
                                });
            
                            } else {
                                message.error('设置请求失败')
                            }
                        } else {
                            message.error('网络请求失败！')
                        }
                    }).catch(r => {
                    })
                    const { ind_info = {} } = this.props.alitaState || {};
                    const userinfo = ind_info.data || {}
                    const userInfo = userinfo.pers_cert_info || {}
                    this.setState({name:userInfo.name});
                    this.setState({id:userInfo.pid});
                    this.setState({cs:userInfo.state});
                    this.setState({note:userInfo.note});
                    this.setState({pic_url1:userInfo.picture[0]});
                    this.setState({pic_url2:userInfo.picture[1]});
                    this.setState({pic_url3:userInfo.picture[2]});
            
                }
            } else {
                message.error('网络请求失败！')
            }
        }).catch(r => {
        })
    }
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

    handleClick() {
        if (!checkUserInfo(this.props.history)) {//检查用户信息是否完整
            return;
        }
        var c = 0;
        const user = getLocalStorage('user');
        const name = this.props.form.getFieldValue('name');
        const id = this.props.form.getFieldValue('code');
        const{pic_url1} = this.state;
        const{pic_url2} = this.state;
        const{pic_url3} = this.state;
        const{note} = this.state;
        console.log("aid",user.aid)
        if(name === null || name === ""){
            message.error('未输入姓名！')
            c++;
        }
        if(id === null || id === ""){
            message.error('未输入身份证号码！')
            c++;
        }
        if(pic_url1 === "http://video-cloud-bupt.oss-cn-beijing.aliyuncs.com/2fBQf7ccPQ.png" || pic_url2 === "http://video-cloud-bupt.oss-cn-beijing.aliyuncs.com/2fBQf7ccPQ.png" || pic_url3 === "http://video-cloud-bupt.oss-cn-beijing.aliyuncs.com/2fBQf7ccPQ.png" || pic_url1 === null || pic_url2 === null || pic_url3 === null){
            message.error('未上传对应的身份证照片！')
            c++;
        }
        if(c === 0){
            VCloudAPI.post("/com/" + user.cid + '/certification/personal/?aid=' + user.aid, {
                "aid": user.aid,
                "pid": id,
                "name":name,
                "picture": [pic_url1,pic_url2,pic_url3],
                "state": 1,
                "note": note
            }).then(response => {
                if (response.status === 200) {
                    const { code = 0, data = {}, msg = {} } = response.data || {};
                    if (code === 200) {
                        this.setState({name:name});
                        this.setState({id:id});
                        this.setState({cs:1});
                    } else {
                        message.error('请重新认证!')
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
        VCloudAPI.put("/com/" + user.cid + '/certification/personal/?aid=' + user.aid, {
            "pid": this.state.id,
            "name":this.state.name,
            "picture": [this.state.pic_url1,this.state.pic_url2,this.state.pic_url3],
            "state": 0,
            "note": this.state.note
        }).then(response => {
            if (response.status === 200) {
                const { code = 0, data = {}, msg = {} } = response.data || {};
                if (code === 200) {
                    this.setState({cs:0});
                    console.log("state",this.state)
                } else {
                    message.error('请重新认证!')
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
    
    progress = (percent) => {
        console.log('上传进度:', parseInt(percent * 100));
    }

    beforeUpload1 = file => {
        console.log('beforeuploascover');

        console.log('上传文件名', file.name);
        console.log(file.size);
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
                    this.setState({ pic_url1: url });
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
    beforeUpload2 = file => {
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
                    this.setState({ pic_url2: url });
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
    beforeUpload3 = file => {
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
                    this.setState({ pic_url3: url });
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

    render() {
        const { getFieldDecorator } = this.props.form;
        const { ind_info = {} } = this.props.alitaState || {};
        const userinfo = ind_info.data || {}
        const userInfo = userinfo.pers_cert_info || {}
        const { TextArea } = Input;
        console.log("findind",userInfo)
        
        let indv= (
            <Row >
                <Form className="form-style" labelCol={{ span: 5 }} wrapperCol={{ span: 14 }} >
                <Col span={20} offset={4}>
                <Descriptions layout="vertical">
        <Descriptions.Item label="注意事项"><p>1.每个证件只能绑定一个账号</p>
        <p>2.证件照不清晰或与输入的信息不匹配,将导致实名认证被驳回</p>

        <p>3.您提供的证件信息将受到严格保护,仅用于身份验证,未经本人许可不会用于其他用途</p>

        <p>4.除原证件无效（如：改名、移民）等特殊情况外，实名认证审核通过后将不能修改。</p>
        </Descriptions.Item>
        </Descriptions>
        <Descriptions layout="vertical">
            <Descriptions.Item label="证件要求">
                <p>1.拍照要求同身份证</p>
                <p>2.暂不支持港澳同胞回乡证</p>

                <p>3.证件必须在有效期内，有效期需在一个月以上</p>
            </Descriptions.Item>
        </Descriptions>
        <Descriptions layout="vertical">
            <Descriptions.Item label="照片要求">
            <p>1.本人手持证件正面露脸，五官清晰可辨</p>

            <p>2.证件照上信息需完整且清晰可辨（无反光、遮挡、水印、证件套、logo等）</p>

            <p>3.申请人填写的“真实姓名”和“证件号码”需和提交证件照片信息一致</p>

            <p>4.证件必须真实拍摄，不能使用复印件</p>

            <p>5.确保照片完整（不缺边角），证件周围不允许加上边角框（如：加上红框等）</p>

            </Descriptions.Item>
        </Descriptions>
        </Col>
                        <Form.Item label="真实姓名">
                            {getFieldDecorator('name', {
                                initialValue: this.state.name || '',
                                rules: [{ required: true, message: '请输入真实姓名' }],

                            })(
                                <Input />
                            )}
                        </Form.Item>

                        <Form.Item label="证件号码">
                            {getFieldDecorator('code', {
                                initialValue: this.state.id || '',
                                rules: [{ required: true, message: '请输入身份证号码' }],
                            })(
                                <Input />
                            )}
                        </Form.Item>

                        <Form.Item label="证件照片">
                        {getFieldDecorator('cover', {
                            rules: [{ required: true }],
                        })(
                            <Row>
                            <Col span={7} offset={1}>
                            <Upload
                                beforeUpload={this.beforeUpload1}
                                showUploadList={false}
                            >
                                <img src={this.state.pic_url1} alt="avatar" style={{ width: '200px' ,height: '120px' }} />
                            </Upload>
                        </Col>
                        <Col span={7} offset={1}>
                            <Upload
                                beforeUpload={this.beforeUpload2}
                                showUploadList={false}
                            >
                                <img src={this.state.pic_url2} alt="avatar" style={{ width: '200px' ,height: '120px' }} />
                            </Upload>
                        </Col>
                        <Col span={7} offset={1}>
                            <Upload
                                beforeUpload={this.beforeUpload3}
                                showUploadList={false}
                            >
                                <img src={this.state.pic_url3} alt="avatar" style={{ width: '200px' ,height: '120px' }} />
                            </Upload>
                        </Col>

                        <Col span={15} offset={4}>
                                <div className="upload-warn-text">
                                    请上传正式有效的手持证件相片，为了保证显示效果，请上传 500 x 300 大小的图标，
                                    支持jpg、jpeg、png格式，文件大小不超过 2M</div>
                            </Col>
                            </Row>
                        )}
                         </Form.Item>

                        <Row>
                            
                        </Row>

                        <Form.Item label="备注">
                            <TextArea value={this.state.note} rows={3} onChange={this.handleDesc} placeholder= '若遇到无法上传证件照片的情况，请备注于此，并联系客服'/>
                        </Form.Item>
                        <Row>
                            <Col span={2} offset={11}>
                                <Button type="primary" onClick={this.handleClick}>确认上传</Button>
                            </Col>
                        </Row>
                    </Form>
        </Row>);
        if(this.state.cs === 1){
            indv = (
                <Row>
                <Form className="form-style" labelCol={{ span: 5 }} wrapperCol={{ span: 14 }} >
                <Form.Item label="真实姓名">
                            {getFieldDecorator('name', {
                                initialValue: this.state.name || '',
                            })(
                                <Input />
                            )}
                        </Form.Item>
    
                        <Form.Item label="证件号码">
                            {getFieldDecorator('code', {
                                initialValue: this.state.id || '',
                            })(
                                <Input />
                            )}
                        </Form.Item>
    
                        <Form.Item label="证件照片">
                        {getFieldDecorator('cover', {
                        })(
                            <Row>
                            <Col span={7} offset={1}>
                                <img src={this.state.pic_url1} alt="avatar" style={{ width: '200px' ,height: '120px' }} />
                         
                        </Col>
                        <Col span={7} offset={1}>
                                <img src={this.state.pic_url2} alt="avatar" style={{ width: '200px' ,height: '120px' }} />
                          
                        </Col>
                        <Col span={7} offset={1}>
                                <img src={this.state.pic_url3} alt="avatar" style={{ width: '200px' ,height: '120px' }} />
                        
                        </Col>
                            </Row>
                        )}
                         </Form.Item>
                <Col span={18} offset={8}>
            <font size = '5'>实名认证审核中，请等待3-7个工作日</font>
             </Col>
                 </Form>
                </Row>
            )
        }
        if(userInfo.state === 2){
            indv = (
                <Row>
                <Form className="form-style" labelCol={{ span: 5 }} wrapperCol={{ span: 14 }} >
            <Col span={18} offset={10}>
            <font size = '5'>实名认证完成</font>
                 </Col>
                 <Form.Item label="真实姓名">
                            {getFieldDecorator('name', {
                                initialValue: this.state.name || '',
                            })(
                                <Input />
                            )}
                        </Form.Item>
    
                        <Form.Item label="证件号码">
                            {getFieldDecorator('code', {
                                initialValue: this.state.id || '',
                            })(
                                <Input />
                            )}
                        </Form.Item>
    
                        <Form.Item label="证件照片">
                        {getFieldDecorator('cover', {
                        })(
                            <Row>
                            <Col span={7} offset={1}>
                                <img src={this.state.pic_url1} alt="avatar" style={{ width: '200px' ,height: '120px' }} />
                         
                        </Col>
                        <Col span={7} offset={1}>
                                <img src={this.state.pic_url2} alt="avatar" style={{ width: '200px' ,height: '120px' }} />
                          
                        </Col>
                        <Col span={7} offset={1}>
                                <img src={this.state.pic_url3} alt="avatar" style={{ width: '200px' ,height: '120px' }} />
                        
                        </Col>
                            </Row>
                        )}
                         </Form.Item>
                 </Form>
                </Row>
            )
        }
        if(userInfo.state === 3){
            indv = (
                <Row>
                <Form className="form-style" labelCol={{ span: 5 }} wrapperCol={{ span: 14 }} >
                        <Col span={20} offset={7}>
                        <Row><font size = '5'>实名认证未通过</font></Row>
                <Descriptions layout="vertical">
        <Descriptions.Item label="注意事项"><p>1.每个证件只能绑定一个账号</p>
        <p>2.证件照不清晰或与输入的信息不匹配,将导致实名认证被驳回</p>

        <p>3.您提供的证件信息将受到严格保护,仅用于身份验证,未经本人许可不会用于其他用途</p>

        <p>4.除原证件无效（如：改名、移民）等特殊情况外，实名认证审核通过后将不能修改。</p>
        </Descriptions.Item>
        </Descriptions>
        <Descriptions layout="vertical">
            <Descriptions.Item label="证件要求">
                <p>1.拍照要求同身份证</p>
                <p>2.暂不支持港澳同胞回乡证</p>

                <p>3.证件必须在有效期内，有效期需在一个月以上</p>
            </Descriptions.Item>
        </Descriptions>
        <Descriptions layout="vertical">
            <Descriptions.Item label="照片要求">
            <p>1.本人手持证件正面露脸，五官清晰可辨</p>

            <p>2.证件照上信息需完整且清晰可辨（无反光、遮挡、水印、证件套、logo等）</p>

            <p>3.申请人填写的“真实姓名”和“证件号码”需和提交证件照片信息一致</p>

            <p>4.证件必须真实拍摄，不能使用复印件</p>

            <p>5.确保照片完整（不缺边角），证件周围不允许加上边角框（如：加上红框等）</p>

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
        {indv}
            </div>
        )
    }
}
const WrappedApp = Form.create({ name: 'coordinated' })(IndividualVerify);

export default withRouter(connectAlita()(WrappedApp));
