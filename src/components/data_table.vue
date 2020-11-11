<template>
    <div class="current">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>数据统计</el-breadcrumb-item>
          <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- card区域 -->
        <el-card>
            <div id="main" style="width: 800px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
// 导入echarts插件
import echarts from 'echarts'

//导入lodash用于合并对象
import _ from 'lodash'

export default {
    data() {
        return {
        // 需要合并的数据
            options: {
               title: {
                 text: '用户来源'
               },
               tooltip: {
                 trigger: 'axis',
                 axisPointer: {
                   type: 'cross',
                   label: {
                     backgroundColor: '#E9EEF3'
                   }
                 }
               },
               grid: {
                 left: '3%',
                 right: '4%',
                 bottom: '3%',
                 containLabel: true
               },
               xAxis: [
                 {
                   boundaryGap: false
                 }
               ],
               yAxis: [
                 {
                   type: 'value'
                 }
               ]
             }

        }
    },
    created() {
        
    },
    // 此时页面上的元素已经被渲染完毕了
    async mounted() {
         // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        let { data: res } = await this.$http.get('reports/type/1')
        if(res.meta.status !== 200) return this.$message.error('图表获取失败')
        this.$message.success('图表获取成功')

        const result = _.merge(res.data, this.options)
        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(result);
    }
    
}
</script>

<style lang="less" scoped>

</style>