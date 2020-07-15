import React from 'react';
import BreadcrumbCustom from './../../BreadcrumbCustom';
import VodList from './VodList';
import HeaderPanel from './HeaderPanel';
import './style.less';
import CreateVodModal from './CreateVodModal';
import SelectModal from './VodSelectModal';
import { connectAlita } from 'redux-alita';

/**
 * 我的点播界面,展示已经创建的点播列表
 */
class MyVodPage extends React.Component {

    render() {
        return (
            <div className="live-page">
                <BreadcrumbCustom first="我的点播" />
                <div className="header-panel">
                    <HeaderPanel />
                </div>
                <div className="live-table-panel">
                    <CreateVodModal />
                    <SelectModal />
                    <VodList />
                </div>
            </div>
        )
    }
}

export default connectAlita()(MyVodPage);