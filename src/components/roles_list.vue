<template>
    <div class="current">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-button type="primary" @click="addRoledialogVisible = true">添加角色</el-button>
            <el-table :data="rolesData" border style="width: 100%">
                <el-table-column type="expand">
                    <tempalte slot-scope="scoped">
                        <!-- 栅格布局 -->
                        <el-row v-for="(item1, i1) in scoped.row.children" :key="item1.id"  :class="['bdbottom', i1 === 0 ? 'bdtop' : '']">
                            <!-- 一级权限 -->
                            <el-col :span="5">                 
                                <el-tag @close="removeRight(scoped.row, item1.id)" :closable="true">{{item1.authName}}</el-tag><span class="el-icon-caret-right"></span>
                            </el-col>
                            <!-- 二级和三级权限       -->
                            <el-col :span="19"> 
                                <el-row :key="item2.id" v-for="(item2, i2) in item1.children" :class="[i2 == 0 ? '' : 'bdtop']">
                                    <el-col :span="6">
                                        <el-tag @close="removeRight(scoped.row, item2.id)" :closable="true" type="success">{{item2.authName}}</el-tag><span class="el-icon-caret-right"></span>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag :closable="true" @close="removeRight(scoped.row, item3.id)" :key="item3.id" type="warning" v-for="item3 in item2.children">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </tempalte>   
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column prop="level" label="操作">
                    <!-- 作用域插槽 -->
                        <template slot-scope="scoped">
                            <!-- 修改按钮 -->
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditRoleDialog(scoped.row)">编辑</el-button>
                            <!-- 删除按钮 -->
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="showDelRoleDialog(scoped.row)">删除</el-button>
                            <!-- 分配角色按钮 -->
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRightTree(scoped.row)">分配权限</el-button>
                        </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加角色对话框 -->
        <el-dialog
          title="添加角色"
          :visible.sync="addRoledialogVisible"
          width="30%" @close="closeAddRoledialog">
            <!-- 内容主体 -->
        <el-form :model="addRoleForm" ref="addRolesRef" :rules="addRoleRules" label-width="100px" class="demo-ruleForm">
            <el-form-item label="角色名称" prop="name">
                <el-input v-model="addRoleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="desc">
                <el-input v-model="addRoleForm.desc"></el-input>
            </el-form-item>
        </el-form>    
          <!-- 内容底部 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addRoledialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRole">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 编辑角色弹出框 -->
        <el-dialog
          title="编辑角色"
          :visible.sync="editRoledialogVisible"
          width="30%" @close="closeEditRoledialog">
            <!-- 内容主体 -->
            <el-form :model="editRoleForm" ref="editRoleRef" :rules="editRoleRules" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名称">
                    <el-input v-model="editRoleForm.roleName" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>    
          <!-- 内容底部 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="editRoledialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRole">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 删除角色对话框 -->
        <el-dialog
          title="删除角色"
          :visible.sync="delRoleDialogVisible"
          width="30%">
          <!-- 内容主体区域 -->
          <span>是否删除角色</span>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="delRoleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="closeDelRoleDialog">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 分配权限对话框 -->
        <el-dialog
          title="分配权限"
          :visible.sync="showRoleDialogVisible"
          width="30%" @close="clearKeyArr">
            <!-- 对话框内容 -->
            <!-- 树形控件 -->
            <el-tree ref="treeRef" :data="rolesDataTree" :props="defaultProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="keyArr">
            </el-tree>
          <!-- 对话框底部 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="showRoleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateRoleRight">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            //接收角色数据
            rolesData: [],
            //添加角色的显示与隐藏
            addRoledialogVisible: false,
            //添加角色表单
            addRoleForm: {
                name: '',
                desc: ''
            },
            //添加角色表单验证
            addRoleRules: {
                name: [
                    {required:true, message: '角色名称不能为空', trigger: 'blur'}
                ],
                desc: [
                    {required:true, message: '角色描述不能为空', trigger: 'blur'}
                ]
            },
            //编辑角色弹出框的显示与隐藏
            editRoledialogVisible: false,     
            //编辑角色表单
            editRoleForm: {}, 
            //修改角色表单验证  
            editRoleRules: {
                roleDesc: [
                    {required:true, message: '角色描述不能为空', trigger: 'blur'}
                ]
            },    
            //删除角色对话框的显示与隐藏
            delRoleDialogVisible: false,
            //接收权限树状数据
            rolesDataTree: [],
            // 分配权限对话框的显示与隐藏
            showRoleDialogVisible: false,
            //树形控件展示的数据字段和嵌套依据
            defaultProps: {
                children: 'children',
                label: 'authName'
            },
            //树形图权限数据的勾选数组
            keyArr: [],
            //当前即将分配权限的角色的id
            roleId: ''
        }
    },
    created: function() {
        // 调用接口获取权限列表数据
        this.getRoleList()
    },
    methods: {
        //接口获取权限列表
        async getRoleList() {
            let { data: res } = await this.$http.get('roles')
            if(res.meta.status !==  200) return this.$message.error('获取角色列表失败')
            this.rolesData = res.data
            this.$message.success('获取角色列表成功')
            // console.log(res);
        },
        //添加角色
        addRole() {
            this.$refs.addRolesRef.validate( async bol => {
                if(!bol) return 
                let { data: res } = await this.$http.post('roles', {
                    roleName: this.addRoleForm.name,
                    roleDesc: this.addRoleForm.desc
                })
                if(res.meta.status !== 201) return this.$message.error('添加角色失败')
                this.getRoleList();
                this.$message.success('添加角色成功')
                this.addRoledialogVisible = false
            })
            
        },
        //添加角色弹出框关闭
        closeAddRoledialog() {
            //关闭时清空表单
            this.$refs.addRolesRef.resetFields()
        },
        // 编辑修改角色
        async showEditRoleDialog(role) {
            this.editRoledialogVisible = true        
            let {data: res} = await this.$http.get(`roles/${role.id}`)
            if(res.meta.status !== 200) return this.$message,error('编辑失败')
            this.editRoleForm = res.data
            
        },
        // 关闭表单重置表单数据
        closeEditRoledialog() {
            this.$refs.editRoleRef.resetFields();
        },
        //修改用户提交
        editRole: function() {
            this.$refs.editRoleRef.validate(async bol => {
                if(!bol) return 
                let { data: res } = await this.$http.put(`roles/${this.editRoleForm.roleId}`, {
                    roleName: this.editRoleForm.roleName,
                    roleDesc: this.editRoleForm.roleDesc
                })
                // console.log(this.editRoleForm.roleId);
                if(res.meta.status !== 200) return this.$message.error('修改失败')
                this.getRoleList()
                this.$message.success('修改成功')
                this.editRoledialogVisible = false
            })
        },
        //点击删除按钮弹出删除角色对话框
        showDelRoleDialog(role) {
            this.roleId = role.id
            this.delRoleDialogVisible = true
        },
        // 删除角色提交
        async closeDelRoleDialog() {
            let { data: res } = await this.$http.delete(`roles/${this.roleId}`)
            // console.log(res);
            if(res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            this.getRoleList();
            this.delRoleDialogVisible = false
        },
        //获取树状数据
        async getRolesDataTree() {
            let { data: res } = await this.$http.get('rights/tree')
            this.rolesDataTree = res.data
            // console.log(res);
        },
        //根据id删除三级标签
        async removeRight(role, rightId) {
            // 确定删除弹出框
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).catch(err => err);

            if(confirmResult !== 'confirm') {
                return this.$message.info('取消了删除')
            }
            
            let { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if(res.meta.status !== 200) return this.$message.error('删除权限失败')
            // this.getRoleList()
            role.children = res.data
            this.$message.success('删除权限成功')


            console.log('确认了删除');
        },
        // 展示分配权限的对话框
        showRightTree(role) {
            this.roleId = role.id
            this.showRoleDialogVisible = true
            this.getRolesDataTree()
            this.getKeyArr(role, this.keyArr)

        },
        //通过递归获取所有角色的三级权限的id 并保存到数组中
        getKeyArr(node, arr) {
            // 如果node节点不包含children树形  就是三级节点
            if(!node.children) {
                return arr.push(node.id)
            }

            node.children.forEach(item => {
                this.getKeyArr(item, arr)
            })
        },
        //清空保留的勾选数组 keyArr
        clearKeyArr() {
            this.keyArr = []
        },
        // 授权角色权限
        async updateRoleRight() {
            //获取所有的选中和班选中节点的id 数组
            const keys = [...this.$refs.treeRef.getCheckedKeys(),
                        ...this.$refs.treeRef.getHalfCheckedKeys()
                        ]
            //权限数组转化为字符串
            const keysStr = keys.join(',')
            let { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
                rids: keysStr
            })
            if(res.meta.status !== 200) return this.$message.error('更新失败')
            // console.log(keysStr);
            this.$message.success('更新成功')
            this.getRoleList()
            this.showRoleDialogVisible = false
        }
    }
}
</script>

<style lang="less" scoped>
    .el-button {
        margin-bottom: 10px;
    }
    .el-tag {
        margin: 10px 5px 10px 0;
    }
    .el-row {
        display: flex;
        margin: 0;
        align-items: center;
    }
    .bdtop {
        border-top: 1px solid #eee;
    }
    .bdbottom {
        border-bottom: 1px solid #eee;
    }
</style>