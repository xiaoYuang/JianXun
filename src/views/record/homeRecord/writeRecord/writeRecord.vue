<template>
  <div class="write">
    <div class="title">
      <span>施工内容 : </span>
      <span class="add el-icon-edit-outline" title="添加" @click="createBuildContent"></span>
    </div>
    
    <el-form :inline="true" label-width="70px">
      <ul>
        <li class="content" v-for="(contentItem, index) in buildContent" :key="index">
          <el-form-item label="分项工程" style="margin-bottom:0;display:block;" >
            <el-select placeholder="请选择工程" style="width:630px" v-model="contentItem.itemName" @change="changeItem" value-key="itemId">
              <el-option v-for="(item, index) in projectList" :key="index" :label="item.itemName" :value="item.itemName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="栋/段" style="margin-bottom:0;">
            <!-- <el-input v-model="contentItem.layerNo" placeholder="栋/段" style="width:100px;"></el-input> -->
            <el-select v-model="contentItem.layerNo" placeholder="栋/段" style="width:100px">
              <el-option v-for="item in floorList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="层" style="margin-bottom:0;" label-width="50px">
            <!-- <el-input v-model="contentItem.layerName" placeholder="层" style="width:100px;"></el-input> -->
            <el-select v-model="contentItem.layerName" placeholder="层" style="width:100px">
              <el-option v-for="item in layerList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班组" style="margin-bottom:0;" label-width="50px">
            <el-select v-model="contentItem.groupName" placeholder="请选择班组" style="width:120px">
              <el-option v-for="item in group" :key="item.groupId" :label="item.groupName" :value="item.groupName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="人数" style="margin-bottom:0;" label-width="50px">
            <el-input v-model="contentItem.workCount" placeholder="请输入人数" style="width:120px;"></el-input>
          </el-form-item>
          <el-form-item class="progress" label="进度情况" style="display:block;">
            <el-input style="width:630px;" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入进度情况" v-model="contentItem.progress"></el-input>
          </el-form-item>
          <span style="display:none;">{{contentItem.orderNo = index}}</span>
          <span class="clear el-icon-circle-close-outline" title="删除" @click="deleteBuildContent(index)"></span>
        </li>
      </ul>
    </el-form>

    <div class="mainThing">
      <div class="title">主要记事 : </div>
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item :title="item.attrName" name="1" v-for="(item, index) in attrData" :key="index">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="item.content">
          </el-input>
        </el-collapse-item>
      </el-collapse>
      <div class="btn">
        <el-button type="primary" @click="buildLog">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
const RES_OK = '1'

