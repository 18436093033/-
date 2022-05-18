<template>
  <div class="user_container">
    <!-- 面包屑导航区
       -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
  <el-row :gutter="20">
 <el-col :span="7">
  <el-input placeholder="请输入内容"  class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList">
    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
  </el-input>
 </el-col>
 <el-col :span="2">
   <el-button type="primary" @click="dialogVisible=true">添加</el-button>
 </el-col>
  </el-row>
  <!-- 用户列表区 -->
  <el-table :data="userlist" border stripe>
     <el-table-column type="index" label="#" ></el-table-column>
    <el-table-column label="姓名" prop="username" ></el-table-column>
    <el-table-column label="邮箱" prop="email" ></el-table-column>
       <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态">
            <!-- //作用域插槽 用scope拿到对应全部的数据，也就是userlist -->
            <!-- scope.row 是每一行的数据每一个用户 -->
            <template v-slot="scope">
              <el-switch v-model="scope.row.mg_state" @change="userStateChangeed(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200px" >
            <template v-slot="scope">
              <!-- 修改按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
             <!-- 分配角色按钮 -->
             <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRole(scope.row)"></el-button>
             </el-tooltip>
            </template>
          </el-table-column>

  </el-table>
  <!-- 分页 -->
<!-- 控制一次切换多少页@size-change="handleSizeChange" -->
<!-- 点击页码，或者下一页就会触发   @current-change="handleCurrentChange"-->
<!-- layout="total, sizes, prev, pager, next, jumper"表示展示哪些功能组件 -->
   <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2,1,3,4]"
      :page-size="queryInfo.querysize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="40%"
        @close="DialogClosed"
        >
        <!-- 添加用户主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="ruleFormRef" label-width="70px" >
          <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
           </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
           </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
           </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
           </el-form-item>
        </el-form>
        <!-- 添加用户底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
       <el-button type="primary"  @click="addUser">添加</el-button>
        </span>
    </el-dialog>
        <!-- 修改用户的对话框 -->
    <el-dialog
        title="修改用户信息"
        :visible.sync="editDialogVisible"
        width="40%"
        @close="editDialogClosed"
        >
        <!-- 修改用户主体区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editRuleFormRef" label-width="70px" >
          <el-form-item label="用户名">
              <el-input v-model="editForm.username" disabled></el-input>
           </el-form-item>
           <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email" ></el-input>
           </el-form-item>
           <el-form-item label="手机号" prop="mobile">
              <el-input v-model="editForm.mobile" ></el-input>
           </el-form-item>
        </el-form>
        <!-- 修改用户底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
       <el-button type="primary" @click="editUserInfo">修改</el-button>
        </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
  title="分配角色"
  :visible.sync="setRoledialogVisible"
  width="40%">
 <div>
   <p>当前用户{{userInfo.userName}}</p>
  <p>当前角色{{userInfo.roleDesc}}</p>
  <p>分配角色
    <el-select v-model="selectedRoleId" placeholder="请选择">
       <!-- :lable下拉看到的值 -->
       <!-- :value="item.id"当选中下拉菜单中的某一项的时候,传入v-model的是id -->
    <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
  </p>
 </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoledialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    //自定义验证邮箱的规则
    var checkEmail=(rule,value,cb)=>{
      const regEmail=/^([\w])+@([\w])+(\.[\w])+/
      if(regEmail.test(value)){
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
        //自定义手机号的规则
    var checkMobile=(rule,value,cb)=>{
      const regMobile=/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if(regMobile.test(value)){
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {

     queryInfo:{
      //  搜索关键字
       query:'',
      //  当前的页数?
       pagenum:1,
       //当前每页显示多少条数据
       pagesize:2
     },
     userlist:[],
     total:0,
     //控制对话框显示和隐藏
     dialogVisible:false,

  //  表单绑定数据对象 
     addForm:{
          username:"",
          password:'',
          email:'',
          mobile:''
     },
    // 添加用户验证规则
        addFormRules:{
         username:[
           {required:true,message:'请输入用户名',trigger:'blur'},
           {min:3,max:10,message:'用户名长度在3-10个字母之间',trigger:'blur'}
          ],
          password:[
           {required:true,message:'请输入密码',trigger:'blur'},
           {min:6,max:15,message:'密码长度在3-10个字母之间',trigger:'blur'}
          ],
          email:[
            {required:true,message:'请输入邮箱',trigger:'blur'},
            {validator:checkEmail,trigger:'blur'}
          ],
          mobile:[
             {required:true,message:'请输入手机号',trigger:'blur'},
            //  {min:11,max:11,message:'请输入11位手机号'},
              {validator:checkMobile,trigger:'blur'}
          ]
    },
        // 修改表单的规则
    editFormRules:{
             email:[
            {required:true,message:'请输入邮箱',trigger:'blur'},
            {validator:checkEmail,trigger:'blur'}
          ],
           mobile:[
             {required:true,message:'请输入邮箱',trigger:'blur'},
            //  {min:11,max:11,message:'请输入11位手机号'},
              {validator:checkMobile,trigger:'blur'}
          ]
    },
    // 编辑对话框的显示与隐藏
    editDialogVisible:false,
    //存储编辑时根据id查询到的用户信息
    editForm:{},
    // 分配角色对话框的显示和隐藏
    setRoledialogVisible:false,
    userInfo:{},
    rolesList:[],
    selectedRoleId:""


    }

  },
  created(){
    this.getUserList()
  },
  methods:{
   async getUserList(){
       const {data:res}=await this.$http.get('users',{params:this.queryInfo})
       console.log(res.data)
       if(res.meta.status!==200){
         return this.$message.error('获取用户失败')
       }
       this.userlist=res.data.users 
        this.total=res.data.total
        console.log(this.userlist)

    },
    // 监听pagesize改变的事件，如何选中每页展示1条，就只有一条数据展现在页面上
    handleSizeChange(newSize){
      this.queryInfo.pagesize=newSize
      // 刷新页面
      this.getUserList()
    },
    // 监听页码改变
    handleCurrentChange(newPage){
 this.queryInfo.pagenum=newPage
      //我不明白为什么要调用这个？？？？？？？？？？？？？？？？刷新页面
      this.getUserList()
    },

    //监听用户状态的改变
    async userStateChangeed(userInfo){
       console.log(userInfo)
      //  this.$http.put(`users/:uId/state/:type`)
    const{data:res}= await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
       if(res.meta.status !==200){
         //如果失败则把状态置为修改之前
         userInfo.mg_state=!userInfo.mg_state
         return this.$message.error('状态修改失败')
       }
        this.$message.success('更新状态成功')
    },
    DialogClosed(){
      this.$refs.ruleFormRef.resetFields()
    },
    // 添加用户
    addUser(){
      this.$refs.ruleFormRef.validate(async valid=>{
        console.log(valid)
        // 打印出ture或false
      if(!valid) return this.$message.error('请输入正确信息')
       const {data:res}=await this.$http.post('users',this.addForm)
       if(res.meta.status!==201){
         this.$message.error('添加用户失败')
       }
       this.$message.success('添加用户成功！')
       this.dialogVisible=false
       this.getUserList()
      })
    },
   async showEditDialog(id){
      this.editDialogVisible=true
     const {data:res}=await this.$http.get(`users/${id}`)
     if(res.meta.status!==200){
       return this.$message.error('查询信息失败')
     }
     //如果请求成功就保存在edirForm数组中
     this.editForm=res.data
    //  console.log(this.editForm)
    },
    editDialogClosed(){
      this.$refs.editRuleFormRef.resetFields()
    },
    //修改用户信息并且提交
    editUserInfo(){
    this.$refs.editRuleFormRef.validate(async valid=>{
        if(!valid) return
       const{data:res}=await this.$http.put(`users/${this.editForm.id}` ,{email:this.editForm.email,mobile:this.editForm.mobile})
       if(res.meta.status!==200)  return this.$message.error('更新数据失败')
      //  关闭对话框
       this.editDialogVisible=false
      //  刷新数据
       this.getUserList()
      //  提示成功
       this.$message.success('更新用户成功')
 })
    },
   async  removeUserById(id){
      //弹框提示
        const confirmResult= await this.$confirm('确定删除该用户吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }) .catch(err=>err)  
        // console.log(confirmResult)
        if(confirmResult!=='confirm'){
          return  this.$message.info('取消删除')
        }
       const {data:res}= await this.$http.delete(`users/${id}`)
       if(res.meta.status!==200){
         this.$message.error('删除失败')
       }
       this.$message.success('删除成功')
       this.getUserList()
        },
 // 显示分配角色对话框
   async showSetRole(userInfo){

         //  展示对话框之前获取所有角色列表
         const {data:res}=await this.$http.get('roles')
         this.rolesList=res.data
// ?????????????????????????????????????????????????????????????????????????????
       console.log(userInfo+'wwwwwwwww')
         this.setRoledialogVisible=true,
         this.userInfo=userInfo
        },
    async saveRoleInfo(){
       if(!this.selectedRolesId){
         return this.$message.error('您没有选择新角色')
       }
    const{data:res}=await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
    if(res.meta.status!==200){
      console.log(res+'_______________-')
      return this.$message.error('更新角色失败')
    }
    
      this.$message.success('更新角色成功')
       this.getUserList()
       this.setRoledialogVisible=false

     }
    }
  }

</script>

<style lang="less" scoped>
</style>