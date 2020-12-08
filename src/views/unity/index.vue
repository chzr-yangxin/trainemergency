<template>
  <div>
    <unity
      src="/unityweb/Build/web.json"
      width="100%"
      height="100%"
      class="unity-web"
      unityLoader="/unityweb/Build/UnityLoader.js"
      ref="unityvue"
    ></unity>
    <div class="my-buts">
      <span class="title">系统名称</span>

      <span class="dealtask" v-if="pritask">
        <span>【{{pritask.taskname}}】</span><br/>
        <el-button-group>
          
          <el-button v-for="item in steps" :key="item.step" size="mini" :type="item.tp" :disabled="!item.ismy" @click="dealTask(item)">{{ item.txt }}<em v-if="item.ismy">（点击接受任务）</em></el-button>
        </el-button-group>
      </span>

      <div class="username">
        <!-- <div class="my-tasks">
          <span>待处理任务：</span>
          <el-select
            v-model="mytaskid"
            placeholder="请选择"
            size="mini"
            @change="chooseScene($event)"
          >
            <el-option
              v-for="item in tasks"
              :key="item.id"
              :label="item.checkname"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div> -->

        {{ user.nickname }}
        <a class="a-logout" @click="logout">[退出]</a>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Unity from "vue-unity-webgl";
import { alltasks, getMyTask, scoreTask } from "@/api/func";

export default {
  computed: {
    ...mapGetters(["user"]),
  },
  components: { Unity },
  data() {
    return {
      mytaskid: null,
      steps: null,
      pritask: null,

      intervaltask: null,
    };
  },
  mounted() {
    this.initUnity(() => {
      let role = this.user.role;
      if (role) {
        this.$refs.unityvue.message(
          "MonoSingletionRoot",
          "LoadScene",
          role.description
        );
      }
      //
    });
  },
  created() {
    window.HandCap = (txt) => {
      alert(txt);
    };
    window.BeatPhone = (txt) => {
      //// 分数清零
      alert("ok");
      alert(txt);
    };
    window.inited = () => {
      // 初始化场景成功
      this.getMyTasks();
    };
  },
  methods: {
    initUnity(callback) {
      let int = setInterval(() => {
        if (this.$refs.unityvue.loaded) {
          clearInterval(int);
          setTimeout(() => {
            callback();
          }, 500);
        }
      }, 100);
    },
    async getMyTasks() {
      this.intervaltask = setInterval(async () => {
        if (!this.tasks) {
          this.getMTask();
        }
      }, 5000);
      this.getMTask();
    },
    async getMTask() {
      let obj = await getMyTask();
      console.log(obj);
      if(obj.data && obj.data.task){
        this.pritask = obj.data.task
        let mysteps = obj.data.mysteps;
        let allsteps = [];
        for(let i=0;i<this.pritask.tasksteps;i++){
          let ismy = false;
          let mobj = null;
          for(let m of mysteps){
            if(m.taskstep == i){
              ismy = true;
              mobj = m;
            }
          }
          let txt = '已完成';
          let tp = 'success';
          if(this.pritask.curstep == i){
            txt = '进行中';
            tp = 'primary';
          }else if(this.pritask.curstep < i){
            txt = '等待中';
            tp = 'default';
          }
          allsteps.push({ step: i, ismy: ismy, curstep: this.pritask.curstep, txt: txt, tp: tp, data: mobj });
        }
        this.steps = allsteps;
      }
      // if (obj.data && obj.data.length > 0) {
      //   this.tasks = obj.data[0];
      //   this.sendTaskToUnity()
      //   this.mytaskid = this.tasks.id
      // } else {
      //   this.tasks = null;
      // }
    },
    dealTask(item){
      // 接受任务
      if(item.data && item.curstep == item.step){
        this.mytaskid = item.data.id;
      }
      // 测试
      // this.mytaskid = '58cd1cff0d5745b92aa7fac479627fb6';
      // this.pftest()
    },
    sendTest() {
      // this.$refs.unityvue.message(
      //   "MonoSingletionRoot",
      //   "LoadScene",
      //   "值班站长"
      // );
      console.log(this.$refs.unityvue);
    },
    sendTest2() {
      // this.$refs.unityvue.message(
      //   "MonoSingletionRoot",
      //   "ATSReceive",
      //   "尝试单扳实验"
      // );
    },
    pftest() {
      this.scoreTask(77);
    },
    async scoreTask(score) {
      await scoreTask(this.mytaskid, score);
      this.$message({
        type: "success",
        message: "分数成功提交，您的分数是：" + score,
        offset: 100,
      });
      this.tasks = null;
    },
    //如何发送
    async sendTaskToUnity() {
      let task = this.tasks;
      if (task) {
        this.$refs.unityvue.message(
          "MonoSingletionRoot",
          "ATSReceive",
          task.checkname
        );
      }
    },
    async logout() {
      if (this.intervaltask) {
        clearInterval(this.intervaltask);
      }
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  },
};
</script>
<style lang="scss">
#unity-container {
  height: 100%;
}
.unity-web .footer {
  display: none;
}
</style>
<style lang="scss" scoped>
.unity-web {
  position: absolute;
  left: 0;
  top: 50px;
  width: 100%;
  height: calc(100% - 50px);
}
.my-tasks {
  display: inline-block;
  span {
    font-size: 12px;
    color: #f60;
  }
  margin: 0 20px 0 0;
}
.dealtask {
  font-size: 12px;
  color: #f60;
  padding-top: 6px;
  flex: 1;
  text-align: center;
}
.my-buts {
  position: absolute;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: #fff;
  box-shadow: 0 0 10px #ccc;
  display: flex;
  justify-content: space-between;
  .title {
    font-size: 26px;
    font-weight: bold;
    display: inline-block;
    margin: 10px 0 0 20px;
  }
  .username {
    display: inline-block;
    margin: 13px 20px 0 0;
    a {
      color: #409eff;
      margin: 0 0 0 5px;
      text-decoration: underline;
    }
  }
}
</style>