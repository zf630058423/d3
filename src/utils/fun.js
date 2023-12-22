import moment from 'moment'

/* 函数节流 */
function throttle(fn, interval) {
  let enterTime = 0; // 触发的时间
  const gapTime = interval || 300; // 间隔时间，如果interval不传，则默认300ms
  return function () {
    const context = this;
    const backTime = new Date(); // 第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments);
      enterTime = backTime; // 赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}

/* 函数防抖 */
function debounce(fn, interval) {
  let timer;
  const gapTime = interval || 500; // 间隔时间，如果interval不传，则默认1000ms
  return function () {
    clearTimeout(timer);
    const context = this;
    const args = arguments; // 保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function () {
      fn.call(context, args);
    }, gapTime);
  };
}

// 对象浅拷贝实现深拷贝(包含多级)
function deepCopy(dest, obj) {
  const o = dest;
  for (const k in obj) {
    o[k] = obj[k];
    if (typeof obj[k] === 'object') {
      obj[k] = obj[k].constructor ? [] : {};
      deepCopy(o[k], obj[k]);
    } else {
      o[k] = obj[k];
    }
  }
  return o;
}

/**
 * 加法运算，避免数据相加小数点后产生多位数和计算精度损失。
 * @param {*} num1
 * @param {*} num2
 * @returns
 */
