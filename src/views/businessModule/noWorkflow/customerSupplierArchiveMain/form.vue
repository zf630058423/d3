<template>
  <!-- 客商档案表单 -->
  <div v-loading="loading" class="flow-form">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      :disabled="isReadOnly"
      label-width="140px"
    >
      <row-layout title="基本信息" :cols="3">
        <el-form-item slot="col_1" label="客商编号：">
          <el-input v-model="dataForm.code" size="small" placeholder="自动填写" disabled/>
        </el-form-item>
        <el-form-item slot="col_2" prop="customerName" label="客商名称：">
          <el-input v-model="dataForm.customerName" size="small" placeholder="请输入" @blur="vaildOnlyCustomerName"/>
        </el-form-item>
        <el-form-item slot="col_3" prop="customerProperty" label="客商性质：">
          <el-select v-model="dataForm.customerProperty" placeholder="请选择" size="small" style="width: 100%">
            <el-option v-for="(item,index) in customerPropertyList" :key="index" :label="item.configName" :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-2">
        <el-form-item slot="col_1" prop="taxRegistrationNum" label="统一社会信用代码：">
          <el-input v-model="dataForm.taxRegistrationNum" size="small" placeholder="请输入" />
        </el-form-item>
        <el-form-item slot="col_2" prop="customerCategoryId" label="客商类别：">
          <el-checkbox-group v-model="dataForm.customerCategoryId" id="exception">
            <el-checkbox v-for="(item,index) in customerCategoryNameList" :key="index" :label="item.configValue">{{item.configName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="customerLevelName" label="客商级别：">
          <el-select v-model="dataForm.customerLevelId" placeholder="请选择" size="small" style="width: 100%">
            <el-option v-for="(item,index) in customerLevelNameList" :key="index" :label="item.configName" :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_2" label="联系人：">
          <el-input v-model="dataForm.contactPerson" size="small" placeholder="请输入" />
        </el-form-item>
        <el-form-item slot="col_3" prop="contactTitle" label="联系人职务：">
          <el-input v-model="dataForm.contactTitle" size="small" placeholder="请输入" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="phone" label="联系人电话：">
          <el-input v-model="dataForm.phone" size="small" placeholder="请输入" />
        </el-form-item>
        <el-form-item slot="col_2" prop="customerStatus" label="客商状态：">
          <el-radio-group v-model="dataForm.customerStatus" @change="changeCustomerStatus">
            <el-radio v-for="(item,index) in customerStatusList" :key="index" :label="item.configValue">{{item.configName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3" prop="enableStatus" label="启用状态：">
          <el-radio-group v-model="dataForm.enableStatus" :disabled="isAble">
            <el-radio v-for="(item,index) in enableStatusList" :key="index" :label="item.configValue">{{item.configName}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-2">
        <el-form-item slot="col_1" prop="addressArea" label="地址：">
          <casc-select code="AddressCascade"  v-model="dataForm.addressArea" ref="area" :defaultValue="dataForm.addressArea"></casc-select>
        </el-form-item>
        <el-form-item slot="col_2" prop="addressDetail" label="详细地址：">
          <el-input v-model="dataForm.addressDetail" size="small" placeholder="请输入" />
        </el-form-item>
      </row-layout>

      <row-layout title="开票信息" :cols="3">
        <el-form-item slot="col_1" label="开票企业地址：">
          <el-input v-model="dataForm.billAddress" size="small" placeholder="请输入" />
        </el-form-item>
        <el-form-item slot="col_2" label="开票电话号码：">
          <el-input v-model="dataForm.billTel" size="small" placeholder="请输入" />
        </el-form-item>
        <el-form-item slot="col_3" label="开票银行账号：">
          <el-input v-model="dataForm.billBankAccountNo" size="small" placeholder="请输入" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1"  label="开票开户银行：">
          <el-input v-model="dataForm.issuingBank" size="small" placeholder="请输入" />
        </el-form-item>
      </row-layout>

      <form-title :title="'银行信息'"></form-title>
      <div>
        <el-button type="primary" size="small" @click="addBaseBank">新增</el-button>
      </div>
      <el-table :data="dataForm.customerSupplierArchiveBankDetailList" class="f2bpmui-datagrid-vuetable" border>
        <el-table-column label="序号" type="index">
        </el-table-column>
        <el-table-column label="银行账号">
          <template slot-scope="scope">
            <el-input v-model="scope.row.account" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="账户名称">
          <template slot-scope="scope">
            <el-input v-model="scope.row.accountName" size="small" placeholder="请输入" />
          </template>
        </el-table-column>
        <el-table-column label="开户银行">
          <template slot-scope="scope">
            <select-dialog :model-data="baseBank" :value="scope.row.bankName" dynamic-model="customDialog" @updateValue="updateBaseBankValue($event,scope.$index)"></select-dialog>
          </template>
        </el-table-column>
        <el-table-column label="币种">
          <template slot-scope="scope">
            <el-select v-model="scope.row.currencyTypeId" placeholder="请选择" disabled>
              <el-option v-for="(item,index) in currencyOptions" :key="index" :value="item.configValue" :label="item.configName">
                {{ item.configName }} {{ item.configValue }}
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="text" @click="delCustomerBank(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="CreateName" label="编制人：">
          <span>{{dataForm.createUserName}}</span>
        </el-form-item>
        <el-form-item slot="col_2" prop="CreateDept" label="编制部门：">
          <span>{{dataForm.deptName}}</span>
        </el-form-item>
        <el-form-item slot="col_3" prop="CreateTime" label="编制时间：">
          <span>{{dataForm.createTime}}</span>
        </el-form-item>
      </row-layout>
    </el-form>
  </div>
</template>

<script>
  import FormTitle from '@/components/basic/formTitle/index.vue';
  import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
  import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
  import NumberInput from '@/components/basic/numberInput/index.vue';
  import CascSelect from '@/components/basic/cascSelect/index.vue';
  import UploaderFile from '@/components/basic/uploaderFile/index.vue'
  import { getDataDictByConfigType } from '@/Api/dataDict.js'
  import {getSerialNumber} from '@/Api/workflowBusssion/index.js'
  import { saveForm, updateForm,getForm,checkCustomerName } from '@/Api/customerSupplierList/index.js';
  import moment from 'moment'
  import comMixin from '../minix';
  export default {
    components: { FormTitle, RowLayout, SelectDialog, NumberInput, CascSelect, UploaderFile },
    data() {
      return {
        dialogModel: {
          singleSelect: true,
          resultFieldKey: "",
          data:[]
        },
        biddingFormDialog: {
          code: 'BPM_BiddingForm_4793',
          parm: {
            data: [],
            isMulti:true
          }
        },
        baseBank: { code: 'bank_branch', customDialog: 'bank_branch', isSetHead: 1, isMulti: false, initailData: [] },
        rowObject: {
        },
        fileList: [],
        currencyOptions: [], // 币种
        customerPropertyList: [], // 客商性质
        customerCategoryNameList: [], // 客商类别
        customerLevelNameList: [], // 客商级别
        customerStatusList: [], // 客商状态
        enableStatusList: [], // 启用状态
        numVal:'100',
        loading: false,
        formVisible: false,
        dialogVisible: false,
        isAble: false,
        isReadOnly: false,
        radioData: [
          { label: 1, name: '是' },
          {label:0,name:'否'}
        ],
        dataForm: {
          addressArea: '',
          billAddress: '',
          billBankAccountNo: '',
          customerLevelName: '',
          customerCategoryId: [],
          billTel: '',
          bindAccountId: '',
          blackListStatus: '',
          businessKey: '',
          code: '',
          contactPerson: '',
          contactTitle: '',
          createTime: '',
          createUserId: '',
          createUserName: '',
          customerIntegration: '',
          customerLevelId: '',
          customerName: '',
          customerProperty: '0',
          customerStatus: '',
          customerSupplierArchiveBankDetailList: [],
          deptId: '',
          deptName: '',
          addressDetail: '',
          enableStatus: '1',
          formId: '',
          id: '',
          isDel: '',
          lastModifyTime: '',
          lastModifyUserId: '',
          issuingBank: '',
          moduleType: '',
          operatingstate: '',
          phone: '',
          procInstState: '',
          remark: '',
          taxRegistrationNum: '',
          wiid: ''
        },
        dataRule: {
          name: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ],
          customerName: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ],
          customerProperty: [
            { required: true, message: '必填项不能为空', trigger: 'change' }
          ],
          taxRegistrationNum: [
            { required: true, message: '必填项不能为空', trigger: 'blur' },
            { required: true, pattern: /^[A-Z0-9]{18}$/, message: '请输入正确格式的统一社会信用代码', trigger: 'blur' }
          ],
        }
      };
    },
    mixins: [comMixin],
    computed: {
    },
    created(){
      let formAction = Object.toQueryString('formAction') || '';
      if(formAction >2){
        this.isReadOnly = true;
      }
      this.beforeInit();
    },
    mounted() {
      this.beforeInit();
    },
    methods: {
      /**
       * 初始化详情
       * @param {*} data
       */
      inits() {
        var that = this;
        let id = Object.toQueryString('rowId') || '';
        if (that.$refs['dataForm']) that.$refs['dataForm'].resetFields();
        if (id) {
          try {
            that.loading = true;
            getForm(id).then(res => {
              if (res.code === 200) {
                that.dataForm = res.data;
              }
            });
            this.loading = false
          } catch (error) {
            this.loading = false
          }
        } else {
          this.initUserInfo();
          this.clearForm()
        }
      },
      /**
       * 初始化用户信息
       */
      initUserInfo() {
        const { orgName, orgId, realName, userId } = FUI.Sys.getAuthor();
        this.dataForm.createUserId = userId;
        this.dataForm.createUserName = decodeURIComponent(realName);
        this.dataForm.deptId = orgId;
        this.dataForm.deptName = decodeURIComponent(orgName);
        this.dataForm.createTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      },
      updateValue(data) {
        this.dataForm.name = data[0].text;
      },
      beforeInit() {
        let formAction = Object.toQueryString('formAction') || '';
        if (formAction > 2) {
          this.isReadOnly = true;
        }else {
          this.isReadOnly = false;
        }
        this.getDataDictByConfigType();
      },
      afterInit() {
        var that = this;
        var type = that.dataForm.customerCategoryId;
        if(type && typeof type == "string"){
          if(type.indexOf(',') !== -1){
            var arr =  type.split(',');
            that.dataForm.customerCategoryId = arr;
          }else{
            that.dataForm.customerCategoryId = [...type];
          }
        }else {
          that.dataForm.customerCategoryId = type?type:[];
        }
      },
      handleChange() { },
      /**
       * 初始化字典
       */
      async getDataDictByConfigType() {
        const res = await getDataDictByConfigType({ params: { configTypes: '客商性质,客商类别,客商级别,客户状态,启用状态,币种' }});
        if (res.success) {
          res.data.forEach(ele => {
            switch (ele.dataDictType) {
              case '客商性质':
                this.customerPropertyList = ele.dataDict;
                break;
              case '客商类别':
                this.customerCategoryNameList = ele.dataDict;
                break;
              case '客商级别':
                this.customerLevelNameList = ele.dataDict;
                break;
              case '客户状态':
                this.customerStatusList = ele.dataDict;
                break;
              case '启用状态':
                this.enableStatusList = ele.dataDict;
                break;
              case '币种':
                this.currencyOptions = ele.dataDict;
                break;
              default:
                break;
            }
          });
        }
      },
      /**
       * 获取单据编号
       */
      getSerialNumber() {
        var that = this;
        var code = 'BPM_SupplierFiles';
        getSerialNumber({
          counterCode: code
        }).then(res => {
          if (res.success) {
            that.dataForm.code = res.msg;
          }
        })
      },
      /**
       * 添加银行账号
       */
      addBaseBank() {
        if (!this.dataForm.customerSupplierArchiveBankDetailList) this.dataForm.customerSupplierArchiveBankDetailList = []
        this.dataForm.customerSupplierArchiveBankDetailList.push({
          accountId: '',
          accountName: '',
          bankId: '',
          bankName: '',
          currencyTypeId: 'CNY',
          account: '',
          bankType: ''
        })
      },
      /**
       * 删除银行账号
       */
      delCustomerBank(index) {
        this.dataForm.customerSupplierArchiveBankDetailList.splice(index, 1)
      },
      /**
       * 银行类别
       */
      updateBaseBankValue(data, index) {
        this.$set(this.dataForm.customerSupplierArchiveBankDetailList[index], 'bankId', data[0].id)
        this.$set(this.dataForm.customerSupplierArchiveBankDetailList[index], 'bankName', data[0].name)
      },
      /**
       *表单校验
       */
      validateForm() {
        const _this = this;
        var arr = _this.$refs.area.getResult();
        _this.dataForm.addressArea = arr.value;
        let parm = Object.toClone(_this.dataForm);
        if(typeof parm.customerCategoryId == 'object'){
          parm.customerCategoryId = (parm.customerCategoryId).join();
        }
        if(_this.vaildTableList() === false){
          return false
        }
        return new Promise(resolve => {
          _this.$refs['dataForm'].validate(valid => {
            if (valid) {
              return resolve(parm);
            } else {
              return resolve(false)
            }
          })
        });
      },
      /**
       * 客商状态
       * */
      changeCustomerStatus(){
        let that = this;
        let val = that.dataForm.customerStatus;
        if(val == 3){
          that.dataForm.enableStatus = '0';
          that.isAble = true;
        }else {
          that.isAble = false;
        }
        that.$forceUpdate();
      },
      /**
       * 校验子表信息完整
       * */
      vaildTableList(){
        //提交时前置事件  务必要有返回值true/false; 返回false：校验不通过， 返回true校验通过继续执行
        // 判断table内输入框必填
        var arr = this.dataForm.customerSupplierArchiveBankDetailList;
        if (arr && arr.length > 0) {
          for (var j = 0; j < arr.length; j++) {
            if (arr[j]) {
              var accountName = arr[j].accountName;
              var bankName = arr[j].bankName;
              var account =arr[j].account;

              if (accountName && bankName && account) {
                return true;
              } else {
                FUI.Window.showMsg2( '银行信息中，所有表格行都需补充完整！');
                return false
              }
            }
          }

        }
      },
      clearForm(){
        this.$refs['dataForm'].resetFields();
        this.dataForm.customerSupplierArchiveBankDetailList = [];
      },
      // 客商名称校验唯一性
      async vaildOnlyCustomerName(){
        var that = this;
        var parms = {
          "customerName": that.dataForm.customerName,
          "id": that.dataForm.id,
        };
        const res = await checkCustomerName(parms);
        if(res.code === 500){
          return false
        }
      }
    }
  };
</script>

<style scoped lang="scss">

  .commponent-height{
    height: 32px;
    line-height: 32px;
  }

  ::v-deep .designPrice {
    .el-input-group__append {
      padding: 0 12px;
    }
  }

</style>