export default {
  data() {
    return {
      orgId: this.$route.query.orgId,
      date: this.$route.query.date,
      orgTemplateId: this.$route.query.orgTemplateId,
      templateId: this.$route.query.templateId,
      layerList: [], // 层
      floorList: [], // 楼层
      attrData: [], // 主要记事
      projectList: [],
      group: [],
      progress: [],
      activeNames: ['1'],
      itemData: {}, // 分项工程
      buildContent: [
        {
          "itemId": "",
          "itemName": "",
          "groupName": "",
          "workCount": '',
          "layerNo": '',
          "floorNo": 0,
          "layerName": "",
          "progress": "",
          "orderNo": 0
        }
      ]
    }
  },
  methods: {
    // 分项工程
    changeItem(item, index) {
      console.log(item, index)
    },
    handleChange(val) {
      console.log(val)
    },
    // 获取组织主要记事列表
    getBuildAttrList() {
      let params = {
        projectOrgId: this.orgId,
        templateId: this.templateId,
        orgTemplateId: this.orgTemplateId
      }
      this.$api.organizationList(params).then(res => {
        if(res.errorCode === RES_OK) {
          this.attrData = res.data.buildAttrList
        }
      })
    },
    // 获取组织分项工程
    getProjectList() {
      this.$api.getBuildLogItemList({
        projectOrgId: this.orgId,
        orgTemplateId: this.orgTemplateId
      }).then(res => {
        if(res.errorCode === RES_OK){
          this.projectList = res.data
        }
      })
    },
    //获取组织分组
    getGroupList() {
      let params = {
        projectOrgId: this.orgId,
        orgTemplateId: this.orgTemplateId
      }
      this.$api.getBuildLogGroupList(params).then(res => {
        if(res.errorCode == RES_OK) {
          this.group = res.data
        }else {
          this.$message.warning('网络延迟')
        }
      })
    },
    //获取组织施工进度
    getProgressList() {
      this.date = this.date.replace(/\//g, '-')
      let params = {
        projectOrgId: this.orgId,
        date: this.date,
        orgTemplateId: this.orgTemplateId
      }
      this.$api.getBuildLogProgressList(params).then(res => {
        if (res.errorCode === RES_OK) {
          // this.progress = res.data
          if (res.data.length > 0) {
            this.buildContent = res.data.map(val => {
              return {
                ...val,
                progress: val.perProgress
              }
            })
          }
          // this.buildContent = res.data.length > 0? res.data : this.buildContent
        }
      })
    },
    // 获取层段位置
    getLayer() {
      let params = {
        projectOrgId: this.orgId
      }
      this.$api.getBuildLogLayer(params).then(res => {
        console.log(res.data)
        if (res.errorCode === RES_OK) {
          let item = res.data[0]
          if(item) {
            for (let i = item.layerStart; i <= item.layerEnd; i++) {
              this.layerList.push(i)
            }
            for (let j = item.floorStart; j <= item.floorEnd; j++) {
              this.floorList.push(j)
            }
          } else {
            this.$message.warning('没有层/段')
          }
        }
      })
    },
    // 增加施工内容
    createBuildContent() {
      // this.orderIndex ++
      let data = {
        "itemName": "",
        "groupName": "",
        "workCount": '',
        "layerNo": '',
        "floorNo": 0,
        "layerName": "",
        "perProgress": "",
        "orderNo": this.orderIndex
      }
      this.buildContent.push(data)
    },
    // 删除施工内容
    deleteBuildContent(index) {
      this.buildContent.splice(index, 1)
    },
    // 创建日志
    buildLog() {
      this.$api.buildLog({
        orgId: this.orgId,
        orgTemplateId: this.orgTemplateId,
        buildContent: JSON.stringify(this.buildContent),
        mainBuildAttr: JSON.stringify(this.attrData)
      }).then(res => {
        if(res.errorCode == RES_OK) {
          this.$message.success('提交成功')
          this.$router.push({
            path: '/record',
            query: {
              orgId: this.$route.query.orgId,
              orgTemplateId: this.$route.query.orgTemplateId,
              templateId: this.$route.query.templateId,
              projectId: this.$route.query.projectId
            }
          })
        }
      })
    }
  },
  created() {
    this.getBuildAttrList()
    this.getProjectList()
    this.getGroupList()
    this.getProgressList()
    this.getLayer()
  }
}
</script>

<style lang="scss" scoped>
.write {
  margin: 20px;
  padding: 10px;
  background: #ffffff;
  min-width: 1000px;
  .title {
    width: 100%;
    // margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .add {
      font-size: 24px;
      cursor: pointer;
    }
  }

  .el-form {
      .progress{
        display: block;
        margin-bottom: 0;
        // /deep/ .el-form-item__content{
        //   width: 78%;
        // }
      }
    }
  

  .mainThing {
    padding-top: 20px;
    .btn {
      width: 100%;
      position: relative;
      margin-top: 20px;
      text-align: center;
    }
  }
  .content{
    padding: 5px;
    margin-bottom: 8px;
    position: relative;
    width: 800px;
    border: 1px solid #ddd;
    border-radius: 5px;
    // /deep/ .el-card__body{
    //   padding: 0 10px 5px;
    // }
  }
  .clear {
    position: absolute;
    cursor: pointer;
    top: 5px;
    right: 10px;
    font-size: 16px;
    color: #ddd;
    &:hover{
      color: #000;
    }
  }
}
</style>

