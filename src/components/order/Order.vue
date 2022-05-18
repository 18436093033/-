<template>
  <div>
             <!-- 面包屑导航  -->
       <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
          <!-- 卡片试图 -->
    <el-card >
        <el-row>
            <el-col :span=8>
               <el-input placeholder="请输入内容" clearable>
                   <el-button slot="append" icon="el-icon-search"></el-button>
               </el-input>
            </el-col>
        </el-row>
        <!-- 表格区域 -->
        <el-table :data="orderList" scope stripe>
        <el-table-column type="index"></el-table-column>
          <el-table-column prop="order_number" label="商品编号"></el-table-column>
          <el-table-column prop="order_price" label="商品价格"></el-table-column>
          <el-table-column prop="pay_status" label="是否付款">
           <template v-slot="scope">
              <el-tag  type="danger" v-if='scope.row.pay_status==0'>{{'未付款'}}</el-tag>
              <el-tag v-else>已付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货">

          </el-table-column>
          <el-table-column label="下单时间">
             <template v-slot="scope">
               {{scope.row.create_time|momentTime}}
             </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-solt="scope">
                  <!-- 修改按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editOrder"></el-button>
              <!-- 物流进度按钮 -->
              <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
      
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区域 -->
         <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 对话框 -->
    <el-dialog
       title="提示"
       :visible.sync="dialogVisible"
       width="40%"
       @close="dialogClosed">
      <!-- 表单 -->
      <el-form :model="editOrderForm" :rules="editOrderRules" ref="editOrderRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="省市区/县" prop="sheng">
            <el-cascader
               v-model="editOrderForm.sheng"
               :options="cityData"
               :props="{ expandTrigger: 'hover' }"
              >
            </el-cascader>
        </el-form-item>
         <el-form-item label="详细地址" prop="location">
           <el-input v-model="editOrderForm.location"></el-input>
         </el-form-item>
      </el-form>
       <span slot="footer" class="dialog-footer">
       <el-button @click="dialogVisible = false">取 消</el-button>
       <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
     </el-dialog>
<!-- 物流进度对话框 -->
    <el-dialog
  title="物流进度"
  :visible.sync="progressVisible"
  width="50%"
  >
  <el-timeline :reverse="reverse">
    <!-- 时间线 -->
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
     </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
data(){
    return{
      queryInfo:{
      query:'',
      pagenum:1,
      pagesize:5
      },
      orderList:[],
      total:0,
      dialogVisible:false,
      cityData ,
      editOrderForm:{
        sheng:[],
        location:'',

      },
      editOrderRules:{
        location:[{required:true,message:'详细地址不能为空',trigger:'blur'}],
        sheng:[{required:true,message:'地址不能为空',trigger:'blur'}]

      },
      
      
      progressVisible:false,
      //存放物流信息的数组
      progressInfo:[
        {
          "time":"2018-05-10 09:39:00",
          "ftime":"2018-05-10 90:02:20",
          "context":'已签收',
          "location":''
        },
                {
          "time":"2018-05-10 09:39:00",
          "ftime":"2018-05-10 90:02:20",
          "context":'运输中，预计明天送达',
          "location":''
        },
        
                {
          "time":"2018-05-10 09:39:00",
          "ftime":"2018-05-10 90:02:20",
          "context":'运输中，预计明天送达',
          "location":''
        },
        
                {
          "time":"2018-05-10 09:39:00",
          "ftime":"2018-05-10 90:02:20",
          "context":'运输中，预计明天送达',
          "location":''
        },
        
                {
          "time":"2018-05-10 09:39:00",
          "ftime":"2018-05-10 90:02:20",
          "context":'运输中，预计明天送达',
          "location":''
        }
      ],
      reverse:false
    }
    
},
created(){
  this.getOrderList()
},
methods:{
  async getOrderList(){
    const{data:res}=await this.$http.get('orders',{params:this.queryInfo})
    if(res.meta.status!=200){
      return this.$message.error('获取订单列表失败')
    }
    // console.log(res)
    this.total=res.data.total
    this.orderList=res.data.goods
  },
  handleSizeChange(newSize){
    this.queryInfo.pagesize=newSize
    this.getOrderList()
  },
  handleCurrentChange(newPage){
    this.queryInfo.pagenum=newPage
    this.getOrderList()
  },
  editOrder(){
    this.dialogVisible=true
  },
  // 对话框关闭
  dialogClosed(){
    this.dialogVisible=false
    this.$refs.editOrderRef.resetFields()
  },
  async showProgressBox(){
  this.progressVisible=true
  // const{data:res}=await this.$http.get('/kuaidi/804909574412544580')
  //   if(res.meta.status!=200){
  //     return this.$message.error('获取订单列表失败')
  //   }
  //   this.progressInfo=res.data
  //   console.log(this.progressInfo)
  // }
}}
}
</script>

<style lang="less" scoped>
.el-cascader{
  width: 100%;
}
.el-timeline{
  // width: 200px;
  // height: 200px;
  overflow: scroll;
}
.l-timeline-item{
  width: 100%;
}
</style>