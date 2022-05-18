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
         <el-alert show-icon title="注意：只允许第三级分类设置相关参数"
    type="warning" :closable="false">
  </el-alert>
   <el-row>
          <el-col>
              <span>选择商品分类：</span>
               <el-cascader
                  v-model="selectedCateKeys"
                  :options="catelist"
                  :props="{ expandTrigger: 'hover',...cateProps }"
                  @change="handleChange" ></el-cascader>
              </el-col>
   </el-row>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="动态参数" name="many">
        <el-button size="mini" type="primary" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
        <!-- 动态参数表格 -->
        <el-table :data="manyTableDate" border stripe>
            <el-table-column type="expand">
                <template v-slot="scope">
             <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
             <!-- 动态切换的tag标签 -->
               <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">                 
                </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name" ></el-table-column>
            <el-table-column label="操作">
                <template v-slot="scope">
              <!-- 修改按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)" >修改</el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
       
            </template>
            </el-table-column>
        </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态属性" name="only">
        <el-button size="mini" type="primary" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
        <!-- 静态参数表格 -->
           <!-- 动态参数表格 -->
        <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
                <template v-slot="scope">
             <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
             <!-- 动态切换的tag标签 -->
               <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">                 
                </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name" ></el-table-column>
            <el-table-column label="操作">
                <template v-slot="scope">
              <!-- 修改按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)"  >修改</el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini"  @click="removeParams(scope.row.attr_id)">删除</el-button>
       
            </template>
            </el-table-column>
        </el-table>
    </el-tab-pane>
  </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
         :title="this.titleText"
         :visible.sync="addDialogVisible"
         width="40%" @close="addDialogClosed"
         >
         <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px" >
             <el-form-item :label="titleText" prop="attr_name">
               <el-input v-model="addForm.attr_name"></el-input>
             </el-form-item>
         </el-form>
         <span slot="footer" class="dialog-footer">
           <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
</el-dialog>
    <!-- 编辑对话框 -->
        <el-dialog
         :title="this.titleText"
         :visible.sync="editDialogVisible"
         width="40%" @close="editDialogClosed"
         >
         <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="80px" >
             <el-form-item :label="titleText" prop="attr_name">
               <el-input v-model="editForm.attr_name"></el-input>
             </el-form-item>
         </el-form>
         <span slot="footer" class="dialog-footer">
           <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
</el-dialog>
</div>
</template>

