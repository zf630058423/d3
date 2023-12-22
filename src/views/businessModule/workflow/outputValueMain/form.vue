<template>
  <!-- 产值填报表单 -->
  <!-- :disabled="setting.readonly" -->
  <div v-loading="loading" class="start-form">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="170px"
    >
      <row-layout title="项目信息" :cols="3">
        <el-form-item slot="col_1" prop="code" label="单据编号：">
          <el-input v-model="dataForm.code" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
        </el-form-item>
        <el-form-item slot="col_2" prop="constructCode" label="项目编号：">
          <select-dialog :disabled="true" :isLinkBtn="true" :btnDisabled="setting.readonly" :width="900" :height="360" :modelData="projectModel" :value="dataForm.constructCode" @updateValue="projectUpdate" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="constructName" label="项目名称：">
          <el-input v-model="dataForm.constructName" size="small" placeholder="请输入" disabled/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="constructionUnitName" label="管理部门：">
          <el-input v-model="dataForm.constructionUnitName" size="small" placeholder="自动带出" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" prop="projectManagerName" label="项目负责人：">
          <el-input v-model="dataForm.projectManagerName" size="small" placeholder="自动带出" disabled/>
        </el-form-item>
        <el-form-item slot="col_3" prop="totalConstructionAmount" label="施工总金额(含税)(元)：">
          <link-input v-model="dataForm.totalConstructionAmount" tip="链接到建安合同详情/第一个审核通过的设计收入合同详情" :placeholder="msgTip.SYSTEM_PLACEHOLDER" disabled></link-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="customerName" label="客户：">
          <el-input v-model="dataForm.customerName" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
        </el-form-item>
        <el-form-item slot="col_2" prop="competitionUnitName" label="中标单位：">
          <el-input size="small" v-model="dataForm.competitionUnitName" placeholder="自动带出" disabled></el-input>
        </el-form-item>
        <el-form-item slot="col_3" prop="totalPayInAmount" label="累计收款金额：">
          <el-input size="small" v-model="dataForm.totalPayInAmount" clearable :placeholder="msgTip.SYSTEM_PLACEHOLDER" disabled></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="totalMaterialAmount" label="材料累计入库金额：">
          <el-input type="number" v-model="dataForm.totalMaterialAmount" size="small" :placeholder="msgTip.SYSTEM_PLACEHOLDER" maxlength="20" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" prop="totalLaborAmount" label="劳务累计核量金额：">
          <el-input type="number" v-model="dataForm.totalLaborAmount" size="small" :placeholder="msgTip.SYSTEM_PLACEHOLDER" maxlength="20" disabled/>
        </el-form-item>
        <el-form-item slot="col_3" prop="totalMaterialLaborAmount" label="材料劳务总额：">
          <el-input type="number" v-model="dataForm.totalMaterialLaborAmount" size="small" :placeholder="msgTip.SYSTEM_PLACEHOLDER" maxlength="20" disabled />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="totalMaterialRate" label="材料累计入库占比(%)：">
          <el-input type="number" v-model="dataForm.totalMaterialRate" size="small" :placeholder="msgTip.SYSTEM_PLACEHOLDER" maxlength="20" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" prop="totalLaborRate" label="劳务累计核量占比(%)：">
          <el-input type="number" v-model="dataForm.totalLaborRate" size="small" :placeholder="msgTip.SYSTEM_PLACEHOLDER" maxlength="20" disabled/>
        </el-form-item>
        <el-form-item slot="col_3" prop="" label="">
        </el-form-item>
      </row-layout>
      <row-layout title="产值信息" :cols="3">
        <el-form-item slot="col_1" prop="currentPeriod" label="所属月份：">
          <!-- <el-date-picker v-model="dataForm.recordTime" type="datetime" :disabled="type==='add'?false:true" placeholder="选择日期时间"></el-date-picker> -->
          <el-date-picker v-model="dataForm.currentPeriod" value-format="yyyy-MM" type="month" placeholder="选择月份" :disabled="disabledVal()"></el-date-picker>
        </el-form-item>
        <el-form-item slot="col_2" prop="currentMonthReportAmount" label="本月申报施工产值(元)：">
          <!-- <el-input v-model="dataForm.currentMonthReportAmount" size="small" placeholder="请输入保留两位小数的正数" :disabled="disabledVal()" @input="numInput('currentMonthReportAmount')" /> -->
          <amount-input v-model="dataForm.currentMonthReportAmount" defaultValue placeholder="请输入" :disabled="disabledVal()"></amount-input>
        </el-form-item>
        <el-form-item slot="col_3" prop="currentMonthConfirmAmount" label="本月确认产值(元)：">
          <!-- <el-input v-model="dataForm.currentMonthConfirmAmount" size="small" placeholder="请输入保留两位小数的正数" :disabled="disabledVal()" @input="numInput('currentMonthConfirmAmount')" /> -->
          <amount-input v-model="dataForm.currentMonthConfirmAmount" defaultValue placeholder="请输入" :disabled="disabledVal()"></amount-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="totalOpenInvoiceAmount" label="已开票金额(含税)(元)：">
          <el-input type="number" v-model="dataForm.totalOpenInvoiceAmount" size="small" placeholder="系统计算" maxlength="20" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" prop="totalReportAmount" label="累计申报施工产值(元)：">
          <el-input type="number" v-model="dataForm.totalReportAmount" size="small" placeholder="系统计算" maxlength="20" disabled/>
        </el-form-item>
        <el-form-item slot="col_3" prop="totalConfirmAmount" label="累计确认产值(元)：">
          <el-input type="number" v-model="dataForm.totalConfirmAmount" size="small" placeholder="系统计算" maxlength="20" disabled/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="currentMonthReportImageProgress" label="本月施工产值形象进度(%)：">
          <el-input type="number" v-model="dataForm.currentMonthReportImageProgress" size="small" placeholder="系统计算" maxlength="20" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" prop="totalReportImageProgress" label="累计申报施工产值形象进度(%)：">
          <el-input type="number" v-model="dataForm.totalReportImageProgress" size="small" placeholder="系统计算" maxlength="20" disabled/>
        </el-form-item>
        <el-form-item slot="col_3" prop="totalConfirmImageProgress" label="累计确认产值形象进度(%)：">
          <el-input type="number" v-model="dataForm.totalConfirmImageProgress" size="small" placeholder="系统计算" maxlength="20" disabled/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="nextMonthEstimateAmount" label="下月施工产值预估(元)：">
          <!-- <el-input v-model="dataForm.nextMonthEstimateAmount" size="small" placeholder="请输入保留两位小数的正数" :disabled="disabledVal()" @input="numInput('nextMonthEstimateAmount')" /> -->
          <amount-input v-model="dataForm.nextMonthEstimateAmount" defaultValue placeholder="请输入" :disabled="disabledVal()"></amount-input>
        </el-form-item>
        <el-form-item slot="col_2" prop="status" label="项目状态：">
          <el-input v-model="dataForm.status" size="small" placeholder="自动带出" disabled/>
        </el-form-item>
        <el-form-item slot="col_3" prop="" label="">
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="remark" label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" :disabled="disabledVal()" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" :title="'甲方/监理本月确认产值附件'" :class="isMenu?'required-tag':''">
        <el-form-item slot="col_1" prop="confirmFileInfoList" label="附件文件：">
          <update-files v-model="dataForm.confirmFileInfoList"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" :title="'项目部本月申请产值附件'"  :class="isMust?'required-tag':''">
        <el-form-item slot="col_1" prop="reportFileInfoList" label="附件文件：">
          <update-files v-model="dataForm.reportFileInfoList"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" :title="'其他附件'">
        <el-form-item slot="col_1" prop="otherFileInfoList" label="附件文件：">
          <update-files v-model="dataForm.otherFileInfoList"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="createUserName" label="编制人：">
          <label class="label-style">{{dataForm.createUserName}}</label>
        </el-form-item>
        <el-form-item slot="col_2" prop="createUserDeptName" label="编制人部门：">
            <label class="label-style">{{dataForm.createUserDeptName}}</label>
        </el-form-item>
        <el-form-item slot="col_3" prop="createTime" label="编制时间：">
          <label class="label-style">{{ dataForm.createTime}}</label>
        </el-form-item>
      </row-layout>
    </el-form>
  </div>
