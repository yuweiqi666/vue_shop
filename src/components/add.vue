<template>
    <div class="current">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 头部提示信息 -->
            <el-alert
              title="添加商品信息"
              type="info"
              center
              show-icon
              :closable="false">
            </el-alert>
            <!-- 步骤条 -->
            <el-steps :space="200" :active="stepData - 0" finish-status="success" align-center>
              <el-step title="基本信息"></el-step>
              <el-step title="商品参数"></el-step>
              <el-step title="商品属性"></el-step>
              <el-step title="商品图片"></el-step>
              <el-step title="商品内容"></el-step>
              <el-step title="完成"></el-step>
            </el-steps>
            <!-- 竖向tab栏区域 -->
            <el-form :model="addGoodsForm" :rules="addGoodsRules" ref="addGoodsRef" label-width="100px" label-position="top">
                <el-tabs tab-position="left" v-model="stepData" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                  <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addGoodsForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addGoodsForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addGoodsForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addGoodsForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类">
                            <el-cascader
                                v-model="selectGoodsClass"
                                :options="classForm"
                                :props="classConfig"
                                @change="goodsClassChange"
                                clearable></el-cascader>
                        </el-form-item>
                  </el-tab-pane>
                  <el-tab-pane label="商品参数" name="1">
                      <!-- 动态参数数据 -->
                      <el-form-item :key="item.attr_id" :label="item.attr_name" v-for="item in queryData">
                            <!-- 复选框 -->
                            <el-checkbox-group v-model="item.attr_vals">
                              <el-checkbox :key="i" :label="item2" v-for="(item2, i) in item.attr_vals" border></el-checkbox>
                            </el-checkbox-group>
                      </el-form-item>
                  </el-tab-pane>
                  <el-tab-pane label="商品属性" name="2">
                        <!-- 静态属性数据  循环attrData获取属性数据-->
                        <el-form-item :key="item.attr_id" :label="item.attr_name" v-for="item in attrData">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                  </el-tab-pane>
                  <el-tab-pane label="商品图片" name="3">
                        <el-upload
                          :action="uploadUrl"
                          :on-preview="handlePreview"
                          :on-remove="handleRemove"
                          :headers="headerObj"
                          list-type="picture"
                          :on-success="handleSuccess">
                          <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                  </el-tab-pane>
                  <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器组件 -->
                        <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
                        <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
                  </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片预览对话框 -->
        <el-dialog
          title="预览图片"
          :visible.sync="imgPreDialogVisible"
          width="30%">
          <img :src="previewUrl" alt="" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'