<script>
export default {

    data(){
        return{
          catelist:[] ,
        //   级联选择框的配置对象
        cateProps:{
            // value选中的值
            value:'cat_id',
            // label看到的值
            label:'cat_name',
            // children指定父子结点的嵌套属性
            children:'children'
        },
        // v-model绑定的值会把选中的id一级父亲的id保存到这里面
        selectedCateKeys:[],
        // 点击激活的名称
        activeName:'many',
        //动态参数数据 
        manyTableDate:[],
        // 静态参数的数据
        onlyTableData:[],
        addDialogVisible:false,
        addFormRules:{
            attr_name:[{required:true,message:'请填入信息',trigger:'blur'}]
        },
        addForm:{
            attr_name:''
            
        },
        editDialogVisible:false,
        editForm:{
            attr_name:''
        },
        // 动态切换tag
        inputVisible:false,
        inputValue:''

        }
    },
    computed:{
    //  如果按钮需要禁用返回true
       isBtnDisabled(){
           if(this.selectedCateKeys.length!==3){
               return true
           }
           return false
       },
    //    当前选中的三级分类的id
    cateId(){
        if(this.selectedCateKeys.length===3){
            return this.selectedCateKeys[2]
        }
        return null
    },
    //动态计算标题显示
    titleText(){
       if(this.activeName==='many'){
           return '动态参数'
       }
       return '静态属性'
    }

    },
    created(){
        this.getCateList()
    },
    methods:{
        //获取所有的商品分类
        async getCateList(){
     const{data:res}=await this.$http.get('categories')
     if(res.meta.status!==200){
         return this.$message.error('获取失败')
     }
     this.catelist=res.data
    //  console.log(res.data)

        },
        // 级联选择框绑定的事件处理函数
       handleChange(){
          this.getParamsData() 
       },

    //    获取参数的列表数据
    async  getParamsData(){
          //判断选中的是否为三级分类
      if(this.selectedCateKeys.length!==3){
          this.selectedCateKeys=[]
          this.manyTableDate=[],
          this.onlyTableData=[]
          return
      }
    //   根据所选分类的id，和当前所处的哪个标签，获取对应的参数
      const{data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
      if(res.meta.status!==200){
          return this.$message.error('获取参数失败')   
      }
      console.log(res.data)
      res.data.forEach(item=>{
      item.attr_vals=item.attr_vals?item.attr_vals.split(","):[]
      item.inputVisible=false
      item.inputValue=''
      })
    //   console.log(res.data) 
        if(this.activeName=='many'){
            this.manyTableDate=res.data
        }else{
            this.onlyTableData=res.data
        }
        },

        // tab页标签点击事件的处理函数

    handleClick(){
    this.getParamsData()
            // console.log(this.activeName)
        },
    addDialogClosed(){
       this.$refs.addFormRef.resetFields()
    },
    // 点击确定按钮向后台添加输入的参数
     addParams(){
       this.$refs.addFormRef.validate(async valid=>{
           if(!valid) return
         const{data:res}=await this.$http.post(`categories/${this.cateId}/attributes`,
         {attr_name:this.addForm.attr_name,attr_sel:this.activeName})
        //  console.log(res)
         if(res.meta.status!==201){
             return this.$message.error('添加参数失败')
         }
         this.$message.success('添加成功')
         this.addDialogVisible=false
         this.getParamsData()
    })
    
    
     },

    //  点击编辑展示对话框，并且输入框里有该项内容
    async showEditDialog(id){
         const{data:res}=await this.$http.get(`categories/${this.cateId}/attributes/${id}`,
        {params:{attr_sel:this.activeName}} )
        //  console.log(res)
         if(res.meta.status!==200){
             return this.$message.error('添加参数失败')
         }
         this.editDialogVisible=true
         this.editForm=res.data
        //  console.log(res.data)
     },
    //  关闭对话框重置
      editDialogClosed(){
      this.$refs.editFormRef.resetFields()
     },
// 点确定提交对话框
     editParams(){
          this.$refs.editFormRef.validate(async valid=>{
           if(!valid) return
         const{data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
         {attr_name:this.editForm.attr_name,attr_sel:this.activeName})
        //  console.log(res)
         if(res.meta.status!==200){
         return this.$message.error('编辑失败')
         }
         this.$message.success('编辑成功')
         this.editDialogVisible=false
         this.getParamsData()
    })
     },
    //  根据id删除
  async removeParams(attr_id){
       const confirmResult= await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        // 用户取消操作
        if(confirmResult!=='confirm'){
            return this.$message.info('取消删除')
        }
        const{data:res}=await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
          if(res.meta.status!==200){
         return this.$message.error('删除失败')
         }
         this.$message.success('删除成功')
         this.getParamsData()

   },
// 动态切换tag和输入框
  async  handleInputConfirm(row){
    //    判断是否输入的是空格，也不知道谁说在v-model后面加trim报错了都垃圾
     if(row.inputValue.trim().length===0){
           row.inputVisible=false
            row.inputValue=''
            return
     }
       row.attr_vals.push(row.inputValue.trim())
        row.inputVisible=false
        row.inputValue=''
        //发起请求保存操作
        this.saveAttrVals(row)

   },
   async saveAttrVals(row){
         const{data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
        {attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(',')})
         if(res.meta.status!==200){
             return this.$message.error('修改失败')
         }
         console.log(res)
         this.$message.success('修改成功')
   },
   showInput(row){
   row.inputVisible=true
//    动态获取焦点从element上占下的
   this.$nextTick(_ => {
    this.$refs.saveTagInput.$refs.input.focus();
        });
   },
   handleClose(i,row){
   row.attr_vals.splice(i,1)
   this.saveAttrVals(row)
   }

    
    }
}
</script>

<style lang="less" scoped>
.el-alert{
    margin-bottom: 15px;
}
.el-cascader{
    width: 300px;
}
.input-new-tag{
    width: 100px;
}
.el-tag{
    margin-right: 10px;
}
</style>