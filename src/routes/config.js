/**
 * 菜单路由配置
 * key: 路由path
 * route：路径路由，一般直接key来表示了
 * title：菜单项名称
 * icon：
 * component：组件名称，需要和component模块的index.js导出的组件名称一致
 * auth：是否登录才能查看组件，默认为false（表示需要登录），为true（表示不需要登录）
 * permissions：查看该组件所需要的权限,是一个数组
 * query：
 */
export default {
    menus: [
        // { key: '/app/dashboard/index', title: '首页概览', icon: 'dashboard', component: 'Dashboard' },
        {
            key: '/app/dashboard', title: '首页', icon: 'rocket',
            subs: [
                { key: '/app/dashboard/', title: '总览', component: 'Dashboard' },
            ]
        },
        {
            key: '/app/user/', title: '用户管理', icon: 'copy',
            subs: [
                { key: '/app/usercert/', title: '用户审核', component: 'UserCert' },
                { key: '/app/userverified/', title: '已审核', component: 'UserVerified' },
                { key: '/app/useradminlist/', title: '管理员列表', component: 'UserAdminList'},
            ]
        },
        {
            key: '/app/order/', title: '订单管理', icon: 'star',
            subs: [
                { key: '/app/order/overview', title: '订单查看', component: 'OrderIndex' },
            ]
        },
        {
            key: '/app/livemanage/', title: '直播管理', icon: 'star',
            subs: [
                { key: '/app/livemanage/overview', title: '直播查看', component: 'MyLivesPage' },
            ]
        },
        {
            key: '/app/vodmanage', title: '点播管理', icon: 'area-chart',
            subs: [
                { key: '/app/vodmanage/overview', title: '点播查看', component: 'MyVodPage' },
            ]
        },

        {
            key: '/app/systemmonitor', title: '系统监控', icon: 'star',
            subs: [
                { key: '/app/systemmonitor/mysql', title: '数据库', component: 'SystemIndex' },
            ]
        },

        {
            key: '/app/enterprise/submanager', title: '企业管理', icon: 'star',
            subs: [
                { key: '/app/enterprise/submanager/management', title: '子账号管理', component: 'AccountIndex' },
            ]
        },

        {
            key: '/app/admin', title: '用户中心', icon: 'star',
            subs: [
                { key: '/app/admin/admincenter', title: '个人中心', component: 'UserCenter' },
            ]
        },
    ],
    others: [] // 非菜单相关路由
}