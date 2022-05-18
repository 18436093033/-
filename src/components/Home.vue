<template>

  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header><span>电商后台管理系统</span>
      <el-button
        type="info"
        @click="logout"
      >退出</el-button>
    </el-header>
    <!-- 侧边栏区域 -->
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div
          class="toggle-button"
          @click="toggleBtn"
        >| | |</div>
        <el-menu
          background-color="#333"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id +''"
            v-for="item in menulist"
            :key="item.id"
          >
            <template
              slot="title"
              class="first"
            >
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
              <!-- :index="subItem.id+ ''" -->
            <el-menu-item
               :index="'/home/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id" @click="saveNavState('/home/'+subItem.path)">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>

          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主题区 -->
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      menulist: [],
      activePath:'',
      iconsObj: {
        125: 'iconfont icon-shoucang',
        103: 'iconfont icon-shouye',
        101: 'iconfont icon-baozhang',
        102: 'iconfont icon-yiwen',
        145: 'iconfont icon-sousuo'
      }
    }
  },
  created() {
    this.getMenuList()
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      const token = sessionStorage.getItem('token')

      // 跟老师方法不一样
      window.sessionStorage.removeItem('token')
      // 跟老师方法不一样
      this.$router.replace('/login')
      this.$message.success('退出成功')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      // console.log(this.menulist)
    },
    toggleBtn() {
      this.isCollapse = !this.isCollapse
    },
    //保存链接激活状态
    saveNavState(activePath){
  window.sessionStorage.setItem('activePath',activePath)
  this.activePath=activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // padding-left: 0;
    line-height: 58px;
    // padding:20px 0;
    background-color: #333;
    // border-bottom: 2px solid #ccc;
    color: #fff;
    font-size: 24px;
    font-family: Arial, Helvetica, sans-serif;
  }
  .el-aside {
    height: 100%;
    background-color: #333;
    i {
      margin-right: 10px;
    }
    .toggle-button {
      background-color: #ccc;
      border-right: 3px solid #333;
      text-align: center;
      font-size: 15px;
      line-height: 100%;
      padding: 5px;
      font-weight: 700;
      cursor: pointer;
    }
    .el-menu {
      border: 0;
      .el-menu-item {
        border: 0;
      }
    }
  }
  .el-main {
    background-color: #fff;
  }
}
</style>