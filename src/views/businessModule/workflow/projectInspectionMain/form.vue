<template>
  <!-- 项目巡检表单 -->
  <div>
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="180px" :disabled="setting.readonly">
      <row-layout :cols="3" title="项目信息" class="form-box">
        <template slot="col_1">
          <el-form-item prop="code" label="单据编号：">
            <el-input v-model="dataForm.code" disabled size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="managerDeptName" label="管理部门：">
            <el-input v-model="dataForm.managerDeptName" disabled size="small" />
          </el-form-item>
          <el-form-item prop="inspectionStartDate" label="巡检开始日期：">
            <el-date-picker v-model="dataForm.inspectionStartDate" value-format="yyyy-MM-dd" type="date"
              placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item prop="inspectionType" label="巡检类型：">
            <el-radio-group v-model="dataForm.inspectionType">
              <el-radio :label="item.configValue" :key="item.configValue" v-for="item in inspectionTypeOptions">{{
                item.configName }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="constructCode" label="项目编号：">
            <select-dialog :width="800" :height="360" :value="dataForm.constructCode" @updateValue="selectConstructCode"
              :isLinkBtn="true" :modelData="contractInProjectModelData" dynamicModel="customDialog"></select-dialog>
          </el-form-item>
          <el-form-item prop="constructManager" label="项目负责人：">
            <el-input v-model="dataForm.constructManager" disabled size="small" :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="inspectionEndDate" label="巡检结束日期：">
            <el-date-picker v-model="dataForm.inspectionEndDate" value-format="yyyy-MM-dd" type="date"
              placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="constructName" label="项目名称：">
            <el-input v-model="dataForm.constructName" disabled size="small" />
          </el-form-item>
          <el-form-item prop="constructManagerPhone" label="项目负责人联系电话：">
            <el-input v-model="dataForm.constructManagerPhone" disabled size="small"
              :placeholder="pleaseEnterPlaceHolder" />
          </el-form-item>
          <el-form-item prop="constructPhase" label="项目施工阶段：">
            <el-radio-group v-model="dataForm.constructPhase">
              <el-radio :label="item.configValue" :key="item.configValue" v-for="item in constructPhaseOptions">{{
                item.configName }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </row-layout>

      <row-layout :cols="1" title="本次集团公司抽巡检参与人员：（含项目所属经济实体巡检分管负责人或其委托人）">
        <el-form-item slot="col_1" label-width="0">
          <subFormTab v-model="dataForm.userDetailList" ref="subFormTab" :disabled="setting.readonly" />
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" title="本次项目抽巡检结论">
        <template slot="col_1">
          <el-table :data="inspectionTab" fit :border="true" class="f2bpmui-datagrid-vuetable border-show"
            :show-header="false">
            <el-table-column label="label" :align="'center'" class-name="d3-table__cell" width="360px">
              <template slot-scope="scope">
                <div class="is_required">{{ scope.row.label }}</div>
              </template>
            </el-table-column>
            <el-table-column label="code">
              <template slot-scope="scope">
                <el-form-item slot="col_1" label-width="0" prop="theInspectionTotalResult"
                  v-if="scope.row.code === 'theInspectionTotalResult'">
                  <el-radio-group v-model="dataForm.theInspectionTotalResult">
                    <el-radio :label="item.configValue" :key="item.configValue"
                      v-for="item in inspectionTotalResultOptions">{{ item.configName }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item slot="col_1" label-width="0" prop="theInspectionRiskLevel"
                  v-if="scope.row.code === 'theInspectionRiskLevel'">
                  <el-radio-group v-model="dataForm.theInspectionRiskLevel"
                    v-if="scope.row.code === 'theInspectionRiskLevel'">
                    <el-radio :label="item.configValue" :key="item.configValue"
                      v-for="item in inspectionRiskLevelOptions">{{ item.configName }}
                      <span :class="`radio-color-box radio-color-${item.configValue}`"></span>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <div v-if="scope.row.code === 'isNeedRectification'">
                  <row-layout :cols="3" marginStyle="margin: 0">
                    <el-form-item slot="col_1" label-width="0" prop="isNeedRectification">
                      <el-radio-group v-model="dataForm.isNeedRectification" @change="changeNeedRectification">
                        <el-radio :label="item.label" :key="item.name" v-for="item in radioData">{{ item.name
                        }}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item slot="col_2" label="整改完成日期：" label-width="120"
                      :prop="dataForm.isNeedRectification == '1' ? 'rectificationDate' : ''"
                      v-if="dataForm.isNeedRectification == '1'">
                      <el-date-picker v-model="dataForm.rectificationDate" value-format="yyyy-MM-dd" type="date"
                        placeholder="选择日期时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item slot="col_3" label="整改完成状态：" label-width="120"
                      v-if="dataForm.isNeedRectification == '1'">
                      <el-select v-model="dataForm.rectificationState" placeholder="请选择" size="small" style="width:100%"
                        disabled>
                        <el-option v-for="(item) in rectificationStateOptions" :key="item.configValue"
                          :label="item.configName" :value="item.configValue"></el-option>
                      </el-select>
                    </el-form-item>
                  </row-layout>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </row-layout>
      <row-layout :cols="1" title="项目团队成员到位情况">
        <template slot="col_1">
          <el-table :data="teamMembersTab" fit :border="true" class="f2bpmui-datagrid-vuetable"
            :span-method="teamMembersTabSpanMethod">
            <el-table-column label="岗位设置">
              <template slot-scope="scope">
                <div>{{ scope.row.label }}</div>
              </template>
            </el-table-column>
            <el-table-column label="项目经理" :align="'center'">
              <template slot-scope="scope">
                <el-checkbox v-model="dataForm['constructManagerSituation' + scope.row.val]"
                  :true-label="scope.row.val">{{ }}</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="生产经理" :align="'center'">
              <template slot-scope="scope">
                <el-checkbox v-model="dataForm['produceManagerSituation' + scope.row.val]" :true-label="scope.row.val">{{
}}</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="技术负责人" :align="'center'">
              <template slot-scope="scope">
                <el-checkbox v-model="dataForm['technologyManagerSituation' + scope.row.val]"
                  :true-label="scope.row.val">{{ }}</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="安全员" :align="'center'">
              <template slot-scope="scope">
                <el-checkbox v-model="dataForm['safetyOfficerSituation' + scope.row.val]" :true-label="scope.row.val">{{
}}</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="质量员" :align="'center'">
              <template slot-scope="scope">
                <el-checkbox v-model="dataForm['qulityOfficerSituation' + scope.row.val]" :true-label="scope.row.val">{{
}}</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="施工员" :align="'center'">
              <template slot-scope="scope">
                <el-checkbox v-model="dataForm['constructOfficerSituation' + scope.row.val]"
                  :true-label="scope.row.val">{{ }}</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="预算员" :align="'center'">
              <template slot-scope="scope">
                <el-checkbox v-model="dataForm['estimateClerkSituation' + scope.row.val]" :true-label="scope.row.val">{{
}}</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="采购员" :align="'center'">
              <template slot-scope="scope">
                <el-checkbox v-model="dataForm['purchaserSituation' + scope.row.val]" :true-label="scope.row.val">{{
}}</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="仓管员" :align="'center'">
              <template slot-scope="scope">
                <el-checkbox v-model="dataForm['warehouseKeeperSituation' + scope.row.val]" :true-label="scope.row.val">{{
}}</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="深化设计" :align="'center'">
              <template slot-scope="scope">
                <el-checkbox v-model="dataForm['detailedDesignSituation' + scope.row.val]" :true-label="scope.row.val">{{
}}</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="资料员" :align="'center'">
              <template slot-scope="scope">
                <el-checkbox v-model="dataForm['documenterSituation' + scope.row.val]" :true-label="scope.row.val">{{
}}</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="劳务员" :align="'center'">
              <template slot-scope="scope">
                <el-checkbox v-model="dataForm['laborPersonnel' + scope.row.val]" :true-label="scope.row.val">{{
}}</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column >
              <template slot="header" slot-scope="scope">
                <span class="unhidden is_required">按本项目规模及合同要求，本项目团队是否满足本项目管理需求</span>
              </template>
              <el-table-column label="满足" :align="'center'">
                <template slot="header">
                  <div class="color-h35 color-green">满足</div>
                </template>
                <template slot-scope="scope">
                  <el-radio v-model="dataForm.isTheRequirements" label="1">{{ }}</el-radio>
                </template>
              </el-table-column>
              <el-table-column label="基本满足" :align="'center'">
                <template slot="header">
                  <div class="color-h35 color-yellow">基本满足</div>
                </template>
                <template slot-scope="scope">
                  <el-radio v-model="dataForm.isTheRequirements" label="2">{{ }}</el-radio>
                </template>
              </el-table-column>
              <el-table-column label="不能满足" :align="'center'">
                <template slot="header">
                  <div class="color-h35 color-red">不能满足</div>
                </template>
                <template slot-scope="scope">
                  <el-radio v-model="dataForm.isTheRequirements" label="3">{{ }}</el-radio>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </template>
        <template slot="col_1">
          <el-form-item prop="inspectionSituation" label="检查情况：" :style="{ 'margin': '14px 0 0 0' }" label-width="160px">
            <el-input v-model="dataForm.inspectionSituation" type="textarea" :rows="3" placeholder="请输入500字以内的描述"
              maxlength="500" show-word-limit />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" title="工程形象进度巡检情况">
        <template slot="col_1">
          <el-table :data="projectImageProgressInspectionStatus" fit :border="true" class="f2bpmui-datagrid-vuetable ">
            <el-table-column label="开工-竣工（完工）时间" :align="'center'">
              <el-table-column label="合同" :align="'center'">
                <el-table-column :align="'center'">
                  <template slot="header">
                    <div class="">开工</div>
                  </template>
                  <template slot-scope="scope">
                    <el-form-item label-width="0" prop="contractStartTime">
                      <el-date-picker v-model="dataForm.contractStartTime" value-format="yyyy-MM-dd" type="date"
                        placeholder="选择日期时间" disabled></el-date-picker>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column :align="'center'">
                  <template slot="header">
                    <div class="">竣工</div>
                  </template>
                  <template slot-scope="scope">
                    <el-form-item label-width="0" prop="contractEndTime">
                      <el-date-picker v-model="dataForm.contractEndTime" value-format="yyyy-MM-dd" type="date"
                        placeholder="选择日期时间" disabled></el-date-picker>
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="实际" :align="'center'">
                <el-table-column :align="'center'">
                  <template slot="header">
                    <div class="is_required">开工</div>
                  </template>
                  <template slot-scope="scope">
                    <el-form-item label-width="0" prop="actualStartTime">
                      <el-date-picker v-model="dataForm.actualStartTime" value-format="yyyy-MM-dd" type="date"
                        placeholder="选择日期时间"></el-date-picker>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column :align="'center'">
                  <template slot="header">
                    <div class="is_required">完工</div>
                  </template>
                  <template slot-scope="scope">
                    <el-form-item label-width="0" prop="actualEndTime">
                      <el-date-picker v-model="dataForm.actualEndTime" value-format="yyyy-MM-dd" type="date"
                        placeholder="选择日期时间"></el-date-picker>
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table-column>
            <el-table-column label="当前形象进度（%）" :align="'center'">
              <el-table-column label="上报进度（DRP）">
                <template slot-scope="scope">
                  <el-input v-model="dataForm.reportProgress" disabled placeholder="自动带出" />
                </template>
              </el-table-column>
              <el-table-column label="现场实际进度">
                <template slot="header">
                  <div class="is_required">现场实际进度</div>
                </template>
                <template slot-scope="scope">
                  <el-form-item label-width="0" prop="siteActualProgress">
                    <el-input v-model="dataForm.siteActualProgress" placeholder="请输入" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="负偏差情况" :align="'center'">
                <el-table-column :align="'center'">
                  <template slot="header">
                    <div class="is_required">小</div>
                  </template>
                  <template slot-scope="scope">
                    <el-form-item label-width="0" prop="deviationSituation">
                      <el-radio-group v-model="dataForm.deviationSituation">
                        <el-radio label="1">{{ }}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column :align="'center'">
                  <template slot="header">
                    <div class="is_required">大</div>
                  </template>
                  <template slot-scope="scope">
                    <el-form-item label-width="0" prop="deviationSituation">
                      <el-radio-group v-model="dataForm.deviationSituation">
                        <el-radio label="0">{{ }}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </template>
                </el-table-column>
              </el-table-column>
            </el-table-column>
            <el-table-column label="当期进度管控状况" :align="'center'">
              <template slot="header">
                <div class="is_required">当期进度管控状况</div>
              </template>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div class="color-h70 color-green">正常</div>
                </template>
                <template slot-scope="scope">
                  <el-form-item label-width="0" prop="progressControlStatus">
                    <el-radio-group v-model="dataForm.progressControlStatus">
                      <el-radio label="1">{{ }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div class="color-h70 color-yellow">可控</div>
                </template>
                <template slot-scope="scope">
                  <el-radio v-model="dataForm.progressControlStatus" label="2">{{ }}</el-radio>
                </template>
              </el-table-column>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div class="color-h70 color-red">不正常</div>
                </template>
                <template slot-scope="scope">
                  <el-radio v-model="dataForm.progressControlStatus" label="3">{{ }}</el-radio>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </template>
        <template slot="col_1">
          <el-form-item prop="projectOverview" label="工程概况：" :style="{ 'margin': '24px 0 0 0' }" label-width="160px">
            <el-input v-model="dataForm.projectOverview" type="textarea" :rows="3" placeholder="请输入500字以内的描述"
              maxlength="500" show-word-limit />
          </el-form-item>
          <el-form-item prop="constructionScope" label="施工范围：" :style="{ 'margin': '24px 0 0 0' }" label-width="160px">
            <el-input v-model="dataForm.constructionScope" type="textarea" :rows="3" placeholder="请输入500字以内的描述"
              maxlength="500" show-word-limit />
          </el-form-item>
          <el-form-item prop="contentProgress" label="施工内容进度：" :style="{ 'margin': '24px 0 0 0' }" label-width="160px">
            <el-input v-model="dataForm.contentProgress" type="textarea" :rows="3" placeholder="请输入500字以内的描述"
              maxlength="500" show-word-limit />
          </el-form-item>
          <el-form-item prop="sitePersonnel" label="现场施工人数：" :style="{ 'margin': '24px 0 0 0' }" label-width="160px">
            <el-input v-model="dataForm.sitePersonnel" type="textarea" :rows="3" placeholder="请输入500字以内的描述"
              maxlength="500" show-word-limit />
          </el-form-item>
          <el-form-item prop="aurationDescription" label="工期说明：" :style="{ 'margin': '24px 0 0 0' }" label-width="160px">
            <el-input v-model="dataForm.aurationDescription" type="textarea" :rows="3" placeholder="请输入500字以内的描述"
              maxlength="500" show-word-limit />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" title="工程质量管控巡检情况">
        <template slot="col_1">
          <el-table :data="projectImageProgressInspectionStatus" fit :border="true" class="f2bpmui-datagrid-vuetable ">
            <el-table-column label="图纸/方案/技术交底" :align="'center'">
              <template slot="header">
                <div class="is_required">图纸/方案/技术交底</div>
              </template>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div>齐全</div>
                </template>
                <template slot-scope="scope">
                  <el-form-item label-width="0" prop="technicalDisclosure">
                    <el-radio-group v-model="dataForm.technicalDisclosure">
                      <el-radio label="1">{{ }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div>不齐</div>
                </template>
                <template slot-scope="scope">
                  <el-radio v-model="dataForm.technicalDisclosure" label="0">{{ }}</el-radio>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="全面落实实测实量情况" :align="'center'">
              <template slot="header">
                <div class="is_required">全面落实实测实量情况</div>
              </template>
              <el-table-column label="落实到位" :align="'center'">
                <template slot-scope="scope">
                  <el-form-item label-width="0" prop="actualMeasurementSituation">
                    <el-radio-group v-model="dataForm.actualMeasurementSituation">
                      <el-radio label="1">{{ }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="还要加强" :align="'center'">
                <el-form-item label-width="0">
                  <el-radio v-model="dataForm.actualMeasurementSituation" label="0">{{ }}</el-radio>
                </el-form-item>
              </el-table-column>
            </el-table-column>
            <el-table-column label="隐验/竣工资料" :align="'center'">
              <template slot="header">
                <div class="is_required">隐验/竣工资料</div>
              </template>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div>齐全</div>
                </template>
                <template slot-scope="scope">
                  <el-form-item label-width="0" prop="hiddenInspection">
                    <el-radio-group v-model="dataForm.hiddenInspection">
                      <el-radio label="1">{{ }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div>不齐</div>
                </template>
                <template slot-scope="scope">
                  <el-radio v-model="dataForm.hiddenInspection" label="0">{{ }}</el-radio>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="当期质量管控及风险" :align="'center'">
              <template slot="header">
                <div class="is_required">当期质量管控及风险</div>
              </template>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div class="color-h35 color-green">正常</div>
                </template>
                <template slot-scope="scope">
                  <el-form-item label-width="0" prop="currentQuality">
                    <el-radio-group v-model="dataForm.currentQuality">
                      <el-radio label="1">{{ }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div class="color-h35 color-yellow">可控</div>
                </template>
                <template slot-scope="scope">
                  <el-radio v-model="dataForm.currentQuality" label="2">{{ }}</el-radio>
                </template>
              </el-table-column>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div class="color-h35 color-red">不正常</div>
                </template>
                <template slot-scope="scope">
                  <el-radio v-model="dataForm.currentQuality" label="3">{{ }}</el-radio>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </template>
        <template slot="col_1">
          <el-form-item prop="qualityInspection" label="质量巡检内容及情况：" :style="{ 'margin': '24px 0 0 0' }"
            label-width="160px">
            <el-input v-model="dataForm.qualityInspection" type="textarea" :rows="3" placeholder="请输入500字以内的描述"
              maxlength="500" show-word-limit />
          </el-form-item>
        </template>
      </row-layout>

      <row-layout :cols="1" title="工程安全管控巡检情况">
        <template slot="col_1">
          <el-table :data="projectImageProgressInspectionStatus" fit :border="true" class="f2bpmui-datagrid-vuetable ">
            <el-table-column label="现场安全措施" :align="'center'">
              <template slot="header">
                <div class="is_required">现场安全措施</div>
              </template>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div>落实到位</div>
                </template>
                <template slot-scope="scope">
                  <el-form-item label-width="0" prop="siteSafetyMeasures">
                    <el-radio-group v-model="dataForm.siteSafetyMeasures">
                      <el-radio label="1">{{ }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div>还要加强</div>
                </template>
                <template slot-scope="scope">
                  <el-radio v-model="dataForm.siteSafetyMeasures" label="0">{{ }}</el-radio>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="安全教育" :align="'center'">
              <template slot="header">
                <div class="is_required">安全教育</div>
              </template>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div>落实到位</div>
                </template>
                <template slot-scope="scope">
                  <el-form-item label-width="0" prop="safetyEducation">
                    <el-radio-group v-model="dataForm.safetyEducation">
                      <el-radio label="1">{{ }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div>还要加强</div>
                </template>
                <template slot-scope="scope">
                  <el-radio v-model="dataForm.safetyEducation" label="0">{{ }}</el-radio>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="安全台账" :align="'center'">
              <template slot="header">
                <div class="is_required">安全台账</div>
              </template>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div>齐全</div>
                </template>
                <template slot-scope="scope">
                  <el-form-item label-width="0" prop="safetyLedger">
                    <el-radio-group v-model="dataForm.safetyLedger">
                      <el-radio label="1">{{ }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div>不齐</div>
                </template>
                <template slot-scope="scope">
                  <el-radio v-model="dataForm.safetyLedger" label="0">{{ }}</el-radio>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="当期安全管控及风险" :align="'center'">
              <template slot="header">
                <div class="is_required">当期安全管控及风险</div>
              </template>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div class="color-h35 color-green">正常</div>
                </template>
                <template slot-scope="scope">
                  <el-form-item label-width="0" prop="currentSafetyRisk">
                    <el-radio-group v-model="dataForm.currentSafetyRisk">
                      <el-radio label="1">{{ }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div class="color-h35 color-yellow">可控</div>
                </template>
                <template slot-scope="scope">
                  <el-radio v-model="dataForm.currentSafetyRisk" label="2">{{ }}</el-radio>
                </template>
              </el-table-column>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div class="color-h35 color-red">不正常</div>
                </template>
                <template slot-scope="scope">
                  <el-radio v-model="dataForm.currentSafetyRisk" label="3">{{ }}</el-radio>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </template>
        <template slot="col_1">
          <el-form-item prop="contentAndSituation" label="安全巡检内容及情况：" :style="{ 'margin': '24px 0 0 0' }"
            label-width="160px">
            <el-input v-model="dataForm.contentAndSituation" type="textarea" :rows="3" placeholder="请输入500字以内的描述"
              maxlength="500" show-word-limit />
          </el-form-item>
        </template>
      </row-layout>

      <row-layout :cols="1" title="工程成本管控巡检情况">
        <template slot="col_1">
          <el-table :data="projectImageProgressInspectionStatus" fit :border="true" class="f2bpmui-datagrid-vuetable ">
            <el-table-column label="劳务支付" :align="'center'">
              <el-table-column :align="'center'">
                <template slot="header">
                  <div class="is_required">计划</div>
                </template>
                <template slot-scope="scope">
                  <el-form-item label-width="0" prop="servicePaymentsPlan">
                    <el-input v-model="dataForm.servicePaymentsPlan" placeholder="自动带出" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div class="is_required">实际</div>
                </template>
                <template slot-scope="scope">
                  <el-form-item label-width="0" prop="servicePaymentsReality">
                    <el-input v-model="dataForm.servicePaymentsReality" placeholder="自动带出" />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="材料支付" :align="'center'">
              <el-table-column :align="'center'">
                <template slot="header">
                  <div class="is_required">计划</div>
                </template>
                <template slot-scope="scope">
                  <el-form-item label-width="0" prop="materialPaymentPlan">
                    <el-input v-model="dataForm.materialPaymentPlan" placeholder="自动带出" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div class="is_required">实际</div>
                </template>
                <template slot-scope="scope">
                  <el-form-item label-width="0" prop="materialPaymentReality">
                    <el-input v-model="dataForm.materialPaymentReality" placeholder="自动带出" />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="签证" :align="'center'">
              <el-table-column :align="'center'">
                <template slot="header">
                  <div class="is_required">应签证</div>
                </template>
                <template slot-scope="scope">
                  <el-form-item label-width="0" prop="visaShould">
                    <el-input v-model="dataForm.visaShould" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div class="is_required">已签证</div>
                </template>
                <template slot-scope="scope">
                  <el-form-item label-width="0" prop="visaFinish">
                    <el-input v-model="dataForm.visaFinish" />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="当期成本管控及风险" :align="'center'">
              <template slot="header">
                <div class="is_required">当期成本管控及风险</div>
              </template>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div class="color-h35 color-green">正常</div>
                </template>
                <template slot-scope="scope">
                  <el-form-item label-width="0" prop="currentCost">
                    <el-radio-group v-model="dataForm.currentCost">
                      <el-radio label="1">{{ }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div class="color-h35 color-yellow">可控</div>
                </template>
                <template slot-scope="scope">
                  <el-radio v-model="dataForm.currentCost" label="2">{{ }}</el-radio>
                </template>
              </el-table-column>
              <el-table-column :align="'center'">
                <template slot="header">
                  <div class="color-h35 color-red">不正常</div>
                </template>
                <template slot-scope="scope">
                  <el-radio v-model="dataForm.currentCost" label="3">{{ }}</el-radio>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </template>
        <template slot="col_1">
          <el-form-item prop="basicRequirements" label="劳务管理基本要求：" :style="{ 'margin': '24px 0 0 0' }"
            label-width="160px">
            <el-input v-model="dataForm.basicRequirements" type="textarea" :rows="3" placeholder="请输入500字以内的描述"
              maxlength="500" show-word-limit />
          </el-form-item>
          <el-form-item prop="materialManagement" label="材料管理基本要求：" :style="{ 'margin': '24px 0 0 0' }"
            label-width="160px">
            <el-input v-model="dataForm.materialManagement" type="textarea" :rows="3" placeholder="请输入500字以内的描述"
              maxlength="500" show-word-limit />
          </el-form-item>
        </template>
      </row-layout>

      <row-layout :cols="1" title="工程资金管控巡检情况">
        <template slot="col_1">
          <el-table :data="projectImageProgressInspectionStatus" fit :border="true" class="f2bpmui-datagrid-vuetable ">
            <el-table-column label="合同金额" :align="'center'">
              <template slot="header">
                <div class="is_required">合同金额</div>
              </template>
              <template slot-scope="scope">
                <el-form-item label-width="0" prop="contractAmountTax">
                  <el-input v-model="dataForm.contractAmountTax" :placeholder="autofillPlaceHolder" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="上期确权应收款" :align="'center'">
              <template slot="header">
                <div class="is_required">上期确权应收款</div>
              </template>
              <template slot-scope="scope">
                <el-form-item label-width="0" prop="currentMonthConfirmAmount">
                  <el-input v-model="dataForm.currentMonthConfirmAmount" :placeholder="autofillPlaceHolder" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="本月已收款" :align="'center'">
              <template slot="header">
                <div class="is_required">本月已收款</div>
              </template>
              <template slot-scope="scope">
                <el-form-item label-width="0" prop="receivedThisMonth">
                  <el-input v-model="dataForm.receivedThisMonth" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="本月计划付款" :align="'center'">
              <template slot="header">
                <div class="is_required">本月计划付款</div>
              </template>
              <template slot-scope="scope">
                <el-form-item label-width="0" prop="paymentThisMonth">
                  <el-input v-model="dataForm.paymentThisMonth" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="预计下月付款" :align="'center'">
              <template slot="header">
                <div class="is_required">预计下月付款</div>
              </template>
              <template slot-scope="scope">
                <el-form-item label-width="0" prop="expectedPaymentNextMonth">
                  <el-input v-model="dataForm.expectedPaymentNextMonth" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="累计收款" :align="'center'">
              <template slot="header">
                <div class="is_required">累计收款</div>
              </template>
              <template slot-scope="scope">
                <el-form-item label-width="0" prop="accumulatedReceipts">
                  <el-input v-model="dataForm.accumulatedReceipts" />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="当期是否存在经营风险" :align="'center'">
              <template slot="header">
                <div class="is_required">当期是否存在经营风险</div>
              </template>
              <template slot-scope="scope">
                <el-form-item label-width="0" prop="isOperationalRisk">
                  <el-radio-group v-model="dataForm.isOperationalRisk">
                    <el-radio label="1">是 <span :class="`radio-color-box radio-color-3`"></span></el-radio>
                    <el-radio label="0">否 <span :class="`radio-color-box radio-color-1`"></span></el-radio>
                  </el-radio-group>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <template slot="col_1">
          <el-form-item prop="fundControlInspection" label="资金管控巡检内容及情况：" :style="{ 'margin': '24px 0 0 0' }"
            label-width="160px">
            <el-input v-model="dataForm.fundControlInspection" type="textarea" :rows="3" placeholder="请输入500字以内的描述"
              maxlength="500" show-word-limit />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" title="资料管控情况">
        <template slot="col_1">
          <el-form-item prop="memoSituation" label="描述：" label-width="160px">
            <el-input v-model="dataForm.memoSituation" type="textarea" :rows="3" placeholder="请输入500字以内的描述"
              maxlength="500" show-word-limit />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" title="深化设计管理">
        <template slot="col_1">
          <el-form-item prop="designManageMemo" label="描述：" label-width="160px">
            <el-input v-model="dataForm.designManageMemo" type="textarea" :rows="3" placeholder="请输入500字以内的描述"
              maxlength="500" show-word-limit />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" title="合同履约情况">
        <template slot="col_1">
          <el-form-item prop="contractPerformanceMemo" label="描述：" label-width="160px">
            <el-input v-model="dataForm.contractPerformanceMemo" type="textarea" :rows="3" placeholder="请输入500字以内的描述"
              maxlength="500" show-word-limit />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" title="客户满意度情况">
        <template slot="col_1">
          <el-form-item prop="customerSatisfactionMemo" label="描述：" label-width="160px">
            <el-input v-model="dataForm.customerSatisfactionMemo" type="textarea" :rows="3" placeholder="请输入500字以内的描述"
              maxlength="500" show-word-limit />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" title="发现被抽巡检项目部存在的亮点">
        <template slot="col_1">
          <el-form-item prop="discoveringHighlightsMemo" label="描述：" label-width="160px">
            <el-input v-model="dataForm.discoveringHighlightsMemo" type="textarea" :rows="3" placeholder="请输入500字以内的描述"
              maxlength="500" show-word-limit />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" title="相关施工安全、施工质量、施工工期、施工技术等交底和岗位培训情况以及效果如何，在现场随机询问情况">
        <template slot="col_1">
          <el-form-item prop="situationAndEffectivenessMemo" label="描述：" label-width="160px">
            <el-input v-model="dataForm.situationAndEffectivenessMemo" type="textarea" :rows="3"
              placeholder="请输入500字以内的描述" maxlength="500" show-word-limit />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" title="重点关注项/其他风险点">
        <template slot="col_1">
          <el-form-item prop="riskPoints" label="描述：" label-width="160px">
            <el-input v-model="dataForm.riskPoints" type="textarea" :rows="3" placeholder="请输入500字以内的描述" maxlength="500"
              show-word-limit />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" title="有关项目部提请集团协助解决的合理事项的回复内容">
        <template slot="col_1">
          <el-form-item prop="assistanceSolving" label="描述：" label-width="160px">
            <el-input v-model="dataForm.assistanceSolving" type="textarea" :rows="3" placeholder="请输入500字以内的描述"
              maxlength="500" show-word-limit />
          </el-form-item>
        </template>
      </row-layout>
      <row-layout :cols="1" title="现场照片">
        <el-form-item slot="col_1" prop="pictureList" label="附件文件：">
          <update-files v-model="dataForm.pictureList"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" title="巡检报告">
        <el-form-item slot="col_1" prop="inspectionReportList" label="附件文件：">
          <update-files v-model="dataForm.inspectionReportList"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="1" title="工程项目巡查整改通知单">
        <el-form-item slot="col_1" prop="projectNoticeList" label="附件文件：">
          <update-files v-model="dataForm.projectNoticeList"></update-files>
        </el-form-item>
      </row-layout>
      <row-layout :cols="3">
        <template slot="col_1">
          <el-form-item prop="createUserName" label="编制人：">
            <label class="label-style">{{ dataForm.createUserName }}</label>
          </el-form-item>
        </template>
        <template slot="col_2">
          <el-form-item prop="deptName" label="编制人部门：">
            <label class="label-style">{{ dataForm.deptName }}</label>
          </el-form-item>
        </template>
        <template slot="col_3">
          <el-form-item prop="createTime" label="编制时间：">
            <label class="label-style">{{ dataForm.createTime }}</label>
          </el-form-item>
        </template>
      </row-layout>
    </el-form>
  </div>
</template>
<script>
import comMixin from "../minix";
import RowLayout from "@/components/basic/fromLayout/rowLayout.vue";
import updateFiles from '@/components/basic/uploaderFile/index.vue';
import subFormTab from './components/subFormTab.vue';
import SelectDialog from "@/components/workflow/selector/selectorDialog.vue";
import RuleRequired from '@/views/businessModule/enum/requiredMsg';
import { getDataDictByConfigType } from '@/Api/dataDict.js'
import { RADIO3_GROUP } from '@/views/businessModule/enum/param';

export default {
  name: "projectInspectionMain",
  components: {
    RowLayout,
    updateFiles,
    subFormTab,
    SelectDialog,
  },
  props: {
    type: {
      type: String,
      default: ""
    },
    value: {
      type: Object,
      default: () => { }
    }
  },
  mixins: [comMixin],
  data () {
    return {
      dataForm: {
        accumulatedReceipts: "", //	累计收款
        actualEndTime: "", //实际竣工时间
        actualMeasurementSituation: "", //全面落实实测实量情况(1落实到位,2还要加强)	
        actualStartTime: "", //实际开工时间
        aurationDescription: "", //工期说明
        basicRequirements: "", //劳务管理基本要求
        code: "", //单据编号
        constructCode: "", //项目编号
        constructArchiveMainId: "", //项目档案id
        constructName: "", //	项目名称
        constructManager: "", //	项目负责人
        constructManagerPhone: "", //	项目负责人联系电话
        constructManagerSituation: "", //	项目经理(1是否到岗,2是否入职)
        constructOfficerSituation: "", //	施工员(1是否到岗,2是否入职)
        constructPhase: "", //	项目施工阶段
        constructionScope: "", //	施工范围
        contentAndSituation: "", //	安全巡检内容及情况
        contentProgress: "", //	施工内容进度
        contractPerformanceMemo: "", //	合同履约情况描述
        contractStartTime: "", //	合同开工时间
        contractEndTime: "", //	合同完工时间
        contractAmountTax: "", //	合同金额
        currentMonthConfirmAmount: "", //	上期确权应收款
        currentCost: "", //	当期成本管控及风险(1正常,2可控,3不正常)	
        currentQuality: "", //	当期质量管控及风险(1正常,2可控,3不正常)	
        currentSafetyRisk: "", //当期安全管控及风险(1正常,2可控,3不正常)
        customerSatisfactionMemo: "", //客户满意度情况描述
        designManageMemo: "", //	深化设计管理描述
        detailedDesignSituation: "", //	深化设计(1是否到岗,2是否入职)
        deviationSituation: "", //	负偏差情况(1大,2小)
        discoveringHighlightsMemo: "", //	发现被抽巡检项目部存在的亮点描述
        documenterSituation: "", //	资料员(1是否到岗,2是否入职)
        estimateClerkSituation: "", //	预算员(1是否到岗,2是否入职)
        expectedPaymentNextMonth: "", //	预计下月付款
        fundControlInspection: "", //	资金管控巡检内容及情况
        hiddenInspection: "", //	隐验/竣工资料(1齐全,2不齐)
        inspectionEndDate: "", //	巡检结束日期
        inspectionReportList: [], //	巡检报告
        inspectionSituation: "", //	检查情况
        inspectionType: "", //	巡检类型
        inspectionStartDate: "", //	巡检开始日期
        isNeedRectification: "", //	是否需要整改(0:否 1:是)
        isOperationalRisk: "", //	当期是否存在经营风险(1是,2否)
        isTheRequirements: "", //	本项目团队是否满足本项目管理需求
        laborPersonnel: "", //	劳务员(1是否到岗,2是否入职)
        materialManagement: "", //	材料管理基本要求
        materialPaymentPlan: "", //	材料支付(1计划)
        materialPaymentReality: "", //	材料支付(2实际)
        memoSituation: "", //	资料管控情况描述
        managerDeptName: "", //	管理部门
        paymentThisMonth: "", //	本月计划付款
        pictureList: [], //	现场照片
        produceManagerSituation: "", //	生产经理(1是否到岗,2是否入职)
        progressControlStatus: "", //	当期进度管控状况(1正常,2可控,3不正常)
        projectOverview: "", //	工程概况
        //projectNoticeList: [], //	工程概况
        purchaserSituation: "", //	采购员(1是否到岗,2是否入职)	
        qualityInspection: "", //	质量巡检内容及情况
        qulityOfficerSituation: "", //	质量员(1是否到岗,2是否入职)
        receivedThisMonth: "", //	本月已收款
        rectificationDate: "", //	整改完成日期
        rectificationState: "0", //	整改完成状态(1：已完成 0；未完成)
        replyContent: "", //	回复内容描述
        riskPoints: "", //	重点关注项/其他风险点描述
        safetyEducation: "", //	安全教育(1落实到位,2还要加强)
        safetyLedger: "", //	安全台账(1齐全,2不齐)
        safetyOfficerSituation: "", //	安全员(1是否到岗,2是否入职)
        servicePaymentsPlan: "", //	劳务支付计划
        servicePaymentsReality: "", //	劳务支付实际
        siteActualProgress: "", //	现场实际进度
        reportProgress: "", //	上报进度
        sitePersonnel: "", //	现场施工人数
        siteSafetyMeasures: "", //	现场安全措施(1落实到位,2还要加强)	
        situationAndEffectivenessMemo: "", //	相关施工安全、施工质量、施工工期、施工技术等交底和岗位培训情况以及效果如何，在现场随机询问情况描述
        technicalDisclosure: "", //	图纸/方案/技术交底(1齐全,2不齐)	
        technologyManagerSituation: "", //	技术负责人(1是否到岗,2是否入职)
        theInspectionRiskLevel: "", //		本次巡检风险等级(1绿色,2黄色,3红色)
        theInspectionTotalResult: "", //	本次巡检总结果(1优秀,2优良,3良好,4合格,5不合格)
        assistanceSolving: "", //	有关项目部提请集团协助解决的合理事项的回复内容
        userDetailList: [{
          phone: "",//
          position: "",//岗位
          projectInspectionMainId: "",//项目巡检主键id
          userId: "",//用户id
          realName: "",//用户
          userDeptName: "",//部门
          userType: "",//人员类型
        }], //	本次集团公司抽巡检参与人员
        projectNoticeList: [],//工程项目巡查整改通知单
        visaShould: "", //	已签证
        visaFinish: "", //	应签证
        warehouseKeeperSituation: "", //仓管员(1是否到岗,2是否入职)
      },
      inspectionTab: [
        { label: '本次巡检总结果', code: 'theInspectionTotalResult' },
        { label: '本次巡检风险等级', code: 'theInspectionRiskLevel' },
        { label: '是否需要整改', code: 'isNeedRectification' },
      ],
      teamMembersTab: [
        { label: '是否到岗', val: '1' },
        { label: '是否入职', val: '2' }
      ],
      projectImageProgressInspectionStatus: [{}],
      pleaseEnterPlaceHolder: "请输入",
      autofillPlaceHolder: "自动带出",
      computedPlaceHolder: "自动计算",
      contractInProjectModelData: { code: 'XiangMuDangAnXunJian', parm: { data: [], singleSelect: true } }, //项目档案（项目巡检）
      dataRule: RuleRequired.dataRule(['constructCode', 'inspectionStartDate', 'inspectionEndDate', 'constructPhase', 'inspectionType',
        'theInspectionTotalResult', 'inspectionRiskLevel', 'isNeedRectification', 'theInspectionRiskLevel', 'isTheRequirements', 'inspectionSituation',
        , 'actualStartTime', 'actualEndTime', 'rectificationDate', 'siteActualProgress', 'deviationSituation',
        'progressControlStatus', 'projectOverview', 'constructionScope', 'contentProgress', 'sitePersonnel', 'aurationDescription',
        'technicalDisclosure', 'actualMeasurementSituation', 'hiddenInspection', 'currentQuality', 'qualityInspection', 'siteSafetyMeasures',
        'safetyEducation', 'safetyLedger', 'currentSafetyRisk', 'contentAndSituation', 'servicePaymentsPlan', 'servicePaymentsReality',
        'materialPaymentPlan', 'materialPaymentReality', 'visaShould', 'visaFinish', 'currentCost', 'basicRequirements',
        'materialManagement', 'contractAmountTax', 'currentMonthConfirmAmount', 'receivedThisMonth', 'paymentThisMonth',
        'isOperationalRisk', 'fundControlInspection', 'memoSituation', 'designManageMemo', 'contractPerformanceMemo','projectNoticeList',
        'customerSatisfactionMemo', 'discoveringHighlightsMemo', 'situationAndEffectivenessMemo', 'riskPoints', 'pictureList', 'inspectionReportList',
        , 'assistanceSolving']),
      constructPhaseOptions: [],// 项目施工阶段
      inspectionTypeOptions: [],// 巡检类型
      inspectionTotalResultOptions: [],//本次巡检总结果
      inspectionRiskLevelOptions: [],//本次巡检风险等级
      rectificationStateOptions: [],//整改完成状态
      actualMeasurementSituationOptions: [
        { configName: "落实到位", configValue: "1" },
        { configName: "还要加强", configValue: "0" }
      ],//全面落实实测实量情况
      radioData: RADIO3_GROUP,
    };
  },
  computed: {

  },
  created () {
    this.getDataDictByConfigType();
    let numArr = ['servicePaymentsPlan', 'servicePaymentsReality', 'materialPaymentPlan', 'materialPaymentReality', 'visaShould', 'visaFinish', 'paymentThisMonth', 'expectedaymentNextMonth', 'accumulatedReceipts']
    numArr.forEach((i) => {
      this.dataRule[i] = RuleRequired.curCustomRule(true, this.validateNumber3);
    })
    this.afterInit()
  },
  methods: {
    //校验两位小数
    validateNumber3 (rule, value, callback) {
      if (!value) return callback()
      let pattern = /^[\d]+(\.[\d]{1,2})?$/;
      if (!pattern.test(value)) {
        callback(new Error('请输入正数,保留两位小数'))
      }
      callback()
    },
    changeNeedRectification(){
      // 工程项目巡查整改通知单上传附件控件，当是否需要整改为“是”时，必填；否则不必填  curCustomRule
      console.log('this.dataForm.isNeedRectification',this.dataForm.isNeedRectification,this.dataForm.isNeedRectification == '1')
      this.dataRule['projectNoticeList'] =  RuleRequired.curFiledRule(this.dataForm.isNeedRectification == '1')
    },
    afterInit () {
      let checkArr = ['constructManagerSituation', 'produceManagerSituation', 'technologyManagerSituation', 'safetyOfficerSituation', 'qulityOfficerSituation', 'constructOfficerSituation', 'estimateClerkSituation', 'purchaserSituation', 'warehouseKeeperSituation', 'detailedDesignSituation', 'documenterSituation', 'laborPersonnel']
      for (let key of checkArr) {
        this.$set(this.dataForm,key + '2',this.dataForm[key] && this.dataForm[key].includes('2') ? '2' : '')
        this.$set(this.dataForm,key + '1',this.dataForm[key] && this.dataForm[key].includes('1') ? '1' : '')
      }
      this.changeNeedRectification()
    },
    //项目编号
    selectConstructCode (data) {
      let assignmentArr = ['constructArchiveMainId', 'constructName', 'constructCode', 'managerDeptName',
        'constructManagerPhone', 'contractAmountTax', 'currentMonthConfirmAmount', 'materialPaymentPlan',
        'materialPaymentReality', 'servicePaymentsPlan', 'servicePaymentsReality', 'totalReportImageProgress']
      for (const key of assignmentArr) {
        this.dataForm[key] = data[0][key];
      }
      this.dataForm.constructManager = data[0].constructManagerName;
    },
    //主合同编号
    selectDialogMasterContractCode (data) {
      this.dataForm.contractInOutMainCode = data[0].code;
      this.dataForm.contractInOutMainId = data[0].id;
      this.dataForm.contractInOutMainName = data[0].name;
      let autofillArr = ['contractPartyAId', 'contractPartyAName', 'contractPartyBId', 'contractPartyBName', 'contractType']
      autofillArr.forEach(i => {
        this.dataForm[i] = data[0][i];
      })
    },
    /**
     * 获取表单数据
     */
     getDataForm() {
      const _dataForm = JSON.parse(JSON.stringify(this.dataForm));
      let checkArr = ['constructManagerSituation', 'produceManagerSituation', 'technologyManagerSituation', 'safetyOfficerSituation', 'qulityOfficerSituation', 'constructOfficerSituation', 'estimateClerkSituation', 'purchaserSituation', 'warehouseKeeperSituation', 'detailedDesignSituation', 'documenterSituation', 'laborPersonnel']
          for (let key of checkArr) {
            _dataForm[key] = [_dataForm[key + '1'], _dataForm[key + '2']].filter(i => i).join()
            delete _dataForm[key + '1']
            delete _dataForm[key + '2']
          }
      let numArr = ['servicePaymentsPlan', 'servicePaymentsReality', 'materialPaymentPlan', 'materialPaymentReality']
      numArr.forEach(item=>{
        _dataForm[item] = _dataForm[item]-0
      })
      return _dataForm;
    },
    async validateForm () {
      const _this = this;
      const _subFormData = await _this.$refs['subFormTab'].validateForm();
      let _dataForm =this.getDataForm()
      return new Promise(resolve => {
        _this.$refs['dataForm'].validate(valid => {
          
          if (valid && _subFormData) {
            _dataForm.subFormData = _subFormData
            resolve(_dataForm)
          } else {
            resolve(false)
          }
        })
      });
    },
    /** 初始化字典*/
    async getDataDictByConfigType () {
      const res = await getDataDictByConfigType({ params: { configTypes: '巡检类型,项目施工阶段,本次巡检总结果,本次巡检风险等级,全面落实实测实量情况,整改完成状态' } })
      if (res.success) {
        res.data.forEach(ele => {
          switch (ele.dataDictType) {
            case '巡检类型':
              this.inspectionTypeOptions = ele.dataDict;
              break;
            case '项目施工阶段':
              this.constructPhaseOptions = ele.dataDict;
              break;
            case '本次巡检总结果':
              this.inspectionTotalResultOptions = ele.dataDict;
              break;
            case '本次巡检风险等级':
              this.inspectionRiskLevelOptions = ele.dataDict;
              break;
            case '全面落实实测实量情况':
              this.actualMeasurementSituationOptions = ele.dataDict;
              break;
            case '整改完成状态':
              this.rectificationStateOptions = ele.dataDict;
              break;
            default:
              break;
          }
        });
      }
    },
    teamMembersTabSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex > 12) {
        if ([0, 1].includes(rowIndex)) {
          return {
            rowspan: 2,
            colspan: 1
          };
        }
      }
    },
  }
};
</script>
<style lang="scss" scoped>
@import url('../../style/form.scss');

.form-box {
  .el-form-item {
    margin-bottom: 20px;
  }
}

::v-deep .el-table .el-table__body {
  border-collapse: collapse;
}

::v-deep .d3-table__cell {
  background: #f7f8fa;
}

::v-deep .el-table.border-show td.el-table__cell {
  border: 1px solid #EBEEF5;
  border-collapse: collapse;
}

.is_required::after {
  content: "*";
  color: #f56c6c;
  margin-left: 4px;
}

.radio-color-box {
  display: inline-block;
  border-radius: 100%;
  width: 14px;
  height: 14px;
  line-height: 1;
  vertical-align: middle;
}

.radio-color-1 {
  background: #1afa29;
}

.radio-color-2 {
  background: #f4ea2a;
}

.radio-color-3 {
  background: #d81e06;
}

.color-h35 {
  height: 35px;
  line-height: 35px;
  margin: 0 -10px;
}

.color-h70 {
  height: 70px;
  line-height: 70px;
  margin: 0 -10px;
}

.color-green {
  background: #1afa29;
}

.color-yellow {
  background: #f4ea2a;
}

.color-red {
  background: #d81e06;
}

::v-deep .el-table td.el-table__cell div {
  overflow: initial;
}

::v-deep .el-table.border-show td.el-table__cell .el-form-item__content {
  width: max-content;
}

::v-deep .el-table td.el-table__cell .el-form-item__error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 0;
  padding-top: 0px;
  position: absolute;
  top: 100%;
  left: 0;
}

::v-deep .el-form-item {
  margin-bottom: 2px;
}

::v-deep .fold-label .el-form-item__label {
  white-space: pre-wrap;
  text-align: right;
  margin-top: 4px;
  line-height: 16px !important;
  /*设置行高为label高度的一半（有n行就是label高度的1/n）*/
  text-justify: distribute-all-lines;
}

::v-deep .el-table--border .el-table__cell,
.el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
  border-right: 1px solid #EBEEF5;
}

::v-deep .el-table .el-table__body {
  border-left: 1px solid #EBEEF5;
}

::v-deep .default-label .el-form-item__label {
  text-align: right;
  text-justify: distribute-all-lines;
}

.unhidden{
  overflow: unset;
  text-align: center;
  white-space: normal;
  display: block;
}
</style>
