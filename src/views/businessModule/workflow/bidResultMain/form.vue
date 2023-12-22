<template>
  <!-- 客户信息登记 -->
  <div v-loading="loading">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      :disabled="setting.readonly"
      label-width="140px"
      class="new-data-form-css"
    >
      <row-layout :title="'基础信息'" :cols="3">
        <el-form-item slot="col_1" label="单据编号：">
          <el-input v-model="dataForm.code" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" prop="marketCode" label="立项编号：">
          <selector-dialog :model-data="marketMainDialog" :value="dataForm.marketCode" dynamic-model="customDialog" @updateValue="updateMarketMainValue"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="业务单元：">
          <el-input v-model="dataForm.businessUnit" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="客户：">
          <el-input v-model="dataForm.customerName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" label="立项名称：">
          <el-input v-model="dataForm.marketName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3" label="业务中心：">
          <el-input v-model="dataForm.businessCenter" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="跟进人：">
          <el-input v-model="dataForm.followerName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" label="项目介绍人：">
          <el-input v-model="dataForm.projectIntroName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3" label="已完成流程：">
          <el-tag @click="getBidDocument('bidPreReviewMainId')" style="margin-right:20px"><i class="el-icon-link"></i>标前评审</el-tag>
          <el-tag @click="getBidDocument('bidDocumentReviewMainId')"><i class="el-icon-link"></i>招标文件评审</el-tag>
        </el-form-item>
      </row-layout>
      <row-layout v-if="dataForm.isContractor == 0" :cols="3">
        <el-form-item slot="col_1" label="立项类型：">
          <el-select v-model="dataForm.marketType" placeholder="自动填写" style="width: 100%" disabled size="small">
            <el-option v-for="(item,index) in marketTypeOptions" :key="index" :label="item.configName" :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" label="产品线：">
          <el-input v-model="dataForm.productLineName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3" label="招投标形式：">
          <el-select v-model="dataForm.bidForm" placeholder="自动填写" style="width: 100%" disabled size="small">
            <el-option v-for="(item,index) in bidFormOptions" :key="index" :label="item.configName" :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="是否预选承包商：">
          <el-radio-group v-model="dataForm.isContractor" :disabled="true">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :title="'开标信息'" :cols="3">
        <el-form-item slot="col_1" prop="winTheBid" label="是否中标：">
          <el-radio-group v-model="dataForm.winTheBid" @change="changeWinTheBid">
            <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" prop="winBidName" label="中标单位：">
          <selector-dialog :model-data="bidUnitDialog" :value="dataForm.winBidName" dynamic-model="customDialog" @updateValue="updateWinBidDialogValue"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="bidPrice" label="中标价(元)：">
          <amountInput v-model="dataForm.bidPrice" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="taxRateId" label="税率（%）：">
          <selector-dialog :model-data="taxRateDialog" :value="dataForm.taxRateName" dynamic-model="customDialog" @updateValue="updateTaxRateValue"></selector-dialog>
        </el-form-item>
      </row-layout>
      <row-layout v-if="dataForm.winTheBid==1" :cols="1" cell="3">
        <el-form-item slot="col_1" prop="winOrLoseBidAnalysis" label="中标分析：">
          <el-input v-model="dataForm.winOrLoseBidAnalysis" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="至少10个汉字，至多500汉字" maxlength="500" />
        </el-form-item>
      </row-layout>
      <row-layout v-if="dataForm.winTheBid==0" :cols="1" cell="3">
        <el-form-item slot="col_1" prop="loseBidReason" label="未中标原因：">
          <el-checkbox-group v-model="dataForm.loseBidReason">
            <el-checkbox v-for="(item,index) in loseBidReasonOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-checkbox>
          </el-checkbox-group>
          <el-input v-if="dataForm.loseBidReason&&dataForm.loseBidReason.indexOf('-1') != -1" v-model="dataForm.otherReason" placeholder="请输入"></el-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" cell="3">
        <el-form-item slot="col_1" label="备注：">
          <el-input v-model="dataForm.bidMemo" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="500" />
        </el-form-item>
      </row-layout>
      <form-title :title="'投标单位及投标情况'"></form-title>
      <el-button type="primary" size="small" @click="addSituationDetail">新增</el-button>
      <el-table :data="dataForm.situationDetailList" class="f2bpmui-datagrid-vuetable" border>
        <el-table-column label="投标单位名称*">
          <template slot-scope="scope">
            <selector-dialog :model-data="bidUnitDialog" :value="scope.row.bidunitName" dynamic-model="customDialog" @updateValue="updateBidUnitDialogValue($event,scope.$index)"></selector-dialog>
          </template>
        </el-table-column>
        <el-table-column label="投标报价（元）*">
          <template slot-scope="scope">
            <amountInput v-model="scope.row.tenderOfferAmount" />
          </template>
        </el-table-column>
        <el-table-column label="综合排名*">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.ranking"
              size="small"
              maxlength="9"
              type="number"
              oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="text" @click="delTableList(scope.$index, 'situationDetailList')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <form-title v-if="isShowTabs()" :title="'入库结果'"></form-title>
      <el-tabs v-if="isShowTabs()" v-model="activeName">
        <el-tab-pane label="基本信息" name="first">
          <row-layout :cols="3">
            <el-form-item slot="col_1" prop="firstParty" label="网站/系统/甲方名称：" label-width="150px">
              <el-input v-model="dataForm.firstParty" size="small" placeholder="请输入" />
            </el-form-item>
            <el-form-item slot="col_2" prop="isDistrictSucceed" label="是否入库成功：">
              <el-radio-group v-model="dataForm.isDistrictSucceed">
                <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item slot="col_3" prop="validPeriod" label="入库有效期至：">
              <div class="input-row">
                <el-date-picker
                  :disabled="isValidPeriod"
                  v-model="dataForm.validPeriod"
                  type="date"
                  placeholder="请选择"
                  size="small"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
                <el-checkbox v-model="isValidPeriod" @change="changeValidPeriod">长期有效</el-checkbox>
              </div>
            </el-form-item>
          </row-layout>
          <row-layout :cols="3">
            <el-form-item slot="col_1" prop="isRegister" label="是否注册账号：" label-width="150px">
              <el-radio-group v-model="dataForm.isRegister">
                <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item slot="col_2" prop="isLock" label="是否办理CA锁：">
              <el-radio-group v-model="dataForm.isLock">
                <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item slot="col_3" prop="businessType" label="入选业务类型：">
              <el-input v-model="dataForm.businessType" size="small" placeholder="请输入" />
            </el-form-item>
          </row-layout>
          <row-layout :cols="3">
            <el-form-item slot="col_1" prop="district" label="入选片区：" label-width="150px">
              <el-input v-model="dataForm.district" size="small" placeholder="请输入" />
            </el-form-item>
            <el-form-item slot="col_2" prop="districtScope" label="片区范围：">
              <div class="input-row">
                <el-input v-show="false" v-model="dataForm.districtScope" />
                <cascSelect :disabled="isCheckedScope" :default-value="dataForm.addressCascade" code="AddressCascade" @change-select="changeDistrictScope" />
                <el-checkbox v-model="isCheckedScope" @change="changeCheckedScope">全国</el-checkbox>
              </div>
            </el-form-item>
          </row-layout>
          <row-layout :cols="1" cell="3">
            <el-form-item slot="col_1" label="备注：" label-width="150px">
              <el-input v-model="dataForm.basicMemo" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" />
            </el-form-item>
          </row-layout>
        </el-tab-pane>
        <el-tab-pane v-if="dataForm.isRegister==1" label="账户信息" name="second">
          <el-button type="primary" size="small" @click="addContranctAccount">新增</el-button>
          <el-table :data="dataForm.contranctAccountList" class="f2bpmui-datagrid-vuetable" border>
            <el-table-column label="网址*">
              <template slot-scope="scope">
                <el-input v-model="scope.row.url" size="small" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="登录账号(用户名)*">
              <template slot-scope="scope">
                <el-input v-model="scope.row.userName" size="small" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="登录密码*">
              <template slot-scope="scope">
                <el-input v-model="scope.row.passWord" size="small" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="账户注册时间*">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.registerTime"
                  type="date"
                  placeholder="请选择"
                  size="small"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="账户管理人*">
              <template slot-scope="scope">
                <el-input v-model="scope.row.sccountAdminId" size="small" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="预留联系人*">
              <template slot-scope="scope">
                <el-input v-model="scope.row.linkMan" size="small" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="预留邮箱*">
              <template slot-scope="scope">
                <el-input v-model="scope.row.linkMan" size="small" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="备注*">
              <template slot-scope="scope">
                <el-input v-model="scope.row.accountName" size="small" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80px">
              <template slot-scope="scope">
                <el-button type="text" @click="delTableList(scope.$index,'contranctAccountList')">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane v-if="dataForm.isLock==1" label="CA锁信息" name="third">
          <el-button type="primary" size="small" @click="addContranctLock">新增</el-button>
          <el-table :data="dataForm.contranctLockList" class="f2bpmui-datagrid-vuetable" border>
            <el-table-column label="CA锁名称*">
              <template slot-scope="scope">
                <el-input v-model="scope.row.lockName" size="small" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="CA锁密码*">
              <template slot-scope="scope">
                <el-input v-model="scope.row.lockPassword" size="small" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="办理时间*">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.processeTime"
                  type="date"
                  placeholder="请选择"
                  size="small"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="有效期至*">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.validUntil	"
                  type="date"
                  placeholder="请选择"
                  size="small"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="备注*">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark" size="small" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80px">
              <template slot-scope="scope">
                <el-button type="text" @click="delTableList(scope.$index,'contranctLockList')">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <form-title :title="'附件'"></form-title>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="proofAwardList" label="中标证明文件：">
          <update-files v-model="dataForm.proofAwardList"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="bidWinList" label="中标清单：">
          <update-files v-model="dataForm.bidWinList"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="编制人：">
          <span>{{ dataForm.createUserName }}</span>
        </el-form-item>
        <el-form-item slot="col_2" label="编制人部门：">
          <span>{{ dataForm.deptName }}</span>
        </el-form-item>
        <el-form-item slot="col_3" label="编制时间：">
          <span>{{ dataForm.createTime }}</span>
        </el-form-item>
      </row-layout>
    </el-form>
  </div>
