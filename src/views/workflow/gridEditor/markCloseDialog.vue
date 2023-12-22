<template>
  <div class="test">
    <el-form label-width="120px" ref="formRef" :model="data" :rules="formRules">
      <div class="projectInfo">
        <div  class="formData">
          <h4>请填写关闭原因</h4>
          <el-row v-if="type != 6 && type != 5 && type != 3 && type != 2">
            <el-col>
                <el-form-item label="关闭原因" prop="closeReason" label-width="120px">
                  <el-select v-model="data.closeReason" 
                  @change="selectChange($event)"
                  placeholder="请选择" style="width:100%">
                    <el-option
                      v-for="item in options"
                      :key="item.configValue"
                      :label="item.configName"
                      :value="item.configValue"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
             
              <el-form-item
                v-if="type != 6 && type != 5 && type != 3 && type != 2 && data.closeReason == 99"
                label-width="120px"
                prop="closeMemo"
              >
                <el-input
                  type="textarea"
                  v-model="data.closeMemo"
                  style="width: 100%"
                  minRows="3"
                  clearable
                  :rows="4"
                  minlength='4'
                  placeholder='最少4个汉字'
                  name="closeCause"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="dialogfooter">
        <el-button size="small" type="primary" @click="submitForm()"
          ><i class="fa fa-save" />确认
        </el-button>
        <el-button id="btn_cancel" size="small" @click="closeEdit"
          ><i class="fa fa-minus-circle" />取消
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getDataDictByConfigType } from '@/Api/dataDict.js';
import { closeOperateApi } from '@/Api/dialogApi/marketProject';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';

const requiredArray = ['closeReason', 'closeMemo'];

export default {
  data() {
    return {
      type: '', // 6 5 3 2开启  其余关闭 
      data: {
        type: "",
        id: "",
        closeMemo: "",  //关闭备注
        requiredType: "",
        closeReason:'',  //关闭原因
      },
     formRules: RuleRequired.dataRule(requiredArray),
      // formRules: {
      //   closeReason: [
      //     {
      //       required: true,
      //       message: "请输入关闭原因",
      //       trigger: "blur",
      //     },
      //   ],
      // },
      options: [],
    };
  },
  mounted() {
    let parms = decodeURI(this.$route.query.parms);
    this.obj = JSON.parse(parms);
    this.data.requiredType = this.obj.requiredType
      ? this.obj.requiredType
      : "get";
    this.data.url = this.obj.url;
    this.data.type = this.obj.type;
    this.type = this.obj.type;
    this.data.id = this.obj.id;
    //that.data.closeCause = that.obj.closeCause;
  },
  created() {
    //备注默认不必填，只有选择了关闭原因选择了其他才必填
    this.formRules['closeMemo'] = RuleRequired.curFiledRule(false);
    this.getDataDictByConfigTypeData();
  },
  methods: {
    async getDataDictByConfigTypeData() { 
      const configTypes = '项目关闭原因';
      let { data, success } = await getDataDictByConfigType({ params: { configTypes: configTypes } });
      if (success) {
        if (data.length > 0) { 
          this.options = data.find(item => item.dataDictType === '项目关闭原因')?.dataDict || [];
        } 
      }
    },
    //关闭弹窗
    closeEdit() {
      FUI.Window.closeEdit();
    },
    //提交
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          _this.closeOperateData();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async closeOperateData() { 
      const { closeReason, closeMemo } = this.data;
      const requiredData = {
        id: this.data.id,
        closeReason, //关闭原因
        closeMemo //关闭备注
      }
      const { code,msg } = await closeOperateApi(requiredData);
      if (code === 200) {
        FUI.Window.showMsg2("关闭成功");
        setTimeout(() => {
          FUI.Window.closeEdit(true);
        }, 1000)
      } else { 
        FUI.Window.showMsg2(msg);
      }
    },
    selectChange(item) {
      if (item === '99') {
        this.formRules['closeMemo'] = [
          ...RuleRequired.curFiledRule(true),
          ...RuleRequired.curCustomRule(true, function (rule, value, callbacak) {
            const reg = /[\u4E00-\u9FA5]/g;
            let chinaLen = 0;
            if (value.match(reg)) { 
              chinaLen = value.match(reg).length;  //中文的个数 汉字的个数
            }
            if (chinaLen >= 4) {
              callbacak();
            } else {
              callbacak(new Error('至少输入4个汉字'));
            }
          }, 'blur')
        ]
      } else { 
        this.formRules['closeMemo'] = RuleRequired.curFiledRule(false);
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.dialogfooter {
  position: absolute;
  left: 5%;
  height: 30px;
  width: 90%;
  text-align: center;
  padding: 0;
  display: flex;
  justify-content: flex-end;
  bottom: 20px;
}
.test {
  .layui-layer-btn {
    display: none !important;
  }

  .title {
    vertical-align: middle;
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #0099ff;
    border-bottom: 1px solid #f3f3f3;
    padding-bottom: 5px;
  }

  .title::before {
    content: "";
    display: inline-block;
    width: 4px;
    height: 20px;
    margin-right: 5px;
    background-color: #0099ff;
  }

  .projectInfo {
    margin-bottom: 10px;
    padding: 5px;
    background-color: #fff;

    .formData {
      width: 90%;
      font-size: 15px;
      line-height: 26px;
     
      padding: 5px 0;
      h4 {
        font-size: 14px;
        line-height: 40px;
        color: #333;
        text-align: center;
        margin-bottom: 5px;
      }
    }
  }

  .footer {
    background-color: #fff;
    padding: 5px;
  }
}
</style>