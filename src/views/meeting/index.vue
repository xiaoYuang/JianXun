<template>
  <el-container>
  <el-aside width="200px">
    <el-menu :default-openeds="openeds" @select="handleSelect" :default-active="activeIndex">
      <el-submenu :index="((index+1)+'')" v-for="(item,index) in asideArr" :key="index">
        <template slot="title">{{item.title}}</template>
        <el-menu-item-group v-for="(ele,i) in item.content" :key="i"  >
          <!-- :class="{'is-active': selActive == selActive }" -->
          <el-menu-item :index="(index+1)+'-'+(i+1)" >{{ele}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

    </el-menu>
  </el-aside>
  <!-- 内容区域 -->
  <el-main>
    <router-view></router-view>
  </el-main>
</el-container>
</template>

<script>
export default {
  name: 'system',
  data() {
    return {
      openeds: ['1'],
      activeIndex: '1-1',
      asideArr: [
        {title: '会议通知', content: ['当前通知', '历史纪录']}
      ]
    }
  },
  created() {
    // console.log(this.$route.name)
    switch (this.$route.name) {
      case 'publicLibrary': this.activeIndex = '1-1'; break
      case 'projectLibrary': this.activeIndex = '1-2'; break
      case 'orgLibrary': this.activeIndex = '1-3'; break
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log(key, keyPath)
      this.activeIndex = key
      switch (key) {
        case '1-1': this.$router.push({ path: '/meeting/meetingCurrent' }); break
        case '1-2': this.$router.push({ path: '/meeting/meetingHistory' }); break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../styles/mixin.scss";
// .emergency {
//   height: 100%;
//   padding-top: 80px;
//   box-sizing: border-box;
//   .aside {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
  
//     width: pp(240);
//     height: 100%;
//     // background:green;
//     border: #ccc solid 1px;
//     float: left;
//   }
//   .content {
//     border: #ccc solid 1px;
//     height: 100%;
//   }
// }
</style>
