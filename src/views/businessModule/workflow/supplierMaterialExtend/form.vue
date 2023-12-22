<template>
  <!-- 材料供应商 -->
  <div v-loading="loading">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      :disabled="setting.readonly"
      label-width="180px"
      class="new-data-form-css"
    >
      <row-layout :title="'基础信息'" :cols="3">
        <el-form-item slot="col_1" prop="supplierType" label="供应商类型：">
          <el-radio-group v-model="dataForm.supplierType" @change="openDialogVisible">
            <el-radio v-for="(item,index) in supplierTypeOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" prop="name" label="供应商名称：">
          <el-input v-model.trim="dataForm.name" placeholder="请输入" size="small" maxlength="100" />
        </el-form-item>
        <el-form-item slot="col_3" prop="natureOfSupplier" label="供应商性质：">
          <el-radio-group v-model="dataForm.natureOfSupplier">
            <el-radio v-for="(item,index) in natureOfSupplierOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="code" label="供应商编号：">
          <el-input v-model="dataForm.code" disabled size="small" placeholder="自动填写" />
        </el-form-item>
        <el-form-item slot="col_2" prop="registerStartTime" label="注册成立日期：">
          <el-date-picker
            v-model="dataForm.registerStartTime"
            type="date"
            placeholder="请选择"
            size="small"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item slot="col_3" prop="taxRegistrationNum" label="统一社会信用代码：">
          <el-input v-model="dataForm.taxRegistrationNum" size="small" placeholder="请输入" maxlength="18" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="registeredFund" label="注册资金(万元)：">
          <amount-input v-model="dataForm.registeredFund"></amount-input>
        </el-form-item>
        <el-form ref="warehouseForm" :model="dataForm" :rules="dataRule" :disabled="!isRequiredInitialWare" slot="col_2" label-width="180px">
          <el-form-item prop="initialWarehousingRating" label="入库初始评级：">
            <el-radio-group v-model="dataForm.initialWarehousingRating">
              <el-radio v-for="(item,index) in initialWarehousingRatingOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-form-item slot="col_3" label="合作过程评级：">
          <el-radio-group v-model="dataForm.cooperativeProcessRating" :disabled="true">
            <el-radio v-for="(item,index) in cooperativeProcessRatingOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="fiscalSystem" label="税务制度：">
          <el-radio-group v-model="dataForm.fiscalSystem" @change="openDialogVisible">
            <el-radio v-for="(item,index) in fiscalSystemOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item slot="col_2" prop="creditRating" label="纳税信用等级：">
          <el-select v-model="dataForm.creditRating" placeholder="请选择">
            <el-option v-for="(item,index) in creditRatingOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item slot="col_3" prop="contactPerson" label="联系人：">
          <el-input v-model="dataForm.contactPerson" size="small" placeholder="请输入" maxlength="20" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="contactPersonTel" label="联系人电话：">
          <number-input v-model="dataForm.contactPersonTel" :maxlength="11" />
        </el-form-item>
        <el-form-item slot="col_2" prop="contactPersonPost" label="联系人职务：">
          <el-input v-model="dataForm.contactPersonPost" size="small" placeholder="请输入" maxlength="50" />
        </el-form-item>
        <el-form-item slot="col_3" prop="contactPersonIdCard" label="联系人身份证号：">
          <el-input v-model="dataForm.contactPersonIdCard" size="small" placeholder="请输入" maxlength="18" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="contactPersonEmail" label="联系人邮箱：">
          <el-input v-model="dataForm.contactPersonEmail" size="small" placeholder="请输入" maxlength="100" />
        </el-form-item>
        <el-form-item slot="col_2" prop="corporateName" label="法人姓名：">
          <el-input v-model="dataForm.corporateName" size="small" placeholder="请输入" maxlength="20" />
        </el-form-item>
        <el-form-item slot="col_3" label="法人电话：">
          <number-input v-model="dataForm.corporateTel" :maxlength="11" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="legalPersonIdCard" label="法人身份证号：">
          <el-input v-model="dataForm.legalPersonIdCard" size="small" placeholder="请输入" maxlength="18" />
        </el-form-item>
        <el-form-item slot="col_2" prop="address" label="地址：">
          <cascSelect :default-value="dataForm.address" code="AddressCascade" @change-select="changeAddress" />
        </el-form-item>
        <el-form-item slot="col_3" prop="officeAddress" label="办公地址：">
          <el-input v-model="dataForm.officeAddress" size="small" placeholder="请输入" maxlength="200" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="工厂地址：">
          <el-input v-model="dataForm.factoryAddress" size="small" placeholder="请输入" maxlength="20" />
        </el-form-item>
        <el-form-item slot="col_2" prop="areaOfBusinessPremises" :label="dataForm.supplierType==2?'厂房面积(㎡)：':'经营场所面积(㎡)：'">
          <amount-input v-model="dataForm.areaOfBusinessPremises" maxlength="20"></amount-input>
        </el-form-item>
        <el-form-item slot="col_3" label="经营场所属性：">
          <el-select v-model="dataForm.propertyOfBusinessSite" placeholder="请选择">
            <el-option v-for="(item,index) in propertyOfBusinessSiteOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="systemOfOwnership" label="所有制：">
          <el-select v-model="dataForm.systemOfOwnership" placeholder="请选择">
            <el-option v-for="(item,index) in systemOfOwnershipOptions" :key="index" :value="item.configValue" :label="item.configName">
              {{ item.configName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dataForm.supplierType==1" slot="col_2" prop="recommendUnit" label="推荐单位：">
          <el-radio-group v-model="dataForm.recommendUnit">
            <el-radio v-for="(item,index) in recommendUnitOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="dataForm.supplierType==1" slot="col_3" label="推荐人姓名：">
          <el-input v-model="dataForm.nameOfReferrer" size="small" :disabled="dataForm.recommendUnit!='1'" placeholder="请输入" maxlength="200" />
        </el-form-item>
        <el-form-item v-if="dataForm.supplierType==2" slot="col_2" prop="monthlyMaximumOutputValue" label="月度最大产值(万元/月)：">
          <amount-input v-model="dataForm.monthlyMaximumOutputValue"></amount-input>
        </el-form-item>
        <el-form-item v-if="dataForm.supplierType==2" slot="col_3" label="深化设计人员数量：">
          <number-input v-model="dataForm.deepenNumberDesigners" :maxlength="20" />
        </el-form-item>
      </row-layout>
      <row-layout v-if="dataForm.supplierType==2" :cols="3">
        <el-form-item slot="col_1" label="技术人员数量：">
          <number-input v-model="dataForm.numberOfTechnicalPerson" :maxlength="20" />
        </el-form-item>
        <el-form-item slot="col_2" label="管理/带班人员数量：">
          <number-input v-model="dataForm.numberOfSubstitutePerson" :maxlength="20" />
        </el-form-item>
        <el-form-item slot="col_3" label="推荐单位：" prop="recommendUnit">
          <el-radio-group v-model="dataForm.recommendUnit">
            <el-radio v-for="(item,index) in recommendUnitOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </row-layout>
      <row-layout v-if="dataForm.supplierType==2" :cols="3">
        <el-form-item slot="col_1" label="推荐人姓名：">
          <el-input v-model="dataForm.referrerPhone" :disabled="dataForm.recommendUnit!='1'" size="small" placeholder="请输入" maxlength="20" />
        </el-form-item>
        <el-form-item slot="col_2" label="推荐人电话：">
          <number-input v-model="dataForm.referrerPhone" :disabled="dataForm.recommendUnit!='1'" :maxlength="11" />
        </el-form-item>
        <el-form-item slot="col_3" prop="recommendDept" label="推荐部门：">
          <selector-dialog :model-data="orgDialog" :width="500" :value="dataForm.recommendDept" dynamic-model="selectOrg" @updateValue="updateOrgValue($event,'recommendDept','recommendDeptId')"></selector-dialog>
        </el-form-item>
      </row-layout>
      <row-layout v-if="dataForm.supplierType==2" :cols="3">
        <el-form-item slot="col_1" label="智链平台注册状态：">
          <el-input v-model="dataForm.intellectualChainPlatformType" disabled size="small" placeholder="请输入" maxlength="200" />
        </el-form-item>
      </row-layout>
      <row-layout v-else :cols="3">
        <el-form-item slot="col_1" label="推荐人电话：">
          <number-input v-model="dataForm.referrerPhone" :maxlength="11" :disabled="dataForm.recommendUnit!='1'" />
        </el-form-item>
        <el-form-item slot="col_2" prop="recommendDept" label="推荐部门：">
          <selector-dialog :model-data="orgDialog" :width="500" :value="dataForm.recommendDept" dynamic-model="selectOrg" @updateValue="updateOrgValue($event,'recommendDept','recommendDeptId')"></selector-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="智链平台注册状态：">
          <el-input v-model="dataForm.intellectualChainPlatformType" disabled size="small" placeholder="请输入" maxlength="200" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="supplierBusinessScope" label="供应商经营范围：">
          <el-checkbox-group v-model="dataForm.supplierBusinessScope">
            <el-checkbox v-for="(item,index) in supplierBusinessScopeOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" label="入库备注：">
          <el-input v-model="dataForm.remark" type="textarea" :autosize="{ minRows: 5}" size="small" placeholder="请输入" maxlength="250" />
        </el-form-item>
      </row-layout>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane name="first" label="银行信息">
          <div>
            <el-button type="primary" size="small" @click="addTableList('supplierBankDetail')">新增</el-button>
          </div>
          <el-table :data="dataForm.supplierBankDetail" class="f2bpmui-datagrid-vuetable" border>
            <el-table-column label="银行账号" :render-header="addRedStar">
              <template slot-scope="scope">
                <number-input v-model="scope.row.accountId" :maxlength="20" />
              </template>
            </el-table-column>
            <el-table-column label="账户名称" :render-header="addRedStar">
              <template slot-scope="scope">
                <el-input v-model="scope.row.accountName" size="small" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="开户银行" :render-header="addRedStar">
              <template slot-scope="scope">
                <selector-dialog :model-data="baseBank" :value="scope.row.bankName" dynamic-model="customDialog" @updateValue="updateBaseBankValue($event,scope.$index)"></selector-dialog>
              </template>
            </el-table-column>
            <el-table-column label="币种">
              <template slot-scope="scope">
                <el-select v-model="scope.row.currencyTypeId" placeholder="请选择">
                  <el-option v-for="(item,index) in currencyOptions" :key="index" :value="item.configValue" :label="item.configName">
                    {{ item.configName }} {{ item.configValue }}
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="默认" width="80px">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.isDefault" true-label='1' false-label='0' @change="changeDefault($event, scope.row)" :disabled="type !== 'detail'?false:true"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80px">
              <template slot-scope="scope">
                <el-button type="text" @click="delTableList(scope.$index,'supplierBankDetail')">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="second" label="业务覆盖地区">
          <div>
            <el-button type="primary" size="small" @click="addTableList('supplierMaterialAreaDetail')">新增</el-button>
          </div>
          <el-table :data="dataForm.supplierMaterialAreaDetail" class="f2bpmui-datagrid-vuetable" border>
            <el-table-column type="index" label="序号" width="120px" />
            <el-table-column label="地区名称" :render-header="addRedStar">
              <template slot-scope="scope">
                <cascSelect :default-value="scope.row.region" code="AddressCascade" @change-select="changeRegion($event,scope.$index)" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80px">
              <template slot-scope="scope">
                <el-button type="text" @click="delTableList(scope.$index,'supplierMaterialAreaDetail')">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="third" label="主要生产或销售产品">
          <div>
            <el-button type="primary" size="small" @click="addTableList('supplierMaterialProductDetail')">新增</el-button>
          </div>
          <el-table :data="dataForm.supplierMaterialProductDetail" class="f2bpmui-datagrid-vuetable" border>
            <el-table-column type="index" label="序号" width="120px" />
            <el-table-column label="产品名称" :render-header="addRedStar">
              <template slot-scope="scope">
                <el-input v-model="scope.row.productName" size="small" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80px">
              <template slot-scope="scope">
                <el-button type="text" @click="delTableList(scope.$index,'supplierMaterialProductDetail')">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane v-if="dataForm.supplierType==1" name="fourth" label="产品信息">
          <div>
            <el-button type="primary" size="small" @click="addTableList('supplierMaterialProductInfoDetail')">新增</el-button>
          </div>
          <el-table :data="dataForm.supplierMaterialProductInfoDetail" class="f2bpmui-datagrid-vuetable" border>
            <el-table-column type="index" label="序号" width="120px" />
            <el-table-column label="主打强项">
              <template slot-scope="scope">
                <el-input v-model="scope.row.mainStrength" size="small" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="打样时间(天数)">
              <template slot-scope="scope">
                <amount-input v-model="scope.row.samplingTime"></amount-input>
              </template>
            </el-table-column>
            <el-table-column label="设计风格">
              <template slot-scope="scope">
                <el-input v-model="scope.row.designStyle" size="small" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="是否专利产品">
              <template slot-scope="scope">
                <el-radio-group v-model="scope.row.patentedProduct">
                  <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column label="特殊工艺">
              <template slot-scope="scope">
                <el-radio-group v-model="scope.row.specialTechnique">
                  <el-radio v-for="(item,index) in radioOptions" :key="index" :label="item.configValue">{{ item.configName }}</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80px">
              <template slot-scope="scope">
                <el-button type="text" @click="delTableList(scope.$index,'supplierMaterialProductInfoDetail')">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane v-else name="fourth" label="工厂主要设备/销售门店">
          <div>
            <el-button type="primary" size="small" @click="addTableList('supplierMaterialStoreDetail')">新增</el-button>
          </div>
          <el-table :data="dataForm.supplierMaterialStoreDetail" class="f2bpmui-datagrid-vuetable" border>
            <el-table-column type="index" label="序号" width="120px" />
            <el-table-column label="名称">
              <template slot-scope="scope">
                <el-input v-model="scope.row.productionName" size="small" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="数量">
              <template slot-scope="scope">
                <number-input v-model="scope.row.productionNum" :maxlength="20" />
              </template>
            </el-table-column>
            <el-table-column label="日产量/台">
              <template slot-scope="scope">
                <number-input v-model="scope.row.productionDaily" :maxlength="20" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80px">
              <template slot-scope="scope">
                <el-button type="text" @click="delTableList(scope.$index,'supplierMaterialStoreDetail')">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="fifth" label="最近三年营业收入">
          <div>
            <el-button type="primary" size="small" @click="addTableList('supplierMaterialBusinessDetail')">新增</el-button>
          </div>
          <el-table :data="dataForm.supplierMaterialBusinessDetail" class="f2bpmui-datagrid-vuetable" border>
            <el-table-column type="index" label="序号" width="120px" />
            <el-table-column label="年份">
              <template slot-scope="scope">
                <number-input v-model="scope.row.particularYear" />
              </template>
            </el-table-column>
            <el-table-column label="内销金额(万元)">
              <template slot-scope="scope">
                <amount-input v-model="scope.row.amountOfDomesticSales"></amount-input>
              </template>
            </el-table-column>
            <el-table-column label="外销金额(万元)">
              <template slot-scope="scope">
                <amount-input v-model="scope.row.exportValue"></amount-input>
              </template>
            </el-table-column>
            <el-table-column prop="grossSalesAmount" label="总销售金额(万元)">
               <template slot-scope="scope">
                {{ getGrossSalesAmount(scope.row.amountOfDomesticSales,scope.row.exportValue) }}
               </template>
            </el-table-column>
            <el-table-column label="环比增长率">
              <template slot-scope="scope">
                <percentage-input v-model="scope.row.sequentialGrowthRate"></percentage-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80px">
              <template slot-scope="scope">
                <el-button type="text" @click="delTableList(scope.$index,'supplierMaterialBusinessDetail')">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="sixth" label="准入条件">
          <el-table :data="dataForm.supplierMaterialConditionDetail" class="f2bpmui-datagrid-vuetable" border>
            <el-table-column label="准入条件" prop="entryCondition" />
            <el-table-column label="准入最低要求" prop="minEntryRequirement" />
            <el-table-column label="20 ~25分" prop="maxScore" />
            <el-table-column label="15 ~ 19分" prop="medScore" />
            <el-table-column label="0 ~ 14分" prop="lowestmark" />
            <el-table-column label="得分">
              <template slot-scope="scope">
                <number-input v-model="scope.row.score" :maxlength="2"  :maxValue="25" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80px">
              <template slot-scope="scope">
                <el-button type="text" @click="delTableList(scope.$index,'supplierMaterialConditionDetail')">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          备注：<br>
          1、得分85~100分者为A级优质供应商，可以优先合作并考虑纳入战略供应商。<br>
          2、得分70~84分者为B级合格供应商，可以正常采购。<br>
          3、得分60~69分者为C级辅导级供应商，需辅导或停止合作 <br>
          4、得分60分以下者为D级不合格供应商，予以淘汰。<br>
          <el-form-item label="综合评定：">
            <el-input v-model="dataForm.synthesizeEvaluate" size="small" placeholder="请输入" maxlength="20" />
          </el-form-item>
          <el-form-item label="综合得分：">
            <el-input :value="getSynthesizeScore()" size="small" placeholder="自动计算" maxlength="20" disabled />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="seventh" label="附件">
          <row-layout :cols="1">
            <el-form-item slot="col_1" prop="businessLicense" label="营业执照：" label-width="250px">
              <update-files v-model="dataForm.businessLicense"></update-files>
            </el-form-item>
          </row-layout>
          <row-layout :cols="1">
            <el-form-item slot="col_1" prop="corporateIdentityCardFront" label="法人身份证正面：" label-width="250px">
              <update-files v-model="dataForm.corporateIdentityCardFront"></update-files>
            </el-form-item>
          </row-layout>
          <row-layout :cols="1">
            <el-form-item slot="col_1" prop="contactIDCardFront" label="联系人身份证正面：" label-width="250px">
              <update-files v-model="dataForm.contactIDCardFront"></update-files>
            </el-form-item>
          </row-layout>
          <row-layout :cols="1">
            <el-form-item slot="col_1" prop="taxCreditRatingInTheLastTwoYears" label="近两年的纳税信用评级：" label-width="250px">
              <update-files v-model="dataForm.taxCreditRatingInTheLastTwoYears"></update-files>
            </el-form-item>
          </row-layout>
          <row-layout :cols="1">
            <el-form-item slot="col_1" prop="photosCompanyDoorAndOfficeSpace" label="公司门头照片以及办公经营场地照片：" label-width="250px">
              <update-files v-model="dataForm.photosCompanyDoorAndOfficeSpace"></update-files>
            </el-form-item>
          </row-layout>
          <row-layout :cols="1">
            <el-form-item slot="col_1" prop="accountOpeningPermitOrStampedAccountOpeningInFormation" label="开户许可证或加盖章的开户信息：" label-width="250px">
              <update-files v-model="dataForm.accountOpeningPermitOrStampedAccountOpeningInFormation"></update-files>
            </el-form-item>
          </row-layout>
          <row-layout :cols="1">
            <el-form-item slot="col_1" label="其他资料：" label-width="250px">
              <update-files v-model="dataForm.otherInformation"></update-files>
            </el-form-item>
          </row-layout>
        </el-tab-pane>
        <el-tab-pane name="eighth" label="合同信息">
          <el-table :data="dataForm.supplierMaterialContractDetail" class="f2bpmui-datagrid-vuetable" border>
            <el-table-column type="index" label="序号" width="120px" />
            <el-table-column label="合同编号" prop="contractCode" />
            <el-table-column label="合同名称" prop="contractName" />
            <el-table-column label="合同金额" prop="contractAmount" />
            <el-table-column label="合同类型" prop="contractType" />
            <el-table-column label="项目编号" prop="projectCode" />
            <el-table-column label="项目名称" prop="projectName" />
            <el-table-column label="编制时间" prop="createTime" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="ninth" label="付款信息">
          <el-table :data="dataForm.supplierMaterialPaymentDetail" class="f2bpmui-datagrid-vuetable" border>
            <el-table-column type="index" label="No" />
            <el-table-column label="付款单编号" prop="paymentCode" />
            <el-table-column label="付款金额" prop="paymentAmount" />
            <el-table-column label="表单名称" prop="tableName" />
            <el-table-column label="合同编号" prop="contractCode" />
            <el-table-column label="合同名称" prop="contractName" />
            <el-table-column label="项目编号" prop="projectCode" />
            <el-table-column label="项目名称" prop="projectName" />
            <el-table-column label="审批通过时间" prop="finishedTime" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
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
import selectorDialog from '@/components/workflow/selector/selectorDialog.vue';
import { getDataDictByConfigType } from '@/Api/dataDict.js'
import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
import numberInput from '@/components/basic/numberInput/index.vue';
import percentageInput from '@/components/basic/numberInput/percentageInput.vue';
import amountInput from '@/components/basic/numberInput/amountInput.vue';
import cascSelect from '@/components/basic/cascSelect/index.vue'
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import TextInput from '@/components/basic/elInput/textInput.vue';
import tools from '@/utils/fun.js'
export default {
  components: { selectorDialog, RowLayout, numberInput, amountInput, percentageInput, cascSelect, updateFiles, TextInput },
  mixins: [comMixin],
  data() {
    return {
      loading: false,
      formVisible: false,
      dialogVisible: false,
      isReadOnly: false,
      activeName: 'first',
      dataForm: {
        name: '',
        code: '',
        modifyReason: '',
        customerStatus: '1',
        supplierType: '1',
        natureOfSupplier: '0',
        recommendUnit: '2',
        recommendDept: '',
        recommendDeptId: '',
        businessLicense: [],
        corporateIdentityCardFront: [],
        contactIDCardFront: [],
        taxCreditRatingInTheLastTwoYears: [],
        photosCompanyDoorAndOfficeSpace: [],
        accountOpeningPermitOrStampedAccountOpeningInFormation: [],
        otherInformation: [],
        customerBankDetailList: [],
        supplierMaterialContractDetail: [],
        supplierMaterialPaymentDetail: [],
        supplierMaterialStoreDetail: [],
        supplierBusinessScope: [],
        supplierBankDetail: [],
        supplierMaterialAreaDetail: [],
        supplierMaterialProductDetail: [],
        supplierMaterialProductInfoDetail: [],
        supplierMaterialBusinessDetail: [],
        supplierMaterialConditionDetail: [{
          id: '',
          entryCondition: '工厂管理',
          minEntryRequirement: '生产制度、财务制度、加工流程、车间管理制度、员工统一着装、企业质量方针标识、产品堆放分区合理化、出厂包装、检验等',
          lowestmark: '着装不统一和出厂包装不完整',
          maxScore: '各项都符合标准为',
          medScore: '若质量方针不明确或加工流程不规范',
          score: ''
        }, {
          id: '',
          entryCondition: '生成设备',
          minEntryRequirement: '生产设备则根据实际生产所需要用到的设备考虑',
          lowestmark: '大部分需要外加工',
          maxScore: '设备齐全',
          medScore: '部分产品需要外加工',
          score: ''
        }, {
          id: '',
          entryCondition: '生产能力',
          minEntryRequirement: '生产设备、员工人数、厂房面积大小考虑，设备、人员和厂房面积是否满足生产实力',
          lowestmark: '不具备生产实力',
          maxScore: '均满足',
          medScore: '不能满足大批量生产',
          score: ''
        }, {
          id: '',
          entryCondition: '检验设备',
          minEntryRequirement: '检测设备主要从有检测设备及相关持证人员考虑',
          lowestmark: '无检测设备无持证人员',
          maxScore: '有检测设备有持证人员',
          medScore: '有检测设备无持证人员',
          score: ''
        }]
      },
      natureOfSupplierOptions: [],
      supplierTypeOptions: [],
      initialWarehousingRatingOptions: [],
      cooperativeProcessRatingOptions: [],
      fiscalSystemOptions: [],
      creditRatingOptions: [],
      propertyOfBusinessSiteOptions: [],
      systemOfOwnershipOptions: [],
      recommendUnitOptions: [],
      supplierBusinessScopeOptions: [],
      currencyOptions: [],
      radioOptions: [],
      baseBank: { code: 'bank_branch', customDialog: 'bank_branch', isSetHead: 1, isMulti: false, initailData: [] },
      orgDialog: { resultFieldKey: 'groupId', code: 'selectOrg', customDialog: 'selectOrg', isSetHead: 1, isMulti: false, initailData: [], parm: { singleSelect: true }},
      dataRule: RuleRequired.dataRule(['supplierType', 'name', 'registerStartTime', 'taxRegistrationNum', 'initialWarehousingRating',
        'registeredFund', 'creditRating', 'contactPersonTel', 'contactPersonPost', 'contactPerson', 'natureOfSupplier',
        'contactPersonIdCard', 'contactPersonEmail', 'corporateName', 'legalPersonIdCard', 'address', 'recommendUnit', 
        'officeAddress', 'areaOfBusinessPremises', 'systemOfOwnership', 'recommendDept', 'fiscalSystem', 'supplierBusinessScope',
        'businessLicense', 'corporateIdentityCardFront', 'contactIDCardFront', 'taxCreditRatingInTheLastTwoYears', 
        'photosCompanyDoorAndOfficeSpace', 'accountOpeningPermitOrStampedAccountOpeningInFormation']),
      form: {
        modifyReason: ''
      }
    };
  },
  computed: {
    /**
     * 【入库初始评级】
     * 创建时不可选，在供应商资审员审核时必填
     */
    isRequiredInitialWare() {
      let isApprove = this.pageBaseInfo.buttons.find((res)=>{return res.buttonName == '审批'})
      const required = isApprove && WFContext.CurrentActivityName.trim() == '供应商资审员'?true:false;
      this.dataRule['initialWarehousingRating'] = RuleRequired.curFiledRule(required);
      return required;
    },
  },
  mounted() { },
  methods: {
    /**
     * 综合得分
     */
    getSynthesizeScore() {
      let synthesizeScore = 0;
      this.dataForm.supplierMaterialConditionDetail.forEach(e=>{
        synthesizeScore = tools.getNumAdd(synthesizeScore,e.score)
      })
      this.dataForm.synthesizeScore = synthesizeScore;
      return synthesizeScore;
    },
    /**
    * 给表头加必填符号*
    */
    addRedStar(h, { column }) {
      return [
        h("span", " " + column.label),
        h("span", { style: "color: red" }, "*")
      ];
    },
    /**
     * 银行数据，默认只有一条数据勾选
     */
    changeDefault(e, row){
      this.dataForm.supplierBankDetail.forEach(item => {
        item.isDefault = '0';
      })
      row.isDefault = e;
    },
    /**
     * 总和
     */
    getGrossSalesAmount(start,end){
      return tools.getNumAdd(start,end);
    },
    updateOrgValue(data, filedName, filedValue) {
      if (data && data.length <= 0) return;
      const { value, text } = data[0]
      this.dataForm[filedName] = text;
      this.dataForm[filedValue] = value;
    },
    handleClick(val) {
      console.log('xxx', val)
    },
    /**
     * 字段校验
     */
    initRuleRequired() {
      this.dataRule['taxRegistrationNum'] = RuleRequired.curCustomRule(true, function (rule, value, callbacak) {
        let pattern = /^[A-Z0-9]{18}$/;
        if (pattern.test(value)) {
          callbacak();
        } else {
          callbacak(new Error('统一社会信用码输入有误'));
        }
       });
      ['legalPersonIdCard','contactPersonIdCard'].forEach(field=>{
        this.dataRule[field] = RuleRequired.curCustomRule(true, function (rule, value, callbacak) {
        let pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (pattern.test(value)) {
          callbacak();
        } else {
          callbacak(new Error('请输入正确格式的身份证号'));
        }
       });
      })
    },
    openDialogVisible() {
      this.dialogVisible = true;
      this.form.modifyReason = ''
    },
    handleClose() {

    },
    submitForm() {
      this.dataForm.modifyReason = this.form.modifyReason;
      this.dialogVisible = false;
    },
    /**
     * 切换地址
     */
    changeAddress(data) {
      this.dataForm.address = data.value
      this.$refs['dataForm'].clearValidate('address')
    },
    /**
     * 切换地区名称
     */
    changeRegion(data,index){
      this.dataForm.supplierMaterialAreaDetail[index].region = data.value;
    },
    /**
     * 添加表格集合
     */
    addTableList(filedName) {
      if (!this.dataForm[filedName]) this.dataForm[filedName] = []
      var obj = {}
      switch (filedName) {
        // 银行信息
        case 'supplierBankDetail':
          obj = {
            accountId: '',
            accountName: '',
            bankId: '',
            bankName: '',
            bankType: '',
            currencyTypeId: '',
            currencyTypeName: '',
            id: '',
            isDefault: this.dataForm.supplierBankDetail.length<=0 ? '1': '0',
            sort: '',
            supplierMainId: ''
          }
          break;
        // 业务覆盖地区
        case 'supplierMaterialAreaDetail':
          obj = {
            region: '',
            regionId: ''
          }
          break;
        // 主要生产或销售产品
        case 'supplierMaterialProductDetail':
          obj = {
            productName: ''
          }
          break;
        // 产品信息
        case 'supplierMaterialProductInfoDetail':
          obj = {
            designStyle: '',
            mainStrength: '',
            patentedProduct: '',
            samplingTime: '',
            specialTechnique: ''
          }
          break;
        // 工厂主要设备/销售门店
        case 'supplierMaterialStoreDetail':
          obj = {
            productionDaily: '',
            productionName: '',
            productionNum: ''
          }
          break;
        // 最近三年营业收入
        case 'supplierMaterialBusinessDetail':
          obj = {
            amountOfDomesticSales: '',
            exportValue: '',
            grossSalesAmount: '',
            particularYear: '',
            sequentialGrowthRate: ''
          }
          break;
        default:
          break;
      }
      this.dataForm[filedName].push(obj)
    },
    /**
     * 删除表格数据
     */
    delTableList(index, filedName) {
      this.dataForm[filedName].splice(index, 1)
    },
    /**
     * 银行类别
     */
    updateBaseBankValue(data, index) {
      if(data && data.length <= 0) return;
      const {id,name } = data[0]
       this.$set(this.dataForm.supplierBankDetail[index], 'bankId',id)
      this.$set(this.dataForm.supplierBankDetail[index], 'bankName', name)
    },
    /**
     * 企业类型为-政府机构/国有事业时，不必填，否则编制人必填
     * @param {*} fieldName
     */
    setProp(fieldName) {
      if (this.dataForm.companyType === '1' || this.dataForm.companyType === '2') {
        return 'noRequired'
      }
      return fieldName;
    },
    beforeInit() {
      const year = new Date().getFullYear();
      this.dataForm.supplierMaterialBusinessDetail = [];
      for (let index = 0; index < 3; index++) {
        this.dataForm.supplierMaterialBusinessDetail.push({
          amountOfDomesticSales: '',
          exportValue: '',
          grossSalesAmount: '',
          particularYear: year - index - 1,
          sequentialGrowthRate: ''
        })
      }
      this.getDataDictByConfigType()
      this.initRuleRequired()
    },
    afterInit() {
      if (this.dataForm.supplierBusinessScope) this.dataForm.supplierBusinessScope = this.dataForm.supplierBusinessScope.split(',')
    },
    /**
     * 获取表单数据
     */
    getDataForm() {
      const dataForm = JSON.parse(JSON.stringify(this.dataForm));
      dataForm.supplierBusinessScope = this.dataForm.supplierBusinessScope.toString();
      return dataForm;
    },
    /**
     * 校验表格必填项
     */
    validateTable() {
      if(this.dataForm.supplierBankDetail.length <= 0) {
        this.$message.error('银行信息页签 必须有一行数据')
        return;
      }
      const tableColumns = [{
        tableField: 'supplierBankDetail',
        tableName: '银行信息',
        fieldList: {
          accountId: '银行账号',
          accountName: '账户名称',
          bankName: '开户银行',
        }
      },{
        tableField: 'supplierMaterialAreaDetail',
        tableName: '业务覆盖地区',
        fieldList: {
          region: '地区名称'
        }
      },{
        tableField: 'supplierMaterialProductDetail',
        tableName: '主要生产或销售产品',
        fieldList: {
          productName: '产品名称'
        }
      }]
      for (let pIndex in tableColumns) {
        const _scoureData = this.dataForm[tableColumns[pIndex].tableField]
        const validObj = tableColumns[pIndex].fieldList
        const tableName = tableColumns[pIndex].tableName
        for (let index in _scoureData) {
          let _row = _scoureData[index]
          for (let key in validObj) {
            if (!_row[key]) {
              this.$message.error(`${tableName}：第 ${(parseInt(index) + 1)} 行 ${validObj[key]} 不能为空`)
              return false
            }
          }
        }
      }
      return true;
    },
    /**
     * 表单校验
     */
    async validateForm() {
      const _this = this;
      const vaild = await _this.validateTable()
      if(!vaild) return false;
      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          if (valid) {
            if(_this.$refs['warehouseForm'] && _this.isRequiredInitialWare) {
              _this.$refs['warehouseForm'].validate(valid => {
                if (valid) {
                  return resolve(_this.getDataForm());
                } else {
                  return resolve(false)
                }
              })
            }
            return resolve(_this.getDataForm());
          } else {
            this.$message.error('必填项不能为空')
            return resolve(false)
          }
        })
      });
    },
    /**
     * 初始化字典
     */
    async getDataDictByConfigType() {
      const res = await getDataDictByConfigType({ params: { configTypes: '供应商性质,供应商类型,入库初始评级,合作过程评级,' +
    '税务制度,纳税信用等级,经营场所属性,所有制,推荐单位,供应商经营范围,币种,是或否' }})
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '供应商性质':
              this.natureOfSupplierOptions = ele.dataDict;
              break;
            case '供应商类型': // 客户状态 == 项目介绍人状态
              this.supplierTypeOptions = ele.dataDict;
              break;
            case '入库初始评级':
              this.initialWarehousingRatingOptions = ele.dataDict;
              break;
            case '合作过程评级':
              this.cooperativeProcessRatingOptions = ele.dataDict;
              break;
            case '税务制度':
              this.fiscalSystemOptions = ele.dataDict;
              break;
            case '纳税信用等级':
              this.creditRatingOptions = ele.dataDict;
              break;
            case '经营场所属性':
              this.propertyOfBusinessSiteOptions = ele.dataDict;
              break;
            case '所有制':
              this.systemOfOwnershipOptions = ele.dataDict;
              break;
            case '推荐单位':
              this.recommendUnitOptions = ele.dataDict;
              break;
            case '供应商经营范围':
              this.supplierBusinessScopeOptions = ele.dataDict;
              break;
            case '币种':
              this.currencyOptions = ele.dataDict;
              break;
            case '是或否':
              this.radioOptions = ele.dataDict;
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
