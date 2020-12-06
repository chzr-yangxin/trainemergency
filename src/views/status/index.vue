<template>
  <div class="dashboard-container">
    <div class="container-status">
      <h1>登录状态</h1>
      <el-button
        @click="loginthis(item)"
        v-for="item of stsdatas"
        :key="item.id"
        :type="item.status ? 'success' : 'default'"
        >{{ item.description }}</el-button
      >

      <br /><br /><br /><br /><br />
      <div v-if="!runningtaskes || runningtaskes.length <= 0">
        <el-button
          v-if="isallready"
          type="primary"
          round
          @click="showSendDialog"
          >下发任务</el-button
        >
      </div>

      <div class="curtask" v-if="runningtaskes && runningtaskes.length > 0">
        <h3>正在执行的任务：《{{ runningtaskes[0].checkname }}》</h3>
        <el-table
          border
          :data="runningtaskes"
          style="width: 100%"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="rolename" label="角色"> </el-table-column>
          <el-table-column prop="usercode" label="工号"> </el-table-column>
          <el-table-column prop="nickname" label="姓名"> </el-table-column>
          <el-table-column prop="score" label="成绩"> </el-table-column>
          <el-table-column prop="finish" label="是否完成"> </el-table-column>
        </el-table>
      </div>
    </div>

    <div
      class="curtask oldtask"
      v-if="lastfinishtaskes && lastfinishtaskes.length > 0"
    >
      <h3>上次执行完的任务：《{{ lastfinishtaskes[0].checkname }}》</h3>
      <el-table
        border
        :data="lastfinishtaskes"
        style="width: 100%"
        row-class-name="warning-row"
      >
        <el-table-column prop="rolename" label="角色"> </el-table-column>
        <el-table-column prop="usercode" label="工号"> </el-table-column>
        <el-table-column prop="nickname" label="姓名"> </el-table-column>
        <el-table-column prop="score" label="成绩"> </el-table-column>
        <el-table-column prop="finish" label="是否完成"> </el-table-column>
      </el-table>
    </div>
    <br /><br /><br /><br /><br />
    <!-- -->
    <el-dialog title="下发任务" :visible.sync="dialogVisible" width="50%">
      <b>选择任务</b>
      <div>
        <span v-for="item of tasks" :key="item.id" class="line-task">
          <el-radio v-model="choosetask" :label="item.id" border>{{
            item.title
          }}</el-radio
          ><br />
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-loading="sending" type="primary" @click="confirmSendTask"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getRoles,
  getSession,
  computerlogin,
  alltasks,
  sendTask,
  getRnningTask,
  getLastFinishTask,
} from "@/api/func";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
  },
  data() {
    return {
      stsdatas: [],

      runningtaskes: [],
      lastfinishtaskes: [],

      dialogVisible: false,
      tasks: [],
      choosetask: null,
      sending: false,

      isallready: false,
      intervalData: null,
    };
  },
  methods: {
    async initInfo() {
      let roles = await getRoles();
      let sessions = await getSession();
      let datas = [];
      let tmpstatus = {};
      for (let s of sessions.data) {
        if (!tmpstatus[s.roleid]) {
          tmpstatus[s.roleid] = s;
        }
      }
      let isready = true;
      for (let r of roles.data) {
        r.status = tmpstatus[r.id] ? true : false;
        datas.push(r);
        if (r.status != true) {
          isready = false;
        }
      }
      this.isallready = isready;
      this.stsdatas = datas;
    },
    async inittasks() {
      let tasks = await alltasks();
      this.tasks = tasks.data;
    },
    loginthis(item) {
      if (!item.status) {
        this.$confirm("确定以电脑代替该角色？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            await computerlogin(item.id);
            this.$message({ type: "success", message: "操作成功!" });
            item.status = true;
          })
          .catch(() => {});
      }
    },
    async initTaskStatus() {
      let obj = await getRnningTask();
      this.runningtaskes = obj.data;
      //////
      let fobj = await getLastFinishTask();
      this.lastfinishtaskes = fobj.data;
    },
    showSendDialog() {
      this.dialogVisible = true;
    },
    async confirmSendTask() {
      if (this.choosetask) {
        this.sending = true;
        await sendTask(this.choosetask);
        this.sending = false;
        this.dialogVisible = false;
        this.$message({ type: "success", message: "任务下发成功!" });
        this.choosetask = null;
      } else {
        this.$message({ type: "error", message: "请选择任务!" });
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.finish == "已完成") {
        return "success-row";
      }
      return "";
    },
  },
  mounted() {
    this.initInfo();
    this.inittasks();
    this.initTaskStatus();
    //
    if (this.intervalData) {
      clearInterval(this.intervalData);
    }
    this.intervalData = setInterval(() => {
      this.initTaskStatus();
      this.initInfo();
    }, 10000);
  },
  beforeDestroy() {
    console.log("清除定时器");
    if (this.intervalData) {
      clearInterval(this.intervalData);
    }
  },
};
</script>
<style lang="scss">
.warning-row td {
  background: #e6a23c !important;
  color: #fff;
}

.success-row td {
  background: #67c23a !important;
  color: #fff;
}
</style>
<style lang="scss" scoped>
.container-status {
  text-align: center;
  padding: 20px;
}
.line-task {
  margin: 5px 0;
  display: block;
}
.curtask {
  width: 80%;
  margin: 0 auto;
  text-align: center;
}
.oldtask {
  opacity: 0.66;
}
</style>
