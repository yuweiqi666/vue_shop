<template>
    <div class="current">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <!-- 头部警告文字 -->
            <el-alert show-icon title="注意！只允许为第三方分类设置相关参数" type="warning" :closable="false"></el-alert>
            <!-- 选择商品分类 -->
            <el-row>
                <el-col>
                    <span>选择商品分类：</span>
                    <!--选择商品分类的 级联选择器 -->
                    <el-cascader
                        v-model="selectClassData"
                        :options="classData"
                        :props="classProps"
                        @change="classChange"
                        :clearable="true">
                    </el-cascader>
                    <!-- tabs标签页 -->
                    <el-tabs v-model="activeName" @tab-click="tabClick">
                       <!-- 动态参数标签页 -->
                       <el-tab-pane label="动态参数" name="many">
                           <el-button type="primary" size="mini" :disabled="tabFlag" @click="showAddParams">添加参数</el-button>
                           <el-table :data="attrData" border style="width: 100%">
                                <el-table-column type="expand">
                                    <template slot-scope="scoped">
                                        <!-- 循环渲染标签 -->
                                        <el-tag :key="i" v-for="(item, i) in scoped.row.attr_vals" closable @close="closeTag(scoped.row, i)">
                                            {{item}}
                                        </el-tag>
                                        <!-- 添加标签 -->
                                        <el-input
                                          class="input-new-tag"
                                          v-if="scoped.row.inputVisible"
                                          v-model="scoped.row.inputValue"
                                          ref="saveTagInput"
                                          size="mini"
                                          style="width: 5%"
                                          @keyup.enter.native="handleInputConfirm(scoped.row)"
                                          @blur="handleInputConfirm(scoped.row)"
                            
                                        >
                                        </el-input>
                                        <el-button v-else class="button-new-tag" size="mini" @click="showInput(scoped.row)">+ New Tag</el-button>

                                    </template>
                                </el-table-column>
                                <el-table-column type="index" label="#"></el-table-column>
                                <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                                <el-table-column label="操作">
                                    <!-- 作用域插槽 -->
                                    <template slot-scope="scoped">
                                        <el-button type="primary" @click="showEditParams(scoped.row)">修改</el-button>
                                        <el-button type="danger" @click="showDelParams(scoped.row)">删除</el-button>
                                    </template>
                                </el-table-column>
                           </el-table>
                       </el-tab-pane>
                       <!-- 静态属性标签页 -->
                       <el-tab-pane label="静态属性" name="only">
                           <el-button type="primary" size="mini" :disabled="tabFlag" @click="showAddParams">添加属性</el-button>
                           <el-table :data="attrData" border style="width: 100%">
                               <el-table-column type="expand">
                                    <template slot-scope="scoped">
                                        <!-- 循环渲染标签 -->
                                        <el-tag :key="i" v-for="(item, i) in scoped.row.attr_vals" closable @close="closeTag(scoped.row, i)">
                                            {{item}}
                                        </el-tag>
                                        <!-- 添加标签 -->
                                        <el-input
                                          class="input-new-tag"
                                          v-if="scoped.row.inputVisible"
                                          v-model="scoped.row.inputValue"
                                          ref="saveTagInput"
                                          size="mini"
                                          style="width: 5%"
                                          @keyup.enter.native="handleInputConfirm(scoped.row)"
                                          @blur="handleInputConfirm(scoped.row)"
                            
                                        >
                                        </el-input>
                                        <el-button v-else class="button-new-tag" size="mini" @click="showInput(scoped.row)">+ New Tag</el-button>

                                    </template>
                                </el-table-column>
                                <el-table-column type="index" label="#"></el-table-column>
                                <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                                <el-table-column label="操作">
                                    <!-- 作用域插槽 -->
                                    <template slot-scope="scoped">
                                        <el-button type="primary" @click="showEditParams(scoped.row)">修改</el-button>
                                        <el-button type="danger" @click="showDelParams(scoped.row)">删除</el-button>
                                    </template>
                                </el-table-column>
                           </el-table>
                       </el-tab-pane>
                    </el-tabs>
                </el-col>
            </el-row>
        </el-card>
        <!-- 添加参数对话框 -->
        <el-dialog
          title="添加动态参数"
          :visible.sync="addParamsVisible"
          width="50%" @close="addParamsClose">
          <!-- 内容主体区域  -->
            <el-form :model="addParamsForm" :rules="addParamsRules" ref="addParamsRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="参数名称" prop="attr_name">
                    <el-input v-model="addParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addParamsVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParams">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 修改参数对话框 -->
        <el-dialog
          title="修改动态参数"
          :visible.sync="editParamsVisible"
          width="50%" @close="editParamsClose">
          <!-- 内容主体区域  -->
            <el-form :model="editParamsForm" :rules="editParamsRules" ref="editParamsRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="参数名称" prop="attr_name">
                    <el-input v-model="editParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="editParamsVisible = false">取 消</el-button>
            <el-button type="primary" @click="editParams">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 删除参数对话框 -->
        <el-dialog
          title="删除参数"
          :visible.sync="delParamsVisible"
          width="50%">
          <!-- 内容主体区域  -->
          <span>是否删除参数</span>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="delParamsVisible = false">取 消</el-button>
            <el-button type="primary" @click="delParams">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 获取的分类数据
            classData: [],
            //选择的分类数据的配置
            classProps: {
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
            },
            // 选择的分类数据
            selectClassData: [],
            //默认展示的标签页
            activeName: 'many',
            // tab中按钮是否可用
            tabFlag: true,
            // 选择的三级分类的分类id
            classId: 0,
            //获取的参数（属性）数据
            attrData: [],
            //添加参数对话框的显示与隐藏
            addParamsVisible: false,
            //添加分类表单数据
            addParamsForm: {
                attr_name: ''
            },
            //添加参数 表单规则
            addParamsRules: {
                attr_name: [
                    { required: true, message: '参数名称不能为空',  trigger: 'blur' }
                ]
            },
            //修改参数对话框的显示与隐藏
            editParamsVisible: false,
            //修改参数数据表单
            editParamsForm: {
                attr_name: ''
            },
            //修改表单输入规则
            editParamsRules: {
                attr_name: [
                    { required: true, message: '参数名称不能为空', trigger: 'blur' }
                ]
            },
            // 即将修改的参数id
            editAttrId: 0,
            // 删除对话框的显示与隐藏
            delParamsVisible: false,
            // 将要删除的参数id
            delAttrId: 0,
        }
    },
    created() {
        this.getClassData()
        
    },
    methods: {
        async getClassData() {
            let { data: res } = await this.$http.get('categories', {
                params: {
                    type: 3
                }
            })
            if(res.meta.status !== 200) return this.$message.error('获取分类数据失败')
            this.$message.success('分类数据获取成功')
            this.classData = res.data
            // console.log(this.classData);
        },
        // 获取分类参数列表
        async getParamsData() {
            let { data: res } = await this.$http.get(`categories/${this.classId}/attributes`, {
                params: {
                    sel: this.activeName
                }
            })
            console.log(res);
            if(res.meta.status !== 200) return this.$message.error('属性参数获取失败')
            // 将返回数据的attr_vals数据从字符串变为数组
            res.data.forEach( item => {
                // 三元表达式看attr_vals是否为空
                item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
                // 让每一个参数数据中的inputVisible 和 inputValue都不一样
                item.inputVisible = false,
                item.inputValue = ''
            })
            this.attrData = res.data
            this.$message.success('属性参数获取成功')
        },
        // 分类数据发生改变时
        async classChange() {
            // console.log(this.selectClassData);
            // 级联选择器不为空时添加静态属性和动态参数才可以点击
            if(this.selectClassData.length == 3) {
                this.tabFlag = false
                 this.classId = this.selectClassData[this.selectClassData.length -1]
            } else {
                this.tabFlag = true
                this.selectClassData = []
                this.attrData = []
                return
            }
            // console.log(this.classId);
            this.getParamsData()
        },
        // tab点击事件的处理函数
        tabClick() {
            this.classChange()
        },
        //展示添加参数对话框
        showAddParams() {
            this.addParamsVisible = true
        },
        // 添加参数对话框关闭时重置表单
        addParamsClose() {
            // 重置表单
            this.$refs.addParamsRef.resetFields()
            // this.addParamsForm = {}
        },
        //添加动态参数提交
        addParams() {
            this.$refs.addParamsRef.validate(async bol => {
                if(bol == false) return
                let { data: res1 } = await this.$http.post(`categories/${this.classId}/attributes`, {
                    attr_name: this.addParamsForm.attr_name,
                    attr_sel: this.activeName
                })
                if(res1.meta.status !== 201) return this.$message.error('添加参数失败')
                this.addParamsVisible = false
                // 重新获取参数列表
                this.getParamsData()
                this.$message.success('添加参数成功')
            })
        },
        // 显示修改参数对话框
        showEditParams(data) {
            this.editParamsVisible = true
            this.editAttrId = data.attr_id
            console.log(data);
            this.editParamsForm.attr_name = data.attr_name
        },
        //修改表单输入框关闭 重置表单数据
        editParamsClose() {
            // 重置表单数据
            this.$refs.editParamsRef.resetFields()
        },
        // 修改参数提交 
        editParams() {
            this.$refs.editParamsRef.validate(async bol => {
                if(!bol) return
                let { data: res } = await this.$http.put(`categories/${this.classId}/attributes/${this.editAttrId}`, {
                    attr_name: this.editParamsForm.attr_name,
                    attr_sel: this.activeName
                })
                if(res.meta.status !== 200) return this.$message.error('修改失败')
                this.getParamsData()
                this.$message.success('修改成功')
                this.editParamsVisible = false
            })
        },
        // 弹出删除参数对话框
        async showDelParams(data) {
            // console.log(data);
            this.delAttrId = data.attr_id
            this.delParamsVisible = true
        },
        // 点击删除按钮
        async delParams() {
            let { data: res } = await this.$http.delete(`categories/${this.classId}/attributes/${this.delAttrId}`)
            console.log(res);
            if(res.meta.status !==  200) return this.$message.error('删除失败')
            // 重新获取属性参数数据
            this.getParamsData()
            this.delParamsVisible = false
            this.$message.success('删除成功')
        },
        // 点击新增标签按钮显示输入框
        showInput(data) {
            data.inputVisible = true
            // 自动获取焦点   $nextTick就是当页面上的元素被重新渲染之后才会执行回调函数的代码
            this.$nextTick(_ => {
              this.$refs.saveTagInput.$refs.input.focus();
            })

        },
        // 显示输入框时点击回车或者失去焦点时
        async handleInputConfirm(data) {
            if(data.inputValue.trim() !== '') {
                data.attr_vals.push(data.inputValue.trim()) 
                // this.getParamsData()
                data.inputValue = ''
                //发起编辑提交参数
                let { data: res } = await this.$http.put(`categories/${this.classId}/attributes/${data.attr_id}`, {
                    attr_name: data.attr_name,
                    attr_sel: this.activeName,
                    attr_vals: data.attr_vals.join(',')
                })
                if(res.meta.status !== 200) return this.$message.error('编辑参数失败')
                this.$message.success('编辑参数成功')
                
            }

            data.inputVisible = false
            
        },
        //删除标签
        async closeTag(data, i) {
            data.attr_vals.splice(i, 1)
            let { data: res } = await this.$http.put(`categories/${this.classId}/attributes/${data.attr_id}`, {
                    attr_name: data.attr_name,
                    attr_sel: this.activeName,
                    attr_vals: data.attr_vals.join(',')
            })
            if(res.meta.status !== 200) return this.$message.error('编辑参数失败')
            this.$message.success('编辑参数成功')
        }
    }
}
</script>

<style lang="less" scoped>
    .el-alert {
        margin-bottom: 15px;
    }
    .el-cascader {
        margin-bottom: 20px;
    }
    .el-button {
        margin-bottom: 20px;
    }
    .el-tag {
        margin-right: 8px;
    }
</style>