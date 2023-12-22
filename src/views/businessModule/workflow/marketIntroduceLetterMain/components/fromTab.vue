<template>
  <div class="accountInfoClass">
    <el-form ref="subFrom" :model="subFormData" :rules="rules" :disabled="disabled">
      <div class="bthGround">
        <el-button type="primary" size="mini" @click="handleAdd" icon="el-icon-plus">新增</el-button>
      </div>
      <el-table :data="subFormData.detailList" style="width: 100%" size="small" fit class="f2bpmui-datagrid-vuetable"
        :header-cell-class-name="headerCellClass">
        <el-table-column label="序号" type="index" width="50" :align="'center'"></el-table-column>
        <el-table-column label="被介绍人" :class="'required'">
          <template slot-scope="scope">
            <el-form-item>
              <el-input type="text" v-model="scope.row.introducedPersonName" size="small" placeholder="请输入" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="身份证号">
          <template slot-scope="scope">
            <el-form-item :prop="`detailList.${scope.$index}.identityCard`" :rules="rules.identityCard">
              <el-input type="text" v-model="scope.row.identityCard" maxlength="18" size="small" placeholder="请输入" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="性别">
          <template slot-scope="scope">
            <el-form-item>
              <el-select v-model="scope.row.sex" placeholder="请选择" size="small">
                <el-option v-for="item in sexOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="年龄">
          <template slot-scope="scope">
            <el-form-item>
              <el-input type="text" v-model.number="scope.row.age" size="small" placeholder="请输入" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <d3Pagination :sourceData="keepData" ref="d3Pagination" v-model="subFormData.detailList" />
    </el-form>
  </div>
</template>

<script>
import d3Pagination from "@/components/basic/pagination/index.vue";
export default {
  name: "accountInfo",
  components: { d3Pagination },
  props: {
    value: {
      type: Array,
      default: () => { }
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      subFormData: {
        detailList: []
      },
      keepData: [],
      sexOptions: [
        { label: "女", value: "0" },
        { label: "男", value: "1" }
      ],
      rules: {
        identityCard: [
          { validator: this.validateIdCard, trigger: ['change', 'blur'] }
        ],
      },
      id: ''
    };
  },
  watch: {
    value: {
      handler: function (val) {
        if (val) this.keepData = val
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    validateIdCard (rule, value, callback) {
      const pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      let index = rule.field.substr(11, 1)
      if (!value) return false
      if (!pattern.test(value)) {
        return callback(new Error("请输入正确格式的身份证号"))
      }
      this.subFormData.detailList[index].sex = this.getIdCardInfo(value).sex
      this.subFormData.detailList[index].age = this.getIdCardInfo(value).age
      callback()
    },
    //通过身份证号计算年龄、性别、出生日期
    getIdCardInfo: function (idCardNo) {
      let idCardInfo = {
        sex: '', //性别
        birthday: '', // 出生日期(yyyy-mm-dd)
        age: '',
      };
      if (idCardNo.length == 15) {
        idCardInfo.birthday = "19" + idCardNo.substr(6, 2) + "-" + idCardNo.substr(10, 2) + "-" + idCardNo.substr(12, 2);
        if (parseInt(idCardNo.charAt(14)) % 2 == 0) {
          idCardInfo.sex = '0';
        } else {
          idCardInfo.sex = '1';
        }
      } else if (idCardNo.length == 18) {
        idCardInfo.birthday = idCardNo.substr(6, 4) + "-" + idCardNo.substr(10, 2) + "-" + idCardNo.substr(12, 2);
        if (parseInt(idCardNo.charAt(16)) % 2 == 0) {
          idCardInfo.sex = '0';
        } else {
          idCardInfo.sex = '1';
        }
      }
      //获取年龄
      let myDate = new Date();
      let month = myDate.getMonth() + 1;
      let day = myDate.getDate();
      let age = myDate.getFullYear() - idCardInfo.birthday.substring(0, 4) - 1;
      if (idCardInfo.birthday.substring(4, 6) < month || idCardInfo.birthday.substring(4, 6) == month && idCardInfo.birthday.substring(6, 8) <= day) {
        age++;
      }
      idCardInfo.age = age
      return idCardInfo;
    },

    headerCellClass ({ row, column, rowIndex, columnIndex }) {
      const setIndexArr = [1, 2, 3, 4]; //想要改变列的索引
      if (setIndexArr.includes(columnIndex)) {
        //有出现的话就返回
        return "is_required";
      }
    },
    handleAdd () {
      const rowId = Object.toQueryString('rowId')
      let _keepData = this.keepData
      const obj = {
        age: "",
        id: rowId || "", //介绍信申请信息表Id
        identityCard: "", //身份证号
        introducedPersonName: "", //姓名
        sex: "", //性别
      };
      _keepData.push(obj)
    },
    handleDelete (index, row) {
      let _keepData = this.keepData //源数据
      let _d3Pagination = this.$refs.d3Pagination
      //源数据当前页下标
      let _sourceIndex = (_d3Pagination.currentPage - 1) * _d3Pagination.pageSize + index
      if (_keepData.length === 1) {
        this.$message.info("至少保留一条数据");
        return false;
      }
      _keepData.splice(_sourceIndex, 1)

    },
    validateForm () {
      const validObj = {
        introducedPersonName: '被介绍人',
        identityCard: '身份证',
        sex: '性别',
        age: '年龄'
      }
      const _keepData = this.keepData
      let _d3Pagination = this.$refs.d3Pagination
      //源数据当前页下标
      let _pageSize = _d3Pagination.pageSize
      for (let index = 0; index < _keepData.length; index++) {
        let _row = _keepData[index]
        let _currentPage = parseInt((Number(index) + 1) / _pageSize) + 1
        for (let key in validObj) {
          if (!_row[key]) {
            this.$message.error(`被介绍人信息：第 ${_currentPage} 页，第 ${(parseInt(index) + 1)%_pageSize} 行 ${validObj[key]} 不能为空`)
            return false
          }
        }
      }
      return this.keepData
    }
  }
};
</script>

<style scoped>
::v-deep .el-table td.el-table__cell div {
  overflow: initial;
  height: 50px;
  line-height: 50px;
}

::v-deep .el-table td.el-table__cell .el-form-item__error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 0;
  padding-top: 0px;
  position: absolute;
  top: 100%;
  left: 0;
}

.bthGround {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

::v-deep.el-table .is_required .cell::after {
  content: "*";
  color: #f56c6c;
  margin-left: 4px;
}
</style>
