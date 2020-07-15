import React from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import VerifiedTable from './VerifiedTable';
import HeaderPanel from './HeaderPanel';
import './style.less';
import CreateViewInfo from './ViewInfo';
import { connectAlita } from 'redux-alita';


class UserVerified extends React.Component {

    render() {
        return (
            <div className="live-page">
                <BreadcrumbCustom first="已审核" />
                <div className="header-panel">
                    <HeaderPanel />
                </div>
                <div className="live-table-panel">
                    <CreateViewInfo />
                    <VerifiedTable />
                </div>
            </div>
        )
    }
}

export default connectAlita()(UserVerified);