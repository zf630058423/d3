const contractTeamPayroll =[
  {
    path: '/contractTeamPayrollForm',
    name: 'contractTeamPayrollForm',
    component: () => import('@/views/businessModule/noWorkflow/contractTeamPayroll/form'),
    meta: { title: '工资单', requireAuth: true }
  }];
export default contractTeamPayroll;
