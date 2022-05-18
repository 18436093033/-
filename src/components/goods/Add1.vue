<template>
<div>
     <!-- 面包屑导航  -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图  -->
    <el-card>
        <!-- 提示框 -->
        <el-alert title="消息提示" type="info" center show-icon :closable="false">  </el-alert>
        <!-- 进度条 -->
         <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center >
         <el-step title="基本信息"></el-step>
         <el-step title="商品参数"></el-step>
         <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
         <el-step title="商品内容"></el-step>
         <el-step title="完成"></el-step>
          </el-steps> 
          <!-- //侧边tabs -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
         <el-tabs v-model="activeIndex"  :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked" >
         <el-tab-pane label="基本信息" name="0">
             <el-form-item label="商品名称" prop="goods_name">
                 <el-input v-model="addForm.goods_name"></el-input>
             </el-form-item>
                   <el-form-item label="商品价格" prop="goods_price">
                 <el-input v-model="addForm.goods_price" type="number"></el-input>
             </el-form-item>
                   <el-form-item label="商品重量" prop="goods_weight">
                 <el-input v-model="addForm.goods_weight" type="number"></el-input>
             </el-form-item>
             <el-form-item label="商品数量" prop="goods_num">
                 <el-input v-model="addForm.goods_num" type="number"></el-input>
             </el-form-item>
             <el-form-item label="商品分类" prop="goods_cat">
                 <!-- 级联选择器 -->
                  <el-cascader
                     v-model="addForm.goods_cat"
                     :options="cateList"
0                     :props="{ expandTrigger: 'hover', ...cateProps}"
                     @change="handleChange" >
                  </el-cascader>
            </el-form-item>
         </el-tab-pane>
         <el-tab-pane label="商品参数" name="1">
          <el-form-item :label="item.attr_name" v-for="item in manyTableDate" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="item" v-for="(item,index) in item.attr_vals" :key="index" border></el-checkbox>
              </el-checkbox-group>
          </el-form-item>
         </el-tab-pane>
         <el-tab-pane label="商品属性" name="2">
           <el-form-item :label="item.attr_name"
            v-for="item in onlyTableDate" 
            :key="item.attr_id">
           <el-input v-model="item.attr_vals">
           </el-input>
        </el-form-item>    
         </el-tab-pane>
         <el-tab-pane label="商品图片" name="3">
             <!-- action指的是图片上传的api接口 -->
              <!-- :on-preview点击预览 -->
              <!-- list-type 决定图片的渲染效果-->
                <el-upload
                   action='http://127.0.0.1:8008/api/private/v1/upload'
                   :on-preview="handlePreview"
                   :on-remove="handleRemove"
                   list-type="picture"
                   :headers="headerObj"
                   :on-success="handleSuccess">
                   <el-button size="small" type="primary">点击上传</el-button>
                   <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
         </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <!-- 富文本编辑器 -->
          <quill-editor v-model="addForm.goods_introduce"></quill-editor>
          <el-button type="primary" class="btn" @click="add">添加商品</el-button>
        </el-tab-pane>
         </el-tabs>
          </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="40%">
         <img :src="this.preViewPath" >
</el-dialog>
</div>
</template>