import loginVue from './login.vue'
export default {
    data() {
        return {
            // 步骤条所处的位置
            stepData:'0',
            // 新增商品数据表单
            addGoodsForm: {
                goods_name: '',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                goods_cat: [],
                pics: [],
                // 商品的详情描述
                goods_introduce: '',
                attrs: []
            },
            //新增商品表单验证规则
            addGoodsRules: {
                goods_name: [
                    {required: true, message: '商品名称不能为空', trigger: 'blur'}
                ],
                goods_price: [
                    {required: true, message: '商品价格不能为空', trigger: 'blur'}
                ],
                goods_weight: [
                    {required: true, message: '商品重量不能为空', trigger: 'blur'}
                ],
                goods_number: [
                    {required: true, message: '商品数量不能为空', trigger: 'blur'}
                ]
            },
            // 商品分类数据
            classForm: [],
            // 选择的商品分类
            selectGoodsClass: [],
            // 联级选择器配置
            classConfig: {
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // 商品动态参数数据
            queryData: [],
            //商品静态属性数据
            attrData: [],
            // 上传图片的url地址
            uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
            // 文件上传时请求头对象
            headerObj: {
                Authorization: window.sessionStorage.getItem('ss')
            },
            // 预览图片时的图片url地址
            previewUrl: '',
            // 图片预览窗口的显示与隐藏
            imgPreDialogVisible: false
        }
    },
    created() {
        this.getGoodsClass()
    },
    methods: {
        //获取商品分类数据
        async getGoodsClass() {
            let { data: res } = await this.$http.get('categories', {
                params: {
                    type: 3
                }
            })
            if(res.meta.status !== 200) return this.$message.error('获取商品分类数据失败')
            this.classForm = res.data
            this.$message.success('获取分类数据成功')
        },
        // 级联选择器分类数据发生变化时触发的函数
        goodsClassChange() {
            if(this.selectGoodsClass.length < 3) {
                this.selectGoodsClass = []
            }
            console.log(this.selectGoodsClass);
            this.addGoodsForm.goods_cat = this.selectGoodsClass
        },
        // tab切换之前触发的函数
        beforeTabLeave(activeName, oldActiveName) {
            if(oldActiveName === '0' && this.selectGoodsClass.length !== 3) {
                this.$message.error('请先选择商品分类')
                return false
            }
        },

        async tabClicked() {
            // 访问动态参数面板
            if(this.stepData === '1') {
                let { data: res } = await this.$http.get(`categories/${this.selectGoodsClass[2]}/attributes`, {
                    params: {
                        sel: 'many'
                    }
                })
                if(res.meta.status !== 200) return this.$message.error('获取参数失败')
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
                })
                this.queryData = res.data
                this.$message.success('获取参数成功')
                console.log(this.queryData);
            } else if(this.stepData === '2') {
                let { data: res } = await this.$http.get(`categories/${this.selectGoodsClass[2]}/attributes`, {
                    params: {
                        sel: 'only'
                    }
                })
                if(res.meta.status !== 200) return this.$message.error('获取参数失败')
                this.attrData = res.data
                this.$message.success('获取参数成功')
                console.log(this.attrData);
            }
        },
        // 处理图片预览效果 
        handlePreview(file) {
            this.previewUrl = file.response.data.url
            this.imgPreDialogVisible = true
            console.log(this.previewUrl);
        },
        //处理图片移除事件
        handleRemove(file) {
            const filePath = file.response.data.tmp_path
            // console.log(file);
            const i = this.addGoodsForm.pics.findIndex(x => {
                x.pic ===  filePath
            })
             this.addGoodsForm.pics.splice(i, 1)
             console.log(this.addGoodsForm);
        },
        // 监听图片上传成功事件
        handleSuccess(response) {
            // console.log(response);
            const picInfo = {
                pic: response.data.tmp_path 
            }
            this.addGoodsForm.pics.push(picInfo)
            console.log(this.addGoodsForm);
        },
        // 点击添加商品按钮
        addGoods() {
            this.$refs.addGoodsRef.validate(async bol => {
                if(!bol) return this.$message.error('信息填写有误')
                // 对addGoodsForm进行深拷贝  为了将addGoodsForm中的goods_cats属性转化为带‘，’的字符串
                const form = _.cloneDeep(this.addGoodsForm)
                form.goods_cat = form.goods_cat.join(',')
                //为addGoodsForm表单处理动态参数 
                this.queryData.forEach(item => {
                    const newInfo = {}
                    newInfo.attr_id = item.attr_id
                    newInfo.attr_value = item.attr_vals.join(',')
                    this.addGoodsForm.attrs.push(newInfo)
                })
                //为addGoodsForm表单处理静态属性
                this.attrData.forEach(item => {
                    const newInfo = {}
                    newInfo.attr_id = item.attr_id
                    newInfo.attr_value = item.attr_vals
                    this.addGoodsForm.attrs.push(newInfo)
                })
                form.attrs = this.addGoodsForm.attrs
                // 调用接口添加商品
                let { data: res } = await this.$http.post('goods', form)
                console.log(res);
                console.log(form);
                if(res.meta.status !== 201) return this.$message.error(res.meta.msg)
                // 返回步骤1， 重置清空表单
                // this.stepData = '0'
                // this.$refs.addGoodsRef.resetFields()
                this.$router.push('/goods')
                this.$message.success('商品添加成功')
            })
        }

    }
}
</script>

<style lang="less" scoped>
    .el-alert {
        margin-bottom: 20px;
    }
    .el-steps {
        margin-bottom: 20px;
    }
    .el-checkbox {
        margin: 0;
    }
    .previewImg {
        width: 100%;
    }
    .btnAdd {
        margin-top: 15px;
    }
</style>