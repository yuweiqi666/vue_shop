<template>
    <div class="current">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
          <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- card区域 -->
        <el-card>
            <!-- 头部搜索订单 -->
            <el-row>
              <el-col :span="7">
                    <!-- 搜索订单输入框 -->
                    <el-input placeholder="请输入内容" v-model="orderForm.query" clearable @clear="clearInput">
                      <el-button slot="append" icon="el-icon-search" @click="searchOrders"></el-button>
                    </el-input>
              </el-col>
            </el-row>
            <!-- table表单区域 -->
            <el-table :data="orderData.goods" border style="width: 100%">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="order_number" label="订单编号"></el-table-column>
                <el-table-column prop="order_price" label="订单价格"></el-table-column>
                <el-table-column prop="order_pay" label="是否付款">
                    <template slot-scope="scoped">
                        <el-button type="success" plain v-if="scoped.row.order_pay === '1'" size="mini">已付款</el-button>
                        <el-button type="danger" v-else plain size="mini">未付款</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货"></el-table-column>
                <el-table-column prop="update_time" label="下单时间"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scoped">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="success" icon="el-icon-location-outline" size="mini"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 底部页码区域 -->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="orderForm.pagenum"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="orderForm.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="orderData.total" background>
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 获取订单数据用于提交接口的表单
            orderForm: {
                query: '',
                pagenum: 1,
                pagesize: 7
            },
            //从接口获取到的订单数据信息
            orderData: {}
        }
    },
    created() {
        this.getOrdersData()
    },
    methods: {
        //获取订单数据
        async getOrdersData() {
            let { data: res } = await this.$http.get('orders', {
                params: this.orderForm
            })
            // console.log(res);
            if(res.meta.status !== 200) return this.$message.error('获取订单数据失败')
            this.orderData = res.data
            this.$message.success('获取订单数据成功')
        },
        // 清空搜索表单触发的函数
        clearInput() {
            this.getOrdersData()
        },
        //点击搜索按钮触发的函数
        async searchOrders() {
            // console.log(this.orderForm);
            let { data: res } = await this.$http.get('orders', {
                params: this.orderForm
            })
            // console.log(res);
            if(res.meta.status !== 200) return this.$message.error('获取订单数据失败')
            this.orderData = res.data
            console.log(this.orderData);
            this.$message.success('获取订单数据成功')
        },
        // 每页显示多少数据改变时
        handleSizeChange(newSize) {
            this.orderForm.pagesize = newSize
            this.getOrdersData()
        },
        //当前页码改变时
        handleCurrentChange(newSize) {
            this.orderForm.pagenum = newSize
            this.getOrdersData()
        }
    }

}
</script>

<style lang="less" scoped>

</style>