<script>
export default {
data(){
    return{
        activeIndex:'0',
        addForm:{
            goods_name:'',
            goods_price:0,
            goods_weight:0,
            goods_num:1,
            //存放选中的id值
            goods_cat:[],
              //    保存图片临时路径的数组 
             pics:[]  ,
            //  富文本描述 
            goods_introduce:'',
              attrs:[]
        },
       addFormRules:{
        goods_name:[{required:true,message:'请输入商品名称',trigger:'blur'}],
        goods_price:[{required:true,message:'请输入商品价格',trigger:'blur'}],
        goods_weight:[{required:true,message:'请输入商品重量',trigger:'blur'}],
        goods_num:[{required:true,message:'请输入商品数量',trigger:'blur'}],
        goods_cat:[{required:true,message:'请选择三级商品分类',trigger:'blur'}]
       },
    //    级联选择框绑定的数组
       cateList:[],
       cateProps:{
        //    看到的值
           label:'cat_name',
        // 选中的值 
            value:'cat_id',
        // 父子结点嵌套
        children:'children'

       },
    //    商品参数数组
       manyTableDate:[],
    //    商品属性数组
       onlyTableDate:[],
    //    图片上传的请求头对象
       headerObj:{
        Authorization: window.sessionStorage.getItem('token')  
       },
    //    预览图的路径
      preViewPath:'',
      dialogVisible:false,
      localPath:'http://127.0.0.1:8008/api/private/v1/',
    
    }
},
computed:{
  cateId(){
      if(this.addForm.goods_cat.length===3){
          return this.addForm.goods_cat[2]
      }
      return null
  }
},
created(){
    this.getCateList()
},
methods:{
    async getCateList(){
      const{data:res}=await this.$http.get('categories')
       if(res.meta.status!==200){
         return this.$message.error('获取失败')
         }
        //  console.log(res.data)
          this.cateList=res.data
        
    },
   handleChange(){
//    console.log(this.addForm.goods_cat)
   if(this.addForm.goods_cat.length!==3){
       this.addForm.goods_cat=[]
   }
},
beforeTabLeave(activeName,oldActiveName){
     if(oldActiveName==0&&this.addForm.goods_cat.length!==3){
         this.$message.error('请先选择商品分类')
     }
},
async tabClicked(){
    // 访问商品参数面板
    if(this.activeIndex==='1'){
        // console.log('动态参数')
        const{data:res}=await this.$http.get(`categories/${this.cateId-0}/attributes`,{params:{sel:'many'}})
        if(res.meta.status!==200){
         return this.$message.error('获取失败')
         }
         res.data.forEach(item=>{
             item.attr_vals=item.attr_vals.length===0?[]:item.attr_vals.split(',')
         })
        this.manyTableDate=res.data
        console.log(res.data)
       
        //   this.cateList=res.data
    }
    // 访问商品属性
        if(this.activeIndex==='2'){
        // console.log('动态参数')
        const{data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}})
        if(res.meta.status!==200){
         return this.$message.error('获取失败')
         }
        //  res.data.forEach(item=>{
        //      item.attr_vals=item.attr_vals.length===0?[]:item.attr_vals.split(',')
        //  })
        this.onlyTableDate=res.data
        console.log(res.data)
       
        //   this.cateList=res.data
    }
},
       // 预览图
       handlePreview(file){
        //   file是要预览的图片信息下
        console.log(file)
       this.preViewPath=file.response.data.url.replace('8888','8008')
       this.dialogVisible=true
    //    console.log(this.localPath+this.preViewPath)
       },
           // 移除图片
        handleRemove(file){
            // file是要移除的图片信息
          //获取要移除的图片临时路径
        const  filePath=file.response.data.tmp_path 
          const index = this.addForm.pics.findIndex(x=>
          x.pic==filePath)
          this.addForm.pics.splice(index,1)
          console.log(this.addForm)

        },
        // 监听图片上传成功
        handleSuccess(response){
        //    console.log(response)
           const picInfo={ pic:response.data.tmp_path}
           this.addForm.pics.push(picInfo)
        },
        add(){
          this.$refs.addFormRef.validate(async valid=>{
              if(!valid){
                  return  this.$message.error('请填写必要的表单项')
              }
               
           //   处理动态参数
              const form=JSON.parse(JSON.stringify( this.addForm))
             form.goods_cat=form.goods_cat.join(',')
            this.manyTableDate.forEach(item=>{
              const newInfo={
                  attr_id:item.attr_id,
                  attr_value:item.attr_vals
              }
              this.addForm.attrs.push(newInfo)

          })
        //   处理静态参数
         this.onlyTableDate.forEach(item=>{
         const newInfo={
         attr_id:item.attr_id,
         attr_value:item.attr_vals
              }
         this.addForm.attrs.push(newInfo)

          })
       form.attrs=this.addForm.attrs
          console.log(form.attrs)
          //发送请求添加商品
        //   商品名称必须唯一
        const {data:res} = await this.$http.post('goods',form)
           console.log(res)
    if(res.meta.status!==201){
        return this.$message.error('添加失败')
    }
 
    this.$message.success('添加成功')
    this.router.push('/goods')


          })
    

        }
        
}}

</script>

<style lang="less" scoped>
.el-steps{
    margin-top:40px !important;
    margin-bottom: 30px;
   
}
.el-checkbox{
    margin-right: 0px;
}
.el-dialog{
    overflow: hidden;
}
img{
    width: 100%;
    // height: auto;
}
.btn{
    margin-top:10px
}


</style>
