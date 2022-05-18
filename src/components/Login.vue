<template>
  <div class="login-container">
    <div class="login_box">
      <img src="../assets/logo.png" />
      <!-- ------ -->
<div class="form_box">
<el-form  ref="loginFormRef" label-width="0" :model="loginForm" :rules="rules">
  <!-- 用户名 -->
  <el-form-item prop="username" >
    <el-input  v-model="loginForm.username"  prefix-icon="el-icon-user" placeholder="请输入用户名"></el-input>
  </el-form-item>
  <!-- 密码 -->
    <el-form-item prop="password">
    <el-input  type="password"  v-model="loginForm.password" prefix-icon="el-icon-unlock"  show-password  placeholder="请输入密码"></el-input>
  </el-form-item>
  <!-- 按钮 -->
     <el-form-item class="logandres">
    <el-button class="login" type="success" @click="login">登录</el-button>
     <el-button type="info" @click="reset">重置</el-button>
       </el-form-item >
</el-form>
</div>
      <!-- -------------- -->
    </div>
  </div>
</template>

<script>
 export default {
   data(){
     return {
 loginForm:{
  username:'admin',
  password:'123456'
},
rules:{
 username:[{required:true,message:'用户名不能为空',trigger:'blur' }],
 password:[
   {required:true,message:'密码不能为空',trigger:'blur'},
 {min:6,max:12,message:'长度在6-15位之间',trigger:'blur'}
 ]
},

     }
   },
    methods:{
   reset(){
     this.$refs.loginFormRef.resetFields()
   },
   login(){
     this.$refs.loginFormRef.validate( async valid=>{
       if(!valid) return
      const {data:res}= await this.$http.post('login',this.loginForm)
       if(res.meta.status!==200)
         return this.$message.error('登录失败')
       this.$message.success('登陆成功')
console.log(res.data)
       window.sessionStorage.setItem('token',res.data.token)
       this.$router.push('/home')
  
     })
   }



       },
 }
</script>

<style lang="less" scoped>
.login-container {
   height: 100%;
  background-color: #333;
 
  overflow: hidden;
  .login_box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 300px;
    background-color: #fff;
    border: 1px solid #fff;
    border-radius: 10px;
    font-size: 18px;
    img {
      position: absolute;
    //   top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120px;
      height: 120px;
      background-color: #333;
      border-radius: 50%;
      border:10px solid #fff
    }
   .form_box{
     margin-top:100px;
     padding:0px 20px;
   .el-input{
     font-size: 15px;
      
   }
   .el-input:focus{
     border-color:#333
   }
     .logandres{
       display: flex;
       justify-content:space-around;
       .login{
       background-color: rgba(65,184,131);
     }
     }
     
   }

  }
}
</style>