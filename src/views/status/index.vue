<template>
  <div class="dashboard-container">
    <div class="container-status">
      <h1>登录状态</h1>
      <el-button
        @click="loginthis(item)"
        v-for="item of stsdatas"
        :key="item.id"
        :type="
          item.status ? (item.status == 1 ? 'success' : 'primary') : 'default'
        "
        >{{ item.description
        }}{{ item.logintype == "computerlogin" ? "（电脑）" : "" }}</el-button
      >
      <br /><br /><br />
      <span style="margin-right: 8px"><span class="notlog"></span>未登录</span
      >&nbsp;
      <span style="margin-right: 8px"
        ><span class="userlog"></span>用户登录</span
      >&nbsp;
      <span><span class="complog"></span>电脑登录</span>
      <br /><br /><br /><br /><br />
      <div v-if="!runningtaskes || runningtaskes.length <= 0">
        <span v-if="isallready" style="margin-right: 10px">
          <el-radio v-model="radio" label="实训">实训</el-radio>
          <el-radio v-model="radio" label="考核">考核</el-radio>
        </span>
        <div v-if="!runningtaskes">
          <el-button
            v-if="isallready"
            type="primary"
            round
            @click="showSendDialog"
            >下发任务</el-button
          >
        </div>
      </div>
      <div class="curtask" v-if="runningtaskes">
        <h3>正在执行的任务：《{{ runningtaskes.taskname }}》</h3>
        <el-progress
          :text-inside="true"
          :stroke-width="24"
          :percentage="runtaskper"
          status="success"
        ></el-progress>
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
  computerlogout,
} from "@/api/func";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
  },
  data() {
    return {
      stsdatas: [],

      runningtaskes: null,
      runtaskper: 0,
      lastfinishtaskes: [],

      dialogVisible: false,
      tasks: [],
      choosetask: null,
      sending: false,

      isallready: false,
      intervalData: null,

      radio: "实训",
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
        //存储为三个状态：0为未登录，1为用户登录，2为电脑登录
        r.status = tmpstatus[r.id]
          ? tmpstatus[r.id].logintype == "userlogin"
            ? 1
            : 2
          : 0;
        // r.status = tmpstatus[r.id] ? true : false;
        r.logintype = r.status ? tmpstatus[r.id].logintype : "";
        datas.push(r);
        if (r.status == 0) {
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
      // console.log(item);
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
            item.logintype = "computerlogin";
            this.initTaskStatus();
            this.initInfo();
          })
          .catch(() => {});
      } else if (item.logintype == "computerlogin") {
        this.$confirm("确定退出这个电脑角色？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            await computerlogout(item.id);
            this.$message({ type: "success", message: "操作成功!" });
            item.status = false;
            item.logintype = "";
            this.initTaskStatus();
            this.initInfo();
          })
          .catch(() => {});
      } else if (item.logintype == "userlogin") {
        this.$confirm("确定退出这个角色？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            await computerlogout(item.id);
            this.$message({ type: "success", message: "操作成功!" });
            item.status = false;
            item.logintype = "";
            this.initTaskStatus();
            this.initInfo();
          })
          .catch(() => {});
      }
    },
    async initTaskStatus() {
      let obj = await getRnningTask();
      this.runningtaskes = obj.data;
      if (this.runningtaskes) {
        this.runtaskper = parseInt(
          (this.runningtaskes.curstep / this.runningtaskes.tasksteps) * 100
        );
      }
      console.log(this.runningtaskes);
      //////
      // let fobj = await getLastFinishTask();
      // console.log(fobj);
      //this.lastfinishtaskes = fobj.data;
    },
    showSendDialog() {
      this.dialogVisible = true;
    },
    async confirmSendTask() {
      if (this.choosetask) {
        // console.log(this.choosetask)
        this.sending = true;
        await sendTask(this.choosetask, this.radio);
        this.sending = false;
        this.dialogVisible = false;
        //下发任务，传过去实训还是考核this.radio;
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
  .notlog {
    border: 1px solid #ccc;
    width: 20px;
    height: 12px;
    display: inline-block;
    border-radius: 2px;
  }
  .userlog {
    width: 20px;
    height: 12px;
    display: inline-block;
    border-radius: 2px;
    background: #5daf34;
  }
  .complog {
    width: 20px;
    height: 12px;
    display: inline-block;
    border-radius: 2px;
    background: #3a8ee6;
  }
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
