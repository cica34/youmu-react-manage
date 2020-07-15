import React from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import UserTable from './UserTable';
import HeaderPanel from './HeaderPanel';
import './style.less';
import CreateVerify from './DoVerify';
import { connectAlita } from 'redux-alita';


class UserCert extends React.Component {

    render() {
        return (
            <div className="live-page">
                <BreadcrumbCustom first="用户审核" />
                <div className="header-panel">
                    <HeaderPanel />
                </div>
                <div className="live-table-panel">
                    <CreateVerify />
                    <UserTable />
                </div>
            </div>
        )
    }
}

export default connectAlita()(UserCert);