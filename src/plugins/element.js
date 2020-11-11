import Vue from 'vue'
// 局部导入element-ui组件
import { Button, 
         Form, 
         FormItem, 
         Input, 
         Message, 
         Container, 
         Header, 
         Aside, 
         Main, 
         Menu, 
         Submenu, 
         MenuItemGroup, 
         MenuItem, 
         Breadcrumb, 
         BreadcrumbItem, 
         Card,
         Row,
         Col,
         Table,
         TableColumn,
         Switch,
         Tooltip,
         Pagination,
         Dialog,
         Tag,
         MessageBox,
         Tree,
         Option,
         Select,
         Cascader,
         Alert,
         Tabs,
         TabPane,
         Steps,
         Step,
         Checkbox,
         CheckboxGroup,
         Upload
        } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Option)
Vue.use(Select)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
//将Message挂载到Vue的原型对象上
Vue.prototype.$message = Message

// //挂载确定删除弹出框
Vue.prototype.$confirm = MessageBox.confirm;
