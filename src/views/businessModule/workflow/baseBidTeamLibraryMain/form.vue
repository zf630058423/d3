<template>
  <div>
    <div v-loading="loading">
      <el-form
        ref="dataForm"
        :model="dataForm"
        :rules="dataRule"
        :disabled="setting.readonly"
        label-width="200px"
        class="new-data-form-css"
      >
        <row-layout :title="'基础信息'" :cols="3">
          <el-form-item slot="col_1" label="单据编号：">
            <el-input v-model="dataForm.code" disabled size="small" placeholder="自动填写" />
          </el-form-item>
          <el-form-item slot="col_2" prop="idCard" label="身份证/纳税识别：">
            <el-input v-model="dataForm.idCard" :disabled="isRevise" placeholder="请输入" size="small" maxlength="30">
              <el-button slot="append" :disabled="isRevise" @click="verifyExistEvent">查重</el-button>
            </el-input>
          </el-form-item>
          <el-form-item slot="col_3" prop="teamType" label="团队类别：">
            <el-radio-group v-model="dataForm.teamType" :disabled="isRevise">
              <el-radio v-for="(item,index) in teamTypeOpitons" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3">
          <el-form-item slot="col_1" prop="teamName" label="投标团队名称：">
            <el-input v-model="dataForm.teamName" :disabled="isRevise" size="small" placeholder="请输入" maxlength="50" />
          </el-form-item>
          <el-form-item slot="col_2" prop="contact" label="联系人/负责人：">
            <el-input v-model="dataForm.contact" size="small" placeholder="请输入" maxlength="50" />
          </el-form-item>
          <el-form-item slot="col_3" prop="sex" label="性别：">
            <el-radio-group v-model="dataForm.sex">
              <el-radio v-for="(item,index) in sexOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </row-layout>
        <row-layout :cols="3">
          <el-form-item slot="col_1" prop="teamPeopleNumber" label="团队人数：">
            <el-input v-model="dataForm.teamPeopleNumber" size="small" placeholder="请输入" maxlength="50" />
          </el-form-item>
          <el-form-item v-if="isShowField" slot="col_2" prop="phone" label="联系电话：">
            <NumberInput v-model="dataForm.phone" size="small" placeholder="请输入" :maxlength="20" />
          </el-form-item>
          <el-form-item v-if="isShowField" slot="col_3" label="邮箱：">
            <el-input v-model="dataForm.email" size="small" placeholder="请输入" maxlength="50" />
          </el-form-item>
        </row-layout>
        <row-layout :cols="3">
          <el-form-item slot="col_1" prop="teamCity" label="团队所在城市：">
            <cascSelect :default-value="dataForm.teamCity" code="AddressCascade" @change-select="changeTeamCity" />
          </el-form-item>
          <el-form-item slot="col_2" label="是否可以在公司总部（区域）上班：" label-width="240px">
            <el-radio-group v-model="dataForm.isInCompanyWork">
              <el-radio v-for="(item,index) in radioList" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item slot="col_3" label="团队成员中是否包含技术标编制人员：" label-width="240px">
            <el-radio-group v-model="dataForm.isHavePrepared">
              <el-radio v-for="(item,index) in radioList" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </row-layout>
        <row-layout :cols="1">
          <el-form-item slot="col_1" label="团队注册地址/人员工作地址：">
            <el-input v-model="dataForm.teamadress" size="small" placeholder="请输入" maxlength="30" />
          </el-form-item>
        </row-layout>
        <row-layout :cols="3">
          <el-form-item slot="col_1" label="近两年投标金（元）：">
            <el-input v-model="dataForm.bidAmount" size="small" placeholder="系统自动计算" maxlength="30" :disabled="true" />
          </el-form-item>
          <el-form-item slot="col_2" label="近两年投标个数：">
            <el-input v-model="dataForm.bidNum" size="small" placeholder="系统自动计算" maxlength="30" :disabled="true" />
          </el-form-item>
        </row-layout>
        <row-layout :cols="3">
          <el-form-item slot="col_1" label="近两年中标金（元）：">
            <el-input v-model="dataForm.winAmount" size="small" placeholder="系统自动计算" maxlength="30" :disabled="true" />
          </el-form-item>
          <el-form-item slot="col_2" label="近两年中标个数：">
            <el-input v-model="dataForm.winNum" size="small" placeholder="系统自动计算" maxlength="30" :disabled="true" />
          </el-form-item>
        </row-layout>
        <row-layout :cols="1">
          <el-form-item slot="col_1" label="合作业务中心：">
            <selector-dialog :btn-disabled="!isRevise" :width="500" :model-data="businessCenter" :value="dataForm.businessCenter" dynamic-model="selectOrg" @updateValue="updateBusinessCenter"></selector-dialog>
          </el-form-item>
        </row-layout>
        <row-layout :cols="1">
          <el-form-item slot="col_1" prop="scope" label="标书制作擅长范围：">
            <el-input v-model="dataForm.scope" type="textarea" :autosize="{ minRows: 6}" size="small" placeholder="请输入" maxlength="500" />
          </el-form-item>
        </row-layout>
        <row-layout :cols="1">
          <el-form-item slot="col_1" label="曾经合作过的单位：">
            <el-input v-model="dataForm.cooperatedUnit" type="textarea" :autosize="{ minRows: 6}" size="small" placeholder="请输入" maxlength="250" />
          </el-form-item>
        </row-layout>
        <row-layout :cols="1">
          <el-form-item slot="col_1" label="已合作产品线：">
            <el-input v-model="dataForm.cooperatedLine" size="small" placeholder="系统自动计算" maxlength="30" :disabled="true" />
          </el-form-item>
        </row-layout>
        <row-layout :cols="1">
          <el-form-item slot="col_1" label="备注：">
            <el-input v-model="dataForm.memo" type="textarea" :autosize="{ minRows: 6}" size="small" placeholder="请输入" maxlength="250" />
          </el-form-item>
        </row-layout>
        <form-title :title="'团队成员信息'"></form-title>
        <div>
          <el-button type="primary" size="small" @click="addEmployeeList">新增</el-button>
        </div>
        <el-table :data="dataForm.employeeList" class="f2bpmui-datagrid-vuetable" border>
          <el-table-column label="姓名">
            <template slot-scope="scope">
              <el-input v-model="scope.row.name" size="small" placeholder="请输入" />
            </template>
          </el-table-column>
          <el-table-column label="职务">
            <template slot-scope="scope">
              <el-input v-model="scope.row.post" size="small" placeholder="请输入" />
            </template>
          </el-table-column>
          <el-table-column label="专业及擅长">
            <template slot-scope="scope">
              <el-input v-model="scope.row.major" size="small" placeholder="请输入" />
            </template>
          </el-table-column>
          <el-table-column label="所在地">
            <template slot-scope="scope">
              <el-input v-model="scope.row.location" size="small" placeholder="请输入" />
            </template>
          </el-table-column>
          <el-table-column label="是否在中装购买社保">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.isBuySocialSecurity">
                <el-radio v-for="(item,index) in radioList" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="电话">
            <template slot-scope="scope">
              <el-input v-model="scope.row.phone" size="small" placeholder="请输入" maxlength="20" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80px">
            <template slot-scope="scope">
              <el-button type="text" @click="delEmployeeList(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <form-title :title="'附件（身份证复印件）'"></form-title>
        <row-layout :cols="1">
          <el-form-item slot="col_1" prop="idCardInfo" label="身份证复印件：">
            <update-files v-model="dataForm.idCardInfo"></update-files>
          </el-form-item>
        </row-layout>
        <row-layout v-if="dataForm.teamType!=1" :cols="1">
          <el-form-item slot="col_1" prop="licenseInfo" label="营业执照：">
            <update-files v-model="dataForm.licenseInfo"></update-files>
          </el-form-item>
        </row-layout>
        <row-layout v-if="dataForm.teamType!=1" :cols="1">
          <el-form-item slot="col_1" prop="taxInfo" label="税务登记证：">
            <update-files v-model="dataForm.taxInfo"></update-files>
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
  </div>
