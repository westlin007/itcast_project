<template>
  <div class="roleList">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮添加 -->
    <el-button type="success" plain>添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="roleList" border style="width: 100%;margin-top:15px">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 这个内容在我们的项目中需要我们自己来生成 -->
          <el-row v-for="first in scope.row.children" :key="first.id" style="margin-bottom:15px;border-bottom:1px dashed #f00;">
            <el-col :span="4">
              <el-tag closable :type="'success'"   @close='cnt=0;delRight(scope.row,first.id)'>{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
                <el-row v-for='second in first.children' :key='second.id'  style="margin-bottom:10px;">
                    <el-col :span="4"><el-tag closable :type="'info'"   @close='cnt=0;delRight(scope.row,second.id)'>{{second.authName}}</el-tag></el-col>
                    <el-col :span="20">
                        <el-tag closable :type="'error'" v-for='third in second.children' :key='third.id'  style="margin-right:5px;margin-bottom:5px"  @close='cnt=0;delRight(scope.row,third.id)'>{{third.authName}}</el-tag>
                    </el-col>
                </el-row>
            </el-col>
          </el-row>
          <el-row>
              <el-col :span='24' v-show='scope.row.children.length === 0'>还没有任何的权限，先分配！！</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="角色授权" placement="top">
            <el-button type="success" icon="el-icon-share" @click="showGrantDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限对话框 -->
    <el-dialog title="权限分配" :visible.sync="grantdialogTableVisible">
      <el-tree
        :data="rightList"
        ref='tree'
        show-checkbox
        node-key="id"
        :default-expand-all='true'
        :default-checked-keys="chkedArr"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantdialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAllRoleList, delRightByRoleId, grantRoleById } from '@/api/role_index.js'
import { getAllRightList } from '@/api/right_index.js'
export default {
  data () {
    return {
      roleId: '',
      cnt: 0,
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      grantdialogTableVisible: false,
      roleList: [],
      rightList: [],
      chkedArr: []
    }
  },
  methods: {
    // async:标记这个函数中会有异步操作
    // 实现角色授权
    async grantRole () {
      // 先获取到当前用户所选择所有的权限id,拼接 为以,分隔的字符串
      // var rids = ''
      // getCheckedKeys
      // getCheckedNodes
      // console.log(this.$refs.tree.getCheckedKeys())
      // // 取父级节点
      // console.log(this.$refs.tree.getHalfCheckedKeys())
      // console.log(this.$refs.tree.getCheckedNodes())
      // 1.我们有：[{id:109,pid:'107,102'},{id:154,pid:'107,102'}]
      let arr = this.$refs.tree.getCheckedNodes()
      // console.log(arr)
      // 2.遍历数组，进行数据的拼接
      let temp = []
      for (var i = 0; i < arr.length; i++) {
        temp.push(arr[i].id + ',' + arr[i].pid) // ["109,107,102","154,107,102"]
      }
      // console.log(temp)
      // 3.拼接数组元素再转换为数组
      temp = temp.join(',').split(',') // [109,107,102,154,107,102]
      // console.log(temp)
      // 4.数组才能去重  new Set(数组)可以去除数组中的重复数据，它的返回值是一个Set对象
      temp = [...new Set(temp)]
      // console.log(temp.join(','))

      // ?.我们要："102,107,109,154"
      // await：这个关键字是标记后面的是异步操作，我们需要等待这个异步操作执行完毕之后，才进行下一步行为
      // await必须写在async中，并且async只能加给上一级函数
      let res = await grantRoleById(this.roleId, temp.join(','))
      console.log(res)
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
        this.grantdialogTableVisible = false
        this.init()
      } else {
        this.$message.error(res.data.meta.msg)
      }
    },
    // 弹出角色授权对话框
    showGrantDialog (row) {
      // 这里进行数据的存储是为了后期角色授权时能够正确的获取角色id
      this.roleId = row.id
      // 1.让对话框展示
      // 2.加载树形组件的数据
      // 3.获取权限id，让节点默认被选择
      this.grantdialogTableVisible = true
      // 加载树形组件的数据
      getAllRightList('tree').then(res => {
        console.log(res)
        this.rightList = res.data.data
      })
      this.chkedArr.length = 0
      // 获取当前角色的所有权限id,添加到chkedArr
      // 我们只需要获取最后一级--建议尽量做一个判断
      row.children.forEach(first => {
        if (first.children.length > 0) {
          first.children.forEach(second => {
            if (second.children.length > 0) {
              second.children.forEach(third => {
                this.chkedArr.push(third.id)
              })
            }
          })
        }
      })
    },
    delRight (row, rightId) {
      delRightByRoleId(row.id, rightId)
        .then(res => {
          // console.log(res)
          if (this.cnt === 0) {
            this.$message.success('删除角色权限成功')
            this.cnt++
          }
          row.children = res.data.data
          row.children.forEach((v1, in1) => { // 遍历一级权限
            if (v1.children.length === 0) { // 说明这个一级权限下没有任何的二级权限
              this.delRight(row, v1.id)
            } else {
              v1.children.forEach((v2, in2) => {
                if (v2.children.length === 0) { // 说明这个二级权限下没有任何的三级权限
                  this.delRight(row, v2.id)
                }
              })
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  },

  mounted () {
    getAllRoleList()
      .then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.roleList = res.data.data
        }
      })
  }
}
</script>
<style lang="less" scoped>

</style>
