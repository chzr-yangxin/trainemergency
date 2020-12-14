<template>
  <div class="dashboard-container">
    <h1>考核查询列表</h1>
    <div>
      <el-table :data="tableData" border style="width: 100%" v-loading="loadingdata">
        <el-table-column prop="ctime" label="时间"> </el-table-column>
        <el-table-column prop="checkname" label="考核内容"> </el-table-column>
        <el-table-column label="详情">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="showSeeDetail(scope.row)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <br/><br/>
      <el-pagination @current-change="pagechange($event)" background layout="prev, pager, next" :total="totalcount" :page-size="pagesize">
      </el-pagination>
    </div>
    <!-- -->
    <el-dialog
      :title="title + '的应急处理'"
      :visible.sync="dialogVisible"
      width="50%"
      style="text-align: left"
    >
      <el-table
        v-loading="loadingdetial"
        :data="tableDetailData"
        border
        style="width: 100%"
      >
        <el-table-column prop="rolename" label="角色"> </el-table-column>
        <el-table-column prop="usercode" label="工号"> </el-table-column>
        <el-table-column prop="nickname" label="姓名"> </el-table-column>
        <el-table-column prop="score" label="成绩"> </el-table-column>
        <el-table-column prop="finish" label="是否完成"> </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { allResults, getResultDetail } from "@/api/func";
import * as moment from "moment";
export default {
  data() {
    return {
      tableData: [],
      pageindex: 1,
      pagesize: 10,
      totalcount: 10,
      loadingdata: false,

      tableDetailData: [],
      title: "",
      dialogVisible: false,
      loadingdetial: false,
    };
  },
  methods: {
    async initInfo() {
      let obj = await allResults(this.pageindex, this.pagesize);
      let tds = obj.data.results;
      for (let d of tds) {
        d.ctime = moment(d.ctime).format("YYYY-MM-DD HH:mm:ss");
      }
      this.tableData = tds;
    },
    async showSeeDetail(task) {
      this.dialogVisible = true;
      this.title = task.checkname;
      this.loadingdetial = true;
      let stus = await getResultDetail(task.checkid);
      this.tableDetailData = stus.data;
      this.loadingdetial = false;
    },
    pagechange(p){
      this.pageindex = p;
      this.initInfo();
    }
  },
  mounted() {
    this.initInfo();
  },
};
</script>
<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
  text-align: center;
}
</style>