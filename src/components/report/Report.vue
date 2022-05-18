<template>
<div>
      <!-- 面包屑导航  -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    <el-breadcrumb-item>数据报表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图 -->
  <el-card>
<div id="main" style="width:1000px;height:500px"></div>

  </el-card>
</div>
</template>

<script>
// 导入echarts
import * as echarts from 'echarts'
export default {
    data(){
        return{
//    需要合并的数据
        options : {
        title: {
          text: 'ECharts 入门示例'
        },
        //出现提示
        tooltip: {
            trigger:'axis'
        },
       
        legend: {
          data: ['销量']
        },
        xAxis: {
             boundaryGap:false,
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {
            
        },
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      }
        }
    },
    async mounted(){
        // 在dom元素初始化完成时候初始化
        var myChart=echarts.init(document.getElementById('main'))
        const {data:res}=await this.$http.get('reports/type/1')
        if(res.meta.status!==200){
            return this.$message.error('获取折线图数据失败')
        }
        console.log(res.data)
        //数据和配置项
      const result=Object.assign(this.options,res.data)
    // const result={options,res.data}
  
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(result);
    }
}
</script>
<style less="less" scoped >
#main{
    padding:80px;
}


</style>