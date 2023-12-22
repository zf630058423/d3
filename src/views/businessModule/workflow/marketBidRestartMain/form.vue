<template>
  <!-- 营销项目重启表单 -->
  <!-- :disabled="setting.readonly" -->
  <div v-loading="loading" class="start-form">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="165px"
    >
      <row-layout title="业务信息" :cols="3">
        <el-form-item slot="col_1" prop="code" label="单据编号：">
          <el-input v-model="dataForm.code" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
        </el-form-item>
          <el-form-item slot="col_2" prop="marketCenterName" label="业务中心：">
            <el-input v-model="dataForm.marketCenterName" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
          </el-form-item>
          <el-form-item slot="col_3" prop="marketName" label="立项名称：">
            <el-input v-model="dataForm.marketName" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="marketCode" label="立项编号：">
            <el-input v-model="dataForm.marketCode" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
        </el-form-item>
        <el-form-item slot="col_2" prop="marketUnitName" label="业务单元：">
            <el-input v-model="dataForm.marketUnitName" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
        </el-form-item>
        <el-form-item slot="col_3">
        </el-form-item>
      </row-layout>
      <row-layout title="重启说明" :cols="3">
        <el-form-item slot="col_1" prop="followupStage" label="关闭阶段：">
           <el-input v-model="dataForm.followupStage" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
          </el-form-item>
          <!-- 营销立项 原预估投标时间-->
        <el-form-item slot="col_2" prop="bidDateOriginal" v-if="dateOrignalType == 1" label="原预估投标时间：">
            <el-date-picker class="commponent-height" v-model="dataForm.bidDateOriginal" :disabled="getDisabledField('bidDateOriginal')" type="datetime" placeholder="选择日期时间"></el-date-picker> 
        </el-form-item>
        <!-- 预选承包商入库 原预计入库完成日期 -->
        <el-form-item slot="col_2" prop="storeDateOriginal" v-else-if="dateOrignalType==2" label="原预计入库完成日期：">
            <el-date-picker class="commponent-height" v-model="dataForm.storeDateOriginal" :disabled="getDisabledField('storeDateOriginal')" type="datetime" placeholder="选择日期时间"></el-date-picker> 
        </el-form-item>
        <!-- 投标文件评审、标前评审 原投标截止日期 -->
        <el-form-item slot="col_2" prop="bidEndDateOriginal" v-else-if="dateOrignalType==3 || dateOrignalType == 4" label="原投标截止日期：">
            <el-date-picker class="commponent-height" v-model="dataForm.bidEndDateOriginal" :disabled="getDisabledField('bidEndDateOriginal')" type="datetime" placeholder="选择日期时间"></el-date-picker> 
        </el-form-item>

        <!-- 营销立项 新预估投标时间-->
        <el-form-item slot="col_3" prop="bidDate" v-if="dateOrignalType == 1" label="新预估投标时间：">
          <el-date-picker class="commponent-height" v-model="dataForm.bidDate" type="datetime" :disabled="getDisabledField('bidDate')" placeholder="选择日期时间"></el-date-picker> 
        </el-form-item>
        <!-- 预选承包商入库  预计入库完成日期-->
        <el-form-item slot="col_3" prop="storeDate" v-if="dateOrignalType==2" label="新预计入库完成日期：">
          <el-date-picker class="commponent-height" v-model="dataForm.storeDate" type="datetime" :disabled="getDisabledField('storeDate')" placeholder="选择日期时间"></el-date-picker> 
        </el-form-item>
        <!-- 投标文件评审、标前评审 新投标截止日期-->
        <el-form-item slot="col_3" prop="bidEndDate" v-if="dateOrignalType == 3 || dateOrignalType == 4" label="新投标截止日期：">
          <el-date-picker class="commponent-height" v-model="dataForm.bidEndDate" type="datetime" :disabled="getDisabledField('bidEndDate')" placeholder="选择日期时间"></el-date-picker> 
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="3">
        <el-form-item slot="col_1" prop="restartReason" v-if="resultStateStatus" label="重启原因：">
          <text-input type="textarea" placeholder="至少4个汉字，最多可输入400字" rows="5" v-model="dataForm.restartReason" :disabled="getDisabledField('restartReason')"></text-input>
        </el-form-item>
      </row-layout>
      <row-layout title="审批信息" v-if="reviewTitleStatus"></row-layout>
      <row-layout :cols="3" cell="3" v-if="reviewResultStatus">
        <el-form-item slot="col_1" prop="reviewResult" label="评审结果：">
           <el-radio-group v-model="dataForm.reviewResult" :disabled="getDisabledField('reviewResult')">
              <el-radio :label="item.value" :value="item.value" :key="item.value" v-for="item in reviewResultRadioGroup">{{ item.label }}</el-radio>
            </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-2" v-if="designerIsAgreeStatus">
        <el-form-item slot="col_1" prop="designerIsAgree" label="设计立项专员意见：">
            <el-radio-group v-model="dataForm.designerIsAgree" @change="disignerIsAgreeChange('designerIsAgree','designerRemark')" :disabled="getDisabledField('designerIsAgree')"> 
              <el-radio :label="item.value" :name="item.value" :key="item.value" v-for="item in reviewResultRadioGroup">{{ item.label }}</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" v-if="dataForm.designerIsAgree === '0'" prop="designerRemark" label="不同意原因：">
           <el-input v-model="dataForm.designerRemark" size="small" :placeholder="msgTip.ENTER_PLACEHOLDER" :disabled="getDisabledField('designerRemark')" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-2" v-if="leaderIsAgreeStatus">
        <el-form-item slot="col_1" prop="leaderIsAgree" label="总部立项专员意见：">
            <el-radio-group v-model="dataForm.leaderIsAgree" @change="disignerIsAgreeChange('leaderIsAgree','leaderRemark')" :disabled="getDisabledField('leaderIsAgree')">
              <el-radio :label="item.value" :name="item.value" :key="item.value" v-for="item in reviewResultRadioGroup">{{ item.label }}</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" v-if="dataForm.leaderIsAgree === '0'" prop="leaderRemark" label="不同意原因：">
           <el-input v-model="dataForm.leaderRemark" size="small" :placeholder="msgTip.ENTER_PLACEHOLDER" :disabled="getDisabledField('leaderRemark')"/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-2" v-if="manageLeaderIsAgreeStatus">
        <el-form-item slot="col_1" prop="manageLeaderIsAgree" label="综合管理组负责人意见：">
            <el-radio-group v-model="dataForm.manageLeaderIsAgree" :disabled="getDisabledField('manageLeaderIsAgree')" @change="disignerIsAgreeChange('manageLeaderIsAgree','manageLeaderRemark')">
              <el-radio :label="item.value" :name="item.value" :key="item.value" v-for="item in reviewResultRadioGroup">{{ item.label }}</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" v-if="dataForm.manageLeaderIsAgree === '0'" prop="manageLeaderRemark" label="不同意原因：">
           <el-input v-model="dataForm.manageLeaderRemark" size="small" :placeholder="msgTip.ENTER_PLACEHOLDER" :disabled="getDisabledField('manageLeaderRemark')" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-2" v-if="bidderIsAgreeStatus">
        <el-form-item slot="col_1" prop="bidderIsAgree" label="投标管理组负责人意见：">
            <el-radio-group v-model="dataForm.bidderIsAgree" @change="disignerIsAgreeChange('bidderIsAgree','bidderRemark')" :disabled="getDisabledField('bidderIsAgree')">
              <el-radio :label="item.value" :name="item.value" :key="item.value" v-for="item in reviewResultRadioGroup">{{ item.label }}</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" v-if="dataForm.bidderIsAgree === '0'" prop="bidderRemark" label="不同意原因：">
           <el-input v-model="dataForm.bidderRemark" size="small" :placeholder="msgTip.ENTER_PLACEHOLDER" :disabled="getDisabledField('bidderRemark')" />
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
import UploaderFile from '@/components/basic/uploaderFile/index.vue';
import TextInput from '@/components/basic/elInput/textInput.vue';
import { RADIO_GROUP } from '@/views/businessModule/enum/param';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import moment from 'moment'

