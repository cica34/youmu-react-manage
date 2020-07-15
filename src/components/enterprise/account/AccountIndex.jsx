import React from "react";
import BreadcrumbCustom from "../../BreadcrumbCustom";
import './style.less';
import { connectAlita } from 'redux-alita';
import AccountTable from "./AccountTable";
import AccountPanel from "./AccountPanel";

class UserAdminList extends React.Component {

    render() {
        return (
            <div className="live-page1 ">
                <BreadcrumbCustom first="子账号列表" />
                <div className="header-panel">
                    <AccountPanel />
                </div>
                <div className="live-table-panel">
                    <AccountTable />
                </div>
            </div>
        )
    }
}

export default connectAlita()(UserAdminList);