<template>
  <!-- 营销投标项目跟进表单 -->
  <!-- :disabled="setting.readonly" -->
  <div v-loading="loading" class="flow-form">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="148px"
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
        <el-form-item slot="col_1" prop="marketCode" label="立项编号/入库编号：">
            <el-input v-model="dataForm.marketCode" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
        </el-form-item>
        <el-form-item slot="col_2" prop="marketUnitName" label="业务单元：">
            <el-input v-model="dataForm.marketUnitName" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
        </el-form-item>
        <el-form-item slot="col_3" prop="followupStage" label="预警阶段：">
            <el-input v-model="dataForm.followupStage" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER" />
        </el-form-item>
      </row-layout>
      <row-layout title="跟进情况" v-if="isFollowupStatus" :offset="0" :cols="3">
        <el-form-item slot="col_1" prop="isFollowup" label="是否跟进：">
            <el-radio-group v-model="dataForm.isFollowup" @change="isFolowUpChange" :disabled="getDisabledField('isFollowup')">
              <el-radio :label="item.value" :key="item.value" v-for="item in isFollowupRadioGroup">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 营销立项 原预计投标日期-->
        <el-form-item slot="col_2" prop="bidDateOriginal" v-if="dateOrignalType==1" label="原预计投标日期：">
            <el-date-picker class="commponent-height" v-model="dataForm.bidDateOriginal" :disabled="getDisabledField('bidDateOriginal')" type="datetime" placeholder="选择日期时间"></el-date-picker> 
        </el-form-item>
        <!-- 预选承包商入库 -->
        <el-form-item slot="col_2" prop="storeDateOriginal" v-else-if="dateOrignalType==2" label="原预计入库完成日期：">
            <el-date-picker class="commponent-height" v-model="dataForm.storeDateOriginal" :disabled="getDisabledField('storeDateOriginal')" type="datetime" placeholder="选择日期时间"></el-date-picker> 
        </el-form-item>
        <!-- 投标文件评审、标前评审 -->
        <el-form-item slot="col_2" prop="bidEndDateOriginal" v-else-if="dateOrignalType==3 || dateOrignalType == 4" label="原投标截止日期：">
            <el-date-picker class="commponent-height" v-model="dataForm.bidEndDateOriginal" :disabled="getDisabledField('bidEndDateOriginal')" type="datetime" placeholder="选择日期时间"></el-date-picker> 
        </el-form-item>

        <!-- 营销立项 新预计投标日期 新-->
        <el-form-item slot="col_3" prop="bidDate" v-if="dateOrignalType == 1 && bidDateStatus" label="新预计投标日期：">
          <el-date-picker class="commponent-height" v-model="dataForm.bidDate" :disabled="getDisabledField('bidDate')" type="datetime" placeholder="选择日期时间"></el-date-picker> 
        </el-form-item>
        <!-- 预选承包商入库  预计入库完成日期-->
        <el-form-item slot="col_3" prop="storeDate" v-if="dateOrignalType==2" label="预计入库完成日期：">
          <el-date-picker class="commponent-height" v-model="dataForm.storeDate" :disabled="getDisabledField('storeDate')" type="datetime" placeholder="选择日期时间"></el-date-picker> 
        </el-form-item>
        <!-- 投标文件评审、标前评审 新投标截止日期-->
        <el-form-item slot="col_3" prop="bidEndDate" v-if="dateOrignalType == 3 || dateOrignalType == 4" label="新投标截止日期：">
          <el-date-picker class="commponent-height" v-model="dataForm.bidEndDate" type="datetime" placeholder="选择日期时间"></el-date-picker> 
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="resultState" v-if="resultStateStatus" label="是否已出结果：">
          <el-radio-group v-model="dataForm.resultState" @change="resultStateChange" :disabled="getDisabledField('resultState')">
              <el-radio :label="item.value" :key="item.value" v-for="item in resultStateGroup">{{ item.label }}</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" prop="estimateResultDate" v-if="estimateResultDateStatus" label="预计出结果日期：">  
          <el-date-picker class="commponent-height" v-model="dataForm.estimateResultDate" :disabled="getDisabledField('estimateResultDate')" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item slot="col_3"></el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="3" v-if="giveupReasonStatus">
        <el-form-item slot="col_1" prop="giveupReason" label="放弃原因：">
          <el-checkbox-group v-model="checkedBoxGroup" @change="checkboxGroupChange" :disabled="getDisabledField('giveupReason')">
            <el-checkbox :label="cItem.name" :key="cItem.id" v-for="cItem in giveupReasonCheckeds">{{ cItem.name }}</el-checkbox>
            <el-input type="text" placeholder="至少输入4个汉字" class="other-give-reason" v-model="dataForm.giveupReasonRemark" v-if="otherGiveReasonStatus"></el-input>
          </el-checkbox-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="3" v-if="remarkStatus">
        <el-form-item slot="col_1" prop="remark" label="跟进说明：">
           <text-input v-model="dataForm.remark" size="small" :disabled="getDisabledField('remark')" :placeholder="msgTip.FOUR_CHARACTER" />
          </el-form-item>
      </row-layout>
      <row-layout title="审批信息" :cols="3" cell="3"></row-layout>
      <row-layout :cols="3" cell="3" v-if="reviewResultStatus">
        <el-form-item slot="col_1" prop="reviewResult" label="评审结果：">
           <el-radio-group v-model="dataForm.reviewResult" :disabled="getDisabledField('reviewResult')">
              <el-radio :label="item.value" :value="item.value" :key="item.value" v-for="item in reviewResultRadioGroup">{{ item.label }}</el-radio>
            </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-2" v-if="designerIsAgreeStatus">
        <el-form-item slot="col_1" prop="designerIsAgree" label="设计立项专员意见：">
            <el-radio-group v-model="dataForm.designerIsAgree" :disabled="getDisabledField('designerIsAgree')" @change="disignerIsAgreeChange('designerIsAgree','designerRemark')">
              <el-radio :label="item.value" :name="item.value" :key="item.value" v-for="item in reviewResultRadioGroup">{{ item.label }}</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" v-if="dataForm.designerIsAgree === '0'" prop="designerRemark" label="不同意原因：">
           <el-input v-model="dataForm.designerRemark" size="small" :disabled="getDisabledField('designerRemark')" :placeholder="msgTip.ENTER_PLACEHOLDER" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-2" v-if="leaderIsAgreeStatus">
        <el-form-item slot="col_1" prop="leaderIsAgree" label="总部立项专员意见：">
            <el-radio-group v-model="dataForm.leaderIsAgree" :disabled="getDisabledField('leaderIsAgree')" @change="disignerIsAgreeChange('leaderIsAgree','leaderRemark')">
              <el-radio :label="item.value" :name="item.value" :key="item.value" v-for="item in reviewResultRadioGroup">{{ item.label }}</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" v-if="dataForm.leaderIsAgree === '0'" prop="leaderRemark" label="不同意原因：">
           <el-input v-model="dataForm.leaderRemark" size="small" :disabled="getDisabledField('leaderRemark')" :placeholder="msgTip.ENTER_PLACEHOLDER" />
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
import {RADIO_GROUP} from '@/views/businessModule/enum/param';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import moment from 'moment'
import { getDataDictByConfigType } from '@/Api/dataDict.js';
import comMixin from '../minix';
import myFun from '@/utils/fun';


