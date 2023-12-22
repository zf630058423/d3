<template>
  <!-- 计划成本调整 -->
  <div v-loading="loading" class="flow-form">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" :disabled="setting.readonly" label-width="140px">
      <row-layout title="基本信息" :cols="3">
        <el-form-item slot="col_1" label="单据编号：">
          <el-input v-model="dataForm.code" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER"/>
        </el-form-item>
        <el-form-item slot="col_2" prop="constructCode" label="项目编号：">
          <select-dialog :disabled="true" :btnDisabled="setting.readonly" :width="800" :modelData="marketModelData"
                         :height="360" :value="dataForm.constructCode" @updateValue="constructCodeUpdateValue"
                         dynamicModel="customDialog"></select-dialog>
        </el-form-item>
        <el-form-item slot="col_3" label="项目名称：">
          <el-input v-model="dataForm.constructName" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER"/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="管理部门：">
          <el-input v-model="dataForm.constructionUnitName" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER"/>
        </el-form-item>
        <el-form-item slot="col_2" label="项目负责人：">
          <el-input v-model="dataForm.projectManagerName" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER"/>
        </el-form-item>
        <el-form-item slot="col_3" label="项目地址：">
          <el-input v-model="dataForm.projectAddress" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER"/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="建安合同：">
          <el-input v-model="dataForm.contractInCode" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER"/>
        </el-form-item>
        <el-form-item slot="col_2" prop="buildArea" label="建筑面积(㎡)：">
          <el-input v-model="dataForm.buildArea" size="small" :placeholder="msgTip.ENTER_PLACEHOLDER" @change="changeTofixed($event,'buildArea')"/>
        </el-form-item>
        <el-form-item slot="col_3" label="累计形象进度(%)：">
          <el-input v-model="dataForm.accumulateImageProgressRate" disabled size="small" :placeholder="msgTip.AUTO_PLACEHOLDER"/>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="constructionAmountTax" label="施工金额(含税)：">
          <amount-input v-model="dataForm.constructionAmountTax" @change="sumAmountTaxChange($event,'constructionAmountTax')"
                        defaultValue clearable :disabled="dataForm.contractInCode?true:false"
                        :placeholder="msgTip.ENTER_PLACEHOLDER"></amount-input>
        </el-form-item>
        <el-form-item slot="col_2" label="施工金额增补(含税)：">
          <amount-input v-model="dataForm.changeConstructionAmountTax" defaultValue clearable disabled
                        :placeholder="msgTip.ENTER_PLACEHOLDER"></amount-input>
        </el-form-item>
        <el-form-item slot="col_3" label="施工总金额(无税)：">
          <amount-input v-model="dataForm.totalContructionAmountTax" defaultValue clearable disabled
                        :placeholder="msgTip.ENTER_PLACEHOLDER"></amount-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="设计金额(含税)：">
          <amount-input v-model="dataForm.designAmountTax"  defaultValue clearable :disabled="dataForm.contractInCode?true:false"
                        @change="sumAmountTaxChange($event,'designAmountTax')"
                        :placeholder="msgTip.ENTER_PLACEHOLDER"></amount-input>
        </el-form-item>
        <el-form-item slot="col_2" label="设计金额增补(含税)：">
          <amount-input v-model="dataForm.changeDesignAmountTax" defaultValue clearable disabled
                        :placeholder="msgTip.ENTER_PLACEHOLDER"></amount-input>
        </el-form-item>
        <el-form-item slot="col_3" label="设计总金额(无税)：">
          <amount-input v-model="dataForm.totalDesignAmountTax" defaultValue clearable disabled
                        :placeholder="msgTip.ENTER_PLACEHOLDER"></amount-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="销售金额(含税)：">
          <amount-input v-model="dataForm.saleAmountTax" defaultValue clearable :disabled="dataForm.contractInCode?true:false"
                        @change="sumAmountTaxChange($event,'saleAmountTax')"
                        :placeholder="msgTip.ENTER_PLACEHOLDER"></amount-input>
        </el-form-item>
        <el-form-item slot="col_2" label="销售金额增补(含税)：">
          <amount-input v-model="dataForm.changeSaleAmountTax" defaultValue clearable disabled
                        :placeholder="msgTip.ENTER_PLACEHOLDER"></amount-input>
        </el-form-item>
        <el-form-item slot="col_3" label="销售总金额(无税)：">
          <amount-input v-model="dataForm.totalSaleAmountTax" defaultValue clearable disabled
                        :placeholder="msgTip.ENTER_PLACEHOLDER"></amount-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" prop="constructionTaxRate" label="施工税率(%)：">
          <select-dialog2  :disabled="true"  :modelData="rateModel" :width="900" :btnDisabled="dataForm.contractInCode?true:false"
                          :height="360" @updateValue="constructionRateUpdate" :value="dataForm.constructionTaxRate || '请选择'"
                          dynamic-model="customDialog"></select-dialog2>
        </el-form-item>
        <el-form-item slot="col_2" label="设计税率(%)：" :prop="setReq1('designTaxRate')">
          <select-dialog2  :disabled="true" :modelData="rateModel" :width="900" :btnDisabled="dataForm.contractInCode?true:false"
                           :height="360" @updateValue="designTaxRateUpdate" :value="dataForm.designTaxRate || '请选择'"
                           dynamic-model="customDialog"></select-dialog2>
        </el-form-item>
        <el-form-item slot="col_3" label="销售税率(%)：" :prop="setReq2('saleTaxRate')">
          <select-dialog2  :disabled="true" :modelData="rateModel" :width="900" :btnDisabled="dataForm.contractInCode?true:false"
                           :height="360" @updateValue="saleTaxRateUpdate" :value="dataForm.saleTaxRate || '请选择'"
                           dynamic-model="customDialog"></select-dialog2>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="现合同金额(含税)：">
          <amount-input v-model="dataForm.currentContractAmountTax" defaultValue clearable disabled
                        :placeholder="msgTip.ENTER_PLACEHOLDER"></amount-input>
        </el-form-item>
        <el-form-item slot="col_2" label="现合同金额(无税)：">
          <amount-input v-model="dataForm.currentContractAmountUntax" defaultValue clearable disabled
                        :placeholder="msgTip.ENTER_PLACEHOLDER"></amount-input>
        </el-form-item>
        <el-form-item slot="col_3" label="单方合同造价：">
          <amount-input v-model="dataForm.singleContractAmount" defaultValue clearable disabled
                        :placeholder="msgTip.AUTO_PLACEHOLDER"></amount-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="单方目标成本：">
          <amount-input v-model="dataForm.singleTargetAmount" defaultValue clearable disabled
                        :placeholder="msgTip.AUTO_PLACEHOLDER"></amount-input>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1">
        <el-form-item slot="col_1" prop="remark" label="备注：">
          <el-input type="textarea" :placeholder="msgTip.ENTER_PLACEHOLDER" :autosize="{ minRows: 5}" maxlength="250"
                    v-model="dataForm.remark"></el-input>
        </el-form-item>
      </row-layout>
      <form-title :title="'汇总表'"></form-title>
      <div>
        <el-button type="primary" size="small" @click="handelExportSummary" :disabled="false">导出</el-button>
      </div>
      <el-table :data="dataForm.planCostSummaryDetailAdjustList" class="f2bpmui-datagrid-vuetable" border :key="tableKey">
        <el-table-column label="No." width="100px">
          <template slot-scope="scope">
            <span style="color: #0c0b0e">{{scope.row.serialNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column label="费用项目">
          <template slot-scope="scope">
           <span style="font-weight: bold;color: #0c0b0e">{{scope.row.totalExpenseItem}}</span>
          </template>
        </el-table-column>
        <el-table-column label="原目标成本(含税)(元)">
          <template slot-scope="scope">
            <span>{{(scope.row.originalTotalTargetAmountTax || msgTip.AUTO_PLACEHOLDER)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="原目标成本(无税)(元)">
          <template slot-scope="scope">
            <span v-if="scope.row.totalExpenseType == '6'">--</span>
            <span v-else>{{scope.row.originalTotalTargetAmountUntax || msgTip.AUTO_PLACEHOLDER}}</span>
          </template>
        </el-table-column>
        <el-table-column label="调后目标成本(含税)(元)">
          <template slot-scope="scope">
            <amount-input v-if="scope.row.totalExpenseType == '4' || scope.row.totalExpenseType == '5'" @change="changeTotalTargetAmount1" v-model="scope.row.adjustTotalTargetAmountTax" size="small" placeholder="请输入"/>
            <percentage-input v-else-if="scope.row.totalExpenseType == '8'" v-model="scope.row.adjustTotalTargetAmountTax" size="small" placeholder="自动计算，可修改"></percentage-input>
            <span v-else>{{(scope.row.adjustTotalTargetAmountTax || msgTip.AUTO_PLACEHOLDER)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="调后目标成本(无税)(元)">
          <template slot-scope="scope">
            <amount-input v-if="scope.row.totalExpenseType == '4' || scope.row.totalExpenseType == '5'" @change="changeTotalTargetAmount2"  v-model="scope.row.adjustTotalTargetAmountUntax" size="small" placeholder="请输入"/>
            <percentage-input v-else-if="scope.row.totalExpenseType == '8'" v-model="scope.row.adjustTotalTargetAmountUntax" size="small" placeholder="自动计算，可修改"></percentage-input>
            <span v-else-if="scope.row.totalExpenseType == '6'">--</span>
            <span v-else>{{scope.row.adjustTotalTargetAmountUntax || msgTip.AUTO_PLACEHOLDER}}</span>
          </template>
        </el-table-column>
        <el-table-column label="已签合同金额(元)">
          <template slot-scope="scope">
            <span v-if="scope.row.totalExpenseType == '1' || scope.row.totalExpenseType == '2' || scope.row.totalExpenseType == '4'">{{scope.row.contractOutAmount || msgTip.AUTO_PLACEHOLDER}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="已签合同金额占比(%)">
          <template slot-scope="scope">
            <span v-if="scope.row.totalExpenseType == '1' || scope.row.totalExpenseType == '2' || scope.row.totalExpenseType == '4'">{{scope.row.contractOutAmountRate || msgTip.AUTO_PLACEHOLDER}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="已付款金额(元)">
          <template slot-scope="scope">
            <span  v-if="scope.row.totalExpenseType == '1' || scope.row.totalExpenseType == '2' || scope.row.totalExpenseType == '4'">{{scope.row.payOutAmount || msgTip.AUTO_PLACEHOLDER}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="已付款金额占比(%)">
          <template slot-scope="scope">
            <span v-if="scope.row.totalExpenseType == '1' || scope.row.totalExpenseType == '2' || scope.row.totalExpenseType == '4'">{{scope.row.payOutAmountRate || msgTip.AUTO_PLACEHOLDER}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>
      <form-title :title="'料工费明细'"></form-title>
      <div>
        <el-button type="primary" size="small" @click="handelImportPlanCostFee">导入</el-button>
        <el-button type="primary" size="small" @click="handelExportPlanCostFee" :disabled="false">导出</el-button>
      </div>
      <el-table :data="dataForm.planCostFeeDetailAdjustList" border class="f2bpmui-datagrid-vuetable" >
        <el-table-column label="No." width="100px">
          <template slot-scope="scope">
            <span style="color: #0c0b0e">{{scope.row.serialNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column label="费用项目">
          <template slot-scope="scope">
            <span style="font-weight: bold;color: #0c0b0e">{{scope.row.expenseItem}}</span>
          </template>
        </el-table-column>
        <el-table-column label="原目标成本(含税)(元)">
          <template slot-scope="scope">
            <span>
              {{scope.row.originalTargetAmountTax || msgTip.AUTO_PLACEHOLDER}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="原目标成本(无税)(元)">
          <template slot-scope="scope">
            <span>
              {{scope.row.originalTargetAmountUntax || msgTip.AUTO_PLACEHOLDER}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="调后目标成本(含税)(元)">
          <template slot-scope="scope">
            <span v-if="scope.row.expenseItem == '【间接费】' || scope.row.expenseItem == '【材料费】' || scope.row.expenseItem == '【人工费】'">
              {{scope.row.adjustTargetAmountTax || msgTip.AUTO_PLACEHOLDER}}
            </span>
            <amount-input v-else v-model="scope.row.adjustTargetAmountTax" size="small" placeholder="请输入" @change="changeTotalTargetAmountUntax($event,scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column label="调后目标成本(无税)(元)">
          <template slot-scope="scope">
            <span v-if="scope.row.expenseItem == '【间接费】' || scope.row.expenseItem == '【材料费】' || scope.row.expenseItem == '【人工费】'">
              {{scope.row.adjustTargetAmountUntax || msgTip.AUTO_PLACEHOLDER}}
            </span>
            <amount-input v-else v-model="scope.row.adjustTargetAmountUntax" size="small" placeholder="请输入" @change="changeTotalTargetAmountUntax($event,scope.row)"/>
          </template>
        </el-table-column>
      </el-table>

      <form-title :title="'材料对比表'"></form-title>
      <div>
        <el-button type="primary" size="small" @click="handelAdd">新增</el-button>
        <el-button type="primary" size="small" @click="handelImportPlanCostCompare">导入</el-button>
        <el-button type="primary" size="small" @click="handelExportPlanCostCompare"  :disabled="false">导出</el-button>
      </div>
      <el-table :key="tableKey2" :data="dataForm.planCostCompareDetailAdjustList" class="f2bpmui-datagrid-vuetable" border width="100%">
        <el-table-column label="No." width="100px" type="index">
        </el-table-column>
        <el-table-column label="投标报价(按甲方清单报价格式)" align="center">
          <el-table-column label="费用项目" width="160px">
            <div slot="header"><span style="color: #ed4014">*</span> 费用项目</div>
            <template slot-scope="scope">
              <el-input v-model="scope.row.expenseItem" size="small" placeholder="请输入"/>
            </template>
          </el-table-column>
          <el-table-column label="型号规格" width="160px">
            <div slot="header"><span style="color: #ed4014">*</span> 型号规格</div>
            <template slot-scope="scope">
              <el-input v-model="scope.row.specification" size="small" placeholder="请输入"/>
            </template>
          </el-table-column>
          <el-table-column label="单位" width="160px">
            <div slot="header"><span style="color: #ed4014">*</span> 单位</div>
            <template slot-scope="scope">
              <el-input v-model="scope.row.unit" size="small" placeholder="请输入"/>
            </template>
          </el-table-column>
          <el-table-column label="工程量" width="160px">
            <div slot="header"><span style="color: #ed4014">*</span> 工程量</div>
            <template slot-scope="scope">
              <el-input v-model="scope.row.projectQuantity" size="small" placeholder="请输入" @change="changeTofixed4($event,scope.$index,'projectQuantity')"/>
            </template>
          </el-table-column>
          <el-table-column label="单价(无税)" width="160px">
            <div slot="header"><span style="color: #ed4014">*</span> 单价(无税)</div>
            <template slot-scope="scope">
              <el-input v-model="scope.row.bidPriceUntax" size="small" placeholder="请输入" @change="changeTofixed4($event,scope.$index,'bidPriceUntax')"/>
            </template>
          </el-table-column>
          <el-table-column label="税率" width="160px">
            <div slot="header"><span style="color: #ed4014">*</span> 税率</div>
            <template slot-scope="scope">
              <select-dialog  :disabled="true"  :modelData="rateModel" :width="900" :btnDisabled="setting.readonly"
                               :height="360" @updateValue="bidRateRateUpdate($event,scope.$index)" :value="scope.row.bidRate"
                               dynamic-model="customDialog"></select-dialog>
            </template>
          </el-table-column>
          <el-table-column label="单价(含税)" width="160px">
            <div slot="header"><span style="color: #ed4014">*</span> 单价(含税)</div>
            <template slot-scope="scope">
              <el-input v-model="scope.row.bidPriceTax" size="small" placeholder="请输入" @change="changeTofixed4($event,scope.$index,'bidPriceTax')"/>
            </template>
          </el-table-column>
          <el-table-column label="金额(含税)" width="160px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.bidAmountTax" size="small" placeholder="自动计算" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="材料类别" width="160px">
            <div slot="header"><span style="color: #ed4014">*</span> 材料类别</div>
            <template slot-scope="scope">
              <el-input v-model="scope.row.materialType" size="small" placeholder="请输入"/>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="清标工程量" align="center">
          <el-table-column label="净用量" width="160px">
            <div slot="header"><span style="color: #ed4014">*</span> 净用量</div>
            <template slot-scope="scope">
              <el-input v-model="scope.row.pureQuantity" size="small" placeholder="请输入" @change="changeTofixed4($event,scope.$index,'pureQuantity')"/>
            </template>
          </el-table-column>
          <el-table-column label="计算式" width="160px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.designFormula" size="small" placeholder="请输入" maxlength="64"/>
            </template>
          </el-table-column>
          <el-table-column label="耗损率" width="160px">
            <div slot="header"><span style="color: #ed4014">*</span> 耗损率</div>
            <template slot-scope="scope" >
              <percentage-input v-model="scope.row.wasteRate" size="small" placeholder="请输入" @change="changeWasteRate($event,scope.$index)"/>
            </template>
          </el-table-column>
          <el-table-column label="计划用量" width="160px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.planQuantity" size="small" placeholder="自动计算" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="量差" width="160px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.differenceQuantity" size="small" placeholder="自动计算" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="比例" width="160px">
            <template slot-scope="scope">
              <percentage-input v-model="scope.row.bidClearRatio" size="small" placeholder="自动计算" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="经营点" width="160px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.bidClearPoint" size="small" placeholder="自动填充" disabled/>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="目标成本" align="center">
          <el-table-column label="单价(无税)" width="160px">
            <div slot="header"><span style="color: #ed4014">*</span> 单价(无税)</div>
            <template slot-scope="scope">
              <el-input v-model="scope.row.targetPriceUntax" size="small" placeholder="请输入" @change="changeTofixed4($event,scope.$index,'targetPriceUntax')"/>
            </template>
          </el-table-column>
          <el-table-column label="税率" width="160px">
            <div slot="header"><span style="color: #ed4014">*</span> 税率</div>
            <template slot-scope="scope">
              <select-dialog  :disabled="true"  :modelData="rateModel" :width="900" :btnDisabled="setting.readonly"
                               :height="360" @updateValue="targetRateUpdate($event,scope.$index)" :value="scope.row.targetRate"
                               dynamic-model="customDialog"></select-dialog>
            </template>
          </el-table-column>
          <el-table-column label="单价(含税)" width="160px">
            <div slot="header"><span style="color: #ed4014">*</span> 单价(含税)</div>
            <template slot-scope="scope">
              <el-input v-model="scope.row.targetPriceTax" size="small" placeholder="请输入" @change="changeTofixed4($event,scope.$index,'targetPriceTax')"/>
            </template>
          </el-table-column>
          <el-table-column label="金额(含税)" width="160px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.targetAmountTax" size="small" placeholder="自动计算" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="价差" width="160px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.differencePrice" size="small" placeholder="自动计算" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="比例(%)" width="160px">
            <template slot-scope="scope">
              <percentage-input v-model="scope.row.targetRatio" size="small" placeholder="自动计算" disabled/>
            </template>
          </el-table-column>
          <el-table-column label="经营点" width="160px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.targetPoint" size="small" placeholder="自动计算" disabled/>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button type="text" @click="delCustomer(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <form-title :title="'税金'"></form-title>
      <row-layout :cols="3">
        <el-form-item slot="col_1" label="投标报价税金(元)：">
          <span>{{dataForm.bidPriceTaxation || msgTip.AUTO_PLACEHOLDER}}</span>
        </el-form-item>
        <el-form-item slot="col_2" prop="customerPhone" label="原计划成本税金(元)：">
          <span>{{dataForm.originalPlanCostTaxation || msgTip.AUTO_PLACEHOLDER}}</span>
        </el-form-item>
        <el-form-item slot="col_3" prop="customerPhone" label="调后计划成本税金(元)：" label-width="160px">
          <amount-input v-model="dataForm.adjustPlanCostTaxation" @change="planCostTaxationChange" defaultValue clearable
                        :placeholder="msgTip.ENTER_PLACEHOLDER"></amount-input>
        </el-form-item>
      </row-layout>
      <el-table :data="dataForm.planCostTaxationDetailAdjustList" class="f2bpmui-datagrid-vuetable" border>
        <el-table-column label="No." width="100px">
          <template slot-scope="scope">
            <span style="font-weight: bold;color: #0c0b0e">{{scope.row.serialNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column label="费用项目">
          <template slot-scope="scope">
            <span style="font-weight: bold;color: #0c0b0e">{{scope.row.expenseItem}}</span>
          </template>
        </el-table-column>
        <el-table-column label="原计划成本(元)">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.originalPlanAmount" size="small" disabled placeholder="自动带出"/>
          </template>
        </el-table-column>
        <el-table-column label="调后计划成本(元)">
          <template slot-scope="scope">
            <amount-input v-model="scope.row.adjustPlanAmount" size="small" placeholder="请输入"/>
          </template>
        </el-table-column>
      </el-table>
      <row-layout title="附件" :cols="3" cell="3">
        <el-form-item slot="col_1" prop="fileInfoList" label="附件：">
          <uploader-file v-model="dataForm.fileInfoList"></uploader-file>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3" cell="1-1-1">
        <el-form-item slot="col_1" prop="createUserName" label="编制人：">
          <label class="label-style">{{dataForm.createUserName}}</label>
        </el-form-item>
        <el-form-item slot="col_2" prop="deptName" label="编制部门：">
          <label class="label-style">{{dataForm.deptName}}</label>
        </el-form-item>
        <el-form-item slot="col_3" prop="createTime" label="编制时间：">
          <!-- <el-date-picker class="commponent-height" v-model="dataForm.createTime" type="datetime" placeholder="选择日期时间"></el-date-picker> -->
          <label class="label-style">{{dataForm.createTime}}</label>
        </el-form-item>
      </row-layout>
    </el-form>
    <!-- 导入弹框 -->
    <importTemplateDialog :visible.sync="commonImportData.visible" :table-name="commonImportData.tableName" :keyword="keyWord" :model-name="modelName" @importSuccess="importSuccess"/>
  </div>
</template>

<script>
  import FormTitle from '@/components/basic/formTitle/index.vue';
  import RowLayout from '@/components/basic/fromLayout/rowLayout.vue';
  import SelectDialog from '@/components/workflow/selector/selectorDialog.vue';
  import AmountInput from '@/components/basic/numberInput/amountInput.vue';
  import PercentageInput from '@/components/basic/numberInput/percentageInput.vue';
  import CascSelect from '@/components/basic/cascSelect/index.vue';
  import UploaderFile from '@/components/basic/uploaderFile/index.vue';
  import SelectDialog2 from '@/components/workflow/selector/selectorDialog2.vue';
  import percentageInput from '@/components/basic/numberInput/percentageInput.vue';
  import importTemplateDialog from '@/components/basic/importTemplateDialog';
  import {
    RADIO_GROUP,
    BUSINERSSUNIT_MODEL,
    FOLLOWER_MODEL,
    PROJECT_LEADER_MODEL,
    CUSTOMER_MODEL,
    PRODUCTLINE_MODEL
  } from '@/views/businessModule/enum/param';
  import RuleRequired from '@/views/businessModule/enum/requiredMsg';
  import {getDataDictByConfigType, getCheckProjectManager} from '@/Api/dataDict.js'
  import {getAdjustConstructInfo,checkOnlyAdjustData,getConstructInfo} from '@/Api/planCostMain/index.js'
  import {PLANCOSTSUMMARY_DATA,PLANCOSTFEEDETAIL_DATA,PLANCOSTTAXATION_DATA} from "./tableData";
  import {exportDataDetails,importData,downloadTemplateFile} from '@/Api/workflowBusssion/index.js'

  import moment from 'moment'

  import comMixin from '../minix';

  export default {
    components: {FormTitle, RowLayout, SelectDialog, AmountInput, CascSelect, UploaderFile,PercentageInput,SelectDialog2,percentageInput,importTemplateDialog},
    mixins: [comMixin],
    data() {
      return {
        rateModel: {  //税率
          code: 'base_tax_rate_archive',
          parm: {
            isEnableAuthor: 0,
            data: [],
            isMulti: false,
            varParams: [
              {
                key: 'tax_attribute',
                value: 6
              }
            ]
          }
        },
        commonImportData: {
          title: '数据导入',
          visible: false,
          cancelText: '取消',
          type: '',
          tableName: ''
        },
        modelName:'',
        keyWord:'',
        rowObject: {},
        fileList: [],
        numVal: '100',
        loading: false,
        formVisible: false,
        dialogVisible: false,
        tableKey: Object.toGetRandomNum(100, 2000),
        tableKey2: Object.toGetRandomNum(200, 2000),
        radioData: RADIO_GROUP,
        marketModelData: { // 项目档案
          code:'XiangMuDangAnYinXingDangAn_CP146',
          parm: {
            isEnableAuthor: 0,
            data: [],
            isMulti: false
          }
        },
        dataForm: {
          accumulateImageProgressRate: '',
          adjustPlanCostTaxation: '',
          bidPriceTaxation: '',
          buildArea: '',
          businessKey: '',
          changeContructionAmountTax:'',
          changeConstructionAmountTax: '',
          changeDesignAmountTax: '',
          changeSaleAmountTax: '',
          code: '',
          constructArchiveMainId: '',
          constructCode: '',
          constructMainId: '',
          constructName: '',
          constructionAmountTax: '',
          constructionTaxRate: '',
          constructionUnitName: '',
          contractInCode: '',
          contractInMainId: '',
          contractInName: '',
          createTime: '',
          createUserDeptName: '',
          createUserId: '',
          createUserName: '',
          currentContractAmountTax: '',
          currentContractAmountUntax: '',
          deptId: '',
          designAmountTax: '',
          designTaxRate: '',
          fileInfoList: [],
          id: '',
          originalPlanCostTaxation: '',
          planCostCompareDetailAdjustList: [], // 材料对比表
          planCostFeeDetailAdjustList: [], // 料工费明细
          planCostSummaryDetailAdjustList: [], // 汇总表
          planCostTaxationDetailAdjustList: [], // 税金表
          procInstState: '',
          projectAddress: '',
          projectManagerName: '',
          remark: '',
          saleAmountTax: '',
          saleTaxRate: '',
          singleContractAmount: '',
          singleTargetAmount: '',
          totalConstructionAmountUntax: '',
          totalDesignAmountUntax: '',
          totalSaleAmountUntax: '',
          wiid:'',
          constructionUnitId:'',
          projectManagerId:''
        },
        marketCategoryArray: [],  //立项类别
        getSummeryData: PLANCOSTSUMMARY_DATA, // 汇总表默认数据
        getFeeData: PLANCOSTFEEDETAIL_DATA, // 料工费默认数据
        getCostData: PLANCOSTTAXATION_DATA, // 税金默认数据
        marketStatusArray: [],  //项目当前状态
        msgTip: RuleRequired.tipMsg,
        //添加必填项 字段
        //必填项字段
        dataRule: RuleRequired.dataRule(['marketUnitName','constructCode','designTaxRate','saleTaxRate','constructionTaxRate','buildArea','bidPriceTaxation','constructionAmountTax','fileInfoList' ])
      }
    },
    computed: {
    },
    methods: {
      setReq1(name){
          var val = this.dataForm.designAmountTax;
        if(val && (val).toString() !== '0'){
          return name
        }else {
          return ''
        }
      },
      setReq2(name){
        var val = this.dataForm.saleAmountTax;
        if(val && (val).toString() !== '0'){
          return name
        }else {
          return ''
        }
      },
      beforeInit() {
        this.getDataDictByConfigType("立项类型,招投标形式,资质范围,立项类别");
        // 汇总表
        // this.dataForm.planCostSummaryDetailAdjustList = this.getSummeryData;
        // 料工费明细
        // this.dataForm.planCostFeeDetailAdjustList = this.getFeeData;
        // 税金
        // this.dataForm.planCostTaxationDetailAdjustList = this.getCostData;
      },
      //获取详情后的赋值情况
      afterInit() {
        var that = this;
        console.log(this.dataForm, '2222222222222222');
        const obj = this.dataForm;
        that.$nextTick(()=>{
          that.$set(this.dataForm,'planCostCompareDetailAdjustList',obj.planCostCompareDetailAdjustList)
        })
      },
      // 项目编号
      constructCodeUpdateValue(data) {
        const {name,id,code} = data[0];
        this.dataForm.constructCode = code;
        this.dataForm.constructArchiveMainId = id;
        this.dataForm.constructName = name;

        this.getConstructInfoFn();
        this.getPlanCostInfoFn();
      },
      // 获取项目信息
      async getConstructInfoFn(){
        let id = this.dataForm.constructArchiveMainId;
        let res = await getConstructInfo({constructArchiveMainId: id});
        if(res.code === 200){
          const {data} = res;
          this.dataForm.constructionUnitName = data.constructionUnitName;
          this.dataForm.projectManagerName = data.projectManagerName;
          this.dataForm.projectAddress = data.projectAddress;
          this.dataForm.contractInCode = data.contractInCode;
          this.dataForm.contractInMainId = data.contractInMainId;
          this.dataForm.accumulateImageProgressRate = data.accumulateImageProgressRate?data.accumulateImageProgressRate:'';
          this.dataForm.constructionAmountTax = data.constructionAmountTax?data.constructionAmountTax:'';
          this.dataForm.changeConstructionAmountTax = data.changeConstructionAmountTax?data.changeConstructionAmountTax:'';
          this.dataForm.designAmountTax = data.designAmountTax?data.designAmountTax:'';
          this.dataForm.changeDesignAmountTax = data.changeDesignAmountTax?data.changeDesignAmountTax:'';
          this.dataForm.saleAmountTax = data.saleAmountTax?data.saleAmountTax:'';
          this.dataForm.changeSaleAmountTax = data.changeSaleAmountTax?data.changeSaleAmountTax:'';
          this.dataForm.constructionTaxRate = data.constructionTaxRate?data.constructionTaxRate:'';
          this.dataForm.designTaxRate = data.designTaxRate?data.designTaxRate:'';
          this.dataForm.saleTaxRate = data.saleTaxRate?data.saleTaxRate:'';
          this.dataForm.constructionUnitId = data.constructionUnitId;
          this.dataForm.projectManagerId = data.projectManagerId;
        }
      },
      // 获取计划成本信息
      async getPlanCostInfoFn(){
        let id = this.dataForm.constructArchiveMainId;
        let res = await getAdjustConstructInfo({constructArchiveMainId: id});
        if(res.code === 200){
          const {data} = res;
          // this.dataForm = data;
          this.dataForm.bidPriceTaxation = data.bidPriceTaxation; // 投标报价税金
          this.dataForm.originalPlanCostTaxation = data.originalPlanCostTaxation; // 原计划成本税金
          this.dataForm.planCostSummaryDetailAdjustList = data.planCostSummaryDetailAdjustList;// 汇总表
          this.dataForm.planCostCompareDetailAdjustList =  data.planCostCompareDetailAdjustList; // 材料对比表
          this.dataForm.planCostFeeDetailAdjustList = data.planCostFeeDetailAdjustList; // 料工费明细
          this.dataForm.planCostTaxationDetailAdjustList = data.planCostTaxationDetailAdjustList; // 税金表
          var list = this.dataForm.planCostCompareDetailAdjustList;
          var list2 = this.dataForm.planCostFeeDetailAdjustList;
          if(list && list.length > 0){
            this.importPlanCostCompareCount(list,0);
          }
          if(list2 && list2.length >0){
            for(let i in list2){
              this.changeTotalTargetAmountUntax('',list2[i])
            }
          }
        }
      },
      async getDataDictByConfigType(configTypes) {
        const {data, success} = await getDataDictByConfigType({params: {configTypes: configTypes}});
        if (success) {
          if (data && data.length > 0) {
            this.marketStatusArray = data.find(item => item.dataDictType === '项目当前状态')?.dataDict || [];
            this.marketCategoryArray = data.find(item => item.dataDictType === '立项类别')?.dataDict || [];
          }
        }
      },
      // 新增--材料对比表
      handelAdd(){
        if(!this.dataForm.planCostCompareDetailAdjustList) this.dataForm.planCostCompareDetailAdjustList = [];
        this.dataForm.planCostCompareDetailAdjustList.push({
          bidAmountTax: '',
          bidClearPoint: '',
          bidClearRatio: '',
          bidPriceTax: '',
          bidPriceUntax: '',
          bidRate: '',
          constructPlanCostMainId: '',
          designFormula: '',
          differencePrice: '',
          differenceQuantity: '',
          expenseItem: '',
          id: '',
          isDel: '',
          materialType: '',
          planQuantity: '',
          projectQuantity: '',
          pureQuantity: '',
          specification: '',
          targetAmountTax: '',
          targetPoint: '',
          targetPriceTax: '',
          targetPriceUntax: '',
          targetRate: '',
          targetRatio: '',
          unit: '',
          wasteRate: ''
        })
      },


      //自动计算 料工费明细--目标成本(元)
      changeTotalTargetAmountUntax(e,row){
        var amount_1 = 0;
        var amount_2 = 0;
        var list = this.dataForm.planCostFeeDetailAdjustList; //  料工费明细
        var plannedCostSummary = this.dataForm.planCostSummaryDetailAdjustList; // 汇总表
        var type = row.expenseType; //费用类型 (1-人工费;2-材料费;3-间接费)
        var arr = list.filter((item)=>{return item.expenseType === type && (item.expenseType !== '【人工费】' || item.expenseType !== '【材料费】' || item.expenseType !== '【间接费】')});
        // adjustTotalTargetAmountTax adjustTotalTargetAmountUntax
        for(let i in arr){
          amount_1+=Number(arr[i]['adjustTargetAmountTax']);
          amount_2+=Number(arr[i]['adjustTargetAmountUntax']);
        }
        for(let j in list){
          if(type == 1 && list[j].expenseItem == '【人工费】'){
            this.$set(this.dataForm.planCostFeeDetailAdjustList[j], 'adjustTargetAmountTax', amount_1);
            this.$set(this.dataForm.planCostFeeDetailAdjustList[j], 'adjustTargetAmountUntax', amount_2);
            plannedCostSummary.filter(item => item['totalExpenseItem'] === '人工费')[0]['adjustTotalTargetAmountTax'] = amount_1;
            plannedCostSummary.filter(item => item['totalExpenseItem'] === '人工费')[0]['adjustTotalTargetAmountUntax'] = amount_2;
          }else if(type == 2 && list[j].expenseItem == '【材料费】'){
            this.$set(this.dataForm.planCostFeeDetailAdjustList[j], 'adjustTargetAmountTax', amount_1);
            this.$set(this.dataForm.planCostFeeDetailAdjustList[j], 'adjustTargetAmountUntax', amount_2);
            plannedCostSummary.filter(item => item['totalExpenseItem'] === '材料费')[0]['adjustTotalTargetAmountTax'] = amount_1;
            plannedCostSummary.filter(item => item['totalExpenseItem'] === '材料费')[0]['adjustTotalTargetAmountUntax'] = amount_2;
          }else if(type == 3 && list[j].expenseItem == '【间接费】'){
            this.$set(this.dataForm.planCostFeeDetailAdjustList[j], 'adjustTargetAmountTax', amount_1);
            this.$set(this.dataForm.planCostFeeDetailAdjustList[j], 'adjustTargetAmountUntax', amount_2);
            plannedCostSummary.filter(item => item['totalExpenseItem'] === '间接费')[0]['adjustTotalTargetAmountTax'] = amount_1;
            plannedCostSummary.filter(item => item['totalExpenseItem'] === '间接费')[0]['adjustTotalTargetAmountUntax'] = amount_2;
          }
        }
        console.log(amount_1,amount_2);

        this.calculateByPlanCost()
      },
      // 联动计算 -- 汇总表
      calculateByPlanCost(){
        var plannedCostSummary = this.dataForm.planCostSummaryDetailAdjustList;
        var amountTax = this.dataForm.currentContractAmountTax; // 现合同（含税）
        var amountNoTax = this.dataForm.currentContractAmountUntax; // 现合同（无税）
        if(plannedCostSummary.length === 0) return false
        let sumAmount0 = plannedCostSummary.filter(item => item['totalExpenseItem'] === '人工费')[0]['adjustTotalTargetAmountTax'];
        let sumAmount1 = plannedCostSummary.filter(item => item['totalExpenseItem'] === '材料费')[0]['adjustTotalTargetAmountTax'];
        let sumAmount2 = plannedCostSummary.filter(item => item['totalExpenseItem'] === '专业分包合同')[0]['adjustTotalTargetAmountTax'];
        let sumAmount3 = plannedCostSummary.filter(item => item['totalExpenseItem'] === '间接费')[0]['adjustTotalTargetAmountTax'];
        let sumAmount4 = plannedCostSummary.filter(item => item['totalExpenseItem'] === '利息支出(资金占用费)')[0]['adjustTotalTargetAmountTax'];
        let sumAmount00 = plannedCostSummary.filter(item => item['totalExpenseItem'] === '人工费')[0]['adjustTotalTargetAmountUntax'];
        let sumAmount11 = plannedCostSummary.filter(item => item['totalExpenseItem'] === '材料费')[0]['adjustTotalTargetAmountUntax'];
        let sumAmount22 = plannedCostSummary.filter(item => item['totalExpenseItem'] === '专业分包合同')[0]['adjustTotalTargetAmountUntax'];
        let sumAmount33 = plannedCostSummary.filter(item => item['totalExpenseItem'] === '间接费')[0]['adjustTotalTargetAmountUntax'];
        let sumAmount44 = plannedCostSummary.filter(item => item['totalExpenseItem'] === '利息支出(资金占用费)')[0]['adjustTotalTargetAmountUntax'];
        let sumAmount5 = this.dataForm.adjustPlanCostTaxation; // 增值税附加
        let allSumAmount1 = Number(sumAmount0) + Number(sumAmount1) + Number(sumAmount2) + Number(sumAmount3) + Number(sumAmount4) + Number(sumAmount5); //项目成本合计（含税）
        allSumAmount1 = allSumAmount1?Object.tofixed(allSumAmount1,2):'';
        if(allSumAmount1){
          plannedCostSummary.filter(item => item['totalExpenseItem'] === '项目成本合计')[0]['adjustTotalTargetAmountTax'] = Number(allSumAmount1) ;
        }
        let allSumAmount2 = Number(sumAmount00) + Number(sumAmount11) + Number(sumAmount22) + Number(sumAmount33) + Number(sumAmount44); //项目成本合计（无税）
        allSumAmount2 = allSumAmount2?Object.tofixed(allSumAmount2,2):'';
        if(allSumAmount2){
          plannedCostSummary.filter(item => item['totalExpenseItem'] === '项目成本合计')[0]['adjustTotalTargetAmountUntax'] = Number(allSumAmount2);
        }
        let val3 = 0;
        if (Number(amountTax) === 0) {
          val3 = 0;
        } else {
          val3 = (Number(amountTax) - Number(allSumAmount1)) / Number(amountTax); //项目利润率（含税）
          val3 = val3?Object.tofixed(val3,4):'';
          plannedCostSummary.filter(item => item['totalExpenseItem'] === '项目利润率(%)')[0]['adjustTotalTargetAmountTax'] = Number(val3);
        }
        let val33 = 0;
        if (Number(amountNoTax) === 0) {
          val33 = 0;
        } else {
          val33 = (Number(amountNoTax) - Number(allSumAmount2)) / Number(amountNoTax); //项目利润率（无税）
          val33 = val33?Object.tofixed(val33,4):'';
          plannedCostSummary.filter(item => item['totalExpenseItem'] === '项目利润率(%)')[0]['adjustTotalTargetAmountUntax'] =  Number(val33);
        }
        let num = this.dataForm.buildArea; // 建筑面积
        let contractAmountTax = this.dataForm.currentContractAmountTax; // 现合同金额（含税）
        if(num && contractAmountTax){
          let amount1 = contractAmountTax/num;
          amount1 = amount1?Object.tofixed(amount1,2):'';
          this.$set(this.dataForm,'singleContractAmount',amount1); // 单方面合同造价
        }

        let sumTotalTargetAmountTax = 0; // 汇总表tab的目标成本(含税)所在列的"项目成本合计"
        sumTotalTargetAmountTax = plannedCostSummary.filter(item => item['totalExpenseItem'] === '项目成本合计')[0]['adjustTotalTargetAmountTax'];
        if(num && sumTotalTargetAmountTax){
          let amount2 = sumTotalTargetAmountTax/num;
          amount2 = amount2?Object.tofixed(amount2,2):'';
          this.$set(this.dataForm,'singleTargetAmount',amount2);// 单方目标成本
        }
      },
      // 联动结算
      sumAmountTaxChange(e,name){
        var that = this;
        var val = Number(e);
        var sumAmount = 0;
        if(name === 'constructionAmountTax'){
          let contructionAmountTax = that.dataForm.changeConstructionAmountTax; // --施工金额增补(含税)
          contructionAmountTax = contructionAmountTax?contructionAmountTax:'';
          let constructionTaxRate = that.dataForm.constructionTaxRate; // --施工税率
          sumAmount = (val + Number(contructionAmountTax))/(1+Number(constructionTaxRate));
          sumAmount = Object.tofixed(sumAmount,2);
          that.$set(that.dataForm,'totalContructionAmountTax',sumAmount); // --施工总金额(无税)
        }else if(name === 'designAmountTax'){
          let designAmountTax = that.dataForm.changeDesignAmountTax; // --设计金额增补(含税)
          designAmountTax = designAmountTax?designAmountTax:'';
          let designTaxRate = that.dataForm.designTaxRate; // -- 设计税率
          sumAmount = (val + Number(designAmountTax))/(1+Number(designTaxRate));
          sumAmount = Object.tofixed(sumAmount,2);
          that.$set(that.dataForm,'totalDesignAmountTax',sumAmount); // --设计总金额(无税)
        }else if(name === 'saleAmountTax'){
          let saleAmountTax = that.dataForm.changeSaleAmountTax; // --销售金额增补(含税)
          saleAmountTax = saleAmountTax?saleAmountTax:'';
          let saleTaxRate = that.dataForm.saleTaxRate; // -- 销售税率
          sumAmount = (val + Number(saleAmountTax))/(1+Number(saleTaxRate));
          sumAmount = Object.tofixed(sumAmount,2);
          that.$set(that.dataForm,'totalSaleAmountTax',sumAmount); // --销售总金额(无税)
        }
        var currentContractAmountUntax = Number(that.dataForm.totalContructionAmountTax) + Number(that.dataForm.totalDesignAmountTax) + Number(that.dataForm.totalContructionAmountTax);
        currentContractAmountUntax = currentContractAmountUntax?currentContractAmountUntax:'';
        that.dataForm.currentContractAmountUntax = Object.tofixed(currentContractAmountUntax,2); // 现合同金额(无税)
        var currentContractAmountTax = Number(that.dataForm.constructionAmountTax) + Number(that.dataForm.changeConstructionAmountTax) + Number(that.dataForm.designAmountTax)+Number(that.dataForm.changeDesignAmountTax)+Number(that.dataForm.saleAmountTax)+Number(that.dataForm.changeSaleAmountTax);
        currentContractAmountTax = currentContractAmountTax?currentContractAmountTax:'';
        that.dataForm.currentContractAmountTax = Object.tofixed(currentContractAmountTax,2); // 现合同金额(有税)
        this.calculateByPlanCost();
      },
      // 施工税率
      constructionRateUpdate(data){
        const {taxRate, id} = data[0];
        this.dataForm.constructionTaxRate = taxRate;

        // 联动计算
        var amount = this.dataForm.constructionAmountTax;
        this.sumAmountTaxChange(amount,'constructionAmountTax');
      },
      // 设计税率
      designTaxRateUpdate(data){
        const {taxRate, id} = data[0];
        this.dataForm.designTaxRate = taxRate;
        // 联动计算
        var amount = this.dataForm.designAmountTax;
        this.sumAmountTaxChange(amount,'designAmountTax');
      },
      // 销售税率
      saleTaxRateUpdate(data){
        const {taxRate, id} = data[0];
        this.dataForm.saleTaxRate = taxRate;
        // 联动计算
        var amount = this.dataForm.saleAmountTax;
        this.sumAmountTaxChange(amount,'saleAmountTax');
      },
      // 对比表 --投标报价税率
      bidRateRateUpdate(data,index){
        const {taxRate, id} = data[0];
        this.$set(this.dataForm.planCostCompareDetailAdjustList[index], 'bidRate', taxRate);
      },
      // 对比表 --目标成本税率
      targetRateUpdate(data,index){
        const {taxRate, id} = data[0];
        this.$set(this.dataForm.planCostCompareDetailAdjustList[index], 'targetRate', taxRate);
      },
      // 保留两位小数
      changeTofixed(e,name){
        var that = this;
        var val = Number(e)?Number(e):'';
        if(typeof val == 'number'){
          val = Object.tofixed(val,2);
          that.$set(that.dataForm,name,Number(val));
        }else {
          that.$set(that.dataForm,name,'');
        }
        this.calculateByBuildArea();
        this.$forceUpdate();
      },
      // 保留四位小数
      changeTofixed4(e,index,name){
        var that = this;
        var val = Number(e)?Number(e):'';
        if(typeof val == 'number'){
          val = Object.tofixed(val,4);
          that.$set(that.dataForm.planCostCompareDetailAdjustList[index], name, val);
        }else {
          that.$set(that.dataForm.planCostCompareDetailAdjustList[index], name, '');
        }
        if(name == 'projectQuantity' || name == 'bidPriceTax'){
          var quantity = that.dataForm.planCostCompareDetailAdjustList[index]['projectQuantity']; //工程量
          var priceTax = that.dataForm.planCostCompareDetailAdjustList[index]['bidPriceTax']; //投标 单价（含税）
          if(quantity && priceTax){
            let amount1 = Number(quantity) * Number(priceTax);
            that.$set(that.dataForm.planCostCompareDetailAdjustList[index], 'bidAmountTax', Object.tofixed(amount1,2)); //投标 金额
          }
        }else if(name == 'projectQuantity' || name == 'targetPriceTax'){
          var quantity3 = that.dataForm.planCostCompareDetailAdjustList[index]['projectQuantity']; //工程量
          var targetPriceTax = that.dataForm.planCostCompareDetailAdjustList[index]['targetPriceTax']; //目标成本 单价（含税）
          if(quantity3 && targetPriceTax){
            let amount3 = Number(quantity3) * Number(targetPriceTax);
            that.$set(that.dataForm.planCostCompareDetailAdjustList[index], 'targetAmountTax', Object.tofixed(amount3,2)); //目标成本 金额
          }
        }else if(name == 'bidPriceUntax' || name == 'targetPriceUntax'){
          var bidPriceUn = that.dataForm.planCostCompareDetailAdjustList[index]['bidPriceUntax']; //投标单价（无税）
          var targetPriceUn = that.dataForm.planCostCompareDetailAdjustList[index]['targetPriceUntax']; //目标成本单价（无税）
          var differencePrice = Number(bidPriceUn)-Number(targetPriceUn); // 投标报价的 单价(无税)-目标成本的 单价(无税)
          differencePrice = Object.tofixed(differencePrice,2);
          that.$set(that.dataForm.planCostCompareDetailAdjustList[index], 'differencePrice', Object.tofixed(differencePrice,2)); //价差
          var targetRatio = '';
          if(bidPriceUn != 0){
             targetRatio = Number(differencePrice)/Number(bidPriceUn); //价差/投标报价的 单价(无税)
             targetRatio = Object.tofixed(targetRatio,4)
          }
          that.$set(that.dataForm.planCostCompareDetailAdjustList[index], 'targetRatio', targetRatio); //目标成本 比例
          var targetPoint = '';
          if (targetPriceUn && bidPriceUn == 0) {
            targetPoint = '漏项'
          } else if (Number(targetRatio) >= 0.1) {
            targetPoint= '盈利';
          } else if (Number(targetRatio) < 0) {
            targetPoint= '亏损';
          } else if (Number(targetRatio) >= 0 && Number(targetRatio) < 0.1) {
            targetPoint = '';
          }
          that.$set(that.dataForm.planCostCompareDetailAdjustList[index], 'targetPoint', targetPoint); //目标成本 经营点
        } else if(name == 'pureQuantity'){
          // 清标工程量
          var pureQuantity = that.dataForm.planCostCompareDetailAdjustList[index]['pureQuantity']; //净用量
          var wasteRate = that.dataForm.planCostCompareDetailAdjustList[index]['wasteRate']; // 损耗率
          var quantity2 = that.dataForm.planCostCompareDetailAdjustList[index]['projectQuantity']; //工程量
          if(pureQuantity && wasteRate){
            let amount2 = Number(pureQuantity) * (1+Number(wasteRate));
            amount2 = Object.tofixed(amount2,2);
            that.$set(that.dataForm.planCostCompareDetailAdjustList[index], 'planQuantity', amount2); // 计划用量
            var diffQuantity = Number(amount2)-Number(quantity2) ; // 计划用量-工程量
            diffQuantity = Object.tofixed(diffQuantity,2);
            that.$set(that.dataForm.planCostCompareDetailAdjustList[index], 'differenceQuantity', diffQuantity); // 量差
            if(quantity2 != 0){
              var bidClearRatio = Number(diffQuantity)/Number(quantity2); // 量差/工程量
              bidClearRatio = Object.tofixed(bidClearRatio,4);
              that.$set(that.dataForm.planCostCompareDetailAdjustList[index], 'bidClearRatio', bidClearRatio); // 比例
              var bidClearPoint = ''; // 经营点
              if(quantity2 == 0 && amount2){
                bidClearPoint = '漏项';
              }else if(Number(bidClearRatio) >= 0.05){
                bidClearPoint = '多量';
              }else if(Number(bidClearRatio) < -0.05){
                bidClearPoint = '少量'
              }else if(Number(bidClearRatio) >= -0.05 && Number(bidClearRatio) < 0.05){
                bidClearPoint = ''
              }
              that.$set(that.dataForm.planCostCompareDetailAdjustList[index], 'bidClearPoint', bidClearPoint); //清标 经营点
            }

          }
        }
        that.$forceUpdate();
      },
      // 联动计算--对比表--计划用量
      changeWasteRate(e,index){
        var that = this;
        var pureQuantity = that.dataForm.planCostCompareDetailAdjustList[index]['pureQuantity']; //净用量
        var wasteRate = that.dataForm.planCostCompareDetailAdjustList[index]['wasteRate']; // 损耗率
        var quantity2 = that.dataForm.planCostCompareDetailAdjustList[index]['projectQuantity']; //工程量
        if(pureQuantity && wasteRate){
          let amount2 = Number(pureQuantity) * (1+Number(wasteRate));
          amount2 = Object.tofixed(amount2,2);
          that.$set(that.dataForm.planCostCompareDetailAdjustList[index], 'planQuantity', amount2); // 计划用量
          var diffQuantity = Number(amount2)-Number(quantity2) ; // 计划用量-工程量
          diffQuantity = Object.tofixed(diffQuantity,2);
          that.$set(that.dataForm.planCostCompareDetailAdjustList[index], 'differenceQuantity', diffQuantity); // 量差
          var bidClearRatio = '';
          if(quantity2 != 0){
            bidClearRatio = Number(diffQuantity)/Number(quantity2); // 量差/工程量
            bidClearRatio = Object.tofixed(bidClearRatio,4);
            that.$set(that.dataForm.planCostCompareDetailAdjustList[index], 'bidClearRatio', bidClearRatio); // 比例
          }
          var bidClearPoint = ''; // 经营点
          if(quantity2 == 0 && amount2){
            bidClearPoint = '漏项';
          }else if(Number(bidClearRatio) >= 0.05){
            bidClearPoint = '多量';
          }else if(Number(bidClearRatio) < -0.05){
            bidClearPoint = '少量'
          }else if(Number(bidClearRatio) >= -0.05 && Number(bidClearRatio) < 0.05){
            bidClearPoint = ''
          }
          that.$set(that.dataForm.planCostCompareDetailAdjustList[index], 'bidClearPoint', bidClearPoint); //目标成本 经营点
        }
      },
      // 联动计算 -- 建筑面积
      calculateByBuildArea(){
        let num = this.dataForm.buildArea; // 建筑面积
        let contractAmountTax = this.dataForm.currentContractAmountTax; // 现合同金额（含税）
        if(num && contractAmountTax){
          let amount1 = contractAmountTax/num;
          this.$set(this.dataForm,'singleContractAmount',Object.tofixed(amount1,2)); // 单方面合同造价
        }

        const plannedCostSummary = this.dataForm.planCostSummaryDetailAdjustList;
        let sumTotalTargetAmountTax = 0; // 汇总表tab的目标成本(含税)所在列的"项目成本合计"
        sumTotalTargetAmountTax = plannedCostSummary.filter(item => item['totalExpenseItem'] === '项目成本合计')[0]['adjustTotalTargetAmountTax'];
        if(num && sumTotalTargetAmountTax){
          let amount2 = sumTotalTargetAmountTax/num;
          this.$set(this.dataForm,'singleTargetAmount',Object.tofixed(amount2,2));// 单方目标成本
        }
        this.calculateByPlanCost();

      },
      //汇总表--增值税附加赋值
      planCostTaxationChange(){
        var plannedCostSummary = this.dataForm.planCostSummaryDetailAdjustList;
        var val = this.dataForm.adjustPlanCostTaxation;
        plannedCostSummary.filter(item => item['totalExpenseItem'] === '增值税及附加')[0]['adjustTotalTargetAmountTax'] = Number(val);
        this.calculateByPlanCost();
        this.$forceUpdate();
      },
      // 汇总表--项目分包合同 or 利息支出
      changeTotalTargetAmount1(){
        this.calculateByPlanCost();
      },
      changeTotalTargetAmount2(){
        this.calculateByPlanCost();
      },
      // 唯一性校验
      async vaildateOnlyData(){
        let id = this.dataForm.constructMainId;
        let res = await checkOnlyAdjustData({constructArchiveMainId: id});
        if(res.code === 200){
          return true;
        }else{
          FUI.Window.showMsg(res.msg);
          return false;
        }

      },
      validateForm() {
        const _this = this;
        var list = _this.dataForm.planCostCompareDetailAdjustList;
        if(list.length === 0){
          FUI.Window.showMsg('材料对比表至少有一行数据');
          return false;
        }else if(_this.vaildTableList() === false){ // 校验对比表信息完整
          return false;
        }
        if(_this.vaildateOnlyData() === false){
          return false;
        }
        return new Promise(resolve => {
          _this.$refs['dataForm'].validate(valid => {
            if (valid) {
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
        const dataForm = JSON.parse(JSON.stringify(this.dataForm));
        return dataForm;
      },
      // 校验对比表信息完整
      vaildTableList(){
        var isOk = false;
        // 判断table内输入框必填
        var arr = this.dataForm.planCostCompareDetailAdjustList; // 对比表
        if (arr.length > 0) {
          for (var j = 0; j < arr.length; j++) {
            if (arr[j]) {
              var expenseItem = (arr[j].expenseItem).toString(); //费用项目
              var specification = (arr[j].specification).toString(); //规格型号
              var unit = (arr[j].unit).toString(); // 单位
              var projectQuantity = (arr[j].projectQuantity).toString(); // 工程量
              var bidPriceUntax = (arr[j].bidPriceUntax).toString(); //投标报价 单价(无税)
              var bidRate = (arr[j].bidRate).toString(); // 	投标报价税率
              var bidPriceTax = (arr[j].bidPriceTax).toString(); // 投标报价单价（含税）
              var pureQuantity = (arr[j].pureQuantity).toString(); // 净用量
              var wasteRate = (arr[j].wasteRate).toString(); // 损耗率
              var materialType = (arr[j].materialType).toString(); // 材料类别
              var targetPriceUntax = (arr[j].targetPriceUntax).toString(); //目标成本单价(无税)
              var targetRate = (arr[j].targetRate).toString(); //目标成本税率
              var targetPriceTax = (arr[j].targetPriceTax).toString(); //目标成本 单价（含税）


              if (expenseItem && specification && unit && projectQuantity && bidPriceUntax && bidRate && bidPriceTax && pureQuantity && wasteRate && materialType && targetPriceUntax && targetRate && targetPriceTax) {
                return !isOk;
              } else {
                var msg = '';
                var oIndex = j+1; // 行号
                if(!expenseItem) msg = '材料对比表中，第'+oIndex+'行的费用项目不能为空';
                if(!specification) msg = '材料对比表中，第'+oIndex+'行的规格型号不能为空';
                if(!unit) msg = '材料对比表中，第'+oIndex+'行的单位不能为空';
                if(!projectQuantity) msg = '材料对比表中，第'+oIndex+'行的工程量不能为空';
                if(!bidPriceUntax) msg = '材料对比表中，第'+oIndex+'行的 投标报价--单价(无税) 不能为空';
                if(!bidRate) msg = '材料对比表中，第'+oIndex+'行的 投标报价--税率 不能为空';
                if(!bidPriceTax) msg = '材料对比表中，第'+oIndex+'行的 投标报价--单价（含税）不能为空';
                if(!pureQuantity) msg = '材料对比表中，第'+oIndex+'行的净用量不能为空';
                if(!wasteRate) msg = '材料对比表中，第'+oIndex+'行的损耗率不能为空';
                if(!materialType) msg = '材料对比表中，第'+oIndex+'行的材料类别不能为空';
                if(!targetPriceUntax) msg = '材料对比表中，第'+oIndex+'行的 目标成本--单价(无税) 不能为空';
                if(!targetRate) msg = '材料对比表中，第'+oIndex+'行的 目标成本--税率 不能为空';
                if(!targetPriceTax) msg = '材料对比表中，第'+oIndex+'行的 目标成本--单价（含税）不能为空';

                FUI.Window.showMsg2(msg);
                return isOk
              }
            }
          }

        }
      },
      // 汇总表导出
      async handelExportSummary(){
        let isOk = false;
        let url = '/construct/planCostSummaryDetailAdjust/exportData';
        let id = this.dataForm.id;
        if(id){
          let param = {
            constructPlanCostMainId: id
          };
          await exportDataDetails(url, param)
        }else {
          FUI.Window.showMsg('请暂存或提交表单后，再进行导出操作！');
          return isOk
        }

      },
      // 料工费明细导入
       handelImportPlanCostFee(){
        this.commonImportData.visible = true;
        this.commonImportData.tableName = 'planCostFeeDetailAdjustList';
        this.keyWord = 'planCostFeeDetailAdjust';
        this.modelName = 'construct'
      },
      // 料工费明细导出
      async handelExportPlanCostFee(){
        let isOk = false;
        let url = '/construct/planCostFeeDetailAdjust/exportData';
        let id = this.dataForm.id;
        if(id){
          let param = {
            constructPlanCostMainId: id
          };
          await exportDataDetails(url, param)
        }else {
          FUI.Window.showMsg('请暂存或提交表单后，再进行导出操作！');
          return isOk
        }

      },
      //材料对比表导出
      async handelExportPlanCostCompare(){
        let isOk = false;
        let url = '/construct/planCostCompareDetailAdjust/exportData';
        let id = this.dataForm.id;
        if(id){
          let param = {
            constructPlanCostMainId: id
          };
          await exportDataDetails(url, param)
        }else {
          FUI.Window.showMsg('请暂存或提交表单后，再进行导出操作！');
          return isOk
        }
      },
      // 材料对比表导入
      handelImportPlanCostCompare(){
        this.commonImportData.visible = true;
        this.commonImportData.tableName = 'planCostCompareDetailAdjustList';
        this.keyWord = 'planCostCompareDetailAdjust';
        this.modelName = 'construct'
      },
      // 导入返回
      importSuccess(tableName,rows){
        if(rows && rows.length >0){
          if(tableName === 'planCostFeeDetailAdjustList'){
            console.log(rows,'123');
            const list = this.dataForm.planCostFeeDetailAdjustList;
            for(let i in rows){
              for(let j in list){
                 if(list[j].expenseItem === rows[i].expenseItem){
                   list[j].targetAmountUntax = rows[i].targetAmountUntax;
                   list[j].targetAmountTax = rows[i].targetAmountTax;
                 }else if(rows[i].expenseItem === '人工其他' && list[j].expenseItem === '其他'){
                   list[j].targetAmountUntax = rows[i].targetAmountUntax;
                   list[j].targetAmountTax = rows[i].targetAmountTax;
                 }
              }
            }
            for(let n in list){
              this.changeTotalTargetAmountUntax('',list[n]);
            }
          }else if(tableName === 'planCostCompareDetailAdjustList'){
            console.log(rows,'567');
            this.importPlanCostCompareCount(rows,1);
          }
        }
        this.commonImportData.visible = false;
        this.keyWord = '';
        this.modelName = ''
      },
      // 导入对比表联动计算
      importPlanCostCompareCount(rows,oIndex){
        const list = this.dataForm.planCostCompareDetailAdjustList;
        for(let i in rows){
          var quantity = rows[i]['projectQuantity']; //工程量
          var priceTax = rows[i]['bidPriceTax']; //投标 单价（含税）
          var targetPriceTax = rows[i]['targetPriceTax']; //目标成本 单价（含税）
          var pureQuantity = rows[i]['pureQuantity']; //净用量
          var wasteRate = rows[i]['wasteRate']; // 损耗率
          if(quantity && priceTax){
            let amount1 = Number(quantity) * Number(priceTax);
            rows[i]['bidAmountTax'] = Object.tofixed(amount1,2); //投标 金额
          }
          if(quantity && targetPriceTax){
            let amount3 = Number(quantity) * Number(targetPriceTax);
            rows[i]['targetAmountTax'] = Object.tofixed(amount3,2);  //目标成本 金额
          }
          var bidPriceUn = rows[i]['bidPriceUntax']; //投标单价（无税）
          var targetPriceUn = rows[i]['targetPriceUntax']; //目标成本单价（无税）
          var differencePrice = Number(bidPriceUn)-Number(targetPriceUn); // 投标报价的 单价(无税)-目标成本的 单价(无税)
          differencePrice = Object.tofixed(differencePrice,2);
          rows[i]['differencePrice'] = differencePrice; //价差
          var targetRatio = '';
          if(bidPriceUn != 0){
            targetRatio = Number(differencePrice)/Number(bidPriceUn); //价差/投标报价的 单价(无税)
            targetRatio = Object.tofixed(targetRatio,4)
          }
          rows[i]['targetRatio'] = targetRatio; //目标成本 比例
          var targetPoint = '';
          if (targetPriceUn && bidPriceUn == 0) {
            targetPoint = '漏项'
          } else if (Number(targetRatio) >= 0.1) {
            targetPoint= '盈利';
          } else if (Number(targetRatio) < 0) {
            targetPoint= '亏损';
          } else if (Number(targetRatio) >= 0 && Number(targetRatio) < 0.1) {
            targetPoint = '';
          }
          rows[i]['targetPoint'] = targetPoint; //目标成本 经营点
          //------------------------------- 清标工程量-------------------------------------------
          if(pureQuantity && wasteRate){
            let amount2 = Number(pureQuantity) * (1+Number(wasteRate));
            amount2 = Object.tofixed(amount2,2);
            rows[i]['planQuantity'] = amount2;
            var diffQuantity = Number(amount2)-Number(quantity) ; // 计划用量-工程量
            diffQuantity = Object.tofixed(diffQuantity,2);
            rows[i]['differenceQuantity'] = diffQuantity;// 量差

            if(quantity != 0){
              var bidClearRatio = Number(diffQuantity)/Number(quantity); // 量差/工程量
              bidClearRatio = Object.tofixed(bidClearRatio,4);
              rows[i]['bidClearRatio'] = bidClearRatio;// 比例
              var bidClearPoint = ''; // 经营点
              if(quantity == 0 && amount2){
                bidClearPoint = '漏项';
              }else if(Number(bidClearRatio) >= 0.05){
                bidClearPoint = '多量';
              }else if(Number(bidClearRatio) < -0.05){
                bidClearPoint = '少量'
              }else if(Number(bidClearRatio) >= -0.05 && Number(bidClearRatio) < 0.05){
                bidClearPoint = ''
              }
              rows[i]['bidClearPoint'] = bidClearPoint;//目标成本 经营点
            }

          }
          if(oIndex == 1){
            list.push(rows[i]);
          }
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  @import url('../../style/form.scss');

  .commponent-height {
    height: 32px;
    line-height: 32px;
  }

  .el-upload__prompt {
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
</style>
