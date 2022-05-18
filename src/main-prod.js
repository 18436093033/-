import Vue from 'vue'
import App from './App.vue'
import router from './router'
import moment from 'moment';
// import "babel-polyfill"
import {
  Form, FormItem, Button, Input, Message, Container, Header, Main, Aside, Menu, Submenu,
  MenuItemGroup, MenuItem, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch,
  Tooltip, Pagination, Dialog, MessageBox,Tag,Tree,Select,Option,Cascader,Alert,Tabs, TabPane, Steps,Step,
  CheckboxGroup ,Checkbox, Upload,Timeline,TimelineItem
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import './assets/font/iconfont.css'
import './assets/css/global.css'
import  TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'


Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Container);
Vue.use(Aside);
Vue.use(Header);
Vue.use(Main);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Submenu);
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(Card)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
// Vue.use(TabPane)
Vue.use(Col)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)
//将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)
// require styles 引入样式
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'


Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

import axios from 'axios'

Vue.component('tree-table',TreeTable)
//定义全局过滤器
Vue.filter('momentTime',function(data){
  return moment(data).format('YYYY-MM-DD  HH:mm:ss');
});

//配置请求基地址

axios.defaults.baseURL = 'http://127.0.0.1:8008/api/private/v1/'
//注意拦截器位置
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config)
  return config
})
Vue.prototype.$http = axios
// 路由导航首位



Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')










