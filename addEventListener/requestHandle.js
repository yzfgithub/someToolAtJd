import {
    getNPSDetailByTagKeyRequest,
    updateNPSCountByTagKeyRequest,
    updateNPSStatusByTagKeyRequest
  } from './requestApi';
  
  export async function getNPSDetailByTagKey(tagKey) {
    // let res = await getNPSDetailByTagKeyRequest(tagKey);
    let res = {};
    res.data = [
      {
        type: 'modal',
        title: '123abc',
        content: '123abc',
        link: 'targetLink1'
      },
      {
        type: 'toast',
        title: '',
        content: '',
        link: 'targetLink2'
      }
    ];
    if (res && res.data && res.data.length) {
      res.data.forEach((item, key) => {
        if (item.type === 'modal') {
          // 更新页面弹出次数
          updateNPSCountByTagKey(tagKey);
          window.jc2mPCF.showCommonModal({
            title: item.title,
            content: item.content,
            mainText: '马上参与',
            mainType: 'primary', // primary
            subText: '我已参与',
            subType: '',
            onMainHandle: () => {
              window.open(item.link);
            },
            onSubHandle: () => {
              // 更新问卷状态
              updateNPSStatusByTagKey(tagKey);
            }
          });
        } else if (item.type === 'toast') {
          window.jc2mPCF.showSurveyFloating({
            onClick: function () {
              window.jc2mPCF.hideSurveyFloating({
                onClick: () => {
                  window.open(item.link);
                }
              });
            }
          });
        }
      });
    }
  }
  
  export function updateNPSCountByTagKey(tagKey) {
    updateNPSCountByTagKeyRequest(tagKey);
  }
  
  export function updateNPSStatusByTagKey(tagKey) {
    updateNPSStatusByTagKeyRequest(tagKey);
  }
  