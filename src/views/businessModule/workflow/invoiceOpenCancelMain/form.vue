<template>
  <!-- 开票作废申请 -->
  <div class="flow-form">
    <el-form :model="dataForm" ref="dataForm" label-suffix="：" :rules="dataRule" label-width="120px">
       <row-layout :cols="2" cell="1-1">
         <el-form-item label="单据编号" slot="col_1" prop="code">
          <el-input v-model="dataForm.code" :disabled="getDisabledField('code')" :placeholder="msgTip.ENTER_PLACEHOLDER"></el-input>
        </el-form-item>
        <el-form-item label="作废原因" slot="col_2" prop="cancelRemark">
          <text-input v-model="dataForm.cancelRemark" :disabled="getDisabledField('cancelRemark')" :placeholder="msgTip.ENTER_PLACEHOLDER"></text-input>
        </el-form-item>
       </row-layout>
       <row-layout :cols="2" cell="1-1">
         <el-form-item label="对接状态" slot="col_1" prop="dockingStatus">
          <el-select v-model="dataForm.dockingStatus" :disabled="getDisabledField('dockingStatus')">
             <el-option :label="dItem.configName" :value="dItem.configValue" :key="dItem.configValue" v-for="dItem in dockingStatusArray"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="对接备注" slot="col_2" prop="dockingRemark">
          <text-input v-model="dataForm.dockingRemark" :disabled="getDisabledField('dockingRemark')" :placeholder="msgTip.ENTER_PLACEHOLDER"></text-input>
        </el-form-item>
       </row-layout>
       <row-layout :cols="3" cell="3">
        <el-form-item label="发票调整内容" slot="col_1" prop="adjustingContent">
           <text-input type="textarea" v-model="dataForm.adjustingContent" rows="5" :disabled="getDisabledField('adjustingContent')"></text-input>
        </el-form-item>
      </row-layout>
      <row-layout title="作废申请" :cols="3" cell="3">
         <el-form-item slot="col_1" label-width="0" prop="detailList">
           <detail-list v-model="dataForm.detailList" :id="dataForm.id" :readOnly="setting.readonly" :ppData="ppData" ref="subFromData"></detail-list>
         </el-form-item>
      </row-layout>
      <form-title :title="'附件'"></form-title>
      <row-layout :cols="1">
        <el-form-item slot="col_1" label="附件" prop="fileInfoList">
          <update-file v-model="dataForm.fileInfoList" :isReadOnly="fileStatus"></update-file>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="编制人">
          <span>{{ dataForm.createUserName }}</span>
        </el-form-item>
        <el-form-item slot="col_2" label="编制人部门">
          <span>{{ dataForm.deptName }}</span>
        </el-form-item>
        <el-form-item slot="col_3" label="编制时间">
          <span>{{ dataForm.createTime }}</span>
        </el-form-item>
      </row-layout>
    </el-form>
  </div>
</template>

<script>
import comMixin from '../minix';
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import TextInput from '@/components/basic/elInput/textInput.vue'; //清除空格组件
import DetailList from './components/detail-list.vue';
import FormTitle from '@/components/basic/formTitle/index.vue';
import UpdateFile from '@/components/basic/uploaderFile/index.vue';
import { getDataDictByConfigType } from '@/Api/dataDict.js';

// 发票作废申请
export default {
  name: '',
  mixins:[comMixin],
  components: {
    FormTitle,
    RowLayout,
    TextInput,
    DetailList,
    UpdateFile
  },
  data() { 
    return {
      setting: {
        readonly:false
      },
      msgTip: RuleRequired.tipMsg,
      dataForm: {
        id:'',
        code: '',  //单据编号
        cancelRemark: '',  //作废原因
        dockingStatus: '1',  //对接状态
        dockingRemark:'',  //对接备注
        adjustingContent: '',  //发票调整内容
        detailList: [],  //作废明细
        fileInfoList:[],
        createUserName: '',  //编制人
        deptName: '',  //编制人部门
        createTime: '',  //编制时间
        projectManagerId:'', //项目负责人id
        contractInMainCode:'',  //收入合同编号
        constructionUnitId:'',  //管理部门id
        constructArchiveMainCode:'', //项目编号
      },
      fileStatus:false,
      dockingStatusArray:[],
      ppData:[],
      dataRule: {},
      disabledFiled: {
        'code':true
      },
      dataRule: RuleRequired.dataRule(['cancelRemark']),  //必填字段 作废原因
    }
  },
  computed: {
    getDisabledField() {
      return (field) => {
        return this.disabledFiled[field] ? this.disabledFiled[field] : false;
      }
    },
  },
  mounted() { 
    
  },
  methods: {
    //获取详情的 前置事件
    beforeInit() { 
      if (this.setting.readonly) { 
        Object.keys(this.dataForm).forEach(key => { 
          this.disabledFiled[key] = true;
          this.fileStatus = true;
        })
      }
      this.getDictByConfigType();
    },
    afterInit() {
      
    },
    async getDictByConfigType() { 
      const {data, success} = await getDataDictByConfigType({ params: { configTypes: '对接状态' } });
      if (success) { 
        this.dockingStatusArray = data.find(item => item.dataDictType === '对接状态')?.dataDict || '';
      }
    },
    //暂存
    getDataForm() {
      const subFromData = this.$refs['subFromData'].validateForm();
      this.getMainIdInfo(subFromData);
      this.dataForm.detailList = this.getDetailList(subFromData);
      return this.dataForm;
     },
    //提交和审批
    async validateForm() {
      const _this = this;
      const subFromData = await _this.$refs['subFromData'].validateForm();
      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          if (valid && subFromData) {
            _this.getMainIdInfo(subFromData);
            _this.dataForm.detailList = _this.getDetailList(subFromData);
            return resolve(_this.dataForm);
          } else {
            return resolve(false)
          }
        })
      });
    },
    getMainIdInfo(arr) { 
      if (arr.length > 0) { 
        this.dataForm.projectManagerId = arr[0].projectManagerId; //项目负责人id
        this.dataForm.contractInMainCode = arr[0].contractInMainCode;  //收入合同编号
        this.dataForm.constructArchiveMainCode = arr[0].constructArchiveMainCode; //项目编号
        this.dataForm.constructionUnitId = arr[0].constructionUnitId; //管理部门id
      }
    },
    getDetailList(arr) { 
      return arr && arr.length > 0 ? arr.map(item => ({
        id: this.dataForm.id ? item.id : '',
        invoiceNo: item.invoiceNo || '',  //发票号码
        invoiceCode: item.invoiceCode || '',  //发票代码
        invoiceOpenMainId:item.invoiceOpenMainId || '',  //开票主表id
        invoiceCreateTime: item.invoiceCreateTime || '',   //开票日期
        isReInvoice: item.isReInvoice || '',  //是否重开	
        constructArchiveMainCode: item.constructArchiveMainCode || '',  //项目编号
        constructArchiveMainName: item.constructArchiveMainName || '',  //项目名称
        contractInMainCode: item.contractInMainCode || '',  //收入合同编号
        contractInMainName: item.contractInMainName || '',  //收入合同名称
        constructionUnitName: item.constructionUnitName || '',  //管理部门
        dataSource: item.dataSource || '', //数据源	
      })) : []
    },
  }
}
</script>

<style>

</style>