function getNumAdd(num1, num2) {
  let r1, r2, m;
  try {
    r1 = num1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = num2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return Math.round(num1 * m + num2 * m) / m;
}

/**
 * 减法运算，避免数据相减小数点后产生多位数和计算精度损失。
 * @param {*} num1
 * @param {*} num2
 * @returns
 */
function getNumSub(num1, num2) {
  let baseNum, baseNum1, baseNum2;
  let precision;// 精度
  try {
    baseNum1 = num1.toString().split(".")[1].length;
  } catch (e) {
    baseNum1 = 0;
  }
  try {
    baseNum2 = num2.toString().split(".")[1].length;
  } catch (e) {
    baseNum2 = 0;
  }
  baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
  precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
  return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
}

/**
 * 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。
 * @param {*} num1
 * @param {*} num2
 * @returns
 */
function getNumMulti(num1, num2) {
  let baseNum = 0;
  try {
    baseNum += num1.toString().split(".")[1].length;
  } catch (e) {
  }
  try {
    baseNum += num2.toString().split(".")[1].length;
  } catch (e) {
  }
  return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
}

/**
 * 除法运算，避免数据相除小数点后产生多位数和计算精度损失。
 * @param {*} num1
 * @param {*} num2
 * @returns
 */
function getNumDiv(num1, num2) {
  let baseNum1 = 0, baseNum2 = 0;
  let baseNum3, baseNum4;
  try {
    baseNum1 = num1.toString().split(".")[1].length;
  } catch (e) {
    baseNum1 = 0;
  }
  try {
    baseNum2 = num2.toString().split(".")[1].length;
  } catch (e) {
    baseNum2 = 0;
  }
  baseNum3 = Number(num1.toString().replace(".", ""));
  baseNum4 = Number(num2.toString().replace(".", ""));
  return (baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1);
}

/**
 * 获取当前文字的宽度
 * @param {*} text
 * @param {*} fontSize
 * @returns
 */
function getTextWidth(text, fontSize) {
  // 创建临时元素
  const _span = document.createElement('span')
  // 放入文本
  _span.innerText = text;
  // 设置文字大小
  _span.style.fontSize = fontSize + 'px';
  // span元素转块级
  _span.style.position = 'absolute';
  // span放入body中
  document.body.appendChild(_span)
  // 获取span的宽度
  let width = _span.offsetWidth;
  // 从body中删除该span
  document.body.removeChild(_span)
  // 返回span宽度
  return width
}

/**
 * 千分符复制时去掉逗号
 * @param {*} value
 */
function getCopyAmount(value) {
  let curVal = '';
  if (value && typeof (value) === 'string' && value.includes(",")) {
    curVal = Number(value.replace(/[,]/g, ""));
  }
  return curVal;
}

//是否为数字类型:true数字，false非数字。null或“”空都认为是数字。undefined不是数字
function isNumber(value) {
  return !Number.isNaN(Number(value));
}

/**
 * 千分位
 * @param {*} num
 * @returns
 */
function getQianfenWeiStr(num) {
  if (!num || !isNumber(num)) {
    return "0.00";
  }
  num = num ? $.trim(num) + '' : '';
  //是否为负数
  let isFuShu = num.indexOf("-") != -1;
  num = num.replace('-', '');
  let [int, fraction = ''] = num.split('.');
  let ans = '';
  const len = int.length;
  int = int.split('').reverse();
  for (let i = 0; i < len; i++) {
    if (i !== 0 && i % 3 === 0) {
      ans = int[i] + ',' + ans;
    } else {
      ans = int[i] + ans;
    }
  }
  if (fraction !== '') ans += '.' + fraction;
  if (isFuShu) {
    ans = '-' + ans;
  }
  return ans;
}

/**
 * 保留小数
 * @param {*} number 数字
 * @param {*} n 保留位数
 * @returns
 */
function getFixed(number, n) {

  // 如果 digits 参数太小或太大。0 到 20（包括）之间的值不会引起 RangeError。实现环境（implementations）也可以支持更大或更小的值
  if (n < 0) {
    n = 0;
  }
  if (n > 20) {
    console.log("抱歉！小数位不能超过20位");
    throw new RangeError('tofixed() digits argument must be between 0 and 20')
  }
  // 如果该方法在一个非Number类型的对象上调用
  if (isNaN(number)) {
    throw new TypeError(number + '.tofixed() is not a function')
  }
  if (number == 'Infinity' || number == '-Infinity') {
    number = '0';
  }
  number = Object.tofixed(number,n);
  // 如果数值大于 1e+21，该方法会简单调用 Number.prototype.toString()并返回一个指数记数法格式的字符串
  if (number >= Math.pow(10, 21)) {
    return number.toString()
  }
  // 如果忽略该参数，则默认为 0，进行四舍五入，不包括小数部分
  if (n === undefined || n === 0) {
    // return Math.round(number).toString()
    return number.toString();
  }

  let result = number ? number.toString() : '0';
  const arr = result.split('.')
  // 整数情况
  if (arr.length < 2) {
    result += '.'
    for (let i = 0; i < n; i++) {
      result += '0'
    }
    return result
  }

  // 小数情况（原位数 <= 需求位数）
  const integer = arr[0]
  let decimal = arr[1]
  if (decimal.length === n) {
    return result
  }
  if (decimal.length < n) {
    for (let i = 0; i < n - decimal.length; i++) {
      result += '0'
    }
    return integer.length === 0 ? 0 + result : result;
  }
  // 小数情况（原位数 > 需求位数，需四舍五入）
  result = integer.length === 0 ? 0 : integer + '.' + decimal.substring(0, n)
  const last = decimal.substring(n, n + 1)
  if (parseInt(last, 10) >= 5) {

    // const multiple = Math.pow(10, n);
    // if (Number(result) > 0) {
    //   // result = ((Math.round(parseFloat(result) * multiple) + 1) / multiple).toString() // 使用 Math.round 防止结果无限小数
    //   result = ((parseFloat(parseFloat(result) * multiple) + 1) / multiple).toString() // 使用 Math.round 防止结果无限小数
    // } else {
    //   // 判断result为负数的情况
    //   // result = ((Math.round(parseFloat(result) * multiple) - 1) / multiple).toString() // 使用 Math.round 防止结果无限小数
    //   result = ((parseFloat(parseFloat(result) * multiple) - 1) / multiple).toString() // 使用 Math.round 防止结果无限小数
    // }
    // 0 补足小数
    if (result.split('.').length <= 1) {
      result += ".";
      decimal = "";
    } else {
      decimal = result.split('.')[1]
    }

    if (decimal.length < n) {
      for (let i = 0; i < n - decimal.length; i++) {
        result += '0'
      }
      return result
    }
  }
  return result
}
/**
 * 保留小数四舍五入
 * @param {*} number 数字
 * @param {*} n 保留位数
 * @returns
 */
function getTofixed(number, n) {
  // 如果 digits 参数太小或太大。0 到 20（包括）之间的值不会引起 RangeError。实现环境（implementations）也可以支持更大或更小的值
  if (n < 0) {
    n = 0;
  }
  if (n > 20) {
    console.log("抱歉！小数位不能超过20位");
    throw new RangeError('tofixed() digits argument must be between 0 and 20')
  }
  // 如果该方法在一个非Number类型的对象上调用
  if (isNaN(number)) {
    throw new TypeError(number + '.tofixed() is not a function')
  }
  if (number == 'Infinity' || number == '-Infinity') {
    number = '0';
  }
  // 如果数值大于 1e+21，该方法会简单调用 Number.prototype.toString()并返回一个指数记数法格式的字符串
  if (number >= Math.pow(10, 21)) {
    return number.toString()
  }
  // 如果忽略该参数，则默认为 0，进行四舍五入，不包括小数部分
  if (n === undefined || n === 0) {
    return Math.round(number).toString()
  }

  let result = number ? number.toString() : '0';
  const arr = result.split('.')
  // 整数情况
  if (arr.length < 2) {
    result += '.'
    for (let i = 0; i < n; i++) {
      result += '0'
    }
    return result
  }

  // 小数情况（原位数 <= 需求位数）
  const integer = arr[0]
  let decimal = arr[1]
  if (decimal.length === n) {
    return result
  }
  if (decimal.length < n) {
    for (let i = 0; i < n - decimal.length; i++) {
      result += '0'
    }
    return integer.length === 0 ? 0 + result : result;
  }
  // 小数情况（原位数 > 需求位数，需四舍五入）
  result = integer.length === 0 ? 0 : integer + '.' + decimal.substring(0, n)
  const last = decimal.substring(n, n + 1)
  if (parseInt(last, 10) >= 5) {
    const multiple = Math.pow(10, n);
    if (Number(result) > 0) {
      result = ((Math.round(parseFloat(result) * multiple) + 1) / multiple).toString() // 使用 Math.round 防止结果无限小数
    } else {
      // 判断result为负数的情况
      result = ((Math.round(parseFloat(result) * multiple) - 1) / multiple).toString() // 使用 Math.round 防止结果无限小数
    }
    // 0 补足小数
    if (result.split('.').length <= 1) {
      result += ".";
      decimal = "";
    } else {
      decimal = result.split('.')[1]
    }

    if (decimal.length < n) {
      for (let i = 0; i < n - decimal.length; i++) {
        result += '0'
      }
      return result
    }
  }
  return result
}

/**
 * 计算两个日期的相差的天数
 * @param {*} startDate
 * @param {*} endDate
 * @returns
 */
function getCalculatByDate(startDate, endDate) {
  let startDateTime = startDate ? new Date(startDate) : 0;
  let endDateTime = endDate ? new Date(endDate) : 0;
  let startTime = startDateTime ? startDateTime.getTime() : 0;
  let endTime = endDateTime ? endDateTime.getTime() : 0;
  let Difference_In_Time = endTime - startTime;
  let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  return Difference_In_Days;
  // console.log("日期： <br>" + date1 + "<br>和<br>" + date2 + "<br>相差的天数为：" + Difference_In_Days);
}

/**
 * 比较两个日期不能大于多少月，即结束日期(endDate)不能大于开始日期(beginDate)的month月
 * @param {*} beginDate 开始日期
 * @param {*} endDate 结束日期
 * @param {*} month 月份
 * @returns
 */
function getCompareExceedDate(beginDate, endDate, month) {
  if (beginDate && endDate) {
    let arr1 = beginDate.split('-');
    let arr2 = endDate.split('-');
    arr1[1] = parseInt(arr1[1]);
    arr1[2] = parseInt(arr1[2]);
    arr2[1] = parseInt(arr2[1]);
    arr2[2] = parseInt(arr2[2]);
    let flag = true;
    if (arr1[0] == arr2[0]) {//同年
      if (arr2[1] - arr1[1] > month) { //月间隔超过3个月
        flag = false;
      } else if (arr2[1] - arr1[1] == month) { //月相隔3个月，比较日
        if (arr2[2] > arr1[2]) { //结束日期的日大于开始日期的日
          flag = false;
        }
      }
    } else { //不同年
      if (arr2[0] - arr1[0] > 1) {
        flag = false;
      } else if (arr2[0] - arr1[0] == 1) {
        if (arr1[1] < 10) { //开始年的月份小于10时，不需要跨年
          flag = false;
        } else if (arr1[1] + month - arr2[1] < 12) { //月相隔大于3个月
          flag = false;
        } else if (arr1[1] + month - arr2[1] == 12) { //月相隔3个月，比较日
          if (arr2[2] > arr1[2]) { //结束日期的日大于开始日期的日
            flag = false;
          }
        }
      }
    }
    if (!flag) {
      console.log(`时间跨度不得超过${month}个月！`);
      return false;
    }
    return true;
  }
}

/**
 * 日期后几（month）个月
 * @param {*} month
 * @returns
 */
function getCurrentMonth(month) {
  var time = new Date();
  time.setMonth(time.getMonth() + month);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  return y + "-" + m + '-' + d;
}

/**
 * 比较两个日期大小
 * @param {*} beginValue 开始日期
 * @param {*} endValue 结束日期
 * @returns
 */
function checkDateTime(beginValue, endValue) {
  var flag = 0;
  if (beginValue != null && beginValue != "" && endValue != null && endValue != "") {
    var dateS = (beginValue.split(' ')[0]).split('-'); //日期是用'-'分隔,如果你日期用'/'分隔的话,你将这行和下行的'-'换成'/'即可
    var dateE = (endValue.split(' ')[0]).split('-');
    var beginDate = new Date(dateS[0], dateS[1], dateS[2]).getTime(); //如果日期格式不是年月日,需要把new Date的参数调整
    var endDate = new Date(dateE[0], dateE[1], dateE[2]).getTime();
    if (beginDate > endDate) {
      flag = 1;
    } else if (beginDate == endDate) {
      flag = 0;
    } else {
      flag = -1;
    }
  }
  return flag;
}

/**
 * 判断当前日期 大于month个月
 * @param {*} curDate 当前日期
 * @param {*} month 月
 * @returns
 */
function getCurrentDateMonth(curDate, month) {
  const lastTime = getCurrentMonth(month);
  let flag = checkDateTime(curDate, lastTime);
  return flag;
}

//获取当前日期时间
function getCurrentDateTimeString() {
  var myDate = new Date();
  return myDate.toDateFormat('yyyy-MM-dd HH:mm:ss');
}

/**
 * 日期时间格式化
 * @param {*} currentDate
 * @param {*} format
 * @returns
 */
function getMomentDateList(arr, format = 'YYYY-MM-DD HH:mm:ss') {
  // return currentDate ? moment(currentDate).format(format) : '';
  let momentData = {};
  if (arr && arr.length > 0) {
    for (const item of arr) {
      momentData[item] = item ? moment(item).format(format) : '';
    }
  }
  return momentData;
}

//获取Url传递的参数值
function getQueryString(Parametername) {
  let reg = new RegExp('(^|&)' + Parametername + '=([^&]*)(&|$)');
  let search = window.location.search;
  if (!search) {
    let index = window.location.href.indexOf("?");
    search = window.location.href.substr(index);
  }
  let r = search.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return "";
}

/**
 * 数组根据key删除当前的对象
 * @param {*} arr 要删除的数组
 * @param {*} key 对应的键
 * @param {*} id 当前的id
 * @returns
 */
function removeByKey(arr, key, id) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === id) {
      arr.splice(i, 1);
      break;
    }
  }
  return arr;
}