</template>

<script>
import comMixin from '../minix';
import { verifyExist, getBid, getSuccessBidder } from '@/Api/workflowBusssion/bid.js'
import { getDataDictByConfigType } from '@/Api/dataDict.js'
import cascSelect from '@/components/basic/cascSelect/index.vue'
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import FormTitle from '@/components/basic/formTitle/index.vue';
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import NumberInput from '@/components/basic/numberInput/index.vue';
import selectorDialog from '@/components/workflow/selector/selectorDialog.vue';
import { mapGetters } from 'vuex';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
const requiredArray = ['idCard', 'teamType', 'sex', 'teamName', 'contact', 'teamPeopleNumber',
  'phone', 'teamCity', 'scope', 'licenseInfo', 'idCardInfo', 'taxInfo']
export default {
  components: { FormTitle, RowLayout, cascSelect, updateFiles, selectorDialog, NumberInput },
  mixins: [comMixin],
  data() {
    return {
      dataForm: {
        code: '',
        idCard: '',
        teamType: '',
        teamName: '',
        contact: '',
        sex: '',
        teamPeopleNumber: '',
        phone: '',
        email: '',
        teamCity: '',
        isHavePrepared: '',
        isInCompanyWork: '',
        teamadress: '',
        bidAmount: '',
        bidNum: '',
        winAmount: '',
        winNum: '',
        businessCenter: '',
        scope: '',
        cooperatedUnit: '',
        cooperatedLine: '',
        memo: '',
        licenseInfo: [],
        idCardInfo: [],
        taxInfo: [],
        employeeList: []
      },
      radioList: [{
        configName: '是',
        configValue: '1'
      }, {
        configName: '否',
        configValue: '0'
      }],
      teamTypeOpitons: [],
      sexOptions: [],
      businessCenter: { resultFieldKey: 'groupId', isSetHead: 1, isMulti: false, initailData: [] },
      dataRule: RuleRequired.dataRule(requiredArray)
    };
  },
  computed: {
    ...mapGetters(['userInfo']),
    // 是否修订
    isRevise() {
      return this.$route.query.isRevise;
    },
    // 仅编制人、审批人、诺总000002、黎文崇000009、陈群000032、曾飞001442、刘燕000051可见
    isShowField() {
      return ['000002', '000009', '000032', '001442', '000051'].indexOf(this.userInfo.account) !== -1 || this.dataForm.createUserName === this.userInfo.realName;
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
     /**
     * 字段校验
     */
    initRuleRequired() {
      this.dataRule['scope'] = RuleRequired.curCustomRule(true, function (rule, value, callbacak) {
        let len = value.match(/[\u4E00-\u9FA5]/g)?value.match(/[\u4E00-\u9FA5]/g).length:0;
        if (len <= 500) {
          callbacak();
        } else {
          callbacak(new Error('至多500汉字'));
        }
       });
    },
    /**
     * 近两年的投标
     */
    async getBid() {
      if(!this.dataForm.teamName) return;
      const res = await getBid(this.dataForm.teamName)
      if(res.code == 200){
        this.dataForm.bidNum = res.data.amount
        this.dataForm.bidAmount = res.data.bidAmount
      }
    },
    /**
     * 进两年的中标
     */
    async getSuccessBidder() {
      if(!this.dataForm.teamName) return;
      const res = await getSuccessBidder(this.dataForm.teamName)
      if(res.code == 200){
        this.dataForm.winNum = res.data.amount
        this.dataForm.winAmount = res.data.bidAmount
      }
    },
    /**
     * 修订权限
     * 1、编制人员（为表单字段）可修订自己的单据；
     * 2、“合作业务中心”对应人员可修订本业务中心的数据,做成角色（角色名称：投标团队库修订）：①项目所属业务中心-商务人员、项目所
     * 属业务中心-经营部负责人、项目所属业务中心-中心负责人
     * @param {*} e
     */
    updateBusinessCenter(val) {
      const businessCenterid = this.dataForm.businessCenterid.split(',')
      const businessCenter = this.dataForm.businessCenter.split(',')
      const orgIds = [businessCenterid[0]]
      const orgName = [businessCenter[0]]
      val.forEach(e => {
        orgIds.push(e.value)
        orgName.push(e.text)
      })
      this.dataForm.businessCenterid = orgIds.toString()
      this.dataForm.businessCenter = orgName.toString()
      this.$forceUpdate()
    },
    /**
     * 初始化
     */
    beforeInit() {
      this.initRuleRequired()
      this.getDataDictByConfigType()
    },
    /**
     * 获取详情后的回调
     */
    afterInit() {
      this.getBid()
      this.getSuccessBidder()
    },
    /**
     * 查重
     */
    async verifyExistEvent() {
      if (!this.dataForm.idCard) {
        this.$message.error('请输入身份证/纳税识别')
        return
      }
      const res = await verifyExist({ verifyInfo: this.dataForm.idCard })
      if (res.code == 200 && res.data == true) {
        FUI.Window.showMsg('该团队已存在，请联系投标管理中心');
      }
    },
    /**
     * 删除团队成员信息
     */
    delEmployeeList(index) {
      this.dataForm.employeeList.splice(index, 1)
    },
    /**
     * 新增团队成员信息
     */
    addEmployeeList() {
      this.dataForm.employeeList.push({
        isBuySocialSecurity: '',
        location: '',
        major: '',
        name: '',
        phone: '',
        post: ''
      })
    },
    /**
     * 切换所在城市
     */
    changeTeamCity(data) {
      this.dataForm.teamCity = data.value
      this.$refs['dataForm'].clearValidate('teamCity')
    },
    /**
     * 初始化字典
     */
    async getDataDictByConfigType() {
      const res = await getDataDictByConfigType({ params: { configTypes: '团队类别,人员性别' }})
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '团队类别':
              this.teamTypeOpitons = ele.dataDict;
              break;
            case '人员性别':
              this.sexOptions = ele.dataDict;
              break;
            default:
              break;
          }
        });
      }
    },
    validateForm() {
      const _this = this;
      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          if (valid) {
            return resolve(_this.dataForm);
          } else {
            return resolve(false)
          }
        })
      });
    }
  }
};
</script>

<style scoped lang="scss">

</style>
