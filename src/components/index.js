/**
 * 作为模块接口，导出所有的组件
 */
import Dashboard from './dashboard/Dashboard';
import MyLivesPage from "./live/mylives/MyLivesPage";
import OrderIndex from './order/OrderIndex';
import SystemIndex from './system/SystemIndex';
import UserCert from './user/UserCert';
import UserVerified from './user/UserVerified';
import UserAdminList from "./user/UserAdminList";
import AccountIndex from "./enterprise/account/AccountIndex";
import AccountTable from "./enterprise/account/AccountTable";
import UserCenter from './admincenter/UserCenter';
import MyVodPage from "./vod/myvod/MyVodPage";


export default {
    Dashboard,MyLivesPage,OrderIndex,SystemIndex,UserCert,UserVerified,UserAdminList,AccountIndex,
    AccountTable,UserCenter,MyVodPage,
}