</template>

<script>
import comMixin from '../minix';
import FormTitle from '@/components/basic/formTitle/index.vue';
import selectorDialog from '@/components/workflow/selector/selectorDialog.vue';
import { getDataDictByConfigType } from '@/Api/dataDict.js'
import { getBidDocument } from '@/Api/workflowBusssion/bid.js'
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import amountInput from '@/components/basic/numberInput/amountInput.vue';
import cascSelect from '@/components/basic/cascSelect/index.vue'
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
const requiredArray = ['name', 'winTheBid', 'winBidName', 'bidPrice', 'taxRateId',
  'winOrLoseBidAnalysis', 'proofAwardList', 'bidWinList', 'firstParty', 'isDistrictSucceed',
  'validPeriod', 'isRegister', 'isLock', 'district', 'districtScope', 'loseBidReason'];
export default {
  components: { FormTitle, selectorDialog, RowLayout, amountInput, cascSelect, updateFiles },
  mixins: [comMixin],
  data() {
    return {
      loading: false,
      formVisible: false,
      isReadOnly: false,
      activeName: 'first',
      dataForm: {
        name: '',
        code: '',
        winBidName: '',
        winBidId: '',
        taxRateId: '',
        taxRateName: '',
        taxRate: '',
        validPeriod: '',
        districtScope: '',
        productLineName: '',
        productLineId: '',
        winOrLoseBidAnalysis: '',
        otherReason: '',
        fileInfos: [],
        loseBidReason: [],
        contranctAccountList: [],
        contranctLockList: [],
        situationDetailList: [{
          bidunitId: '',
          bidunitName: '',
          tenderOfferAmount: '',
          ranking: ''
        },{
          bidunitId: '',
          bidunitName: '',
          tenderOfferAmount: '',
          ranking: ''
        },{
          bidunitId: '',
          bidunitName: '',
          tenderOfferAmount: '',
          ranking: ''
        }],
        proofAwardList: [],
        bidWinList: []
      },
      radioOptions: [],
      loseBidReasonOptions: [],
      marketTypeOptions: [],
      bidFormOptions: [],
      marketMainDialog: { code: 'bid_result_market_main', customDialog: 'bid_result_market_main', isSetHead: 1, isMulti: false, initailData: [] },
      bidUnitDialog: { code: 'base_competition_bid_unit', customDialog: 'base_competition_bid_unit', isSetHead: 1, isMulti: false, initailData: [] },
      taxRateDialog: { code: 'base_tax_rate_archive', customDialog: 'base_tax_rate_archive', isSetHead: 1, isMulti: false, initailData: [] },
      dataRule: RuleRequired.dataRule(requiredArray),
      form: {
        modifyReason: ''
      },
      linkData: {
        bidDocumentReviewMainAppId: "",
        bidDocumentReviewMainId: "",
        bidDocumentReviewMainWiid: "",
        bidPreReviewMainAppId: "",
        bidPreReviewMainId: "",
        bidPreReviewMainWiid: "",
      },
      isCheckedScope: false,
      isValidPeriod: false
    };
  },
  computed: {},
  mounted() { },
  methods: {
    /**
     * 是否预选承包商为是且入库类别为投标入库/设计入库，显示页签；否则不显示此页签；
     * 【depositcategory】 1，企业入库 2，投标入库 3，设计投标入库
     */
    isShowTabs() {
      return this.dataForm.isContractor === '1' && (this.dataForm.depositcategory === '3' || this.dataForm.depositcategory === '2');
    },
    /**
     * 未中标原因 22
     * 选择“其他”时，显示文本框，必填，不得少于10个字，文本框内提示：不得少于10汉字
     */
    validatorOtherReasonFont(rule, value, callbacak) {
      if (value.indexOf('-1') !== -1) {
        if (!this.dataForm) return callbacak(new Error('请输入其他原因'));
        const reg = /[\u4e00-\u9fa5]/gu;
        const matches = this.dataForm.otherReason.match(reg);
        const length = matches === null ? 0 : matches.length;
        if (length < 10) {
          return callbacak(new Error('至少10个汉字'));
        }
      } else {
        callbacak()
      }
    },
    /**
     * 中标分析
     * 填写不得少于10个字，文本框内提示：不得少于10汉字
     */
    validatorFont10(rule, value, callbacak) {
      if (!value) return callbacak(new Error('必填项不能为空'));
      const reg = /[\u4e00-\u9fa5]/gu;
      const matches = value.match(reg);
      const length = matches === null ? 0 : matches.length;
      if (length < 10) {
        return callbacak(new Error('至少10个汉字'));
      } else {
        callbacak()
      }
    },
    /**
     * 新增CA锁信息
     */
    addContranctLock() {
      if (!this.dataForm.contranctLockList) this.dataForm.contranctLockList = []
      this.dataForm.contranctLockList.push({
        lockName: '',
        lockPassword: '',
        processeTime: '',
        validUntil: '',
        remark: '',
        linkMan: '',
        email: ''
      })
    },
    /**
     * 新增账户信息
     */
    addContranctAccount() {
      if (!this.dataForm.contranctAccountList) this.dataForm.contranctAccountList = []
      this.dataForm.contranctAccountList.push({
        url: '',
        userName: '',
        passWord: '',
        registerTime: '',
        sccountAdminId: '',
        linkMan: '',
        email: '',
        remark: ''
      })
    },
    /**
     * 新增投标单位及投标情况
     */
    addSituationDetail() {
      if (!this.dataForm.situationDetailList) this.dataForm.situationDetailList = []
      this.dataForm.situationDetailList.push({
        bidunitId: '',
        bidunitName: '',
        tenderOfferAmount: '',
        ranking: ''
      })
    },
    /**
     * 删除table
     */
    delTableList(index, tableName) {
      this.dataForm[tableName].splice(index, 1)
    },
    /**
     * 切换地址
     */
    changeDistrictScope(data) {
      this.dataForm.districtScope = data.value
      this.dataForm.addressCascade = data.value
      this.isCheckedScope = false;
    },
    /**
     * 选中全国事件
     */
    changeCheckedScope(val) {
      this.dataForm.addressCascade = ''
      if(val) {
        this.dataForm.districtScope = '全国'
      } else {
        this.dataForm.districtScope = ''
      }
      this.dataRule['districtScope'] = RuleRequired.curFiledRule(this.dataForm.districtScope != '全国');
    },
    /**
     * 选中长期有效
     */
    changeValidPeriod(val) {
      if(val) {
        this.dataForm.validPeriod = '9999-12-31'
      } else {
        this.dataForm.validPeriod = ''
      }
    },
    /**
     * 选中是否中标 0 否 1 是
     */
    changeWinTheBid(val) {
      if(val == 0) { // 未中标原因清空
        this.dataForm.loseBidReason = []
        this.dataForm.otherReason = ''
      } else if(val == 1) {// 中标分析清空
        this.dataForm.winOrLoseBidAnalysis = ''
      }
      this.dataRule['bidPrice'] = RuleRequired.curFiledRule(val == '1');
    },
    /**
     * 立项编号
     */
    updateMarketMainValue(data) {
      const { id, marketCode, businesskey, customerName, followerName, affiliatedBusinessCenterName, bidForm, marketType,
        businessUnit, marketName, isContractor, productLineName, projectIntroName, depositcategory, productLineId } = data[0];
      this.dataForm.marketCode = marketCode;
      this.dataForm.businesskey = businesskey;
      this.dataForm.businessUnit = businessUnit;
      this.dataForm.customerName = customerName;
      this.dataForm.marketName = marketName;
      this.dataForm.marketType = marketType;
      this.dataForm.businessCenter = affiliatedBusinessCenterName;
      this.dataForm.followerName = customerName;
      this.dataForm.projectIntroName = projectIntroName;
      this.dataForm.followerName = followerName;
      this.dataForm.productLineName = productLineName;
      this.dataForm.productLineId = productLineId;
      this.dataForm.isContractor = isContractor;
      this.dataForm.marketMainId = id;
      this.dataForm.bidForm = bidForm;
      this.dataForm.depositcategory = depositcategory;
      this.$forceUpdate()
    },
    /**
     * 已完成流程链接
     */
    async getBidDocument(type){
      if(!this.dataForm.marketMainId){
        FUI.Window.showMsg('请选择立项编号')
        return
      }
      const res = await getBidDocument(this.dataForm.marketMainId)
      if(res.code == 200 && !res.data.msg){
        this.linkData = res.data
        this.toPath(type)
      } else {
        FUI.Window.showMsg(res.msg)
      }
    },
    /**
     * 跳转已完成流程链接
     */
    toPath(type){
      // 招标文件评审
      if(type == 'bidDocumentReviewMainId') {
        if(!this.linkData['bidDocumentReviewMainAppId']) {
          FUI.Window.showMsg('此项目没有投标文件评审的流程')
        } else {
          var url = '/workflowForm?formAction=3&appId=' + this.linkData.bidDocumentReviewMainAppId + '&wiid=' +
            this.linkData.bidDocumentReviewMainWiid + '&encode=bidDocumentReviewMain&rowId='+this.linkData.bidDocumentReviewMainId;
          url = url + '&code=custGrid_BusinessSearch_TouBiaoWenJianPingShen&modelName=bid'
          this.$router.push(url)
        }
      // 标前评审
      } else if(type == 'bidPreReviewMainId') {
        if(!this.linkData['bidPreReviewMainAppId']) {
          FUI.Window.showMsg('此项目没有标前评审的流程')
        } else {
          var url = '/workflowForm?formAction=3&appId=' + this.linkData.bidPreReviewMainAppId + '&wiid=' +
           this.linkData.bidPreReviewMainWiid + '&encode=bidPreReviewMain&rowId='+this.linkData.bidPreReviewMainId;
          url = url + '&code=custGrid_BusinessSearch_BiaoQianPingShen' + '&modelName=bid'
          this.$router.push(url)
        }
      }
    },
    /**
     * 中标单位
     */
    updateWinBidDialogValue(data) {
      if (data.length <= 0) return;
      this.dataForm.winBidId = data[0].id
      this.dataForm.winBidName = data[0].name
    },
    /**
     * 投标单位名称
     */
    updateBidUnitDialogValue(data, index) {
      if (data.length <= 0) return;
      this.dataForm.situationDetailList[index].bidunitId = data[0].id
      this.dataForm.situationDetailList[index].bidunitName = data[0].name
    },
    /**
     * 税率
     */
    updateTaxRateValue(data) {
      if (data.length <= 0) return;
      this.dataForm.taxRateId = data[0].id
      this.dataForm.taxRateName = data[0].name
      this.dataForm.taxRate = data[0].taxRate
    },
    beforeInit() {
      this.getDataDictByConfigType()
      this.initRuleRequired()
      
    },
    afterInit() {
      // 片区赋值
      if(this.dataForm.districtScope == '全国') {
        this.isCheckedScope = true;
      } else {
        this.dataForm.addressCascade = this.dataForm.districtScope
      }
      // 有效时长
      if(this.dataForm.validPeriod == '9999-12-31') this.isValidPeriod = true;
      // 选中全国事件
      if(this.isCheckedScope) this.changeCheckedScope(this.isCheckedScope);
      // 未中标原因
      this.dataForm.loseBidReason = this.dataForm.loseBidReason?this.dataForm.loseBidReason.split(','):[]
      this.initRuleRequired()
    },
    /**
     * 初始化必填信息
     */
    initRuleRequired() {
      /**
       * 中标价
       */
      this.dataRule['bidPrice'] = RuleRequired.curFiledRule(this.dataForm.bidPrice == '1');
    },
    validateForm() {
      const _this = this;
      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          if (valid) {
            if(_this.dataForm.situationDetailList.length <= 0){
              FUI.Window.showMsg('投标单位及投标情况列表至少填写1行')
              return resolve(false);
            }
            for (var i = 0; i < _this.dataForm.situationDetailList.length; i++) {
              const {bidunitName, tenderOfferAmount, ranking} = _this.dataForm.situationDetailList[i];
              if(!bidunitName || !tenderOfferAmount || !ranking) {
                FUI.Window.showMsg('投标单位及投标情况列表，所有表格行都需补充完整！')
                return resolve(false);
              }
            }
            return resolve(_this.getDataForm());
          } else {
            return resolve(false)
          }
        })
      });
    },
    /**
     * 获取表单数据
     */
    getDataForm() {
      const dataForm = JSON.parse(JSON.stringify(this.dataForm))
      dataForm.loseBidReason = this.dataForm.loseBidReason.toString()
      return dataForm;
    },
    /**
     * 初始化字典
     */
    async getDataDictByConfigType() {
      const res = await getDataDictByConfigType({ params: { configTypes: '未中标原因,是或否,立项类型,招投标形式' }})
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '未中标原因':
              this.loseBidReasonOptions = ele.dataDict;
              break;
            case '是或否':
              this.radioOptions = ele.dataDict;
              break;
            case '立项类型':
              this.marketTypeOptions = ele.dataDict;
              break;
            case '招投标形式':
              this.bidFormOptions = ele.dataDict;
              break;
            default:
              break;
          }
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
::v-deep .designPrice {
  .el-input-group__append {
    padding: 0 12px;
  }
}
.input-row {
  display: flex;
  align-items: center;
  height: 40px;
  justify-content: space-between;
  .el-input,.online-cascader {
    flex:1;
    margin-right: 20px;
  }
}
</style>
