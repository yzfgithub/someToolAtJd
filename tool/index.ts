import React from 'react';

// 手机号
export const REG_MOBILE = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
// 身份证号
export const REG_ID = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
// 邮箱
export const REG_EMAIL = /^[A-Za-zd0-9-_.]+@([A-Za-zd0-9]+[-.])+[A-Za-zd]{2,5}$/;
// QQ号
export const REG_QQ = /^[1-9][0-9]{4,12}$/;
// jd erp
export const REG_JD_ERP = /^[a-z0-9]*$/;
// banner count
export const REG_BANNER_COUNT = /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[1-9])$/;
// video type
export const REG_VIDEO = /^.*\.(mp|MP)4$/;
// http 开头
export const REG_HTTP_PROTOCOL = /(http|https):\/\/([\w.]+\/?)\S*/;
// 非全部空格非回车，非换行正则
export const REG_NOT_BLANK = /^(?=.*\S).+$/;
// 首尾有空格正则
export const REG_HAS_INVALID_BLANK = /^(\s)+|(\s)+$/;

export function as<R, T = any>(value: T): R {
  return value as T | R as R;
}

// 轮播图补全后续空位
export function replenish(count: number, Children: React.ReactChild | null) {
  if (count < 1) {
    return null;
  } else {
    const array = new Array(count).fill({});
    return array.map((item, key) => {
      return React.createElement('div', { key: key }, Children);
    });
  }
}

// 下载文件去掉协议头
export function formatFileUrl(url: string) {
  return url.replace(/http:/, '').replace(/https:/, '') ?? '';
}

// 字符串前后去空格
export function removeSpace(value: string) {
  return value.replace(/(^\s*)|(\s*$)/g, '');
}
// 浅遍历字符串去掉前后空格
export function removeSpaceInObject(value: { [key: string]: any }) {
  const newValue = {};
  for (const key in value) {
    if (typeof value[key] === 'string') {
      newValue[key] = removeSpace(value[key]);
    } else {
      newValue[key] = value[key];
    }
  }
  return newValue;
}
// 截取日期
export function subDateString(date: string) {
  return date?.toString().split(' ')[0] ?? '';
}
// 下载
export function downLoadFileByURL(url: string, fileName: string) {
  if (url && typeof url === 'string') {
    const dom: HTMLAnchorElement = document.createElement('a');
    dom.style.display = 'none';
    dom.href = formatFileUrl(url);
    dom.setAttribute('download', fileName);
    document.body.appendChild(dom);
    dom.click();
  }
}

export const handleCheckValidator = (message: string) => {
  return (_: any, value: string) => {
    if (!value) {
      return Promise.reject(message);
    } else if (value.length > 0 && !value.replace(/(^\s*)|(\s*$)/g, '').toString().length) {
      return Promise.reject(message);
    } else {
      return Promise.resolve();
    }
  };
};

// input file type
export const fileType = {
  png: 'image/png',
  pdf: 'application/pdf',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  doc: 'application/msword',
  ppt: 'application/vnd.ms-powerpoint',
  txt: 'text/plain',
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg'
};
