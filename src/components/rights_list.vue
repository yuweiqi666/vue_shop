<template>
    <div class="current">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card class="box-card">
            <el-table :data="rightsData" border style="width: 100%">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="authName" label="权限名称"></el-table-column>
                <el-table-column prop="path" label="路径"></el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template slot-scope="scoped">
                        <el-tag v-if="scoped.row.level == '0'">一级</el-tag>
                        <el-tag v-else-if="scoped.row.level == '1'" type="success">二级</el-tag>
                        <el-tag v-else-if="scoped.row.level == '2'" type="warning">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rightsData : [],
            tagLevel: '',
        }
    }, 
    created: async function() {
        let { data: res } = await this.$http.get('rights/list')
        if(res.meta.status !== 200) return this.$message.error('获取权限列表失败')
        // console.log(res.data);
        this.rightsData = res.data
        this.$message.success('获取权限列表成功')
    }
}
</script>

<style lang="less" scoped>

</style>