import comMixin from '../minix';
import myFun from '@/utils/fun';

//必填字段 先全部加载
const requiredArray = ['restartReason', 'resultState', 'bidEndDate', 'remark', 'designerIsAgree','bidDate',
  'leaderIsAgree', 'manageLeaderIsAgree', 'bidderIsAgree', 'designerRemark', 'leaderRemark', 'manageLeaderRemark', 'bidderRemark'];

export default {
  components: { FormTitle,TextInput, RowLayout, SelectDialog, AmountInput, CascSelect, UploaderFile },
  mixins: [comMixin],
  data() {
    return {
      nodeName: '',  //当前节点名称
      nodeStatus: 0,  //当前节点状态
      numVal:'100',
      loading: false,
      formVisible: false,
      dialogVisible: false,
      radioData: RADIO_GROUP,
      isFollowupRadioGroup: [
        { value: 1, label: '跟进，深入了解' },
        { value: 0, label: '放弃'}
      ],
      reviewResultRadioGroup: [
        { value: '1', label: '同意跟进', reviewReason:'' },
        {value: '0', label:'不同意跟进', reviewReason:''},
      ],
      checkedBoxGroup: [],
      otherGiveReasonStatus:false,
      dataForm: {
        code:'',  //单据编号
        marketCenterId: '',  //业务中心id
        marketCenterName: '',  //业务中心
        marketName: '',  //立项名称
        marketCode: '',  //立项编号
        marketUnitId:'',  //业务单元Id
        marketUnitName: '',  //业务单元
        followupStage: '',  //关闭阶段 预警阶段
        bidDateOriginal: '',  //原预估投标日期
        bidDate: '',  //新预估投标日期
        storeDateOriginal: '', //原预计入库完成日期
        storeDate: '',  //新预计入库完成日期
        bidEndDateOriginal: '',  //原投标截止时间
        bidEndDate: '', //新投标截止日期
        restartReason: '',  //重启原因
        reviewResult: '',  //评审结果
        designerIsAgree: '',  //设计立项专员
        designerRemark: '',  //设计立项专员 备注
        leaderIsAgree: '',  //总部立项专员
        leaderRemark: '',  //总部立项专员 备注
        manageLeaderIsAgree: '',  //综合管理组负责人意见
        manageLeaderRemark: '',  //综合管理组负责人意见备注
        bidderIsAgree: '', //投标管理部负责人意见
        bidderRemark:'', //	投标管理部负责人意见备注
        createUserName:'',  //编制人
        createUserDeptName:'',  //编制人部门
        createTime:'',  //编制时间
      },
      dateOrignalType:1,  //1 营销立项  2 预选承包商入库  3：投标文件评审  4： 标前评审 5：开标结果
      bidEndDateLabelStatus: true,  //现投标截止时间是否显示
      isFollowupStatus: true,  //是否跟进状态显示和隐藏
      resultStateStatus: true,  //是否已出结果是否显示
      // estimateResultDateStatus: true,  //预计出结果日期 显示
      giveupReasonStatus: false,  //放弃原因是否显示 默认隐藏 'bidderRemark'
      reviewResultStatus: false,  //评审结果 是否显示 默认不展示
      designerIsAgreeStatus: false,  //设计立项专员意见是否显示
      leaderIsAgreeStatus: false,  //总部立项专员意见是否显示
      manageLeaderIsAgreeStatus: false,  //综合管理组负责人意见是否显示
      bidderIsAgreeStatus: false,  //投标管理负责人意见是否显示
      msgTip: RuleRequired.tipMsg,
      //添加必填项 字段
      //必填项字段
      dataRule: RuleRequired.dataRule(requiredArray), 
      disabledFiled: {
        'bidDateOriginal':true, //原预估投标时间 营销立项
        'storeDateOriginal': false,  //预选承包商入库 原预计入库完成日期
        'bidEndDateOriginal': false, //投标文件评审、标前评审 原投标截止日期
        'bidDate': false,  //营销立项 新预估投标时间
        'storeDate': false,  //新预计入库完成日期 -预选承包商入库
        'bidEndDate': false, //投标文件评审、标前评审 新投标截止日期
        'restartReason': false, //重启原因
        'reviewResult': false, //评审结果
        'designerIsAgree': false, //设计立项专员意见
        'designerRemark': false, //不同意原因
        'leaderIsAgree': false, //总部立项专员意见
        'leaderRemark': false, //总部不同意原因
        'manageLeaderIsAgree': false,  //综合管理组负责人意见
        'manageLeaderRemark': false,
        'bidderIsAgree': false, //投标管理组负责人意见
        'bidderRemark': false,
      }
    }
  },
  computed: {
    reviewTitleStatus() { 
      return (this.reviewResultStatus || this.designerIsAgreeStatus || this.leaderIsAgreeStatus || this.manageLeaderIsAgreeStatus || this.bidderIsAgreeStatus);
    },
    getDisabledField() { 
      return (field) => {
        return this.disabledFiled[field] ? this.disabledFiled[field] : false;
      }
    },
    //预计出结果日期  是否已出结果显示并且为未出结果时 显示预计出结果日期 是否已出结果 为“未出结果”时显示否则隐藏，且审批环节“跟进人”必须填写
    estimateResultDateStatus() { 
      return (this.resultStateStatus && this.dataForm.resultState == 0) ? true : false; 
    }
  },
  methods: {
    beforeInit() {
      this.dataRule['restartReason'] = RuleRequired.curCustomRule(true, function (rule, value, callbacak) {
             const reg = /[\u4E00-\u9FA5]/g;
            // let len = escape(val).replace(/%u\w{2}/g, "").length;
             let chinaLen = 0;
            if (value.match(reg)) { 
              chinaLen = value.match(reg).length;  //中文的个数 汉字的个数
            }
            if (chinaLen >= 4 && chinaLen < 401) {
              callbacak();
            } else {
              callbacak(new Error('至少输入4个字，最多400字'));
            }  
       });
    },
    //获取详情后的赋值情况
    afterInit() {
      this.nodeStatus = WFContext.WorkflowInstinceState;  //状态判断 0：拟稿  1：草稿 2：审批中 3：审批完成
      //获取当前审批节点
      this.nodeName = WFContext.CurrentActivityName;  //当前节点
      //根据预警阶段判断日期文字 及  校验状态
      this.bidDateLabelStatus();
      this.reviewResultJudage();  //是否显示评审结果
    },
    //是否显示评审结果
    reviewResultJudage() {
      //判断是否有审批按钮
      const approveStatus = (this.pageBaseInfo && this.pageBaseInfo.buttons.some(btn => btn.buttonName === '审批'));
      //默认所有的评审结果不展示 然后根据条件判断对应哪个是展示的
      this.reviewResultStatus = false;  //评审结果
      this.designerIsAgreeStatus = false;  //设计立项专员意见是否显示
      this.leaderIsAgreeStatus = false; //总部立项专员意见是否显示
      this.manageLeaderIsAgreeStatus = false; //综合管理组负责人意见是否显示
      this.bidderIsAgreeStatus = false; //投标管理负责人意见是否显示
      this.dataRule['designerIsAgree'] = RuleRequired.curFiledRule(false); //设立项专员意见 不必填
      this.dataRule['leaderIsAgree'] = RuleRequired.curFiledRule(false); //总部立项专员意见 不必填
      this.dataRule['manageLeaderIsAgree'] = RuleRequired.curFiledRule(false); //综合管理组负责人意见 不必填
      this.dataRule['bidderIsAgree'] = RuleRequired.curFiledRule(false); //投标管理部负责人意见 不必填
      const leaderIsAgreeArray = ['总部立项专员', '总部立项专员1', '总部立项专员2'];
      const designerIsAgreeArray = ['设计立项专员', '设计立项专员1', '设计立项专员2'];
      const manageLeaderIsAgreeArray = ['市场综合管理组负责人', '市场综合部综合管理组负责人', '综合管理组负责人', '市场综合部综合管理组负责人2'];
      const bidderIsAgreeArray = ['投标管理部负责人','投标管理部负责人2'];
      if (approveStatus && leaderIsAgreeArray.includes(this.nodeName)) {  //总部立项专员意见 展示
        this.leaderIsAgreeStatus = true; //显示总部立项专员
        this.dataRule['leaderIsAgree'] = RuleRequired.curFiledRule(true); //总部立项专员意见 必填
        this.disabledFiled['leaderIsAgree'] = false;  //总部立项专员可以编辑
        this.disabledFiled['leaderRemark'] = false;  //总部立项专员1意见可以编辑
      }
      else if (approveStatus && designerIsAgreeArray.includes(this.nodeName)) { //设计立项专员 展示
        this.designerIsAgreeStatus = true;
        this.dataRule['designerIsAgree'] = RuleRequired.curFiledRule(true); //设立项专员意见 必填
        this.disabledFiled['designerIsAgree'] = false;  //设计立项专员可以编辑
        this.disabledFiled['designerRemark'] = false;  //设计立项专员意见可以编辑
      } else if (approveStatus && manageLeaderIsAgreeArray.includes(this.nodeName)) {
        this.manageLeaderIsAgreeStatus = true;
        this.dataRule['manageLeaderIsAgree'] = RuleRequired.curFiledRule(true); //设立项专员意见 必填
        this.disabledFiled['manageLeaderIsAgree'] = false;  //设计立项专员可以编辑
        this.disabledFiled['manageLeaderRemark'] = false;  //设计立项专员意见可以编辑
      } else if (approveStatus && bidderIsAgreeArray.includes(this.nodeName)) {
        this.bidderIsAgreeStatus = true;
        this.dataRule['bidderIsAgree'] = RuleRequired.curFiledRule(true); //投标管理部负责人意见 必填
        this.disabledFiled['bidderIsAgree'] = false;  //投标管理部负责人意见可以编辑
        this.disabledFiled['bidderRemark'] = false;  //投标管理部负责人意见可以编辑
      } 
      this.juadgeAgree();
      // this.reviewResultStatus = (nodeStatus == 3) ? true : false;  //审批完成了显示 评审结果
      if (this.nodeStatus === 3) { //如果是审批完成了 都展示
        this.reviewResultStatus = true;  //评审结果
        this.designerIsAgreeStatus = true;  //设计立项专员意见是否显示
        this.leaderIsAgreeStatus = true; //总部立项专员意见是否显示
        this.manageLeaderIsAgreeStatus = true; //综合管理组负责人意见是否显示
        this.bidderIsAgreeStatus = true; //投标管理负责人意见是否显示
      }
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
      } else if (followupStage == '开标结果') {
        this.dateOrignalType = 5;
       }
      //其他 至少输入4个汉字判断  根据是否跟进来判断
      this.giveupReasonRemarkStatus();

      //如果不是提单环节 不可编辑
      if (WFContext.CurrentActivityName !== '提单') {
        //是否跟进非必填
        Object.keys(this.disabledFiled).forEach(key => { 
          this.disabledFiled[key] = true;
        })
      }
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
    //选择设计立项专员意见时
    disignerIsAgreeChange(filed, filedRemark) {
        this.dataRule[`${filedRemark}`] = RuleRequired.curFiledRule((this.dataForm[filed] === '0')); //不同意原因
    },
    juadgeAgree() {
      let { designerIsAgree, leaderIsAgree, manageLeaderIsAgree, bidderIsAgree } = this.dataForm;
      this.dataRule['designerRemark'] = RuleRequired.curFiledRule((designerIsAgree === '0' && this.designerIsAgreeStatus)); //不同意原因
      this.dataRule['leaderRemark'] = RuleRequired.curFiledRule((leaderIsAgree === '0' && this.leaderIsAgreeStatus)); //总部立项专员 意见原因
      this.dataRule['manageLeaderRemark'] = RuleRequired.curFiledRule((manageLeaderIsAgree === '0' && this.manageLeaderIsAgreeStatus)); //综合管理 不同意原因
      this.dataRule['bidderRemark'] = RuleRequired.curFiledRule((bidderIsAgree === '0'&& this.bidderIsAgreeStatus)); //投标管理 意见原因
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
    checkboxGroupChange(e) {
      this.dataForm.giveupReason = e ? e.join(',') : '';
      this.otherGiveReasonStatus = e.includes('其他') ? true : false;
      this.giveupReasonRemarkStatus();
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
    //保存 暂存
    getDataForm() { 
      this.dataFromDate();
      const dataForm = JSON.parse(JSON.stringify(this.dataForm));
      return dataForm;
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
</style>
