<template>
  <!-- 项目开工报告表单 -->
  <div class="form-box">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="140px" :disabled="setting.readonly">
      <row-layout :cols="3" title="项目信息">
        <template slot="col_1">
          <el-form-item prop="constructMainCode" label="项目编号：">
            <el-input v-model="dataForm.constructMainCode" disabled size="small" :placeholder="autofillPlaceHolder" />
          </el-form-item>
          <el-form-item prop="firstPartyUnitName" label="甲方单位：">
            <el-input v-model="dataForm.firstPartyUnitName" disabled size="small" :placeholder="autofillPlaceHolder" />
          </el-form-item>

          <el-form-item prop="firstPartyLinkManTel" label="甲方联系人电话：">
            <el-input v-model="dataForm.firstPartyLinkManTel" size="small" :disabled="isConstruction"
              :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="superUnitLinkManContactTitle" label="监理联系人职务：">
            <el-input v-model="dataForm.superUnitLinkManContactTitle" size="small" :disabled="isConstruction"
              :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>


          <el-form-item prop="plannedCommencementDate" label="计划开工日期：">
            <el-input v-model="dataForm.plannedCommencementDate" disabled size="small"
              :placeholder="autofillPlaceHolder" />
          </el-form-item>

          <el-form :model="dataForm" ref="dataForm2" :rules="dataRule" label-width="140px" >
            <el-form-item prop="qualityRequirement" label="质量要求：">
              <el-input v-model="dataForm.qualityRequirement" size="small" :disabled="isZhuanYuanApprove"
                :placeholder="autofillPlaceHolder" />
            </el-form-item>
          </el-form>


          

          <el-form-item prop="projectDisclosureSituation" label="项目交底情况: ">
            <el-radio-group v-model="dataForm.projectDisclosureSituation" :disabled="isConstruction">
              <el-radio :label="item.label" :key="item.name" v-for="item in radioData">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="constructMainName" label="项目名称：">
            <el-input v-model="dataForm.constructMainName" disabled size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="firstPartyLinkMan" label="甲方单位联系人：">
            <el-input v-model="dataForm.firstPartyLinkMan" size="small" :disabled="isConstruction"
              :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="superUnit" label="监理单位：">
            <el-input v-model="dataForm.superUnit" size="small" :disabled="isConstruction"
              :placeholder="autofillPlaceHolder" />
          </el-form-item>

          <el-form-item prop="superUnitLinkManTel" label="监理联系人电话：">
            <el-input v-model="dataForm.superUnitLinkManTel" size="small" :disabled="isConstruction"
              :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          
          <el-form :model="dataForm" ref="dataForm1" :rules="dataRule" label-width="140px" >
          <el-form-item prop="contractDuration" label="合同工期(天)：">
            <el-input v-model="dataForm.contractDuration" :disabled="isZhuanYuanApprove"  onkeyup="this.value=this.value.replace(/[^0-9]/g,'')" size="small"
              :placeholder="autofillPlaceHolder" />
          </el-form-item>
          </el-form>

          <el-form-item prop="policyNo" label="保险单号：">
            <el-input v-model="dataForm.policyNo" size="small" disabled :placeholder="autofillPlaceHolder" />
          </el-form-item>

          <el-form-item prop="contractProjectDataMainCode" label="项目开工令">
            <div style="position: relative;">
              <el-input v-model="dataForm.contractProjectDataMainCode" placeholder="自动带出" disabled size="small">
              </el-input>
              <div class="link" v-show="dataForm.contractProjectDataMainCode" @click="toLink">{{ dataForm.contractProjectDataMainCode }}</div>
            </div>
           <!--  <select-dialog disabled  :btnDisabled="true" :isLinkBtn="true" :width="800" :modelData="{}" :placeholder="autofillPlaceHolder" :height="360" :value="dataForm.contractProjectDataMainCode"  dynamicModel="customDialog"></select-dialog> -->
          </el-form-item>


        </template>
        <template slot="col_3">
          <el-form-item prop="address" label="详细地址：">
            <el-input v-model="dataForm.address" size="small" disabled :placeholder="autofillPlaceHolder"></el-input>
          </el-form-item>

          <el-form-item prop="firstPartyLinkManContactTitle" label="甲方联系人职务：">
            <el-input v-model="dataForm.firstPartyLinkManContactTitle" size="small" :disabled="isConstruction"
              :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>

          <el-form-item prop="superUnitLinkMan" label="监理单位联系人：">
            <el-input v-model="dataForm.superUnitLinkMan" size="small" :disabled="isConstruction"
              :placeholder="autofillPlaceHolder" />
          </el-form-item>
          <el-form-item prop="archArea" label="建筑面积㎡：">
            <el-input v-model="dataForm.archArea" size="small" disabled :placeholder="autofillPlaceHolder"></el-input>
          </el-form-item>
          <el-form-item prop="bidPrice" label="中标价(元)：">
            <el-input v-model="dataForm.bidPrice" size="small" disabled :placeholder="autofillPlaceHolder"></el-input>
          </el-form-item>
          <el-form-item prop="constructionUnitName" label="管理部门：">
            <el-input v-model="dataForm.constructionUnitName" size="small" disabled
              :placeholder="autofillPlaceHolder"></el-input>
          </el-form-item>
          <el-form-item prop="code" label="单据编号：">
            <el-input v-model="dataForm.code" size="small" disabled :placeholder="autofillPlaceHolder"></el-input>
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" title="项目管理部门">
        <el-form-item slot="col_1" prop="constructReportDepartDetailList" label-width="0">
          <fromTab v-model="dataForm.constructReportDepartDetailList" ref="subFromData" :disabled="setting.readonly" :createUserName="dataForm.createUserName"></fromTab>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" title="事项内容">
        <el-table :data="itemDescTabData" slot="col_1">
          <el-table-column label="序号" type="index" width="50" :align="'center'"></el-table-column>
          <el-table-column label="事项描述" property="label"></el-table-column>
          <el-table-column label="完成情况" property="itemCode">
            <template slot-scope="scope">
              <el-form-item :prop="dataForm[scope.row.itemCode]" label-width="0"
                v-if="scope.row.itemCode === 'itemDescFour'">
                <el-input v-model="dataForm[scope.row.itemCode]" size="small"
                  placeholder="请填写工盟考勤机编号，或填写第三方考勤机情况说明"></el-input>
              </el-form-item>
              <el-form-item :prop="dataForm[scope.row.itemCode]" label-width="0" v-else>
                <el-radio-group v-model="dataForm[scope.row.itemCode]">
                  <el-radio :label="item.label" :key="item.name" v-for="item in radioData"
                    :disabled="['itemDescSix', 'itemDescFive'].includes(scope.row.itemCode)">{{ item.name }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </row-layout>
      <row-layout :cols="1" title="质量进度责任书">
        <el-form-item slot="col_1" prop="qualityProgressFile" label="附件文件：">
          <update-files v-model="dataForm.qualityProgressFile"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" title="安全责任书">
        <el-form-item slot="col_1" prop="safeFile" label="附件文件：">
          <update-files v-model="dataForm.safeFile"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" title="岗位责任书">
        <el-form-item slot="col_1" prop="postFile" label="附件文件：">
          <update-files v-model="dataForm.postFile"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" title="施工组织设计">
        <el-form-item slot="col_1" prop="buildFile" label="附件文件：">
          <update-files v-model="dataForm.buildFile"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" title="外出经营许可证">
        <el-form-item slot="col_1" prop="businessFile" label="附件文件：">
          <update-files v-model="dataForm.businessFile"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" title="施工许可证">
        <el-form-item slot="col_1" prop="buildLicenceFile" label="附件文件：">
          <update-files v-model="dataForm.buildLicenceFile"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" title="施工作业面移交单">
        <el-form-item slot="col_1" prop="billTransferFile" label="附件文件：">
          <update-files v-model="dataForm.billTransferFile"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" title="临时设施照片、办公室与仓库照片">
        <el-form-item slot="col_1" prop="photoFile" label="附件文件：">
          <update-files v-model="dataForm.photoFile"></update-files>
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
import fromTab from './components/fromTab.vue';
import SelectDialog from "@/components/workflow/selector/selectorDialog.vue";
import { getDataDictByConfigType } from '@/Api/dataDict.js'
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import { RADIO3_GROUP } from '@/views/businessModule/enum/param';

export default {
  name: "constructReportMain",
  components: {
    RowLayout,
    updateFiles,
    fromTab,
    SelectDialog,
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
        address: "", //详细地址
        archArea: "", //建筑面积(m2)
        bidPrice: "", //中标价(元)
        code: "", //单据编号
        constructMainId: "", //施工立项主键id
        constructMainCode: "", //立项项目编号
        constructMainName: "", //项目名称
        constructReportDepartDetailList: [
          {
            constructReportMainId: "",//项目开工报告主键
            id: "", //Id
            name: "", //姓名
            nameId: "", //姓名id
            phone: "", //联系电话
            post: "" //岗位
          }
        ],//项目管理部人员信息集合
        constructionUnitName: "", //管理部门
        contractDuration: "", //合同工期(天)
        qualityProgressFile: [], // 质量进度责任书
        safeFile: [], //安全责任书
        postFile: [], //岗位责任书
        personnelFile: [], //人员三级安全教育凭证
        buildFile: [], //施工组织设计
        businessFile: [], //外出经营许可证
        buildLicenceFile: [], //施工许可证
        billTransferFile: [], //施工作业面移交单
        photoFile: [], //临时设施照片、办公室与仓库照片
        finishedTime: "", //流程时间
        firstPartyLinkMan: "", //甲方单位联系人
        firstPartyLinkManContactTitle: "", //甲方单位联系人职务
        firstPartyLinkManTel: "", //甲方单位联系人电话
        firstPartyUnitName: "", //甲方单位
        id: "", //主键
        itemDescFive: "1", //劳务合同已审批并签署
        itemDescFour: "1", //公司规定的考勤机已安装到位，具备实名制考勤管理条件
        itemDescOne: "", //施工劳务人员已落实，其专业技能、年龄及其携带的施工机械能满足施工需求
        itemDescSix: "", //已完成并经责任人与公司审批且双方已签字确认
        itemDescThree: "", //个人安全防护用品用具已准备齐备，满足进场人员使用需求
        itemDescTwo: "", //现场安全防范措施已落实到位，并全部符合安全验收标准
        marketMainId: "", //营销主键id
        plannedCommencementDate: "", //计划开工日期
        policyNo: "", //保险单号
        procInstState: "", //流程状态
        processFinishedTime: "", //审批通过时间
        qualityRequirement: "", //质量要求
        superUnit: "", //监理单位
        superUnitLinkMan: "", //监理单位联系人
        superUnitLinkManContactTitle: "", //监理单位联系人职位
        superUnitLinkManTel: "", //监理单位联系人电话
        wiid: "", //流程实例
        createUserName: "", //编制人
        createUserId: "", //编制人Id
        deptId: "", //编制人部门
        deptName: "", //编制人部门
        contractProjectDataMainCode: "", //项目开工令 项目单据编号
        contractProjectDataMainId: "", //项目开工令 id
        projectDisclosureSituation: "", //项目交底情况
      },
      autofillPlaceHolder: "自动带出", //自动填写
      pleaseEnterPlaceHolder: "请输入", //请输入
      dataRule: RuleRequired.dataRule(['firstPartyLinkMan', 'superUnit', 'superUnitLinkMan', 'signDate', 'superUnitLinkManTel','firstPartyLinkManContactTitle','projectDisclosureSituation',
        'qualityProgressFile', 'safeFile', 'postFile', 'personnelFile', 'quality', 'address', 'detailAddress', 'payinDetailList','firstPartyLinkManTel','superUnitLinkManContactTitle']),
      itemDescTabData: [
        {
          label: '★施工劳务人员已落实，其专业技能、年龄及其携带的施工机械能满足施工需求',
          itemCode: 'itemDescOne',
        },
        {
          label: '★现场安全防范措施已落实到位，并全部符合安全验收标准',
          itemCode: 'itemDescTwo',
        },

        {
          label: '★个人安全防护用品用具已准备齐备，满足进场人员使用需求',
          itemCode: 'itemDescThree',
        },
        {
          label: '★公司规定的考勤机已安装到位，具备实名制考勤管理条件',
          itemCode: 'itemDescFour',
        },
        {
          label: '劳务合同已审批并签署',
          itemCode: 'itemDescFive',
        },
        {
          label: '已完成并经责任人与公司审批且双方已签字确认',
          itemCode: 'itemDescSix',
        },
      ],
      radioData: RADIO3_GROUP
    };
  },
  created () {
  },
  computed: {
    //是否编制人
    isConstruction () {
      return this.dataForm.createUserName !== WFContext.CurrentRealName
    },
    //是否审批阶段
    isProcInstCreatorRealName () {
      return  WFContext.WorkflowInstinceState == 2
    },
    /**
     * 审批环节“项目运营部负责人”人员填写
     */
     isZhuanYuanApprove() {
      const isRequired = ['项目运营部负责人'].find(res=> {return WFContext.CurrentActivityName.indexOf(res) != -1 })?true:false;
      let isApprove = this.pageBaseInfo.buttons.find((res)=>{return res.buttonName == '审批'})
      this.dataRule['contractDuration'] = RuleRequired.curFiledRule(isRequired && isApprove);
      this.dataRule['qualityRequirement'] = RuleRequired.curFiledRule(isRequired && isApprove);
      return !(isRequired && isApprove)
    }
  },
  methods: {
    toLink(){
      //if(this.dataForm.contractProjectDataMainCode) window.open(`/workflowForm?formAction=3&appId=AE&wiid=0081c0e0-351e-49ea-a1f6-da5e563e0c58&encode=contractProjectDataMain&rowId=${this.dataForm.contractProjectDataMainId}&code=custGrid_CustSearch_YingXiaoLiXiang&modelName=market`)
    },
    beforeInit () {
      // this.getDataDictByConfigType();
    },
    afterInit () {
      //审批阶段且审批人必填
      this.$router.replace({ query: { ...this.$route.query, 'isSubmit': this.isProcInstCreatorRealName } })
      console.log(WFContext.ProcInstCreatorRealName,WFContext.CurrentRealName ,WFContext.WorkflowInstinceState)
      //this.dataRule['qualityRequirement'] = RuleRequired.curFiledRule(this.isProcInstCreatorRealName);
      // this.dataRule['contractDuration'] = RuleRequired.curFiledRule(this.isProcInstCreatorRealName);
    },
    //立项编号
    selectDialoMarketMainCode (data) {
      this.dataForm.marketMainName = data[0].NAME;
      this.dataForm.marketMainCode = data[0].CODE;
      this.dataForm.marketMainId = data[0].id;
      this.dataForm.letterLookUpOrg = data[0].customerName;
    },
    selectDialogLetterIssueOrgName (data) {
      this.dataForm.letterIssueOrgName = data[0].text;
      this.dataForm.letterIssueOrgId = data[0].value;
    },
    //申请单位
    selectDialogApplicantOrgName (data) {
      this.dataForm.applicantOrgName = data[0].text;
      this.dataForm.applicantOrgId = data[0].value;
    },
    async validateForm () {
      const _this = this;
      const subFromData = await _this.$refs['subFromData'].validateForm();
      
      return new Promise(resolve => {

        if(_this.$refs['dataForm1']) {
              _this.$refs['dataForm1'].validate(valid => {
                if (valid) {
                  //return resolve(_this.getDataForm());
                } else {
                  return resolve(false)
                }
              })
            }
          
            if(_this.$refs['dataForm2']) {
              _this.$refs['dataForm2'].validate(valid => {
                if (valid) {
                  //return resolve(_this.getDataForm());
                } else {
                  return resolve(false)
                }
              })
            }

        _this.$refs['dataForm'].validate(valid => {
          if (valid && subFromData) {
            _this.dataForm.constructReportDepartDetailList = subFromData
            resolve(_this.dataForm)
          } else {
            resolve(false)
          }
        })
      });
    },
    //初始化字典
    async getDataDictByConfigType () {
      const res = await getDataDictByConfigType({ params: { configTypes: '申请类型' } })
      if (res.success) {
        res.data.forEach(ele => {
          this.applyTypeOptions = ele.dataDict;
        });
      }
    },

  }
};
</script>
<style lang="scss" scoped>
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

.link {
  position: absolute;
  padding-left: 12px;
  z-index: 1000;
  color: #006eff;
  top: 6px;
  background: #f5f7fa;
  left: 4px;
  line-height: 30px;
  text-decoration-line: underline;
  width: 85%;
  margin-right: 50px;

}
</style>
