<template>
  <!-- 项目介绍人登记 -->
  <div v-loading="loading" class="flow-form">
    <el-form ref="form" :model="dataForm" :rules="dataRule" :disabled="setting.readonly" label-width="140px">
      <row-layout :title="'基本信息'" :cols="3">
        <el-form-item slot="col_1" prop="marketUnitId" label="业务单元：">
          <el-input v-if="isRevise" v-model="dataForm.marketUnitName" size="small" placeholder="自动填写" disabled/>
          <select-dialog v-else :disabled="true" :width="800" :model-data="marketUnitConfig" :height="360" :value="dataForm.marketUnitName" @updateValue="handelMarketUnitName" dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_2" prop="projectIntroducerStatus" label="项目介绍人状态：">
          <el-select v-model="dataForm.projectIntroducerStatus" placeholder="请选择" size="small" style="width: 100%" :disabled="!isRevise"  @change="changeValue($event)">
            <el-option v-for="(item,index) in projectIntroducerStatusOptions" :key="index" :label="item.configName" :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_3" label="单据编号：">
          <el-input v-model="dataForm.code" size="small" placeholder="自动填写" disabled/>
        </el-form-item>
      </row-layout>

      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="personName" label="姓名：">
          <el-input v-model="dataForm.personName" size="small" placeholder="请输入" />
        </el-form-item>
        <el-form-item slot="col_2" label="工号：" v-show="false">
          <el-input v-model="dataForm.personNo" size="small" placeholder="自动生成" disabled />
        </el-form-item>
        <el-form-item slot="col_2" prop="sex" label="性别：">
          <el-radio-group v-model="dataForm.sex">
            <el-radio v-for="(item,index) in sexOptions" :label="item.configValue" :key="index">{{item.configName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_3" prop="projectIntroducerLevel" label="项目介绍人级别：">
          <el-select v-model="dataForm.projectIntroducerLevel" placeholder="请选择" size="small" style="width: 100%" :disabled="!isRevise">
            <el-option v-for="(item,index) in projectIntroducerLevelOptions" :key="index" :label="item.configName" :value="item.configValue">
            </el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-1-1">
      <el-form-item slot="col_1" prop="documentType" label="证件类型：">
        <el-select v-model="dataForm.documentType" placeholder="请选择" size="small" style="width: 100%" @change="changeDocummentType">
          <el-option v-for="(item,index) in documentTypeOptions" :key="index" :label="item.configName" :value="item.configValue">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item slot="col_2" prop="idNumber" label="证件号码：">
        <el-input v-model="dataForm.idNumber" size="small" placeholder="请输入" />
      </el-form-item>
        <div slot="col_3">
          <el-link href="http://zxgk.court.gov.cn/shixin/" type="primary" target="_blank" class="mr15" :underline="false" icon="el-icon-link">失信被执行人查询</el-link>
          <el-link href="http://zxgk.court.gov.cn/xgl/" type="primary" target="_blank" :underline="false" icon="el-icon-link">限制消费查询</el-link>
        </div>
    </row-layout>
      <row-layout :cols="3" >
        <el-form-item slot="col_1" prop="telephoneOne" label="联系电话一：">
          <number-input v-model="dataForm.telephoneOne" size="small" placeholder="请输入" />
        </el-form-item>
        <el-form-item slot="col_2" label="联系电话二：">
          <number-input v-model="dataForm.telephoneTwo" size="small" placeholder="请输入" />
        </el-form-item>
        <el-form-item slot="col_3" prop="isScanningCopy" label="证件扫描件(有/无)：">
          <el-radio-group v-model="dataForm.isScanningCopy">
            <el-radio v-for="(item,index) in isScanningCopyOptions" :key="index" :label="item.configValue">{{item.configName}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" >
        <el-form-item slot="col_1" prop="fixedCity" label="固定所属城市：">
          <el-input  v-if="isRevise" v-model="dataForm.fixedCity" size="small" placeholder="请输入"  disabled/>
          <casc-select v-else code="AddressCascade"  v-model="dataForm.fixedCity" ref="area" :defaultValue="dataForm.fixedCity" @change-select="selectArea"></casc-select>
        </el-form-item>

        <el-form-item slot="col_2" prop="exceptionLimitType" label="异常限制类型：">
          <el-checkbox-group v-model="dataForm.exceptionLimitType" :disabled="isAble || !isRevise" id="exception">
            <el-checkbox v-for="(item,index) in exceptionLimitTypeOptions" :key="index" :label="item.configValue" :disabled="dataForm.projectIntroducerStatus == '1'?true:dataForm.projectIntroducerStatus !== '1'?item.configValue == '0':item.configValue != '0' ">{{item.configName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" label="项目介绍人实际住址：">
          <el-input v-model="dataForm.actualAddress" size="small" placeholder="请输入" style="width: 95.5%;" :disabled="isRevise" maxlength="250"/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" >
        <el-form-item slot="col_1" label="备注：">
          <el-input type="textarea" style="width: 95.5%;" :rows="5" placeholder="请输入" v-model="dataForm.remark" size="small" :disabled="isRevise" maxlength="250">
          </el-input>
        </el-form-item>
      </row-layout>
      <row-layout :offset="1" :title="'附件'" :cols="1">
        <el-form-item slot="col_1" prop="fileInfo" label="附件文件：">
          <uploaderFiles v-model="dataForm.fileInfo" :isReadOnly="isRevise" :revise="isRevise"></uploaderFiles>
          <p class="el-upload__prompt">{{setPromptText}}</p>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="编制人：">
          <span>{{dataForm.createUserName}}</span>
        </el-form-item>
        <el-form-item slot="col_2" label="编制人部门：">
         <span>{{dataForm.deptName}}</span>
        </el-form-item>
        <el-form-item slot="col_3" label="编制时间：">
          <span>{{dataForm.createTime}}</span>
        </el-form-item>
      </row-layout>
    </el-form>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <p>项目介绍人状态修改，需填写修改原因。</p>
      <div>
        <label style="size: 15px;font-weight: normal"><span style="color: #ed4014">*</span>介绍人状态修改原因：</label>
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="reasonCont">
        </el-input>
      </div>

      <span slot="footer" class="dialog-footer">
    <el-button @click="closeDialogBtn" size="small">取 消</el-button>
    <el-button type="primary" @click="submitDialogBtn" size="small">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import FormTitle from '@/components/basic/formTitle/index.vue';
  import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
  import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
  import NumberInput from '@/components/basic/numberInput/index.vue';
  import uploaderFiles from '@/components/basic/uploaderFile/index.vue';
  import CascSelect from '@/components/basic/cascSelect/index.vue';
  import { getDataDictByConfigType } from '@/Api/dataDict.js'
  import {getSerialNumber,getFormInfo} from '@/Api/workflowBusssion/index.js'
  import comMixin from '../minix';

  export default {
    components: { FormTitle, RowLayout, SelectDialog,NumberInput,uploaderFiles,CascSelect },
    mixins: [comMixin],
    data() {
      return {
        dialogModel: {
          singleSelect: true,
          resultFieldKey: "",
          data:[]
        },
        rowObject: {},
        numVal:'100',
        loading: false,
        formVisible: false,
        dialogVisible: false,
        isAble: true,
        isRevise: false,
        reasonCont:'', //修改状态的原因
        marketUnitConfig: {code: 'YeWuDanYuan', customDialog: 'YeWuDanYuan', isSetHead: 1, isMulti: false, initailData: []},
        projectIntroducerStatusOptions:[], //项目介绍人状态options
        sexOptions:[], // 性别options
        isScanningCopyOptions:[], // 证件扫描件（有无）options
        documentTypeOptions:[], // 证件类型options
        exceptionLimitTypeOptions:[], // 异常限制类型options
        projectIntroducerLevelOptions:[], //项目介绍人级别options
        dataForm: {
          marketUnitId:'', // 业务单元id
          marketUnitName:'', // 业务单元
          projectIntroducerStatus:'', // 项目介绍人状态
          personName:'', // 姓名
          personNo:'', // 工号
          remark:'', //	备注
          code:'', // 单据编号
          projectIntroducerLevel:'', // 项目介绍人级别
          sex:'', //	性别
          telephoneOne:'', //	联系电话一
          telephoneTwo:'', // 联系电话二
          isScanningCopy:'', // 证件扫描件（有无）
          idNumber:'', // 	证件号码
          actualAddress:'', // 项目介绍人实际住址
          documentType:'', // 	证件类型
          exceptionLimitType:[], // 		异常限制类型
          fixedCity:'', // 		固定所属城市
          fixedCityId:'', // 		固定所属城市ID
          wiid:'',  // 流程实例ID
          id:'', // 主键id
          fileInfo:[], // 附件
          createUserName:'',
          deptName:'',
          deptId:'',
          createTime:'',
          createUserId:'',
        },
        setPromptText:'提示：请上传项目介绍人身份证正反面扫描件（必传）、资产证明文件', // 附件提示信息
        dataRule: {
          marketUnitId: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ],
          projectIntroducerStatus: [
            { required: true, message: '必填项不能为空', trigger: 'change' }
          ],
          personName: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ],
          sex: [
            { required: true, message: '必填项不能为空', trigger: 'change' }
          ],
          documentType: [
            { required: true, message: '必填项不能为空', trigger: 'change' }
          ],
          idNumber: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ],
          isScanningCopy: [
            { required: true, message: '必填项不能为空', trigger: 'change' }
          ],
          exceptionLimitType: [
            { required: true, message: '必填项不能为空', trigger: 'change' }
          ],
          projectIntroducerLevel: [
            { required: true, message: '必填项不能为空', trigger: 'change' }
          ],
          fixedCity: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ],
          fileInfo: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ],
          telephoneOne: [
            { required: true, message: '必填项不能为空', trigger: 'blur' }
          ],
        }
      };
    },
    computed: {
    },
    created(){
      var state = Object.toQueryString('isRevise');
      if(state) {
        this.isRevise = true;
      }

    },
    mounted() {
      this.beforeInit();
      this.getJobNumber();
      this.afterInit();
    },
    methods: {
      beforeInit() {
        this.getDataDictByConfigType();
        this.dataForm.projectIntroducerStatus = '1'; // 默认值 '正常'
        this.dataForm.isScanningCopy = '1'; // 默认值 '有'
        this.dataForm.projectIntroducerLevel = '3'; // 默认值 'C'
        this.dataForm.exceptionLimitType = ['0']; // 默认值 '无'
        this.dataForm.documentType = '1'; // 默认值 '无'
        this.changeDocummentType()
      },
      afterInit() {
        var _this = this;
        console.log(_this.dataForm,'1234');
        _this.dataForm.createTime = Object.formatDates(_this.dataForm.createTime);
        var type = this.dataForm.exceptionLimitType; // 异常限制类型
        if(type && typeof type == "string"){
          if(type.indexOf(',') !== -1){
            this.dataForm.exceptionLimitType = type.split(',');
          }else{
            this.dataForm.exceptionLimitType = [...type];
          }
        }else {
          this.dataForm.exceptionLimitType = type;
        }
        _this.changeDocummentType()
      },
      /**
       * 业务单元(要改)
       */
      handelMarketUnitName(data) {
        var that = this;
        console.log(data,'111');
        if (data.length > 0) {
          that.dataForm.marketUnitId = data[0].id;
          that.dataForm.marketUnitName = data[0].businessUnit;
          that.$forceUpdate();
        }
      },
      /**
       * 初始化字典
       */
      async getDataDictByConfigType() {
        const res = await getDataDictByConfigType({ params: { configTypes: '证件类型,项目介绍人状态,人员性别,有无证件扫描件,异常限制类型,项目介绍人级别' }});
        if (res.success) {
          res.data.forEach(ele => {
            switch (ele.dataDictType) {
              case '证件类型':
                this.documentTypeOptions = ele.dataDict;
                break;
              case '项目介绍人状态':
                this.projectIntroducerStatusOptions = ele.dataDict;
                break;
              case '人员性别':
                this.sexOptions = ele.dataDict;
                break;
              case '有无证件扫描件':
                this.isScanningCopyOptions = ele.dataDict;
                break;
              case '异常限制类型':
                this.exceptionLimitTypeOptions = ele.dataDict;
                break;
              case '项目介绍人级别':
                this.projectIntroducerLevelOptions = ele.dataDict;
                break;
              default:
                break;
            }
          });
        }
      },
      /**
       * 获取工号
       */
      getJobNumber() {
        var that = this;
        var code = 'market_manager_jobNo';
        getSerialNumber({
          counterCode: code
        }).then(res => {
          if (res.success) {
            that.dataForm.personNo = res.msg;
          }
        })
      },
      /**
       * 获取表单数据
       */
      getDataForm() {
        var _this = this;
        if(!this.isRevise){
          var arr = _this.$refs.area.getResult();
          _this.dataForm.fixedCity = arr.value;
          _this.dataForm.fixedCityId = arr.id;
        }
        this.setSexValue();
        const dataForm = JSON.parse(JSON.stringify(this.dataForm));

        dataForm.exceptionLimitType = (dataForm.exceptionLimitType).join();
        return dataForm;
      },
      /**
       *表单校验
       */
      validateForm() {
        const _this = this;
        if(WFContext.WorkflowInstinceState < 2){
          if(!this.isRevise){
            var arr = _this.$refs.area.getResult();
            _this.dataForm.fixedCity = arr.value;
            _this.dataForm.fixedCityId = arr.id;
          }
          var fileList = _this.dataForm.fileInfo;
          if(fileList.length === 0){
            FUI.Window.showMsg('请上传项目介绍人身份证正反面扫描件');
          }
        }
        this.setSexValue();
        let parm = Object.toClone(_this.dataForm);
        parm.exceptionLimitType = (parm.exceptionLimitType).join();

        return new Promise(resolve => {
          _this.$refs['form'].validate(valid => {
            if (valid) {
              return resolve(parm);
            } else {
              return resolve(false)
            }
          })
        });
      },
      selectArea(data){
        console.log(data,'1111111')
      },
      initDataForm(data){
        console.log(data,'1111111111111111111111111')
      },
      changeValue(value){
        if(value == 2 || value == 3){
          this.isAble = false;
          this.dataForm.exceptionLimitType = ['1','2','3'];
        }else if(value == 1){
          this.dataForm.exceptionLimitType = ['0'];
        }
        this.dialogVisible = true;
        this.reasonCont = '';
      },
      // 关闭model
      closeDialogBtn(){
        this.dialogVisible = false;
        this.reasonCont = '';
      },
      // 提交model
      submitDialogBtn(){
        this.dialogVisible = false;
        this.dataForm.reviseRemark = this.reasonCont;
      },
      // 证件类型
      changeDocummentType(){
        var that = this;
        var type = this.dataForm.documentType;
        that.dataRule.idNumber=[{ required: true, message: '必填项不能为空', trigger: 'blur' }];
        var regIdCard = '';
        if(type == 1){
          regIdCard = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
        }else if(type == 4){
          regIdCard = /^((\s?[A-Za-z])|([A-Za-z]{2}))\d{6}((\([0−9aA]\))|(\([0-9aA]\)))$/;
        }else if(type == 5){
          regIdCard = /^[1|5|7][0-9]{6}\([0-9Aa]\)/;
        }else if(type == 6){
          regIdCard = /^[A-KM-QT-XZ]{1}[0-9]{9}$/;
        }else {
          regIdCard = ''
        }
        if(regIdCard){
          that.dataRule.idNumber.push(
            {required: true, pattern: regIdCard, message: '请输入正确格式的身份证号', trigger: 'blur'}
          )
        }else{
          that.dataRule.idNumber=[{ required: true, message: '必填项不能为空', trigger: 'blur' }];
        }

      },
      //设置性别
      setSexValue(){
        var type = this.dataForm.documentType;
        var idCard = this.dataForm.idNumber;
        if(type && idCard){
          if(idCard.length === 18){
            var num = idCard.slice(16,17);// 取17位
            if(num && num % 2 == 0){
              this.dataForm.sex = '1'
            }else{
              this.dataForm.sex = '2'
            }
          }
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
  .el-upload__prompt{
    color: #F56C6C;
    font-size: 14px;
    font-weight: normal;
    line-height: 25px;
  }
  .link-box{
    color: #409EFF;
    font-weight: normal;
    padding: 0 15px;
  }
</style>
