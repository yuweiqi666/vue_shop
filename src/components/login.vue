<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avater_box">
                <img src="../assets/piao.jpg" alt="">
            </div>
            <!-- 登录表单区域 -->
            <el-form ref="loginFormRef" :model="loginForm" label-width="0px" class="login_form" :rules="loginFormRules">
                <!-- 用户名 -->
                <el-form-item prop="username">
                  <el-input class="inputVBtn" v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                  <el-input class="inputBtn" v-model="loginForm.password" prefix-icon="el-icon-unlock" type="password"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
      return {
        //登录表单的数据对象
        loginForm: {
          username: '',
          password: ''
        },
        loginFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
        //重置按钮
        resetLoginForm: function() {
            console.log(this);
            this.$refs.loginFormRef.resetFields();
        },
        login: function() {
            this.$refs.loginFormRef.validate(async valid => {
                if(!valid) return;
                let {data: res}  = await this.$http.post('login', this.loginForm)
                if(res.meta.status != 200) return this.$message.error('登录失败');
                this.$message.success('登录成功')
                console.log(res);
                //保存接口返回的token数据  用于保持登录状态
                window.sessionStorage.setItem("ss", res.data.token)
                this.$router.push('/home')
            })
            
        }
    }
      }
  
</script>

<style lang="less" scoped>
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
    }
    .login_box {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        max-width: 450px;
        height: 36%;
        min-height: 300px;
        background-color: #fff;
        border-radius: 3px;

        .avater_box {
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 130px;
            height: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            background-color: #fff;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
    }
    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .btns {
        display: flex;
        justify-content: flex-end;
    }
</style>
