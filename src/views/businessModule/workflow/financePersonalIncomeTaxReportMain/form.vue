<template>
  <!-- 个税全员全额申报表单 -->
  <div class="bank-files-form">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="140px" :disabled="setting.readonly">
      <row-layout :cols="3" title="基本信息">
        <template slot="col_1">
          <el-form-item prop="code" label="单据编号：">
            <el-input v-model="dataForm.code" disabled size="small" />
          </el-form-item>
          <el-form-item prop="constructManger" label="项目负责人：">
            <el-input v-model="dataForm.constructManger" disabled size="small" />
          </el-form-item>
          <el-form-item prop="taxAcross" label="跨税报号：">
            <select-dialog :width="800" :height="360" :value="dataForm.taxAcross" @updateValue="voucherCrossMainCode"
              :modelData="voucherCrossModelData" dynamicModel="customDialog"></select-dialog>
          </el-form-item>
          <el-form-item prop="registrationDate" label="报验登记日期：">
            <el-date-picker v-model="dataForm.registrationDate" value-format="yyyy-MM-dd" type="date"
              placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item prop="declarerName" label="申报人：">
            <select-dialog :width="800" :height="360" :value="dataForm.declarerName"
              @updateValue="selectDeclarerId" dynamicModel="selectUsers"></select-dialog>
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="constructCode" label="项目编号：">
            <select-dialog :width="800" :height="360" :value="dataForm.constructCode" @updateValue="selectConstructCode"
              :modelData="contractInProjectModelData" dynamicModel="customDialog"></select-dialog>
          </el-form-item>
          <el-form-item prop="projectAddress" label="项目地址：">
            <el-input v-model="dataForm.projectAddress" disabled size="small" placeholder="自动带出" />
          </el-form-item>
          <el-form-item prop="declarationPeriod" label="申报周期（预缴）：">
            <el-radio-group v-model="dataForm.declarationPeriod">
              <el-radio :label="item.configValue" :key="item.configName" v-for="item in declarationPeriodOptions">{{
                item.configName }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="baseTaxBureauArchiveName" label="税务局：">
            <select-dialog :width="800" :height="360" :value="dataForm.baseTaxBureauArchiveName"
              @updateValue="selectDialomarketCode" :modelData="marketMainModelData"
              dynamicModel="customDialog"></select-dialog>
          </el-form-item>
          <el-form-item prop="declarerTel" label="申报人联系电话：">
            <el-input v-model="dataForm.declarerTel" disabled size="small" placeholder="自动带出" />
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="constructName" label="项目名称：">
            <el-input v-model="dataForm.constructName" disabled size="small" placeholder="自动带出" />
          </el-form-item>
          <el-form-item prop="address" label="详细地址：">
            <el-input v-model="dataForm.address" disabled size="small" placeholder="自动带出"></el-input>
          </el-form-item>
          <el-form-item prop="applicationChannels" label="申报途径：">
            <el-radio-group v-model="dataForm.applicationChannels">
              <el-radio :label="item.configValue" :key="item.configName" v-for="item in applicationChannelsOptions">{{
                item.configName }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="isSocialSecurity" label="是否要求社保证明：">
            <el-radio-group v-model="dataForm.isSocialSecurity">
              <el-radio :label="item.label" :key="item.label" v-for="item in radioOptions">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="crossReportState" label="税跨报状态：">
            <el-input v-model="dataForm.crossReportState" disabled size="small" placeholder="自动带出"></el-input>
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1">
        <template slot="col_1">
          <el-form-item prop="memo" label="备注：">
            <el-input v-model="dataForm.memo" type="textarea" :rows="3" placeholder="最多输入500汉字" maxlength="500" />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" title="项目实际管理人员信息">
        <!-- 项目实际管理人员信息 -->
        <el-form-item slot="col_1" prop="detailList" label-width="0">
          <fromTab v-model="dataForm.detailList" ref="subFromData" :disabled="setting.readonly"
            :createUserName="dataForm.createUserName">
          </fromTab>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" :title="'附件'">
        <el-form-item slot="col_1" prop="fileInfoList" label="附件文件：">
          <update-files v-model="dataForm.fileInfoList"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <template slot="col_1">
          <el-form-item prop="createUserName" label="编制人：">
            <label class="label-style">{{ dataForm.createUserName }}</label>
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="deptName" label="编制人部门：">
            <label class="label-style">{{ dataForm.deptName }}</label>
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="createTime" label="编制时间：">
            <label class="label-style">{{ dataForm.createTime }}</label>
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
import fromTab from './components/fromTab.vue';
import SelectDialog from "@/components/workflow/selector/selectorDialog.vue";
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import { RADIO3_GROUP } from '@/views/businessModule/enum/param';
import { getDataDictByConfigType } from '@/Api/dataDict.js'

export default {
  name: "baseBankArchiveMainListForm",
  components: {
    RowLayout,
    updateFiles,
    fromTab,
    SelectDialog,
  },
  props: {
    value: {
      type: Object,
      default: () => { }
    }
  },
  mixins: [comMixin],
  data () {
    return {
      dataForm: {
        address: "", //项目详细地址
        applicationChannels: "", //申报途径
        baseTaxBureauArchiveId: "", //税务局档案id
        baseTaxBureauArchiveName: "", //税务局
        code: "", //单据编号
        constructArchiveMainId: "", //项目档案id
        constructCode: "", //项目编号
        constructManger: "", //项目负责人
        constructName: "", //项目名称
        crossReportState: "", //税跨报状态
        declarationPeriod: "", //申报周期(预缴)
        declarerId: "", //申报人id
        declarerName: "", //申报人
        declarerTel: "", //申报人联系电话
        deptName: "", //创建人部门
        contractInMainId:"",
        detailList: [
          {
            actualSalary: "", //实际发放工资(元)
            addDeduction: "", //专项附加扣除(元)
            fixedDeductionStandard: "", //固定扣除标准
            id: "", //主键
            idCard: "", //身份证号
            incomeTaxSalary: "", //收入(计划报个税工资)(元)
            memo: "", //备注
            name: "", //姓名
            personalIncomeTaxReportMainId: "", //个税申报主表id
            postion: "", //岗位
            securityAndProvidentFund: "", //社保及公积金可扣除(元)
            startIncomeDate: "", //开始申报日期
            endIncomeDate: "", //结束申报日期
            type: "1", //类型
          }
        ], //子表
        fileInfoList: [], //附件
        isSocialSecurity: "", //是否要求社保证明
        managerDeptName: "", //管理部门
        memo: "", //备注
        projectAddress: "", //项目地址
        registrationDate: "", //报验登记日期
        taxAcross: "", //跨区涉税报号
        voucherCrossTaxReportMainId: "", //跨区涉税事项报告表id
        procInstState: "", //流程状态
        createTime: "", //编制时间
        createUserName: "", //编制人
        deptName: "", //编制人部门
      },
      pleaseEnterPlaceHolder: "请输入", //请输入

      marketMainModelData: { code: 'XiangMuDangAnYinXingDangAn_CP146', parm: { data: [], singleSelect: true } },//项目档案（公用）
      voucherCrossModelData: { code: 'KuaShuiBaoHaoTongYong', parm: { varParams: [{ key: 'crossReportState', value: '6' }, { key: 'constructArchiveMainId', value: '' }] } }, //跨税报号（通用）报验
      contractInProjectModelData: { code: 'vconstructarchivemainvoucher', parm: { data: [], singleSelect: true } }, //项目档案（跨区涉税开具申请）
      declarerIdModelData: { code: 'vconstructarchivemainvoucher', parm: { data: [], singleSelect: true } }, // 申报人 默认编制人
      dataRule: RuleRequired.dataRule(['constructCode', 'declarationPeriod', 'applicationChannels', 'declarerName', 'declarerTel', 'isSocialSecurity', 'fileInfoList']),
      declarationPeriodOptions: [],
      applicationChannelsOptions: [],
      radioOptions: RADIO3_GROUP,
      countArr: ['actualSalary', 'addDeduction', 'incomeTaxSalary', 'fixedDeductionStandard', 'securityAndProvidentFund']
    };
  },
  computed: {
    //用户信息
    userInfo(){
      return this.$store.getters.userInfo
    }
  },
  watch: {
  },
  created () {
    this.getDataDictByConfigType();
    const { realName, userId, mobile } = this.userInfo
    this.dataForm.declarerName = realName;
    this.dataForm.declarerId = userId;
    this.dataForm.declarerTel = mobile;
  },
  methods: {
    afterInit () {
      //详情金额转千分位显示
      this.dataForm.detailList.forEach(item => {
        this.countArr.forEach(field => {
          if (item[field]) item[field] = MyFun.getQianfenWeiStr(MyFun.getTofixed(item[field], 2))
        })
      })
    },
    //项目编号
    selectConstructCode (data) {
      let { constructName, constructCode, constructArchiveMainId, constructManagerName, address, projectAddress } = data[0]
      this.dataForm.constructName = constructName;//项目名称
      this.dataForm.constructCode = constructCode;//项目编号
      this.dataForm.constructArchiveMainId = constructArchiveMainId;//项目id
      this.dataForm.constructManger = constructManagerName;//项目负责人
      this.dataForm.address = address;
      this.dataForm.projectAddress = projectAddress;
      this.voucherCrossModelData.parm.varParams[1].value = constructArchiveMainId
    },
     //税跨报号
     voucherCrossMainCode (data) {
      this.dataForm.taxAcross = data[0].taxAcross;//税跨报号
      this.dataForm.voucherCrossTaxReportMainId = data[0].voucherCrossTaxReportMainId;//税跨报号单id
      this.dataForm.baseTaxBureauArchiveId = data[0].baseTaxBureauArchiveId;//税务局档案id
      this.dataForm.baseTaxBureauArchiveName = data[0].baseTaxBureauArchiveName;//税务局
      this.dataForm.contractInMainId = data[0].contractInMainId;//收入合同
    },
    // 申报人
    selectDeclarerId (data) {
      this.dataForm.declarerId = data[0].userId //申报人id
      this.dataForm.declarerName = data[0].realName //申报人
      this.dataForm.declarerTel = data[0].mobile //申报人联系电话
    },
    async validateForm () {
      const _this = this;
      const subFromData = Object.toDeepClone(_this.$refs['subFromData'].validateForm())

      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          if (valid && subFromData) {
            subFromData.forEach(item => {
              _this.countArr.forEach(field => {
                item[field] = Number(item[field].toString().includes(",") ? MyFun.getCopyAmount(item[field]) : item[field])
              })
            })
            _this.dataForm.legalLetterClientDetailList = subFromData
            resolve(_this.dataForm)
          } else {
            resolve(false)
          }
        })
      });
    },
    /* 初始化字典 */
    async getDataDictByConfigType () {
      const res = await getDataDictByConfigType({ params: { configTypes: '申报周期,申报途径' } })
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '申报周期':
              this.declarationPeriodOptions = ele.dataDict;
              break;
            case '申报途径':
              this.applicationChannelsOptions = ele.dataDict;
              break;
            default:
              break;
          }
        });
      }
    },
  }
};
</script>
<style lang="scss" scoped>
@import url('../../style/form.scss');

.bank-files-form {
  .el-form-item {
    margin-bottom: 20px;
  }

  .link_box {
    display: flex;
    align-items: center;

    .link_text {
      flex: 1;
    }

    .link_btn {
      height: 30px;
      margin: 2px 0 0 3px;
    }
  }
}
</style>