</template>

<script>
import FormTitle from '@/components/basic/formTitle/index.vue';
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
import AmountInput from '@/components/basic/numberInput/amountInput.vue';
import CascSelect from '@/components/basic/cascSelect/index.vue';
import updateFiles from '@/components/basic/uploaderFile/index.vue';   // 上传附件
import {RADIO_GROUP} from '@/views/businessModule/enum/param';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import moment from 'moment';
import service from "@/utils/services";
import LinkInput from '@/components/basic/elInput/linkInput.vue';
import TextInput from '@/components/basic/elInput/textInput.vue'; //清除空格组件

import comMixin from '../minix';
import {
    FJiaFang_MODEL, CUSTOMER_MODEL, ZhanLueCaiGouCode_MODEL, XiangMuBianHao_MODEL
  } from '@/views/businessModule/enum/param';
import myFun from '@/utils/fun';

//必填字段 先全部加载
const requiredArray = ['handleType', 'constructCode', 'currentPeriod', 'currentMonthReportAmount', 
'currentMonthConfirmAmount', 'nextMonthEstimateAmount', 'fileInfoList'];
const { orgName, orgId, realName, userId } = FUI.Sys.getAuthor();
var type = Object.toQueryString('type') || '';
export default {
  components: { FormTitle, RowLayout, SelectDialog, AmountInput, CascSelect, updateFiles, LinkInput, TextInput, },
  mixins: [comMixin],
  data() {
    return {
      loading: false,
      formVisible: false,
      dialogVisible: false,
      radioData: RADIO_GROUP,
      dialogModel: FJiaFang_MODEL,  //跟进人 甲方弹窗
      projectModel: XiangMuBianHao_MODEL,  // 项目编号 弹窗
      dialogSupplier: CUSTOMER_MODEL,  // 乙方弹窗
      dialogCode: ZhanLueCaiGouCode_MODEL, 
      checkedBoxGroup: [],
      otherGiveReasonStatus:false,
      dataForm: {
        id:'', 
        code:'',  // 单据编号
        constructArchiveMainId:'',  // 项目编号id 必传
        constructCode:'',  // 项目编号
        constructName:'',  // 项目名称
        // constructId:'',  // 项目id  
        categoryId:'',  // 项目分类id 
        constructionUnitName:'',  // 管理部门
        constructionUnitId:'',  // 管理部门id
        projectManagerName:'',  // 项目负责人
        projectManagerId:'',  // 项目负责人id
        totalConstructionAmount: '',  // 施工总金额(含税)(元)
        customerName:'',  // 客户
        competitionUnitName:'',  // 中标单位
        totalPayInAmount:'',  // 累计收款金额
        totalMaterialAmount:'',  // 材料累计入库金额
        totalLaborAmount:'',  // 劳务累计核量金额
        totalMaterialLaborAmount:'',  // 材料劳务总额
        totalMaterialRate:'',  // 材料累计入库占比(%)
        totalLaborRate:'',  // 劳务累计核量占比(%)
        currentPeriod: moment(new Date()).format('YYYY-MM'),  // 所属月份
        currentMonthReportAmount: '',  // 本月申报施工产值(元)
        currentMonthConfirmAmount:'',  // 本月确认产值(元)
        totalOpenInvoiceAmount:'',  // 已开票金额(含税)(元)
        totalReportAmount:'',  // 累计申报施工产值(元)
        totalConfirmAmount:'',  // 累计确认产值(元)
        currentMonthReportImageProgress:'',  // 本月施工产值形象进度(%)
        totalReportImageProgress:'',  // 累计申报施工产值形象进度(%)
        totalConfirmImageProgress:'',  // 累计确认产值形象进度(%)
        nextMonthEstimateAmount:'',  // 下月施工产值预估(元)
        status:'',  // 项目状态
        // customerId: '', // 甲方id  
        // customerName: '',  // 甲方   
        remark: '',  // 备注
        fileInfoList: [],  // 附件文件
        confirmFileInfoList: [],  // 甲方/监理本月确认产值附件
        reportFileInfoList: [],  // 项目部本月申请产值附件
        otherFileInfoList: [],  // 其他附件
        createUserId:'', 
        createUserName:'',  // 编制人
        createUserDeptName:'',  // 编制人部门
        createTime:'',  // 编制时间
      },
      dateOrignalType:1,  //1 营销立项  2 预选承包商入库  3：投标文件评审  4： 标前评审
      bidEndDateLabelStatus: true,  //现投标截止时间是否显示
      isFollowupStatus: true,  //是否跟进状态显示和隐藏
      resultStateStatus: true,  //是否已出结果是否显示
      // estimateResultDateStatus: true,  //预计出结果日期 显示
      giveupReasonStatus: false,  //放弃原因是否显示 默认隐藏 'bidderRemark'
      reviewResultStatus: false,  //评审结果 默认不展示
      msgTip: RuleRequired.tipMsg,
      //必填项字段
      dataRule: RuleRequired.dataRule(requiredArray),
      isMenu: false,
      isMust: false,
      // currentMonth: new Date().getMonth()+1,  // 当前月份 
      totalReportAmount: 0,  // 累计申报施工产值(元)-接口获取的数据
      totalConfirmAmount: 0,   // 累计累计确认产值(元)-接口获取的数据
    }
  },
  computed: {
    //预计出结果日期  是否已出结果显示并且为未出结果时 显示预计出结果日期 是否已出结果 为“未出结果”时显示否则隐藏，且审批环节“跟进人”必须填写
    estimateResultDateStatus() { 
      return (this.resultStateStatus && this.dataForm.resultState == 0) ? true : false; 
    },
    // totalReportAmount(){
    //   return (this.dataForm.totalReportAmount+Number(this.dataForm.currentMonthReportAmount)) || 0;
    // }
  },
  watch: { 
    'dataForm.constructCode':{
      handler(newValue){
        if(newValue){
          this.getAutomaticData();
        }
      },
      deep:true,
    },
    'dataForm.currentMonthReportAmount':{ 
      handler(newValue){
        this.dataForm.totalReportAmount = this.totalReportAmount+Number(newValue) || 0;
        this.dataForm.currentMonthReportImageProgress = this.dataForm.totalConstructionAmount ? (Number(newValue)/this.dataForm.totalConstructionAmount) : 0;   // 施工总金额可能为0
        this.dataForm.totalReportImageProgress = this.dataForm.totalConstructionAmount ? (this.dataForm.totalReportAmount/this.dataForm.totalConstructionAmount) : 0;
        this.isMust = (newValue > 0 ? true : false);  // 本月申报施工产值(元)＞0时,必填 
        this.$set(this.dataRule,'reportFileInfoList',[{required:this.isMust,trigger:['blur','change'],message:"必填项不能为空"}]) // 产值填报-表单 项目部本月申请产值附件必填
      },
    },
    'dataForm.currentMonthConfirmAmount':{ 
      handler(newValue){
        this.dataForm.totalConfirmAmount = this.totalConfirmAmount+Number(newValue) || 0;
        this.dataForm.totalConfirmImageProgress = this.dataForm.totalConstructionAmount ? (this.dataForm.totalConfirmAmount/this.dataForm.totalConstructionAmount) : 0;
        this.isMenu = (newValue > 0 ? true : false);  // 本月确认产值(元)＞0时,必填
        this.$set(this.dataRule,'confirmFileInfoList',[{required:this.isMenu,trigger:['blur','change'],message:"必填项不能为空"}]) // 甲方/监理本月确认产值附件必填
      },
    }
  },
  created(){
    // console.log('currentMonth', this.currentMonth) // 2023-09
    if(!this.dataForm.id){   // 新增时，编制人部门信息
      this.dataForm.createUserDeptName = decodeURIComponent(orgName); 
    }
  },
  methods: {
    usersUpdate(data){    // 甲方弹窗
      this.dataForm.customerId = data[0].orgId;
      this.dataForm.customerName = data[0].realName;
    },
    // 项目编号
    projectUpdate(data){ 
      console.log(data,'项目编号');
      this.dataForm.constructCode = data[0].code;
      this.dataForm.constructName = data[0].name;
      this.dataForm.constructArchiveMainId = data[0].id;
    },
    getAutomaticData(){
      let params = {constructArchiveMainId: this.dataForm.constructArchiveMainId}
      // const params = this.dataForm.constructId;
      service.post(`/contract/outputValueMain/getAutomaticData`, params).then(res => {
        const {code, data} = res;
        if (code === 200) {
          this.dataForm.categoryId = data.categoryId || '';
          this.dataForm.constructionUnitName = data.constructionUnitName || '';
          this.dataForm.constructionUnitId = data.constructionUnitId || '';
          this.dataForm.projectManagerName = data.projectManagerName || '';
          this.dataForm.projectManagerId = data.projectManagerId || '';
          this.dataForm.customerName = data.customerName || '';
          this.dataForm.competitionUnitName = data.competitionUnitName || '';
          this.dataForm.totalPayInAmount = data.totalPayInAmount || 0;
          this.dataForm.totalMaterialAmount = data.totalMaterialAmount || 0;
          this.dataForm.totalConstructionAmount = data.totalConstructionAmount || 0;
          this.dataForm.totalLaborAmount = data.totalLaborAmount || 0;
          this.dataForm.totalMaterialLaborAmount = data.totalMaterialLaborAmount || 0;
          this.dataForm.totalMaterialRate = data.totalMaterialRate || 0;
          this.dataForm.totalLaborRate = data.totalLaborRate || 0;
          this.dataForm.totalOpenInvoiceAmount = data.totalOpenInvoiceAmount || 0;
          this.dataForm.totalReportAmount = data.totalReportAmount || 0;
          this.dataForm.totalConfirmAmount = data.totalConfirmAmount || 0;
          this.totalReportAmount = data.totalReportAmount || 0;   // 存储接口返回的累计申报施工产值(元)
          this.totalConfirmAmount = data.totalConfirmAmount || 0;   // 存储接口返回的累计累计确认产值(元)
          this.dataForm.status = this.getStatus(data.status);
        }
      }).catch(err=>{
        FUI.Window.showMsg('请求异常' + err.toString());
      });
    },
    // 转换状态
    getStatus(status) {
      switch (status) {
        case '1':
          return '未开工'
          break
        case '2':
          return '在建中'
          break
        case '3':
          return '停工中'
          break
        case '4':
          return '施工终止'
          break
        case '5':
          return '合格'
          break
        case '6':
          return '已完工'
          break
        case '7':
          return '已竣工'
          break
        case '8':
          return '已审定'
          break
        case '9':
          return '已关闭'
          break
      }
      return ''
    },
    beforeInit() {
      this.dataRule['restartReason'] = RuleRequired.curCustomRule(true, function (rule, value, callbacak) {
        let pattern = /^([\u4e00-\u9fa5]|\w)+$/;
        let len = escape(value).replace(/%u\w{2}/g, "").length;
        if (len >= 8 && len <= 800 && pattern.test(value)) {
          callbacak();
        } else {
          callbacak(new Error('至少输入4个字，最多400字'));
        }
       });
    },
    //获取详情后的赋值情况
    afterInit() {
      //根据预警阶段判断日期文字 及  校验状态
      this.bidDateLabelStatus();
      this.reviewResultJudage();  //是否显示评审结果
    },
    disabledVal(){
      const { id, createUserId, procInstState} = this.dataForm;
      if(!id){
        return false;
      }else{
        // 审批中2，审批人才可以编辑 
        // 草稿状态时1，创建人能编辑；审批中查看表单，也不能编辑; 提交后被驳回到了提交人环节时，创建人可以;
        return (procInstState!=='3'&&procInstState!=='2'&&userId===createUserId) ? false : true;
      }
    },
    // 本月申报施工产值(元) 保留两位小数
    numInput(field) {
      if (!this.dataForm[field]) {
        this.dataForm[field] = '';
        return
      }
      this.dataForm[field] = this.dataForm[field].replace(/^\D*([0-9]\d*\.?\d{0,2})?.*$/,'$1').replace(/[-|+]/g, ''); // 只能输入保留2位小数的正数
    },
    //是否显示评审结果
    reviewResultJudage() {
      const status = WFContext.WorkflowInstinceState;  //状态判断 0：拟稿  1：草稿 2：审批中 3：审批完成
      this.reviewResultStatus = (status == 3) ? true : false;  //审批完成了显示 评审结果
      this.dataRule['designerIsAgree'] = RuleRequired.curFiledRule(this.reviewResultStatus); //设立项专员意见 必填
      this.dataRule['leaderIsAgree'] = RuleRequired.curFiledRule(this.reviewResultStatus); //总部立项专员意见 必填
      this.dataRule['manageLeaderIsAgree'] = RuleRequired.curFiledRule(this.reviewResultStatus); //设立项专员意见 必填
      this.dataRule['bidderIsAgree'] = RuleRequired.curFiledRule(this.reviewResultStatus); //总部立项专员意见 必填
      this.juadgeAgree();
    },
    bidDateLabelStatus() {
      //followupStage: 预警阶段
      let { followupStage } = this.dataForm;
      this.dataFromDate();
      this.resultStateStatus = false;  //是否已出结果 默认隐藏
      if (followupStage == '营销立项') {
        this.dateOrignalType = 1;
        this.resultStateStatus = true;  //是否已出结果 仅投标文件评审显示 
        this.dataRule['bidDate'] = [  //新预估投标时间 校验
          { required: true, validator: this.judgeDate, trigger: 'blur' }
        ]
      } else if (followupStage == '预选承包商入库') {
        this.dateOrignalType = 2;
        this.dataRule['storeDate'] = [  //新预计入库完成日期 校验
          { required: true, validator: this.judgeDate, trigger: 'blur' }
        ]
      } else if (followupStage == '投标文件评审') {
        this.dateOrignalType = 3;
        this.resultStateStatus = true;  //是否已出结果 仅投标文件评审显示
      } else if (followupStage == '标前评审') {
        this.dateOrignalType = 4;
        this.dataRule['bidEndDate'] = [ //新投标截止日期 校验
          { required: true, validator: this.judgeDate, trigger: 'blur' }
        ]
      }
      //其他 至少输入4个汉字判断  根据是否跟进来判断
      this.giveupReasonRemarkStatus();
    },
    //新预计投标日期/预计入库完成日期，如果该项目在营销立项或者预选承包商阶段，默认展示，“是否跟进”为“跟进”时需校验不可早于当前时间
    //bidDateOriginal: 原预计投标日期, 原预计入库完成日期,原投标截止日期
    //bidEndDate: 新预计投标日期 预计入库完成日期 新投标截止日期 
    judgeDate(rule, value, callback) {
      let valDate = value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '';
      let { followupStage,  bidDateOriginal, storeDateOriginal, bidEndDateOriginal } = this.dataForm;  //bidEndDate： 新预计投标日期 新(现)投标截止日期
      const nowTime = myFun.getCurrentDateTimeString();  //当前时间
      //新投标截止日期
      if (followupStage == '营销立项') {
        if (valDate < nowTime) {
          callback(new Error("新预计投标日期不能小于当前时间"));
        }
        else if (!myFun.getCompareExceedDate(bidDateOriginal, valDate, 3)) {
          callback(new Error("新预计投标日期不可超过原预计投标日期后三个月"));
        }
      } else if (followupStage == '预选承包商入库') {
        if (valDate < nowTime) {
          callback(new Error("新预计入库完成日期不能小于当前时间"));
        }
        else if (!myFun.getCompareExceedDate(storeDateOriginal, valDate, 3)) {
          callback(new Error("新预计投标日期不可超过原预计入库完成日期后三个月"));
        }
       }
      else if (followupStage == '标前评审') {
        if (valDate < nowTime) {
          callback(new Error("现投标截止日期不能小于当前时间"));
        }
        else if (!myFun.getCompareExceedDate(bidEndDateOriginal, valDate, 3)) {
          callback(new Error("新投标截止日期不可超过原投标截止日期后三个月"));
        }
      }
      callback();
    },
    //校验至少输入4个汉字
    checkValidateInput(rule, value, callbacak) {
      let pattern = /^([\u4e00-\u9fa5]|\w)+$/;
      let len = escape(value).replace(/%u\w{2}/g, "").length;
      if (len >= 8 && pattern.test(value)) {
        callbacak();
      } else {
        callbacak(new Error('至少输入4个汉字'));
      }
    },
    juadgeAgree() {
      let { designerIsAgree, leaderIsAgree, manageLeaderIsAgree, bidderIsAgree } = this.dataForm;
      this.dataRule['designerRemark'] = RuleRequired.curFiledRule((designerIsAgree === '0' && this.reviewResultStatus)); //不同意原因
      this.dataRule['leaderRemark'] = RuleRequired.curFiledRule((leaderIsAgree === '0' && this.reviewResultStatus)); //总部立项专员 意见原因
      this.dataRule['manageLeaderRemark'] = RuleRequired.curFiledRule((manageLeaderIsAgree === '0' && this.reviewResultStatus)); //综合管理 不同意原因
      this.dataRule['bidderRemark'] = RuleRequired.curFiledRule((bidderIsAgree === '0'&& this.reviewResultStatus)); //投标管理 意见原因
    },
    //其他 至少输入4个汉字判断
    giveupReasonRemarkStatus() { 
      let status = (this.dataForm.isFollowup == 1) ? false : true;
      if (status && this.otherGiveReasonStatus) { //如果是否跟进为放弃，并且点击了其他
        let _this = this;
        _this.dataRule['giveupReason'] = [
          ...RuleRequired.curFiledRule(true),
          ...RuleRequired.curCustomRule(true, function (rule, value, callbacak) {
            let val = _this.dataForm.giveupReasonRemark;
            let pattern = /^([\u4e00-\u9fa5]|\w)+$/;
            let len = escape(val).replace(/%u\w{2}/g, "").length;
            if (len >= 8 && pattern.test(val)) {
              callbacak();
            } else {
              callbacak(new Error('至少输入4个汉字'));
            }
           }, 'blur')
        ]
      }
    },
    validateForm() {
        const _this = this;
        return new Promise(resolve => {
          _this.$refs['dataForm'].validate(valid => {
            if (valid) {
              _this.dataFromDate();
              return resolve(_this.dataForm);
            } else {
              return resolve(false)
            }
          })
        });
    },
    dataFromDate() { 
      let { bidDateOriginal, bidEndDate, estimateResultDate, createTime, storeDateOriginal, bidEndDateOriginal, bidDate, storeDate } = this.dataForm; 
      this.dataForm.createTime = createTime ? moment(createTime).format('YYYY-MM-DD HH:mm:ss') : '';
      //原预估投标日期
      this.dataForm.bidDateOriginal = bidDateOriginal ? moment(bidDateOriginal).format('YYYY-MM-DD HH:mm:ss') : '';
      //原预计入库完成日期 
      this.dataForm.storeDateOriginal = storeDateOriginal ? moment(storeDateOriginal).format('YYYY-MM-DD HH:mm:ss') : '';
      //原投标截止日期 
      this.dataForm.bidEndDateOriginal = bidEndDateOriginal ? moment(bidEndDateOriginal).format('YYYY-MM-DD HH:mm:ss') : '';
      //新预估投标时间 
      this.dataForm.bidDate = bidDate ? moment(bidDate).format('YYYY-MM-DD HH:mm:ss') : '';
      //预计入库完成日期 
      this.dataForm.storeDate = storeDate ? moment(storeDate).format('YYYY-MM-DD HH:mm:ss') : '';
      //新投标截止日期 bidEndDate
      this.dataForm.bidEndDate = bidEndDate ? moment(bidEndDate).format('YYYY-MM-DD HH:mm:ss') : '';
      this.dataForm.estimateResultDate = estimateResultDate ? moment(estimateResultDate).format('YYYY-MM-DD HH:mm:ss') : '';
      this.dataForm.createUserId = !this.dataForm.id ? userId : this.dataForm.createUserId;
    }
  }
}
</script>

<style scoped lang="scss">
@import url('../../style/form.scss');

.commponent-height{
   height: 32px;
   line-height: 32px;
}

.el-upload__prompt{
    color: #F56C6C;
    font-size: 14px;
    font-weight: normal;
    line-height: 25px;
  }

::v-deep .designPrice {
  .el-input-group__append {
    padding: 0 12px;
  }
}

.other-give-reason{
  width: 350px;
  margin-left: 8px;
}
.required-tag {
  ::v-deep .form-title {
    &::after {
      content: '*';
      color: #F56C6C;
      margin-left: 4px;
      transform: translateY(4px);
      font-size: 18px;
    }
  } 
  ::v-deep .is-required{
    .el-form-item__label{
      &::before{
        display: none;
      }
    }
  } 
}
</style>
