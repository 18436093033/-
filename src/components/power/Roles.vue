<template>
<div class="rouls-container">
        <!-- 面包屑导航  -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
      <!-- 卡片试图 -->
    <el-card >
        <el-row>
            <el-col>
                <el-button type="primary" @click="showAddRolesDialog">添加角色</el-button>
            </el-col>
        </el-row>
    <el-table :data="rolesList" border stripe>
       <el-table-column type="expand" >
           <template v-slot="scope">
            <el-row :class="['bdbottom',index1===0?'bdtop':'','vcenter']"  v-for="(item1,index1) in scope.row.children" :key="item1.id" >
                <!-- 渲染一级权限 -->
                <el-col :span=5>
                  <el-tag closable @close="removeRightById(scope.row,item3.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 渲染二，三级级权限 -->
                 <el-col :span=19>
                     <el-row  :class="[index2===0?'':'bdtop','vcenter']" v-for="(item2,index2) in item1.children" :key="item2.id"  >
                         <el-col :span="6">
                            <el-tag type="success" closable @close="removeRightById(scope.row,item3.id)">{{item2.authName}}</el-tag> 
                            <i class="el-icon-caret-right"></i>
                         </el-col>
                         <el-col :span="18">
                             <el-tag type="warning" v-for="(item3) in item2.children" :key='item3.id' closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag> 
                         </el-col>
                     </el-row>
                 </el-col>
            </el-row>
               <!-- pre 空白会被浏览器保留。其行为方式类似 HTML 中的<pre> 标签。 -->
            <!-- <pre>
                {{scope.row}}
            </pre> -->
           </template>
        </el-table-column>  
  <el-table-column type="index" label="#"></el-table-column>
   <el-table-column label="角色名称" prop="roleName"></el-table-column>
     <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
       <el-table-column label="操作" width="290px" >
         <template v-slot="scope">
             <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
             <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRolesById(scope.row.id)">删除 </el-button>
             <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
         </template>

       </el-table-column>
</el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
  title="提示"
  :visible.sync="addRolesDialogVisible"
  width="40%" @close="addRolesDialogClosed">
 <el-form :model='addRolesForm' :rules="addRolesruleForm" ref="addRolesruleRef" label-width="70px" >
  <el-form-item label="角色名称" prop="roleName" label-width="100px">
    <el-input type="text" v-model="addRolesForm.roleName"  autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc" label-width="100px">
    <el-input type="text" v-model="addRolesForm.roleDesc"  autocomplete="off"></el-input>
  </el-form-item>
 </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRoles">确 定</el-button>
  </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
       <el-dialog
  title="提示"
  :visible.sync=" editRolesDialogVisible"
  width="40%" @close="editDialogClosed">
 <el-form :model='editRolesList' :rules="addRolesruleForm" ref="editRolesruleRef" label-width="70px" >
  <el-form-item label="角色名称" prop="roleName" label-width="100px" disabled>
    <el-input type="text" v-model="editRolesList.roleName"  autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc" label-width="100px">
    <el-input type="text" v-model="editRolesList.roleDesc"  autocomplete="off"></el-input>
  </el-form-item>
 </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRoles">确 定</el-button>
  </span>
    </el-dialog>,
    <!-- 分配权限对话框
     -->
 <el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisiable"
  width="40%"
  @close="setRightDialogClose">
  <!-- 树形控件 -->
<el-tree :data="rightsList" :props="treeProps"  show-checkbox node-key="id"
 default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisiable = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