/**
 * 表头标题的宽度设置
 * @param {*} isDefault
 * @param {*} title
 * @returns
 */
function fnTiteWidth(isDefault, title, len = 0) {
  let chinaLen = 0;
  if (isDefault) {
    return 35;
  } else {
    const reg = /[\u4E00-\u9FA5]/g;
    if (title.match(reg)) {
        chinaLen = title.match(reg).length;  //中文的个数 汉字的个数
      }
    return chinaLen * 16 + len || 120;
  }

}

/**
 * 计算两个日期的相差的天数
 * @param {*} startDate
 * @param {*} endDate
 * @returns
 */
function getDayByDate(startDate, endDate) {
  let startDateTime = startDate ? new Date(startDate) : 0;
  let endDateTime = endDate ? new Date(endDate) : 0;
  let startTime = startDateTime ? startDateTime.getTime() : 0;
  let endTime = endDateTime ? endDateTime.getTime() : 0;
  let Difference_In_Time = endTime - startTime;
  let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  return Difference_In_Days;
  // console.log("日期： <br>" + date1 + "<br>和<br>" + date2 + "<br>相差的天数为：" + Difference_In_Days);
}

/**
 * 税率去掉百分号 按照小数进行计算
 * @param {*} taxRate
 * @returns
 */
function getTaxRateResult(taxRate) {
  let result = '';
  if (taxRate && taxRate.indexOf('%') > -1) {
    result = taxRate.replace('%', '');
  }
  return result ? Number(result / 100) : 0;
}

/**
 * 复制文字
 * @param {*} text 
 */
function copyTextToClipboard(text) {
  let textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
}

export default {
  throttle,
  debounce,
  deepCopy,
  getNumAdd,
  getNumSub,
  getNumMulti,
  getNumDiv,
  getTextWidth,
  getCopyAmount,
  getQianfenWeiStr,
  getFixed,
  getTofixed,
  isNumber,
  getCalculatByDate,
  getCompareExceedDate,
  getCurrentDateMonth,
  getCurrentDateTimeString,
  getMomentDateList,
  getQueryString,
  removeByKey,
  fnTiteWidth,
  getDayByDate,
  getTaxRateResult,
  copyTextToClipboard
}
