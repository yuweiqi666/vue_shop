<template>
    <div class="current">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <!-- 添加分类按钮 -->
            <el-row>
                <el-button type="primary" @click="showAddClassDialog">添加分类</el-button>
            </el-row>
            <!-- 商品分类表格 -->
            <tree-table :data="goodsClassData" :columns="columns" 
            :selection-type="false" :expand-type="false" :show-index="true" index-text="#"
            :border="true" :show-row-hover="false" width="100%">
                <!-- 是否有效列 作用域插槽 -->
                <template slot="isok" slot-scope="scoped">
                    <i class="el-icon-success" v-if="scoped.row.cat_deleted === false" style="color: lightgreen"></i>
                    <i class="el-icon-error" v-else style="color: red"></i>
                </template>
                <!-- 排序等级 作用域插槽 -->
                <template slot="order" slot-scope="scoped">
                    <el-tag size="mini" v-if="scoped.row.cat_level == 0">一级</el-tag>
                    <el-tag size="mini" v-if="scoped.row.cat_level == 1" type="success">二级</el-tag>
                    <el-tag size="mini" v-if="scoped.row.cat_level == 2" type="warning">三级</el-tag>
                </template>
                <!-- 操作列 作用域插槽 -->
                <template slot="opt" slot-scope="scoped">
                    <el-button type="primary" icon="el-icob-edit" size="mini" @click="showEditGoodClass(scoped.row)">操作</el-button>
                    <el-button type="danger" icon="el-icob-delete" size="mini" @click="showDelGoodClass(scoped.row)">删除</el-button>
                </template>
            </tree-table>
            <!-- 底部页码 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
            :current-page="queryData.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryData.pagesize" 
            layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加分类对话框 -->
        <el-dialog
          title="添加分类"
          :visible.sync="addClassDialogVisible"
          width="30%" @close="clearClassDialog">
          <!-- 内容主体 -->
            <el-form :model="addClassForm" :rules="addClassRules" ref="addClassRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="分类名称：" prop="name">
                  <el-input v-model="addClassForm.name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：">
                    <!-- 级联选择器 -->
                    <el-cascader
                        v-model="selectClassData"
                        :options="parentClassData"
                        :props="addClassProps"
                        @change="parentClassChange"
                        :clearable="true"
                        :change-on-select="true">
                    </el-cascader>
                </el-form-item>
            </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addClassDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addClass">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 编辑分类对话框 -->
        <el-dialog 
        title="修改分类"
        :visible.sync="editClassDialogVisible"
        width="30%" @close="clearClassDialog">
            <!-- 内容主体 -->
            <el-form :model="editClassForm" :rules="editClassRules" ref="addClassRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="分类名称：" prop="cat_name">
                  <el-input v-model="editClassForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editClassDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editGoodClass">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 删除分类对话框 -->
        <el-dialog 
        title="删除分类"
        :visible.sync="delClassDialogVisible"
        width="30%">
            <!-- 内容主体 -->
            <span>是否确定删除分类？</span>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="delClassDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="delGoodClass">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            //商品分类列表
            goodsClassData: [],
            //商品分类数据表格列的配置
            columns: [{
                label: '分类名称',
                prop: 'cat_name'
            }, {
                label: '是否有效',
                // 表示当前列定义为模板列
                type: 'template',
                // 表示当前这一列使用的模板名称
                template: 'isok'
            }, {
                label: '排序',
                type: 'template',
                template: 'order'
            }, {
                label: '操作',
                type: 'template',
                template: 'opt'
            }],
            // 调用商品分类列表参数
            queryData: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            // 数据条数
            total: 0,
            //添加分类对话框的显示与隐藏
            addClassDialogVisible: false,
            //添加分类数据
            addClassForm: {
                name: '',
                // 默认添加的是一级分类
                class_level: 0,
                class_pid: 0
            },
            //表单验证规则
            addClassRules: {
                name: [
                    {required: true, message: '请输入分类名称', trigger: 'blur'}
                ]
            },
            //点击添加分类分类时展示的父级分类的数据
            parentClassData: [],
            // 级联选择器的配置
            addClassProps: {
                expandTrigger: 'hover', 
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            //级联选择器选择的数据
            selectClassData: [],
            // 修改分类对话框的显示与隐藏
            editClassDialogVisible: false,
            //修改分类的数据表单
            editClassForm: {
                cat_name: '',
                id: 0
            },
            // 编辑分类对话框中表单的验证规则
            editClassRules: {
                cat_name: [
                    {required: true, message: '分类名称不能为空', trigger: 'blur' }
                ]
            },
            // 删除用户对话框的显示与隐藏
            delClassDialogVisible: false,
            //即将删除的用户的id数据
            delId: 0
        }
    },
    created() {
        // 获取商品分类数据
        this.getgoodsClassData()
    },
    methods: {
        async getgoodsClassData() {
            // 调用商品分类接口
            let { data: res } = await this.$http.get('categories', {
                params: this.queryData
            })
            console.log(res);
            if(res.meta.status !== 200) return this.$message.error('商品分类列表获取失败！')
            this.goodsClassData = res.data.result
            this.total = res.data.total
            this.$message.success('商品列表获取成功')
        },
        // 监听pageSize改变
        handleSizeChange(newSize) {
            this.queryData.pagesize = newSize
            this.getgoodsClassData()
        },
        //监听pagenum的改变
        handleCurrentChange(newPage) {
            this.queryData.pagenum = newPage
            this.getgoodsClassData()
        },
        //展示添加分类对话框
        async showAddClassDialog() {
            this.addClassDialogVisible = true
            let { data: res } = await this.$http.get('categories', {
                params: {
                    type: 2
                }
            })
            // console.log(res.data);
            if(res.meta.status !== 200) return this.$message.error('分类数据获取失败')
            this.parentClassData = res.data
            // console.log(this.parentClassData);
        },
        // 关闭添加分类对话框清空数据
        clearClassDialog() {
            // 重置表单
            this.$refs.addClassRef.resetFields()
            this.selectClassData = []
            this.addClassForm.class_level = {
                name: '',
                class_level: 0,
                class_pid: 0
            }

        },
        // 父类选项发生变化时触发的事件
        parentClassChange() {
        // console.log(this.selectClassData);
            
            if(this.selectClassData.length > 0) {
                this.addClassForm.class_pid = this.selectClassData[this.selectClassData.length - 1]
                this.addClassForm.class_level = this.selectClassData.length
            }else {
                this.addClassForm.class_pid = 0
                this.addClassForm.class_level = 0
            } 
            // console.log(this.addClassForm);
            return
        },
        //添加分类提交
        addClass() {
            this.$refs.addClassRef.validate(async bol => {
                // res为布尔值 验证规则不通过则返回false 通过返回true
                if(!bol) return
                let { data: res } = await this.$http.post('categories', {
                    cat_pid: this.addClassForm.class_pid,
                    cat_name: this.addClassForm.name,
                    cat_level: this.addClassForm.class_level
                })
                // console.log(res);
                if(res.meta.status !== 201) return this.$message.error('添加失败')
                this.getgoodsClassData()
                this.addClassDialogVisible = false
                this.$message.success('添加成功')
            })
        },
        //编辑分类提交
        showEditGoodClass(data) {
            this.editClassDialogVisible = true
            console.log(data);
            this.editClassForm.cat_name = data.cat_name
            this.editClassForm.id = data.cat_id
            
        },
        //编辑分类提交
        async editGoodClass() {
            let { data: res } = await this.$http.put(`categories/${this.editClassForm.id}`, {
                cat_name: this.editClassForm.cat_name
            })
            console.log(res);
            if(res.meta.status !== 200) return this.$message.error('修改失败')
            this.getgoodsClassData()
            this.$message.success('修改成功')
            this.editClassDialogVisible = false
        },
        //删除分类
        showDelGoodClass(data) {
            this.delClassDialogVisible = true
            this.delId =  data.cat_id
        },
        //删除分类提交
        async delGoodClass() {
            // console.log(this.delId);
            let { data: res } = await this.$http.delete(`categories/${this.delId}`)
            if(res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            this.getgoodsClassData()
            this.delClassDialogVisible = false
        }
        
    }
}
</script>

<style lang="less" scoped>
    .el-cascader {
        width: 100%;
    }
</style>