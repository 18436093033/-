<template>
  <div>
           <!-- 面包屑导航  -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card>
       <el-row>
           <el-col>
               <el-button type="primary" class="addClass" @click="showAddCateDialog">添加分类</el-button>
           </el-col>
       </el-row> 
       <!-- 列表区域 -->
      <tree-table :data="catelist" :columns="columns" :selection-type='false' 
      :expand-type="false" show-index index-text="#" border>
      <!-- 是否有效模板 -->
      <template slot='isok' slot-scope="scope" >
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:green"></i>
           <i class="el-icon-error" v-else  style="color:red"></i>
      </template>
      <!-- 排序模板 -->
      <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-if="scope.row.cat_level===2">三级</el-tag>
      </template>
      <!-- 操作模板 -->
    <template slot="opt" slot-scope="scope">
        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button> 
        <el-button  size="mini" type="danger" icon="el-icon-delete">删除</el-button> 
      
      </template>
      </tree-table>
<!-- 分页效果 -->
  <!-- :page-sizes="[2,1,3,4]" -->
      <!-- //当前每页显示多少条 -->
<el-pagination
  :page-size="queryInfo.pagesize"
  :pager-count="11"
  layout="prev, pager, next, total"
  :total="total"
   @current-change="handleCurrentChange">
</el-pagination>
    </el-card>

<!-- 添加分类对话框 -->
<el-dialog
  title="添加分类"
  :visible.sync="addCatedialogVisible"
  width="40%"
  @close="addCateDialogClosed"
>
  <el-form :model="addCateruleForm" :rules="addCaterules" ref="addCateruleRef" label-width="80px" >
  <el-form-item label="分类名称" prop="name" >
    <el-input v-model="addCateruleForm.cat_name"></el-input>
  </el-form-item>
    <el-form-item label="父级分类" >
        <!-- 级联选择器 -->
        <!-- options用来指定数据源 -->
    <el-cascader
    v-model="seletedKeys"
    expand-trigger='hover'
    :options="parentCateList"
    :props="cascaderProps"
    @change="handleChange"
    change-on-select
    clearable
    ></el-cascader>
  </el-form-item>
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="addCatedialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addClass">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
data(){
    return{
        catelist:[],
        queryInfo:{
           type:3,
           pagenum:1,
           pagesize:6
        },
        total:0,
        columns:[
            {
                label:'分类名称',
                // prop用来指定这一列所绑定的属性
                prop:'cat_name'
            },{
                label:'是否有效',
                // 将当前列定义为模板列
                type:'template',
                // 表示当前这一列使用模板名称
                template:'isok'
            },
            {
                label:'排序',
                // 将当前列定义为模板列
                type:'template',
                // 表示当前这一列使用模板名称
                template:'order'
            },
              {
                label:'操作',
                // 将当前列定义为模板列
                type:'template',
                // 表示当前这一列使用模板名称
                template:'opt'
            }
        ],
        addCatedialogVisible:false,
        addCateruleForm:{
           cat_name:'',
           cat_pid:0,
           cat_level:0
          

        },
        addCaterules:{
        //   name:[{required:true,message:'名称不能为空',trigger:'blur' }]
        },
        // 父亲分类
        parentCateList:[],
        // 选中的父级分类的id
        seletedKeys:[],
        // 指定级联选择器的配置对象 
        cascaderProps:{
            value:'cat_id',
            label:'cat_name',
            children:'children'
        }
         
    }
},
created(){
  this.getCateList()
},
methods:{
 async getCateList(){
     const{data:res}=await this.$http.get('categories',{params:this.queryInfo})
     if(res.meta.status!==200){
         return this.$message.error('获取信息失败')
     }
     this.catelist=res.data.result
     this.total=res.data.total
    //  console.log(res.data.result)
  },
  handleCurrentChange(newPage){
      this.queryInfo.pagenum=newPage
      this.getCateList()
  },
  showAddCateDialog(){
      this.addCatedialogVisible=true
      this.getParentCateList()
  },
  //得到级联选择器父级列表
  async getParentCateList(){
      const{data:res}=await this.$http.get('categories',{params:{type:2}})
      if(res.meta.status!==200){
          return this.$message.error('获取失败')
      }
    //   console.log(res.data)
    this.parentCateList=res.data
  },

//   一触发就会自动把选中的id和其父亲的id一并传入seletedKeys
  handleChange(){
    //   console.log(this.seletedKeys)
    if(this.seletedKeys.length>0){
        // 父级分类的id
        this.addCateruleForm.cat_pid=this.seletedKeys[this.seletedKeys.length-1]
        // 为当前分类的等级赋值
        this.addCateruleForm.cat_level=this.seletedKeys.length
        return 
    }else{
        this.addCateruleForm.cat_pid=0,
        this.addCateruleForm.cat_level=0
    }
  },

  addCateDialogClosed(){
      this.$refs.addCateruleRef.resetFields()
      this.seletedKeys=[]
      this.addCateruleForm.cat_level=0
      this.addCateruleForm.cat_pid=0
       this.addCateruleForm.cat_name=''
  },
    addClass(){
 this.$refs.addCateruleRef.validate(async valid=>{
     if(!valid) return
     const{data:res} =await this.$http.post('categories',this.addCateruleForm)
     console.log(res)
     if(res.meta.status!==201){
         return this.$message.error('添加失败')
     }
      this.$message.success('添加成功')
      this.addCatedialogVisible=false
 })
  },
}
}
</script>

<style lang="less" scoped>
.addClass{
    margin-bottom: 15px;
}
.el-cascader{
    width: 100%;
}
</style>