<template>
  <div class="connection page-content-body">
    <div class="selectArea">
      <!-- 项目编码：
      <el-input v-model="listQuery.proCodeInput" placeholder="请输入项目编码" style="width:200px;margin-right:10px" clearable @clear="getProjectList"></el-input> -->
      项目名称：
      <el-input v-model="listQuery.proName" placeholder="请输入项目名称" style="width:200px" clearable @clear="tableData = []"></el-input>
      <el-button type="primary" style="margin-left:10px" @click="getProjectList(1)">搜索</el-button>
    </div>
    <div class="table page-main customTable">
      <el-table ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                :stripe="true"
                :current-change="true"
                class="connection-table">
        <el-table-column width="50">
          <template slot-scope="scope">
            <el-radio :label="scope.$index" v-model="tableIndex" @change.native="handleSelection(scope.row)" class="table-radio">{{''}}</el-radio>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">{{ scope.row.proCode }}</template>
        </el-table-column>
        <el-table-column prop="proName" align="center">
        </el-table-column>
      </el-table>
      <div class="pagination">
        <!-- 分页组件 -->
        <ui-pagination :total="total" @change="getPages"></ui-pagination>
      </div>
    </div>
    <div class="select">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="height: 15px;"></div>
      <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="(item, index) in cities" :label="item" :key="index" style="padding: 5px 0;" :disabled="item.status === '0'">
          <span style="margin-right:50px;">{{item.orgName}}</span>
          <el-button type="text" v-show="item.status === '0'" @click="doApplyOrg(item)">已申请</el-button>
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="btn">
      <el-button type="primary" @click="doBatchBindOrg">提交关联</el-button>
    </div>
  </div>

</template>
<script>
export default {
  data() {
    return {
      checkAll: false,
      checkedCities: [],
      cities: [],
      isIndeterminate: false,
      tableData: [],
      total: 0,
      listQuery: {
        proCode: '',
        proName: '',
        currentPage: 1,
        showCount: 10
      },
      tableIndex: '',
      tableItemId: ''
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.cities : []
      this.isIndeterminate = true
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length
    },
    handleSelection(value) {
      this.tableItemId = value.projectId
    },
    getProjectList(val) {
      // if (val === 1 && this.listQuery.proName === '') {
      //   this.$message.warning('搜索不能为空')
      //   return
      // }
      this.$api.getProjectList(this.listQuery).then(res => {
        if(res.errorCode == '1') {
          if (res.data.length === 0) {
            this.$message.warning(res.resultMsg)
          }
          this.tableData = res.data
          this.total = res.totalRecords
        }else {
          this.$message.warning(res.resultMsg)
        }
      })
    },
    getPages(currentPage, pageSize) {
      this.listQuery.currentPage = currentPage
      this.listQuery.pageSize = pageSize
      this.getProjectList()
    },
    handlePageChange(val){
      this.listQuery.currentPage = val;
      this.getProjectList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getProjectList()
    },
    getNotBindOrgList() {
      this.$api.getNotBindOrgList({
        isMyCreate: 2
      }).then(res => {
        // let resData = []
        // for(let i = 0; i < res.data.length; i++) {
        //   if(res.data[i].projectId == '') {
        //     resData.push(res.data[i])
        //   }
        // }
        // console.log(resData)
        // this.cities = resData
        // console.log(this.cities)
        if(res.errorCode === '1') {
          this.cities = res.data
        }
      })
    },
    // 关联项目+组织
    doBatchBindOrg() {
      if(this.tableItemId == '' || this.checkedCities.length == 0) {
        this.$message.warning('请选择项目或组织')
        return
      }
      let orgListData = []
      for (let i = 0; i < this.checkedCities.length; i++) {
        let value = this.checkedCities[i]
        if (value.status !== '0') {
          orgListData.push({
            projectOrgId: value.projectOrgId,
            orgName: value.orgName
          })
        }
      }
      // let param = {
      //   'orgList': this.checkedCities.map(value => {
      //     return {
      //       projectOrgId: value.projectOrgId,
      //       orgName: value.orgName
      //     }
      //   })
      // }
      let param = {
        orgList: orgListData
      }
      this.$api.doBatchBindOrg({
        projectId: this.tableItemId,
        orgJson: JSON.stringify(param)
      }).then(res => {
        // console.log(res)
        if(res.errorCode == '1') {
          this.$message.success(res.resultMsg)
          this.getProjectList()
          this.getNotBindOrgList()
        }else {
          this.$message.warning(res.resultMsg)
        }
      })
    },
    // 取消申请
    doApplyOrg(data) {
      this.$confirm('需要取消申请关联吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        this.$api.doApplyOrg({
          projectOrgId: data.projectOrgId,
          projectId: data.projectId,
          status: '6'
        }).then(res => {
          if (res.errorCode === '1') {
            this.$message.success('取消申请关联成功')
            this.getNotBindOrgList()
          }
        })
      })
    }
  },
  created() {
    // this.getProjectList()
    this.getNotBindOrgList()
  }
}
</script>

<style lang="scss" scoped>
.connection {
  .connection-table{
    /deep/ .el-table__header-wrapper{
      height: 0;
      border-top: 1px solid #ebeef5;
    }
  }
  .table-radio{
    /deep/ .el-radio__label{
      padding: 0;
    }
  }
  .table {
    margin-top: 20px;
    .pagination {
      width: 90%;
    }
  }
  .select {
    width: 100%;
    margin-top: 20px;
    border: 1px solid #ccc;
    padding: 10px;
    .el-checkbox {
      display: block;
      margin-left: 10px;
    }
  }
  .btn {
    transform: translate(50%, 0);
    margin: 10px 0 20px -20px;
  }
}
</style>

