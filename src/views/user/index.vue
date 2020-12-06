<template>
  <div class="dashboard-container">
    <h1>用户列表</h1>
    <div>
      <div class="buts">
        <el-button type="primary" plain size="small" @click="showAddUser()"
          >添加用户</el-button
        >
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="code" label="工号"> </el-table-column>
        <el-table-column prop="nickname" label="姓名"> </el-table-column>
        <el-table-column prop="sex" label="性别"> </el-table-column>
        <el-table-column prop="phone" label="联系方式"> </el-table-column>
        <el-table-column prop="username" label="登录用户名"> </el-table-column>
        <el-table-column label="角色">
          <template slot-scope="scope">
            {{ scope.row.role ? scope.row.role.description : "无" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showEditUser(scope.row)"
              >编辑</el-button
            >
            <el-button type="text" size="small" @click="deleteUser(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- -->
    <el-dialog
      :title="isAddUser ? '添加用户' : '修改用户'"
      :visible.sync="dialogVisible"
      width="50%"
      style="text-align: left"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="工号" prop="usercode">
          <el-input v-model="form.usercode"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="nickname">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="登录用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item v-if="isAddUser" label="登录密码" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleid">
          <el-select v-model="form.roleid" placeholder="请选择角色">
            <el-option
              v-for="item of roles"
              :label="item.description"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          v-loading="savinguser"
          type="primary"
          @click="confirmSaveUser"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  allusers,
  getRoles,
  adduser,
  updateuser,
  deleteuser,
} from "@/api/func";

export default {
  data() {
    return {
      tableData: [],
      pageindex: 1,
      pagesize: 10,

      dialogVisible: false,
      isAddUser: false,
      savinguser: false,
      form: {
        usercode: "",
        nickname: "",
        sex: "男",
        phone: "",
        username: "",
        password: "",
        roleid: "",
      },
      updateuserid: "",
      rules: {
        usercode: { required: true, message: "请输入工号", trigger: "blur" },
        nickname: { required: true, message: "请输入姓名", trigger: "blur" },
        phone: { required: true, message: "请输入联系方式", trigger: "blur" },
        username: { required: true, message: "请输入登录名", trigger: "blur" },
        password: { required: true, message: "请输入密码", trigger: "blur" },
        roleid: { required: true, message: "请选择角色", trigger: "change" },
      },
      roles: [],
    };
  },
  methods: {
    async initInfo() {
      let obj = await allusers(this.pageindex, this.pagesize);
      this.tableData = obj.data.users;
    },
    async initOther() {
      let obj = await getRoles();
      this.roles = obj.data;
    },
    async confirmSaveUser() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          if (this.isAddUser) {
            this.savinguser = true;
            await adduser(this.form);
            this.$message({ type: "success", message: "添加用户成功!" });
            this.savinguser = false;
            this.initInfo();
            this.dialogVisible = false;
          } else {
            this.savinguser = true;
            await updateuser(this.updateuserid, this.form);
            this.$message({ type: "success", message: "修改用户成功!" });
            this.savinguser = false;
            this.initInfo();
            this.dialogVisible = false;
          }
        } else {
          return false;
        }
      });
    },

    reset() {
      this.form = {
        usercode: "",
        nickname: "",
        sex: "男",
        phone: "",
        username: "",
        password: "",
        roleid: "",
      };
      this.updateuserid = "";
    },
    showAddUser() {
      this.isAddUser = true;
      this.dialogVisible = true;
      this.reset();
    },
    showEditUser(us) {
      this.isAddUser = false;
      this.dialogVisible = true;
      this.updateuserid = us.id;
      this.form.usercode = us.code;
      this.form.nickname = us.nickname;
      this.form.sex = us.sex;
      this.form.phone = us.phone;
      this.form.username = us.username;
      this.form.password = us.password;
      this.form.roleid = us.role ? us.role.id : "";
    },
    deleteUser(us) {
      this.$confirm("确定要删除该用户吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await deleteuser(us.id);
          this.$message({ type: "success", message: "操作成功!" });
          this.initInfo();
        })
        .catch(() => {});
    },
  },
  mounted() {
    this.initInfo();
    this.initOther();
  },
};
</script>
<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
  text-align: center;
}
.buts {
  text-align: right;
  margin: 0 0 10px 0;
}
</style>