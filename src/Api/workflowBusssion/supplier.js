import service from '@/utils/services';

/**
 * 校验供应商外部链接密钥
 * @param {*} secretKey
 * @returns
 */
export const checkSupplierLinkSecretKey = (secretKey) => {
  return service.get(`/supplier/supplierMaterialExtend/checkSupplierLinkSecretKey/${secretKey}`);
}

/**
 * 获取供应商外部链接密钥
 * @returns
 */
export const getSupplierLinkSecretKey = () => {
  return service.get(`/supplier/supplierMaterialExtend/getSupplierLinkSecretKey`);
}

/**
 * 供应商外部新增链接
 * @param {*} params
 * @returns
 */
export const supplierLinkSave = (params) => {
  return service.post(`/supplier/supplierMaterialExtend/supplierLinkSave`, params);
}