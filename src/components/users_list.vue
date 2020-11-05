<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>活动管理</el-breadcrumb-item>
          <el-breadcrumb-item>活动列表</el-breadcrumb-item>
          <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card class="box-card">
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="6">
                    <div>
                      <el-input placeholder="请输入内容" v-model="queryData.query" class="input-with-select" clearable @clear="usersList">
                        <el-button slot="append" icon="el-icon-search" @click="usersList"></el-button>
                      </el-input>
                    </div>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row> 
            <!-- table表格 -->
            <template>
                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column prop="username" label="姓名"></el-table-column>
                    <el-table-column prop="email" label="邮箱"></el-table-column>
                    <el-table-column prop="mobile" label="电话"></el-table-column>
                    <el-table-column prop="role_name" label="角色"></el-table-column>
                    <el-table-column prop="mg_state" label="状态">
                        <!-- 作用域插槽 -->
                        <template slot-scope="scope">
                            <el-switch @change='changeState(scope.row)' v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column prop="c" label="操作">
                        <!-- 作用域插槽 -->
                        <template slot-scope="scope">
                            <!-- 修改按钮 -->
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
                            <!-- 删除按钮 -->
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="showDelDialog(scope.row)"></el-button>
                            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                                <!-- 分配角色按钮 -->
                                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <!-- 底部页码 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryData.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryData.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
                
            </el-pagination>
        </el-card>
        <!-- 添加用户的对话框 -->
        <el-dialog
          title="添加用户"
          :visible.sync="addDialogVisible"
          width="50%" @close="addDialogClose">
          <!-- 内容主体区域  -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog
          title="修改用户"
          :visible.sync="editDialogVisible"
          width="50%" @close="editDialogClose">
          <!-- 内容主体区域 -->
          <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUser">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 删除用户对话框   -->
        <el-dialog
          title="删除用户"
          :visible.sync="delDialogVisible"
          width="50%">
          <!-- 内容主体区域 -->
          <span>是否确定删除用户？</span>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="delDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="delUser">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    
    data() {
        // 验证邮箱
        var checkEmail = (rule , value, cb) => {
            // 验证邮箱的正则表达式
            const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
            if(regEmail.test(value)) {
                return cb()
            }

            cb(new Error('请输入合法的邮箱'))
        }

        //验证手机
        var checkMobile = (rule, value, cb) => {
            const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/
            if(regMobile.test(value)) {
                return cb()
            }

            cb(new Error('请输入合法的手机号'))
        }
        return {
            queryData: {
                //查询参数
                query: '',
                // 当前页码 
                pagenum: 1,
                // 每页显示几条
                pagesize: 10
            },
            tableData: [],
            value: true,
            // 数据个数
            total: 0,
            //控制添加用户对话框的显示与影藏
            addDialogVisible: false,
            //添加用户的表单数据
            addForm:{
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            //添加表单的验证规则对象
            addFormRules: {
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    {
                        min:  3,
                        max: 10,
                        message: '用户名的长度在3~10个字符之间',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {
                        min:  6,
                        max: 15,
                        message: '密码的长度在6~15个字符之间',
                        trigger: 'blur'
                    }
                ],
                email: [
                    {required: true, message: '请输入邮箱', trigger: 'blur'},
                    {validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    {required: true, message: '请输入手机号', trigger: 'blur'},
                    {validator: checkMobile, trigger: 'blur' }
                ]
            },
            // 修改用户对话框显示与隐藏
            editDialogVisible: false,
            //修改用户表单
            editForm:{},
            //修改表单的验证规则对象
            editFormRules: {
                email: [
                    {required: false, message: '请输入邮箱', trigger: 'blur'},
                    {validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    {required: false, message: '请输入手机号', trigger: 'blur'},
                    {validator: checkMobile, trigger: 'blur' }
                ]
            },
            // 删除用户对话框的显示与隐藏
            delDialogVisible: false,
            delForm: {}
        }
    },
    created: function() {
        this.usersList()
    },
    methods: {
        // 获取用户数据
        usersList: async function() {
            let {data: res} = await this.$http.get('users', { params: this.queryData })
            // console.log(res);
            if(res.meta.status !== 200) return this.$message.error('发生错误！')
            this.tableData = res.data.users
            this.total = res.data.total
            // console.log(res.data.totalpage);
            // console.log(this.tableData);
        },
        //监听pagesize改变的事件
        handleSizeChange: function(newSize) {
            console.log(newSize);
            this.queryData.pagesize = newSize
            this.usersList()
        },
        //监听页码值改变的时间
        handleCurrentChange: function(newPage) {
            this.queryData.pagenum = newPage
            this.usersList()
        },
        //switch开关状态值发生改变时触发 修改用户状态
        changeState: async function(userInfo) {
            var currentState = userInfo.mg_state
            var currentId = userInfo.id 
            // console.log(this.value);
            // console.log(currentState);
            // console.log(userInfo);
            var { data: res } = await this.$http.put('users/' + currentId + '/state/' + currentState)
            // console.log(res);
            if(res.meta.status !== 200) {
                userInfo.mg_state = !userInfo.mg_state
                return this.$message.error('用户状态更新失败')
            } 
            this.value = currentState
            this.$message.success('用户状态更新成功')

        },
        // 添加用户
        addUser: function() {
            this.$refs.addFormRef.validate(async valid =>  {
                console.log(valid);
                if(!valid) return
                //调用接口添加用户
                let {data: res} = await this.$http.post('users', {
                username: this.addForm.username,
                password: this.addForm.password,
                email: this.addForm.email,
                mobile: this.addForm.mobile
                })
                this.addForm.username = '',
                this.addForm.password = '',
                this.addForm.email = '',
                this.addForm.mobile = ''
                console.log(res);
                if(res.meta.status !== 201) return this.$message.error('添加失败用户')
                //调用接口重新获取数据
                this.addDialogVisible = false 
                this.usersList()
                this.$message.success('添加成功')


            })
            
        },
        // 关闭添加用户对话框 
        addDialogClose: function() {
            this.$refs.addFormRef.resetFields()
        },
        //调用接口展示编辑用户的对话框
        showEditDialog: async function(userInfo) { 
            console.log(userInfo.id);
            // 调用接口通过id查询用户信息
            let { data: res } = await this.$http.get(`users/${userInfo.id}`)
            if(res.meta.status !== 200) {
                return this.$message.error('修改失败')
            }
            this.editDialogVisible = true
            this.editForm = res.data
            
        },
        //关闭编辑用户对话框 重置表单
        editDialogClose: function() {
            this.$refs.editFormRef.resetFields()
        },
        editUser: function() {
            this.$refs.editFormRef.validate(async valid => {
                if(!valid) return
                //调用接口提交修改用户
                let { data: res } = await this.$http.put(`users/${this.editForm.id}`, {
                    id: this.editForm.id,
                    email: this.editForm.email,
                    mobile: this.editForm.mobile
                })
                if(res.meta.status !== 200) {
                    return this.$message.error('更新失败')
                }
                this.usersList()
                this.$message.success('更新成功')
                this.editDialogVisible = false

            })
        },
        //展示删除用户对话框
        showDelDialog: function(userInfo) {
            console.log(userInfo.id);
            this.delForm = userInfo
            this.delDialogVisible = true
        },
        // 调用接口删除用户
        delUser: async function() {
            let {data: res} = await this.$http.delete(`users/${this.delForm.id}`, {
                id: this.delForm.id
            })
            if(res.meta.status !== 200) return this.$message.error('删除失败')
            this.usersList()
            this.$message.success('删除成功')
            this.delForm = {}
            this.delDialogVisible = false
        }
            
    }
}
</script>

<style lang="less" scoped>
    .text {
      font-size: 14px;
    }

   .item {
      margin-bottom: 18px;
    }

   .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }
    .clearfix:after {
      clear: both
    }

   .box-card {
      width: 100%;
    }
    .item[data-v-8cb927f6] {
        margin-bottom: 0;
    }
    .el-table {
        margin-bottom: 50px;
    }
</style>