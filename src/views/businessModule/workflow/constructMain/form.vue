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
        <el-form-item slot="col_1" prop="marketCode" label="立项编号：">
          <selector-dialog :dataId="dataForm.marketMainId" :model-data="marketMainDialog" :value="dataForm.marketCode" dynamic-model="customDialog" @updateValue="updateMarketMainValue"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" label="立项名称：">
          <el-input v-model="dataForm.marketName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3" label="客户：">
          <el-input v-model="dataForm.customerName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="项目编号：">
          <el-input v-model="dataForm.code" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" prop="name" label="项目名称：">
          <el-input v-model="dataForm.name" size="small" placeholder="请输入" />
        </el-form-item>
        <el-form-item slot="col_3" label="产品线：">
          <el-input v-model="dataForm.productLineName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="中标价(元)：">
          <amountInput v-model="dataForm.bidPrice" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" label="中标单位：">
          <el-input v-model="dataForm.winBidName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_3" label="投标利润率(%)：">
          <percentageInput v-model="dataForm.targetProfitRate" :disabled="true" placeholder="自动填写"/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="categoryId" label="项目分类：">
          <el-select v-model="dataForm.categoryId" placeholder="请选择" @change="changeCategory">
            <el-option v-for="(item,index) in categoryOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" prop="archArea" label="建筑面积㎡：">
          <el-input v-model="dataForm.archArea" size="small" placeholder="请输入" />
        </el-form-item>
        <el-form-item slot="col_3" prop="projectTaxMethod" label="项目计税方式：">
          <el-radio-group v-model="dataForm.projectTaxMethod">
            <el-radio v-for="(item,index) in projectTaxMethodOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="projectAddress" label="项目地址：">
          <cascSelect :default-value="dataForm.projectAddress" code="AddressCascade" @change-select="changeProjectAddress" />
        </el-form-item>
        <el-form-item slot="col_2" prop="address" label="详细地址：">
          <el-input v-model="dataForm.address" size="small" placeholder="请输入" />
        </el-form-item>
        <el-form :disabled="disabledSpecial" :rules="dataRule" slot="col_3" label-width="140px">
          <el-form-item prop="isSpecialProject" label="是否特殊项目：">
            <el-radio-group v-model="dataForm.isSpecialProject">
              <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </row-layout>
      <row-layout :title="'工程信息'" :cols="3">
        <el-form-item slot="col_1" label="业务单元：">
          <el-input v-model="dataForm.marketUnitName" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" prop="constructionUnitId" label="管理部门：">
          <selector-dialog :dataId="dataForm.constructionUnitId" :width="500" :model-data="orgDialog" :value="dataForm.constructionUnitName" dynamic-model="selectOrg" @updateValue="updateDepartmentValue($event,'constructionUnitName', 'constructionUnitId')"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="projectDepartmentId" label="项目部：">
          <selector-dialog :dataId="dataForm.projectDepartmentId" :width="500" :model-data="orgDialog" :value="dataForm.projectDepartmentName" dynamic-model="selectOrg" @updateValue="updateDepartmentValue($event,'projectDepartmentName', 'projectDepartmentId')"></selector-dialog>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="projectStatusId" label="项目状态：">
          <el-select v-model="dataForm.projectStatusId" placeholder="请选择">
            <el-option v-for="(item,index) in projectStatusOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" prop="plannedCommencementDate" label="计划开工日期：">
          <el-date-picker
            v-model="dataForm.plannedCommencementDate"
            type="date"
            placeholder="请选择"
            size="small"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item slot="col_3" prop="plannedEntryDate" label="计划进场日期：">
          <el-date-picker
            v-model="dataForm.plannedEntryDate"
            type="date"
            placeholder="请选择"
            size="small"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="projectManagerId" label="项目负责人：">
          <selector-dialog :dataId="dataForm.projectManagerId"  :model-data="userDialog" :value="dataForm.projectManagerName" dynamic-model="selectUsers" @updateValue="updateUserValue($event,'projectManagerName','projectManagerId')"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="projectManagerTel" label="项目负责人联系电话：" label-width="150px">
          <el-input v-model="dataForm.projectManagerTel" size="small" placeholder="请输入" maxlength="200" />
        </el-form-item>
        <el-form-item slot="col_3" label="监理单位：">
          <el-input v-model="dataForm.superUnit" size="small" placeholder="请输入" maxlength="200" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="监理单位联系人：">
          <el-input v-model="dataForm.superUnitLinkMan" size="small" placeholder="请输入" maxlength="200" />
        </el-form-item>
        <el-form-item slot="col_2" label="监理单位联系人职务：">
          <el-input v-model="dataForm.superUnitLinkManContactTitle" size="small" placeholder="请输入" maxlength="200" />
        </el-form-item>
        <el-form-item slot="col_3" label="甲方联系人：">
          <el-input v-model="dataForm.superUnitLinkManTel" size="small" placeholder="请输入" maxlength="200" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="laborSubcontractorId" label="指定劳务分包商：">
          <selector-dialog :dataId="dataForm.laborSubcontractorId" :model-data="laborSubcontractorDialog" :value="dataForm.laborSubcontractorName" dynamic-model="customDialog" @updateValue="updateLaborSubcontractorValue"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="licenceId" label="建造师：">
          <selector-dialog :dataId="dataForm.licenceId" :model-data="userDialog" :value="dataForm.licenceName" dynamic-model="selectUsers" @updateValue="updateUserValue($event,'licenceName','licenceId')"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" prop="technicalId" label="技术负责人：">
          <selector-dialog :dataId="dataForm.technicalId" :model-data="userDialog" :value="dataForm.technicalName" dynamic-model="selectUsers" @updateValue="updateUserValue($event,'technicalName','technicalId')"></selector-dialog>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="safetyId" label="安全员：">
          <selector-dialog :dataId="dataForm.safetyId" :model-data="userDialog" :value="dataForm.safetyName" dynamic-model="selectUsers" @updateValue="updateUserValue($event,'safetyName','safetyId')"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="qualityId" label="质检员：">
          <selector-dialog :dataId="dataForm.qualityId" :model-data="userDialog" :value="dataForm.qualityName" dynamic-model="selectUsers" @updateValue="updateUserValue($event,'qualityName','qualityId')"></selector-dialog>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" label="备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" />
        </el-form-item>
      </row-layout>
      <form-title :title="'项目管理部人员'"></form-title>
      <div>
        <el-button type="primary" size="small" @click="addConstructManage">新增</el-button>
      </div>
      <el-table :data="dataForm.constructManageDetailList" class="f2bpmui-datagrid-vuetable" border>
        <el-table-column label="岗位">
          <template slot-scope="scope">
            <el-select v-model="scope.row.post" placeholder="请选择">
              <el-option v-for="(item,index) in postOptions" :key="index" :value="item.configValue" :label="item.configName">
                {{ item.configName }}
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <selector-dialog :dataId="scope.row.nameId" :model-data="userDialog" :value="scope.row.name" dynamic-model="selectUsers" @updateValue="updateUserValue($event,'name','nameId', scope.$index)"></selector-dialog>
          </template>
        </el-table-column>
        <el-table-column label="联系电话">
          <template slot-scope="scope">
            <el-input v-model="scope.row.phone" size="small" placeholder="请输入" maxlength="200" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="text" @click="delConstructManage(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <form-title :title="'附件'"></form-title>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="fileInfo" label="附件文件：">
          <update-files v-model="dataForm.fileInfo"></update-files>
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
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import cascSelect from '@/components/basic/cascSelect/index.vue'
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import percentageInput from '@/components/basic/numberInput/percentageInput.vue';
import amountInput from '@/components/basic/numberInput/amountInput.vue';
const requiredArray = ['marketCode', 'name', 'differentPlaces', 'categoryId', 'projectTaxMethod', 'fileInfo',
  'archArea', 'projectAddress', 'address', 'constructionUnitId', 'projectDepartmentId', 'laborSubcontractorId',
  'projectStatusId', 'plannedCommencementDate', 'plannedEntryDate', 'projectManagerId', 'projectManagerTel',
  'licenceId', 'technicalId' ,'safetyId', 'qualityId', 'isSpecialProject'];
