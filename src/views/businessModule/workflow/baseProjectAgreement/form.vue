<template>
  <!-- 项目协议表单 -->
  <div class="form-box">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="140px" :disabled="setting.readonly">
      <row-layout :cols="3" title="立项信息">
        <template slot="col_1">
          <el-form-item prop="code" label="单据编号：">
            <el-input v-model="dataForm.code" size="small" disabled :placeholder="autofillPlaceHolder"></el-input>
          </el-form-item>
          <el-form-item prop="customerName" label="客户：">
            <el-input v-model="dataForm.customerName" disabled size="small" :placeholder="autofillPlaceHolder" />
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="marketCode" label="立项编号：">
            <select-dialog :width="600" :height="360" :value="dataForm.marketCode"
              @updateValue="selectConstructArchiveMain" :modelData="marketMainModelData" :isLinkBtn="true"
              dynamicModel="customDialog"></select-dialog>
          </el-form-item>
          <el-form-item prop="businessUnit" label="业务单元：">
            <el-input v-model="dataForm.businessUnit" size="small" disabled :placeholder="autofillPlaceHolder" />
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="marketName" label="立项名称：">
            <el-input v-model="dataForm.marketName" size="small" disabled :placeholder="autofillPlaceHolder"></el-input>
          </el-form-item>
          <el-form-item prop="followerName" label="跟进人：">
            <el-input v-model="dataForm.followerName" size="small" disabled :placeholder="autofillPlaceHolder"></el-input>
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="3" title="办理信息">
        <template slot="col_1">
          <el-form-item prop="toHandleTheType" label="办理类型：">
            <el-radio-group v-model="dataForm.toHandleTheType">
              <el-radio :label="item.configValue" :key="item.configName" v-for="item in radioData">{{ item.configName
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="scheme" label="协议名称：">
            <el-input v-model="dataForm.scheme" size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="effectiveBeginDate" label="有效开始日期：">
            <el-date-picker v-model="dataForm.effectiveBeginDate" value-format="yyyy-MM-dd" type="date"
              placeholder="选择日期时间" :disabled="!isTheTypeNew"></el-date-picker>
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="masterProjectAgreementCode" label="主协议编号：">
            <el-input v-model="dataForm.masterProjectAgreementCode" size="small" disabled
              :placeholder="pleaseEnterPlaceHolder" v-if="isTheTypeNew" />
            <select-dialog :width="600" :height="360" :value="dataForm.masterProjectAgreementCode"
              @updateValue="selectProjectAgreement" :modelData="projectAgreementModelData" :isLinkBtn="true"
              dynamicModel="customDialog" v-else></select-dialog>
          </el-form-item>
          <el-form-item prop="estimateAmountOfCooperation" label="预估合作金额(元)：">
            <amount-input v-model.trim="dataForm.estimateAmountOfCooperation" size="small" placeholder="请输入保留两位小数的正数" />
          </el-form-item>
          <el-form-item prop="effectiveEndDate" label="有效结束日期：">
            <el-date-picker v-model="dataForm.effectiveEndDate" value-format="yyyy-MM-dd" type="date"
              placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="masterProjectAgreementName" label="主协议名称：">
            <el-input v-model="dataForm.masterProjectAgreementName" size="small" :placeholder="pleaseEnterPlaceHolder"
              :disabled="isTheTypeNew" />
          </el-form-item>
          <el-form-item label=" ">
            <el-radio-group>
              <el-radio :label="item.label" :key="item.name" v-for="item in []">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="theLatestValidEndDate" label="最新有效结束日期：">
            <el-date-picker v-model="dataForm.theLatestValidEndDate" value-format="yyyy-MM-dd" type="date"
              placeholder="选择日期时间" disabled></el-date-picker>
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1">
        <template slot="col_1">
          <el-form-item prop="memo" label="备注：">
            <el-input v-model="dataForm.memo" type="textarea" :rows="3" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" title="附件">
        <el-form-item slot="col_1" prop="fileInfoList" label="附件：">
          <update-files v-model="dataForm.fileInfoList"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" v-if="type !== 'add'">
        <template slot="col_1">
          <el-form-item prop="createUserName" label="编制人：">
            <span> {{ dataForm.createUserName }}</span>
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="deptName" label="编制人部门：">
            <span> {{ dataForm.deptName }}</span>
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="createTime" label="编制时间：">
            <span> {{ dataForm.createTime }}</span>
          </el-form-item>
        </template>
      </row-layout>
    </el-form>
  </div>
</template>
<script>
import comMixin from "../minix";
import RowLayout from "@/components/basic/fromLayout/rowLayout.vue";
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import SelectDialog from "@/components/workflow/selector/selectorDialog.vue";
import { getDataDictByConfigType } from '@/Api/dataDict.js'
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import AmountInput from '@/components/basic/numberInput/amountInput.vue';
export default {
  name: "baseBankArchiveMainListForm",
  components: {
    RowLayout,
    updateFiles,
    SelectDialog,
    AmountInput
  },
  props: {
    type: {
      type: String,
      default: ""
    },
    value: {
      type: Object,
      default: () => { }
    }
  },
  mixins: [comMixin],
  data () {
    return {
      dataForm: {
        businessUnit: "", //业务单元
        code: "", //单据编号
        customerName: "", //客户
        effectiveBeginDate: "", //有效开始日期
        effectiveEndDate: "", //有效结束日期
        estimateAmountOfCooperation: "", //预估合作金额
        fileInfoList: [], //附件
        followerName: "", //跟进人名称
        procInstState: "", //单据状态
        protocolState: "", //协议状态
        marketCode: "", //立项编号
        marketName: "", //立项名称
        marketMainId: "", //营销主键
        scheme: "", //协议名称
        masterProjectAgreementName: "", //主协议名称
        masterProjectAgreementCode: "", //主协议编号
        masterProjectAgreementId: "", //主协议Id
        theLatestValidEndDate: "", //最新有效结束日期
        toHandleTheType: "", //办理类型
        memo: "", //备注
        wiid: "", //流程实例
        createUserName: "", //编制人
        createUserId: "", //编制人Id
        deptId: "", //编制人部门
        deptName: "", //编制人部门
      },
      autofillPlaceHolder: "自动带出", //自动填写
      pleaseEnterPlaceHolder: "请输入", //请输入
      dataRule: RuleRequired.dataRule(['marketCode', 'toHandleTheType', 'scheme', 'effectiveBeginDate',
        'effectiveEndDate', 'estimateAmountOfCooperation', 'fileInfoList','masterProjectAgreementCode']),
      radioData: [],
      marketMainModelData: { code: 'YingXiaoLiXiangXiangMuXieYi', parm: { data: [], singleSelect: true } },
      projectAgreementModelData: { code: 'XiangMuXieYiBianHao', parm: { data: [], singleSelect: true } },
    };
  },
  created () {
  },
  computed: {
    //是否新办
    isTheTypeNew () {
      return this.dataForm.toHandleTheType == 1
    },
  },
  watch: {
    'dataForm.toHandleTheType': {
      handler: function (val) {
        this.dataRule['masterProjectAgreementCode'] = RuleRequired.curFiledRule(!this.isTheTypeNew);
        this.dataRule['effectiveBeginDate'] = RuleRequired.curFiledRule(this.isTheTypeNew);
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    beforeInit () {
      this.getDataDictByConfigType();
      const _this = this
      _this.dataRule['estimateAmountOfCooperation'] = [
        ...RuleRequired.curFiledRule(true),
        ...RuleRequired.curCustomRule(true, function (rule, value, callback) {
          let pattern = /^[\d]+(\.[\d]{1,2})?$/;
          if (pattern.test(value)) {
            _this.dataForm.estimateAmountOfCooperation = Object.tofixed(value, 2)
            callback()
          } else {
            callback(new Error('请输入正数,保留两位小数'))
          }
        }, 'blur')
      ]
    },
    //立项编号
    selectConstructArchiveMain (data) {
      this.dataForm.marketName = data[0].marketname;//立项名称
      this.dataForm.marketCode = data[0].marketcode;//立项编号
      this.dataForm.customerName = data[0].customername;//客户
      this.dataForm.businessUnit = data[0].businessunit;//业务单元
      this.dataForm.followerName = data[0].followername;//跟进人
      this.dataForm.marketMainId = data[0].marketmianid;//营销主键
    },
    //主协议编号
    selectProjectAgreement (data) {
      this.dataForm.masterProjectAgreementName = data[0].scheme;//主协议名称
      this.dataForm.masterProjectAgreementCode = data[0].schemecode;//主协议编号
      this.dataForm.masterProjectAgreementId = data[0].projectagreementid;
      if (!this.isTheTypeNew) {
        this.dataForm.effectiveBeginDate = data[0].thelatestvalidenddate || data[0].effectiveenddate
        this.dataForm.theLatestValidEndDate = data[0].effectiveenddate
      }
    },
    async validateForm () {
      const _this = this;
      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          if (valid) {
            resolve(_this.dataForm)
          } else {
            resolve(false)
          }
        })
      });
    },
    //初始化字典
    async getDataDictByConfigType () {
      const res = await getDataDictByConfigType({ params: { configTypes: '办理类型' } })
      if (res.success) {
        res.data.forEach(ele => {
          this.radioData = ele.dataDict;
        });
      }
    },
  }
};
</script>
<style lang="scss" scoped>
@import url("../../style/form.scss");
.form-box {
  .el-form-item {
    margin-bottom: 20px;
  }


  .mylink {
    background: #006EFF;
    border-radius: 3px;
    cursor: pointer;
    color: #fff;
  }


}

::v-deep .el-table td.el-table__cell div {
  overflow: initial;
  height: 30px;
  line-height: 30px;
}
</style>
