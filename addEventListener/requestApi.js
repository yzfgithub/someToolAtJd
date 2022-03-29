import axios from './axios';

var npsUrl =
  'url1';
var npsAddUrl =
  'url2';
var npsHasUrl =
  'url3';

/**
 * 根据key获取页面或动作配置
 * @param {页面或者动作key值} tagKey
 * @returns
 */
export function getNPSDetailByTagKeyRequest(tagKey) {
  return axios({
    url: npsUrl,
    method: 'post',
    data: { tagKey },
    errorTitle: ''
  });
}

/**
 * 根据key更新页面弹出次数
 * @param {页面或者动作key值} tagKey
 * @returns
 */
export function updateNPSCountByTagKeyRequest(tagKey) {
  return axios({
    url: npsAddUrl,
    method: 'post',
    data: { tagKey },
    errorTitle: ''
  });
}

/**
 * 根据key更新页面对应问卷链接填写状态
 * @param {页面或者动作key值} tagKey
 * @returns
 */
export function updateNPSStatusByTagKeyRequest(tagKey) {
  return axios({
    url: npsHasUrl,
    method: 'post',
    data: { tagKey },
    errorTitle: ''
  });
}