export default {
data(){
  return{
    rolesList:[],
    addRolesDialogVisible:false,
     addRolesForm:{
          roleName:'',
          roleDesc:''
     },
     addRolesruleForm:{
        roleName:[{ required:true,message:'请输入正确角色',triggle:"blur" }],
        roleDesc:[{ required:true,message:'请输入正确角色',triggle:"blur" }]

     },
     editRolesDialogVisible:false,
     editRolesList:{},
    //  觉得分配权限对话框的显示和隐藏
    setRightDialogVisiable:false,
    // 所有权限的数据
    rightsList:[],
    // 树形控件的属性对象
    treeProps:{
      label:'authName',
      children:'children'
    },
    defKeys:[105,116],
    roleId:''

    
  }
},
created(){
  this.getRolesList()
},
methods:{
  async getRolesList(){
  const {data:res}=await this.$http.get('roles')
  if(res.meta.status!==200){
    return this.$message.error('获取失败') 
  }
  this.rolesList=res.data
//   console.log(res.data)
  },
  addRolesDialogClosed(){
 this.$refs.addRolesruleRef.resetFields()
  },
 showAddRolesDialog(){
   this.addRolesDialogVisible=!this.addRolesDialogVisible
  
  },
   addRoles(){
    this.$refs.addRolesruleRef.validate(async valid=>{
        if(!valid) return
         const {data:res}=await this.$http.post('roles',this.addRolesForm)
//    console.log(res)
    if(res.meta.status!==201){
    return this.$message.error('添加角色失败')
}
   
   this.getRolesList()
   this.addRolesDialogVisible=false
   this.$message.success('添加角色成功')
    })


    },
showEditDialog(rolesInfo){
        this.editRolesDialogVisible=!this.editRolesDialogVisible
      this.editRolesList=rolesInfo
    },
//编辑用户
    editRoles(){
this.$refs.editRolesruleRef.validate(async valid=>{
if(!valid) return 
 console.log(this.editRolesList)
const {data:res}=await this.$http.put(`roles/${this.editRolesList.id}`,{roleName:this.editRolesList.roleName,roleDesc:this.editRolesList.roleDesc})
    if(res.meta.status!==200){
        return this.$message.error('角色信息编辑失败')
    }
    this.$message.success('角色信息编辑成功')
    this.editRolesDialogVisible=false
    this.getRolesList()   
        })
    },
    editDialogClosed(){
        this.$refs.editRolesruleRef.resetFields()
    },
    //根据id删除角色
  async  removeRolesById(id){
      //弹框提示
        const confirmResult= await this.$confirm('确定删除该角色吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }) .catch(err=>err)  
        // console.log(confirmResult)
        if(confirmResult!=='confirm'){
          return  this.$message.info('取消删除')
        }
       const {data:res}= await this.$http.delete(`roles/${id}`)
       if(res.meta.status!==200){
         this.$message.error('删除失败')
       }
       this.$message.success('删除成功')
       this.getRolesList()
        },
// 根据id删除权限
  async  removeRightById(role,RightId){
    // console.log(role.children)

      //弹框提示
        const confirmResult= await this.$confirm('确定删除该角色吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }) .catch(err=>err)  
        // console.log(confirmResult)
        if(confirmResult!=='confirm'){
          return  this.$message.info('取消删除')
        }
       const {data:res}= await this.$http.delete(`roles/${role.id}/rights/${RightId}`)
       if(res.meta.status!==200){
         this.$message.error('删除失败')
       }
      // console.log(res.data)
       this.$message.success('删除成功')
      //  不建议用这种方法会刷新页面
      //  this.getRolesList()
      role.children=res.data


        },
  // 展示分配权限对话框
  async showSetRightDialog(role){
const {data:res}= await this.$http.get('rights/tree')
if(res.meta.status!==200) return this.$message.error('数据获取失败')
this.rightsList=res.data
  //  console.log(this.rightsList)
   //递归获取三级节点的id
  //  defKeys是保存子节点的数组,是为了打开分配权限就出现所有子节点!!!!!!!!!!!!!!!
   this.getLeafKeys(role,this.defKeys)
    this.setRightDialogVisiable=true
    this.roleId=role.id
  },

// 通过递归的形式，获取角色下所有三级权限的id，并保存到defkeys数组中,?????为啥要保存到这里面

// 在上面方法中调用
  getLeafKeys(node,arr){
    //如果该节点不包含children属性，则是三级节点
    if(!node.children){
      return arr.push(node.id)
    }
    node.children.forEach(item=>{
      this.getLeafKeys(item,arr)
    })
  },

//解决数组中权限越来越多问题，对话框关闭时候清空数组
  setRightDialogClose(){
    this.defKeys=[]
  },
  async allotRights(){
    const keys=[
      ...this.$refs.treeRef.getCheckedKeys(),
      ...this.$refs.treeRef.getHalfCheckedKeys(),
    ]
    // console.log('+++++'+keys)
    // 将数组分割成，分割的字符串
   const idStr=keys.join(',')
   const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
   if(res.meta.status!==200) return this.$message.error('分配权限失败')
   this.$message.success('分配权限成功')
   this.getRolesList()
   this.setRightDialogVisiable=false
    
  }

}
}
</script>

<style lang="less" scoped>
.el-tag{
    margin:10px
}
.bdtop{
    border-top:1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;;
}
</style>