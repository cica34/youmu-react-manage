import React from 'react';
import { connectAlita } from 'redux-alita';
import { List, message, Tag, Row, Col, Divider } from 'antd';
import { VCloudAPI } from 'myaxios/api';
import { getLocalStorage } from 'myutils/index';
import { checkUserInfo } from 'myutils/UserUtils';
import { withRouter } from 'react-router-dom';
import './style.less';


/**
 * 点播列表展示界面，展示点播封面，名称，标签，简介等信息。
 */
class VodList extends React.Component {
    componentDidMount() {
        if (!checkUserInfo(this.props.history)) {//检查用户信息是否完整
            return;
        }
        const user = getLocalStorage('user');
        //获取该用户所有点播信息
        VCloudAPI.get("/com/" + user.cid + '/videolist/', {

        }).then(response => {
            if (response.status === 200) {
                const { code = 0, data = {} } = response.data || {};
                console.log(data)
                if (code === 200) {
                    // 向用户直播列表中添加一个记录
                    message.success('成功获取点播列表')
                    const{ admin_vod } = this.props.alitaState;
                    this.props.setAlitaState({
                        stateName: 'admin_vod',
                        data: {
                            "videoInfo": data ? data : []
                        }
                    });
                    console.log(data);
                } else {
                    message.error('获取列表失败!')
                }
            } else {
                message.error('网络请求失败！')
            }
        }).catch(r => {
        })
        
        let is_com = 0;
        if (user.aid === user.cid) {
            is_com = 1;
        }
        VCloudAPI.get("/user/" + user.aid + '/info/?is_com=' + is_com, {
        }).then(response => {
            if (response.status === 200) {
                const { code = 0, data = {}, msg = {} } = response.data || {};
                console.log(data)
                if (code === 200) {
                    // 向用户直播列表中添加一个记录
                    message.success('成功获取用户信息')
                    this.props.setAlitaState({
                        stateName: 'user_info',
                        data: data
                    });

                } else {
                    message.error('获取配置失败!')
                }
            } else {
                message.error('网络请求失败！')
            }
        }).catch(r => {
        })
    }

    handleright = (e,record) =>{
        e.preventDefault();
        message.error('抱歉，您的权限不足');
    }

    handleDelete = (e, record) => {
        e.preventDefault();
        console.log('record', record);
        if (!checkUserInfo(this.props.history)) {
            return;
        }
        var user = getLocalStorage('user');
        VCloudAPI.delete('/com/' + user.cid + '/resourses/?rid=' + record.rid,
        ).then(response => {
            if (response.status === 200 && response.data.code === 200) {
                message.success('删除成功');
                const user = getLocalStorage('user');
                VCloudAPI.get("/com/" + user.cid + '/resourses/', {
                }).then(response => {
                    if (response.status === 200) {
                        const { code = 0, data = {} } = response.data || {};
                        console.log(data)
                        if (code === 200) {
                            message.success('成功获取点播列表')
                            this.props.setAlitaState({
                            stateName: 'vod_list_content',
                            data: {"videoInfo": data ? data : []}});
                            console.log(data);
                        } else {
                            message.error('获取列表失败!')
                        }
                    } else {
                        message.error('网络请求失败！')
                    }
                }).catch(r => {
                })
            } else {
                message.error('删除点播失败!');
            }
        }).catch((e) => {         
        message.error('异常!');
    })
}

    render() {

        const { vod_list_content = {} } = this.props.alitaState || {};
        const { data = {} } = vod_list_content || {}
        const { user_info = {} } = this.props.alitaState || {};
        const userInfo = user_info.data || {}
        const tags = userInfo.auth || [];
        console.log('data', data)
        const { videoInfo = [] } = data || {}
        console.log('videoinfo', videoInfo)
        
        var i = 0;
        var j = 0;
        while(tags[i]){
            if(tags[i] === '点播资源管理权限'){
                j = 1;
                break;
            }
            else
            i++;
        }
        let op = (
            <List
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                            onChange: page => {
                                console.log(page);
                            },
                            pageSize: 5,
                        }}
                        dataSource={videoInfo}
                        renderItem={item => (
                            <div>
                                <Row>
                                    <Col span={4}>
                                        <img src={item.pic_url} alt="avatar" style={{ width: '160px', height:'120px'}} />{/*4:3 ratio*/}
                                    </Col>
                                    <Col span={13} offset={1}>
                                        <div className="top-show">
                                            <span className="video-name">{item.name}</span>
                                            <span className="video-time">{item.time}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                            <span className="video-intro">{item.label.map(tag => (
                                                <Tag
                                                    key={tag}
                                                    color={"blue"}
                                                >
                                                    {tag}
                                                </Tag>
                                            ))}</span>
                                        </div>
                                        <div className="video-intro">{item.intro?item.intro:""}</div>
                                    </Col>
                                    <Col span={6}>
                                    <div className="action">
            <a className="action-link" href="http://"
                onClick={(e) => this.handleDelete(e,item)}
            >删除</a>
            <Divider type="vertical" />
            <a className="action-link" href="http://"
                onClick={(e) => {
                e.preventDefault();
                this.props.history.push(`/app/myvod/vodsetting/${item.rid}`)
                this.props.setAlitaState({
                    stateName: 'vod_setting_page',
                    data:{
                        vodData:item
                    }
                });
                }}
            >设置</a>
            <Divider type="vertical" />
            <a className="action-link" href={item.display_url} target="_blank" rel="noopener noreferrer">预览</a>
            </div>
                                    </Col>
                                </Row>
                                <Divider />
                            </div>
                        )}
                    />
        )
        if(j === 0){
            op = (
                <List
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                            onChange: page => {
                                console.log(page);
                            },
                            pageSize: 5,
                        }}
                        dataSource={videoInfo}
                        renderItem={item => (
                            <div>
                                <Row>
                                    <Col span={4}>
                                        <img src={item.pic_url} alt="avatar" style={{ width: '160px',  height:'120px'}} />{/*4:3 ratio*/}
                                    </Col>
                                    <Col span={13} offset={1}>
                                        <div className="top-show">
                                            <span className="video-name">{item.name}</span>
                                            <span className="video-time">{item.time}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                            <span className="video-intro">{item.label.map(tag => (
                                                <Tag
                                                    key={tag}
                                                    color={"blue"}
                                                >
                                                    {tag}
                                                </Tag>
                                            ))}</span>
                                        </div>
                                        <div className="video-intro">{item.intro}</div>
                                    </Col>
                                    <Col span={6}>
                <div className="action">
                <a className="action-link" href="http://"
                    onClick={(e) => this.handleright(e,item)}
                >删除</a>
                <Divider type="vertical" />
                <a className="action-link" href="http://"
                    onClick={(e) => this.handleright(e,item)}
                >设置</a>
                <Divider type="vertical" />
                <a className="action-link" href={item.display_url} target="_blank" rel="noopener noreferrer">预览</a>
                </div>
                                    </Col>
                                </Row>
                                <Divider />
                            </div>
                        )}
                    />
            )
        }

        return (
            <Row>
                <Col span={20} offset={2}>
                    {op}
                </Col>
            </Row>
        );
    }
}

export default withRouter(connectAlita()(VodList));