export default {
  components: { FormTitle, selectorDialog, RowLayout, cascSelect, updateFiles, percentageInput, amountInput },
  mixins: [comMixin],
  data() {
    return {
      loading: false,
      formVisible: false,
      dialogVisible: false,
      isReadOnly: false,
      dataForm: {
        marketName: '',
        marketCode: '',
        customerName: '',
        isContractor: '',
        code: '',
        name: '',
        productLineName: '',
        bidPrice: '',
        winBidName: '',
        targetProfitRate: '',
        categoryId: '',
        archArea: '',
        projectTaxMethod: '',
        projectAddress: '',
        address: '',
        marketUnitName: '',
        constructionUnitId: '',
        constructionUnitName: '',
        projectDepartmentId: '',
        projectDepartmentName: '',
        projectDepartmentName: '',
        projectStatusId: '1',
        plannedCommencementDate: '',
        plannedEntryDate: '',
        projectManagerId: '',
        projectManagerName: '',
        projectManagerTel: '',
        superUnit: '',
        superUnitLinkMan: '',
        superUnitLinkManContactTitle: '',
        superUnitLinkManTel: '',
        laborSubcontractorId: '',
        laborSubcontractorName: '',
        licenceId: '',
        licenceName: '',
        technicalId: '',
        technicalName: '',
        safetyId: '',
        safetyName: '',
        qualityId: '',
        qualityName: '',
        remark: '',
        isSpecialProject: '0',
        constructManageDetailList: [],
        fileInfo: []
      },
      radioOptions: [],
      projectTaxMethodOptions: [],
      postOptions: [],
      categoryOptions: [],
      projectStatusOptions: [],
      marketMainDialog: { code: 'market_main_construct_main', customDialog: 'market_main_construct_main', linkUrl: '/marketInfoView', isSetHead: 1, isMulti: false, initailData: [], isShowLink: true },
      orgDialog: { code: 'YeWuDanYuan', customDialog: 'YeWuDanYuan', linkUrl: '/orgInfoView', isSetHead: 1, parm: { singleSelect: true }, initailData: [], isShowLink: true },
      userDialog: { code: 'selectUsers', customDialog: 'selectUsers', linkUrl: '/userInfoView', isSetHead: 1, parm: { singleSelect: true }, initailData: [], isShowLink: true },
      laborSubcontractorDialog: { code: 'v_customer_supplier_archive_main_construct_main', customDialog: 'v_customer_supplier_archive_main_construct_main',
        linkUrl: '/laborInfoView', isSetHead: 1, isMulti: false, initailData: [], isShowLink: true },
      dataRule: RuleRequired.dataRule(requiredArray),
      form: {
        modifyReason: ''
      }
    };
  },
  computed: {
    disabledSpecial() {
      if(WFContext.CurrentOrgName == '工程管理中心负责人' && WFContext.JumpToTaskId) {
        return false
      }
      return true;
    }
  },
  methods: {
    /**
     * 项目分类切换
     */
    changeCategory(val){
      // 当项目分类为“施工类”时必须选择，否则可不选
      this.dataRule['laborSubcontractorId'] = RuleRequired.curFiledRule(val=='1');
      // 【安全员】
      this.dataRule['safetyId'] = RuleRequired.curFiledRule(val=='1');
      // 【质检员】
      this.dataRule['qualityId'] = RuleRequired.curFiledRule(val=='1');
      // 【技术负责人】
      this.dataRule['technicalId'] = RuleRequired.curFiledRule(val=='1');
      // 【建造师】
      this.dataRule['licenceId'] = RuleRequired.curFiledRule(val=='1');
    },
    /**
     * 更新部门
     */
    updateDepartmentValue(data, filedName, filedValue) {
      if (data && data.length <= 0) return;
      const { value, text } = data[0];
      this.dataForm[filedValue] = value;
      this.dataForm[filedName] = text;
      this.$forceUpdate()
    },
    /**
     * 更新用户
     */
    updateUserValue(data, filedName, filedValue, index) {
      if (data && data.length <= 0) return;
      const { userId, realName, mobile } = data[0];
      if (index !== null && index !== undefined) {
        this.$set(this.dataForm.constructManageDetailList[index], filedName, realName)
        this.$set(this.dataForm.constructManageDetailList[index], filedValue, userId)
        this.$set(this.dataForm.constructManageDetailList[index], 'phone', mobile)
      } else {
        this.dataForm[filedValue] = userId;
        this.dataForm[filedName] = realName;
        if(filedName == 'projectManagerName') this.dataForm['projectManagerTel'] = mobile
      }
      this.$forceUpdate()
    },
    /**
     * 更新劳务分包
     */
    updateLaborSubcontractorValue(data) {
      if (data && data.length <= 0) return;
      const { id, customerName } = data[0];
      this.dataForm.laborSubcontractorId = id;
      this.dataForm.laborSubcontractorName = customerName;
      this.$forceUpdate()
    },
    /**
     * 立项编号
    */
    updateMarketMainValue(data) {
      if (data && data.length <= 0) return;
      const { id, marketname, marketcode, productlinename, targetprofitrate, winbidname, bidprice, marketcentername,
      archarea, isContractor, customername, address, projectaddress } = data[0];
      this.dataForm.marketMainId = id;
      this.dataForm.marketCode = marketcode;
      this.dataForm.marketUnitName = marketcentername;
      this.dataForm.marketName = marketname;
      this.dataForm.customerName = customername;
      this.dataForm.productLineName = productlinename;
      this.dataForm.targetProfitRate = targetprofitrate;
      this.dataForm.winBidName = winbidname;
      this.dataForm.bidPrice = bidprice;
      this.dataForm.archArea = archarea;
      this.dataForm.isContractor = isContractor;
      this.dataForm.address = address;
      this.dataForm.projectAddress = projectaddress;
      this.$forceUpdate()
    },
    /**
     * 切换地址
     */
    changeProjectAddress(data) {
      this.dataForm.projectAddress = data.value
      this.$refs['dataForm'].clearValidate('projectAddress')
    },
    /**
     * 添加银行账号
     */
    addConstructManage() {
      if (!this.dataForm.constructManageDetailList) this.dataForm.constructManageDetailList = []
      this.dataForm.constructManageDetailList.push({
        constructMainId: '',
        id: '',
        nameId: '',
        name: '',
        phone: '',
        post: ''
      })
    },
    /**
     * 删除银行账号
     */
    delConstructManage(index) {
      this.dataForm.constructManageDetailList.splice(index, 1)
    },
    beforeInit() {
      this.getDataDictByConfigType()
    },
    afterInit() {
      if(this.dataForm.categoryId) this.changeCategory(this.dataForm.categoryId);
    },
    /**
     * 获取表单数据
     */
    getDataForm() {
      const dataForm = JSON.parse(JSON.stringify(this.dataForm));
      return dataForm;
    },
    /**
     * 表单校验
     */
    validateForm() {
      const _this = this;
      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          if (valid) {
            if(_this.dataForm.categoryId == '1'){
              if(_this.dataForm.constructManageDetailList.length <= 0) {
                FUI.Window.showMsg('项目分类为施工类，必须维护执行经理');
                return resolve(false)
              } else {
                const index = _this.dataForm.constructManageDetailList.findIndex((res)=>{return res.post == 10})
                if(index == -1 ){
                  FUI.Window.showMsg('项目分类为施工类，必须维护执行经理');
                  return resolve(false)
                } else {
                  const {nameId,phone} = _this.dataForm.constructManageDetailList[index]
                  if(!nameId,!phone) {
                    FUI.Window.showMsg('执行经理岗位，所有数据项都需补充完整！')
                    return resolve(false)
                  }
                }
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
     * 初始化字典
     */
    async getDataDictByConfigType() {
      const res = await getDataDictByConfigType({ params: { configTypes: '项目分类,岗位,是或否,项目计税方式,项目状态' }})
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '项目分类':
              this.categoryOptions = ele.dataDict;
              break;
            case '岗位':
              this.postOptions = ele.dataDict;
              break;
            case '是或否':
              this.radioOptions = ele.dataDict;
              break;
            case '项目计税方式':
              this.projectTaxMethodOptions = ele.dataDict;
              break;
            case '项目状态':
              this.projectStatusOptions = ele.dataDict;
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
</style>
