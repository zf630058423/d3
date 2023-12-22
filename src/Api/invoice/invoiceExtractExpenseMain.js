/**
 * 费用预提单
 */
import service from '@/utils/services';

const INVOICE = '/invoice/invoiceExtractExpenseMain';

//校验发票是否均未付款
export const checkInvoiceApi = (ids) => {
  return service.post(`${INVOICE}/checkInvoice/${ids}`, null, {
    action: '校验发票是否均未付款',
  });
}

//校验修改预提项目
export const checkExtractExpenseApi = (params) => {
  return service.post(`${INVOICE}/checkExtractExpense`, params, {
    action: '校验修改预提项目',
  });
}