<template>
    <el-container>
        <!-- header区域 -->
        <el-header>
            <div>
                <img src="../assets/heima.png" alt="">
                <span> <router-link to="/welcome">电商后台管理系统</router-link> </span>
            </div>
            <el-button type="info" @click="logout">退出登录</el-button>
        </el-header>
        <!-- 内容区 -->
        <el-container>
            <!-- 左侧菜单栏 -->
            <el-aside :width="flag ? '64px' : '200px'">
                    <!-- 折叠条 -->
                    <div class="toggle-button" @click="toggle">|||</div>
                    <!-- 导航按钮 -->
                    <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" :unique-opened="true"  :collapse="flag" :collapse-transition="false" :router="true">
                        <!-- 一级菜单 -->
                        <el-submenu :key="item.id" v-for="item in menuList" :index="item.id + ''">
                            <!-- 一级菜单模板 -->
                            <template slot="title">
                              <i :class="iconsList[item.id]"></i>
                              <span>{{item.authName}}</span>
                            </template>
                            <!-- 二级菜单 -->
                            <el-menu-item :key="itemChildren.id" :index="'/' + itemChildren.path" v-for="itemChildren in item.children">
                                <template slot="title">
                                    <i class="el-icon-menu"></i>
                                    <span> {{itemChildren.authName}}</span>
                                </template>
                            </el-menu-item>
                        </el-submenu>                    
                    </el-menu>
            </el-aside>
            <!-- 右侧主体区 -->
            <el-main>
                <!-- 子路由占位符 -->
                <router-view></router-view>          
            </el-main>
        </el-container>
    </el-container>    
</template>

<script>
export default {
    data: function() {
        return {
            menuList: [],
            iconsList: {
                "125": 'iconfont icon-user',
                "103": 'iconfont icon-tijikongjian',
                "101": 'iconfont icon-shangpin',
                "102": 'iconfont icon-danju',
                "145": 'iconfont icon-baobiao'
            },
            flag: false
        }
    },
    methods: {
        logout() {
            window.sessionStorage.clear();
            this.$router.push('/login')
        },
        //获取所有的菜单
        async getMenuList() {
            let {data: res} = await this.$http.get('menus')
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.menuList = res.data
            // console.log(this.menuList);
        },
        //点击折叠菜单 
        toggle: function() {
            this.flag = !this.flag
        }
    },
    created: function() {
        this.getMenuList();
    }
}
</script>

<style lang="less" scoped>
    .el-container {
        height: 100%;
    }
    .el-header {
        display: flex;
        background-color: #373d41;
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color: #fff;
        font-size: 20px;
        > div {
            display: flex;
            align-items: center;
            span {
                margin-left: 15px;
            }
        }
    }
    .el-aside {
        background-color: #333744;
        .el-menu {
            border-right: 0;
        }
    }
    .el-main {
        background-color: #eaedf1;
        padding: 0;
    }
    i {
        padding-right: 5px;
    }
    .toggle-button {
        background-color: #4A5064;
        color: #fff;
        width: 100%;
        text-align: center;
        font-size: 10px;
        line-height: 24px;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>