//必填字段 先全部加载
const requiredArray = ['isFollowup', 'resultState', 'bidEndDate', 'remark', 'designerIsAgree',
  'leaderIsAgree', 'designerRemark', 'leaderRemark'];

export default {
  components: { FormTitle, RowLayout, SelectDialog, AmountInput, CascSelect, UploaderFile, TextInput },
  mixins: [comMixin],
  data() {
    return {
      numVal:'100',
      loading: false,
      formVisible: false,
      dialogVisible: false,
      radioData: RADIO_GROUP,
      isFollowupRadioGroup: [
        { value: '1', label: '跟进，深入了解' },
        { value: '0', label: '放弃'}
      ],
      resultStateGroup: [  //是否已出结果
        { value: '1', label: '已出结果' },
        { value: '0', label:'未出结果'}
      ],
      reviewResultRadioGroup: [
        { value: '1', label: '同意跟进', reviewReason:'' },
        { value: '0', label:'不同意跟进', reviewReason:''},
      ],
      checkedBoxGroup: [],
      otherGiveReasonStatus: false,
      bidDateStatus:true,  //新预计投标日期 是否显示，默认显示
      dataForm: {
        code:'',  //单据编号
        marketCenterId: '',  //业务中心id
        marketCenterName: '',  //业务中心
        marketName: '',  //立项名称
        marketCode: '',  //立项编号/入库编号
        marketUnitId:'',  //业务单元Id
        marketUnitName: '',  //业务单元
        followupStage: '',  //预警阶段
        isFollowup: '',  //是否跟进
        bidDateOriginal: '',  //原预计投标日期
        bidDate: '',  //新预计投标日期
        storeDateOriginal: '', //原预计入库完成日期
        storeDate: '',  //预计入库完成日期
        bidEndDateOriginal: '',  //原投标截止时间
        bidEndDate: '', //新预计投标日期
        resultState:'',  //是否已出结果
        estimateResultDate: '', //预计预出结果日期
        giveupReason: [], //放弃原因
        giveupReasonRemark:'',  //放弃原因 备注
        remark: '',  //跟进说明
        reviewResult: '',  //评审结果
        designerIsAgree: '',  //设计立项专员
        designerRemark: '',  //设计立项专员 备注
        leaderIsAgree: '',  //总部立项专员
        leaderRemark: '',  //总部立项专员 备注
        createUserName:'',  //编制人
        createUserDeptName:'',  //编制人部门
        createTime:'',  //编制时间
      },
      giveupReasonCheckeds: [  //放弃原因
        { id: 1, name: '业务关系不够', checked: false },
        { id: 2, name: '合同条款苛刻', checked: false },
        { id: 3, name: '客户终止招标或招标发生重大变化', checked: false },
        { id: 4, name: '公开项目市场环境因素', checked: false },
        { id: 5, name: '资信业绩不够', checked: false },
        { id: 6, name: '垫资过大', checked: false },
        { id: 7, name: '控制价过大', checked: false },
        { id: 8, name: '不符合营销底限', checked: false },
        { id: 9, name: '其他', checked: false },
      ],
      dateOrignalType:1,  //1 营销立项  2 预选承包商入库  3：投标文件评审  4： 标前评审
      bidEndDateLabelStatus: true,  //现投标截止时间是否显示
      isFollowupStatus: true,  //是否跟进状态显示和隐藏
      resultStateStatus: true,  //是否已出结果是否显示
      // estimateResultDateStatus: true,  //预计出结果日期 显示
      giveupReasonStatus: false,  //放弃原因是否显示 默认隐藏
      reviewResultStatus: false,  //评审结果 默认不展示
      remarkStatus: false,  //跟进说明 默认不展示
      designerIsAgreeStatus: false,
      leaderIsAgreeStatus: false, 
      constructorRequirementArray: [
        { id: 0, label: '无' },
        { id: 1, label: '一级' },
        { id: 2, label: '二级'}
      ],  //建造师要求
      msgTip: RuleRequired.tipMsg,
      //添加必填项 字段
      //必填项字段
      dataRule: RuleRequired.dataRule(requiredArray),
      disabledFiled: {
        'detailAddress':true, //评审结果
        'isFollowup': false,  //是否跟进
        'bidDateOriginal': false, //原预计投标日期
        'bidDate': false,  //新预计投标日期
        'remark': false,  //跟进说明
        'bidDateOriginal': false, //原预计投标日期 -营销立项
        'storeDateOriginal': false, //原预计入库完成日期 -预选承包商入库
        'bidEndDateOriginal': false, //原投标截止日期 -投标文件评审、标前评审
        'bidDate': false, //新预计投标日期  -营销立项
        'storeDate': false, //预计入库完成日期 -预选承包商入库
        'bidEndDate': false, //投标文件评审、标前评审 新投标截止日期
        'resultState': false, //是否已出结果
        'estimateResultDate': false,  //预计出结果日期
        'designerIsAgree': false,
        'designerRemark': false,
        'leaderIsAgree': false,
        'leaderRemark': false
      }
    }
  },
  computed: {
    getDisabledField() { 
      return (field) => {
        return this.disabledFiled[field] ? this.disabledFiled[field] : false;
      }
    },
    //预计出结果日期  是否已出结果 为“未出结果”时显示否则隐藏，且审批环节“跟进人”必须填写
    estimateResultDateStatus() { 
      return (this.resultStateStatus && this.dataForm.resultState === '0') ? true : false; 
    }
  },
  methods: {
    beforeInit() {
      // this.getDataDictByConfigTypeData();
    },
    //获取详情后的赋值情况
    afterInit() {
      console.log("reviewResult===:",this.dataForm);
      //根据预警阶段判断日期文字 及  校验状态
      this.bidDateLabelStatus();
      this.billOfLoading(); //判断是否是提单环节
      this.reviewResultJudage();  //是否显示评审结果
    },
    async getDataDictByConfigTypeData() { 
      const configTypes = '放弃原因';
      let { data } = await getDataDictByConfigType({ params: { configTypes: configTypes } });
    },
    //是否显示评审结果
    reviewResultJudage() {
      //判断是否有审批按钮
      const approveStatus = (this.pageBaseInfo && this.pageBaseInfo.buttons.some(btn => btn.buttonName === '审批'));
      const status = WFContext.WorkflowInstinceState;  //状态判断 0：拟稿  1：草稿 2：审批中 3：审批完成
      const nodeName = WFContext.CurrentActivityName;  //当前节点
      this.reviewResultStatus = (status === 3) ? true : false;  //审批完成了显示 评审结果
      this.designerIsAgreeStatus = false;
      this.leaderIsAgreeStatus = false;
      this.dataRule['designerIsAgree'] = RuleRequired.curFiledRule(false); //设立项专员意见 必填
      this.dataRule['leaderIsAgree'] = RuleRequired.curFiledRule(false); //总部立项专员意见 必填
      if (approveStatus && (nodeName === '总部立项专员1' || nodeName === '总部立项专员')) {  //总部立项专员意见 展示
        this.leaderIsAgreeStatus = true;
        this.dataRule['leaderIsAgree'] = RuleRequired.curFiledRule(true); //总部立项专员意见 必填
        this.disabledFiled['leaderIsAgree'] = false;  //总部立项专员可以编辑
        this.disabledFiled['leaderRemark'] = false;  //总部立项专员1意见可以编辑
      }
      else if (approveStatus && nodeName === '设计立项专员') { //设计立项专员 展示
        this.designerIsAgreeStatus = true;
        this.dataRule['designerIsAgree'] = RuleRequired.curFiledRule(true); //设立项专员意见 必填
        this.disabledFiled['designerIsAgree'] = false;  //设计立项专员可以编辑
        this.disabledFiled['designerRemark'] = false;  //设计立项专员意见可以编辑
      }

      //审批通过
      if (status === 3) {
        this.designerIsAgreeStatus = (this.dataForm.designerIsAgree !== '' && this.dataForm.designerIsAgree !== null);   //设计立项专员 如果不等于空显示
        this.leaderIsAgreeStatus = (this.dataForm.leaderIsAgree !== '' && this.dataForm.leaderIsAgree !== null);  //总部立项专员

        const disabledFileds = ['designerIsAgree']
        if (this.reviewResultStatus) { 
          this.disabledFiled['reviewResult'] = true;
        }
      }
      this.juadgeAgree();
    },
    bidDateLabelStatus() {
      let { followupStage, isFollowup } = this.dataForm;
      this.dataFormDate();
      //followupStage: 预警阶段  isFollowup：是否跟进;
      this.resultStateStatus = false;  //是否已出结果 默认隐藏
      if (followupStage == '营销立项') {
        this.dateOrignalType = 1;
        // this.resultStateStatus = true;  //是否已出结果 仅投标文件评审显示
        if (isFollowup === '0') { //是否跟进为放弃
          this.bidDateStatus = false;  //新预计投标日期 隐藏
          this.disabledFiled['bidDateOriginal'] = true; //原预计投标日期
          this.disabledFiled['bidDate'] = true;  //新预计投标日期
        } else if (isFollowup === '1') {
          this.bidDateStatus = true;  //新预计投标日期 隐藏
        }
        if (this.bidDateStatus && this.dateOrignalType === 1) { 
          this.dataRule['bidDate'] = [  //新预计投标日期
            ...RuleRequired.curFiledRule(true),
            ...RuleRequired.curCustomRule(true,this.judgeDate,'blur')
            // { required: true, validator: this.judgeDate, trigger: 'blur' }
          ]
        }
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
        if (isFollowup == 1) {  //如果为跟进
          this.bidEndDateLabelStatus = true;
        } else {
          this.bidEndDateLabelStatus = false;
        }
        this.dataRule['bidEndDate'] = [  //新投标截止日期 校验
          { required: true, validator: this.judgeDate, trigger: 'blur' }
        ]
      }
      //estimateResultDateStatus
      //预计出结果日期判断 是否已出结果为 未出结果 时显示  否则隐藏
      // if (this.resultStateStatus && this.dataForm.resultState === '0') {
      //   this.estimateResultDateStatus = true;
      // }
      // this.estimateResultDateStatus = (this.resultStateStatus && this.dataForm.resultState === '0');
      //跟进说明 默认不显示；仅是否跟进选择“跟进，深入了解”时显示 resultState
      this.remarkStatusJuade();
      //其他 至少输入4个汉字判断  根据是否跟进来判断
      this.giveupReasonRemarkStatus();
    },
    //判断是否是提单环节
    billOfLoading() {
       //如果不是提单环节 不可编辑
      if (WFContext.CurrentActivityName !== '提单') {
        //是否跟进非必填
        // this.dataRule['isFollowup'] = RuleRequired.curFiledRule(false);
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
      let { followupStage, isFollowup, bidDateOriginal, storeDateOriginal, bidEndDateOriginal } = this.dataForm;  //bidEndDate： 新预计投标日期 新(现)投标截止日期
      const nowTime = myFun.getCurrentDateTimeString();  //当前时间
      //新投标截止日期
      if (followupStage == '营销立项' && isFollowup == 1) {
        if (valDate < nowTime) {
          callback(new Error("新预计投标日期不能小于当前时间"));
        }
        else if (!myFun.getCompareExceedDate(bidDateOriginal, valDate, 3)) {
          callback(new Error("新预计投标日期不可超过原预计投标日期后三个月"));
        }
      } else if (followupStage == '预选承包商入库' && isFollowup == 1) {
        if (valDate < nowTime) {
          callback(new Error("新预计投标日期不能小于当前时间"));
        }
        else if (!myFun.getCompareExceedDate(storeDateOriginal, valDate, 3)) {
          callback(new Error("新预计入库完成日期不可超过原预计入库完成日期后三个月"));
        }
       }
      else if (followupStage == '标前评审' && isFollowup == 1) {
        if (valDate < nowTime) {
          callback(new Error("现投标截止日期不能小于当前时间"));
        }
        else if (!myFun.getCompareExceedDate(bidEndDateOriginal, valDate, 3)) {
          callback(new Error("新投标截止日期不可超过原投标截止日期后三个月"));
        }
      }
      callback();
    },
    //校验至少输入4个汉字 跟进说明
    checkValidateInput(rule, value, callbacak) {
      let pattern = /^([\u4e00-\u9fa5]|\w)+$/;
      const reg = /[\u4E00-\u9FA5]/g;
      let chinaLen = 0;
      if (value.match(reg)) { 
        chinaLen = value.match(reg).length;  //中文的个数 汉字的个数
      }
      let len = escape(value).replace(/%u\w{2}/g, "").length;
      if (chinaLen >= 4) {
        callbacak();
      } else {
        callbacak(new Error('至少输入4个汉字'));
      }
    },
    //选择是否已出结果时
    resultStateChange(e) {
      if (e == 1) { 
        this.$confirm('请及时完成【开标结果】流程，否则项目将被关闭', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {}).catch(() => {});
      }
      this.dataForm['estimateResultDate'] = '';
     },
    //选择设计立项专员意见时
    disignerIsAgreeChange(filed,filedRemark) {
      this.dataRule[`${filedRemark}`] = RuleRequired.curFiledRule((this.dataForm[filed] === '0')); //不同意原因
    },
    juadgeAgree() {
      let { designerIsAgree, leaderIsAgree } = this.dataForm;
      this.dataRule['designerRemark'] = RuleRequired.curFiledRule((designerIsAgree === '0' && this.designerIsAgreeStatus)); //不同意原因
      this.dataRule['leaderRemark'] = RuleRequired.curFiledRule((leaderIsAgree === '0' && this.leaderIsAgreeStatus)); //总部立项专员 意见原因
    },
    //选择是否跟进
    isFolowUpChange(e) {
      this.clearSelectResult();
      let status = (e == 1) ? false : true;
      this.giveupReasonStatus = status; //仅是否跟进选择“放弃”时显示放弃原因
      this.dataRule['giveupReason'] = RuleRequired.curFiledRule(status);
      // this.giveupReasonRemarkStatus(); //放弃原因
      // this.remarkStatusJuade(); //跟进说明校验
      this.bidDateLabelStatus();
    },
    //清空 是否已出结果、放弃原因、原预计投标日期(bidDateOriginal)、预计出结果日期
    clearSelectResult() {
      const clearFiles = ['bidDate', 'resultState', 'resultState','estimateResultDate'];
      clearFiles.forEach(filed => { 
        this.dataForm[filed] = '';
      })
      this.checkedBoxGroup = [];
     },
    
    remarkStatusJuade() { //跟进说明 默认不显示；仅是否跟进选择“跟进，深入了解”时显示
      this.remarkStatus = (this.dataForm.isFollowup == 1) ? true : false; 
      if (this.remarkStatus) { 
        this.dataRule['remark'] = RuleRequired.curCustomRule(true, this.checkValidateInput,'blur')
      }
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
            // let pattern = /^([\u4e00-\u9fa5]|\w)+$/;
             const reg = /[\u4E00-\u9FA5]/g;
            // let len = escape(val).replace(/%u\w{2}/g, "").length;
             let chinaLen = 0;
            if (val.match(reg)) { 
              chinaLen = val.match(reg).length;  //中文的个数 汉字的个数
            }
            if (chinaLen >= 4) {
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
    getDataForm() { 
      this.dataFormDate();
      return this.dataForm;
    },
    validateForm() {
      const _this = this;
        return new Promise(resolve => {
          _this.$refs['dataForm'].validate(valid => {
            if (valid) {
              _this.dataFormDate();
              //  console.log("dataFrom===:", _this.dataForm);
              return resolve(_this.dataForm);
            } else {
              return resolve(false)
            }
          })
        });
    },
    dataFormDate() { 
      let { bidDateOriginal, storeDateOriginal, bidEndDateOriginal, bidDate, storeDate, bidEndDate, estimateResultDate } = this.dataForm;
      //原预计投标日期
      this.dataForm.bidDateOriginal = bidDateOriginal ? moment(bidDateOriginal).format('YYYY-MM-DD HH:mm:ss') : '';
      //预选承包商入库
      this.dataForm.storeDateOriginal = storeDateOriginal ? moment(storeDateOriginal).format('YYYY-MM-DD HH:mm:ss') : '';
      //投标文件评审、标前评审
      this.dataForm.bidEndDateOriginal = bidEndDateOriginal ? moment(bidEndDateOriginal).format('YYYY-MM-DD HH:mm:ss') : '';
      //新预计投标日期
      this.dataForm.bidDate = bidDate ? moment(bidDate).format('YYYY-MM-DD HH:mm:ss') : '';
      //预计入库完成日期
      this.dataForm.storeDate = storeDate ? moment(storeDate).format('YYYY-MM-DD HH:mm:ss') : '';
      //新投标截止日期
      this.dataForm.bidEndDate = bidEndDate ? moment(bidEndDate).format('YYYY-MM-DD HH:mm:ss') : '';
      //预计预出结果日期
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
