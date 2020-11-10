<template>
    <div class="current">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <!-- 头部搜索商品和添加商品区域 -->
            <el-row>
              <el-col :span="7">
                    <!-- 搜索商品输入框 -->
                    <el-input placeholder="请输入内容" v-model="queryData.query" class="input-with-select" clearable @clear="clearInput">
                      <el-button slot="append" icon="el-icon-search" @click="searchGoodsByQuery"></el-button>
                    </el-input>
              </el-col>
              <el-col :span="4">
                    <!-- 添加商品按钮 -->
                    <el-button type="primary">添加商品</el-button>
              </el-col>
            </el-row>
            <!-- table表格区域 -->
            <el-table :data="goodsData.goods" border style="width: 100%">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column prop="goods_price" label="商品价格" width="100"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="100"></el-table-column>
                <el-table-column prop="add_time" label="创建时间" width="200">
                    <!-- 通过作用域插槽把时间格式化 -->
                    <template slot-scope="scoped">
                        {{scoped.row.add_time | dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <!-- 作用域插槽 -->
                    <template slot-scope="scoped">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scoped.row)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="showDelDialog(scoped.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 底部页码区域 -->
            <el-pagination @size-change="pageSizeChange" 
                @current-change="currentPageChange" 
                :current-page="queryData.pagenum" 
                :page-sizes="[7, 12, 18, 22]" 
                :page-size="queryData.pagesize" 
                layout="total, sizes, prev, pager, next, jumper" 
                :total="goodsData.total" background>
            </el-pagination>
        </el-card>
        <!-- 删除对话框 -->
        <el-dialog
          title="删除商品"
          :visible.sync="delDialogVisible"
          width="30%">
          <!-- 主体区域 -->
          <span>是否确定永久删除商品</span>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="delDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="delGood">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
import rights_listVue from './rights_list.vue'
export default {
    data() {
        return {
            // 绑定搜索商品输入框数据
            searchGoods: '',
            goodsData: [],
            //获取商品数据时提交的参数表单
            queryData: {
                query: '',
                pagenum: 1,
                pagesize: 7
            },
            // 删除商品对话框的显示与隐藏
            delDialogVisible: false,
            // 删除商品时的id
            delId: 0
        }
    },
    created() {
        this.getGoodsData()
    },
    methods: {
        async getGoodsData() {
            let { data: res } = await this.$http.get('goods', {
                params: this.queryData
            })
            console.log(res);
            if(res.meta.status !== 200) return this.$message.error('商品列表获取失败')
            this.goodsData = res.data
            this.$message.success('商品列表获取成功')
        },
        // 每行显示的商品条数改变时
        pageSizeChange(newSize) {
            this.queryData.pagesize = newSize
            this.getGoodsData()
        },
        // 当前的页码改变
        currentPageChange(newSize) {
            this.queryData.pagenum = newSize
            this.getGoodsData()
        },
        // 特定参数搜索商品
        async searchGoodsByQuery() {
            if(this.queryData.query.trim() === '') return
            let { data: res } = await this.$http.get('goods', {
                params: this.queryData
            })
            console.log(res);
            if(res.meta.status !== 200) return this.$message.error('搜索失败')
            this.goodsData = res.data
            this.$message.success('搜索成功')
        },
        // 清空输入框时触发
        clearInput() {
            this.getGoodsData()
        },
        // 展示删除商品对话框
        showDelDialog(data) {
            this.delDialogVisible = true
            this.delId = data.goods_id
        },
        // 删除商品提交
        async delGood() {
            let { data: res } = await this.$http.delete(`goods/${this.delId}`)
            if(res.meta.status !== 200) return this.$message.error('删除失败')
             this.getGoodsData()
             this.$message.success('删除成功')
             this.delDialogVisible = false
        }
    }
}
</script>

<style lang="less" scoped>
    .el-col-7 {
        margin-right: 10px;
    }
    .el-row {
        margin-bottom: 15px;
    }
    .el-table {
        margin-bottom: 25px;
    }
</style>