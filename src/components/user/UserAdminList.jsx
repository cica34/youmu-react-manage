import React from 'react';
import BreadcrumbCustom from "../BreadcrumbCustom";
import HeaderPanel from "./HeaderPanel";
import CreateViewInfo from "./ViewInfo";
import UserAdminTable from "./UserAdminTable"
import './style.less';
import { connectAlita } from 'redux-alita';


class UserAdminList extends React.Component {

    render() {
        return (
            <div className="live-page">
                <BreadcrumbCustom first="管理员列表" />
                <div className="header-panel">
                    <HeaderPanel />
                </div>
                <div className="live-table-panel">
                    <CreateViewInfo />
                    <UserAdminTable />
                </div>
            </div>
        )
    }
}

export default connectAlita()(UserAdminList);
