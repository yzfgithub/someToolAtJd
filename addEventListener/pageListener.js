/**
 * 使用方法：jc2mPCF.pageListener({'/aaa':'key1'})
 *
 */
 import { getNPSDetailByTagKey } from './requestHandle';

 (function () {
   if (!window.jc2mPCF) {
     window.jc2mPCF = {};
   }
   var pageMapper = {};
   jc2mPCF.pageListener = function (option) {
     var h, pfn;
     pageMapper = option;
     const tagKey = pageMapper[`${window.location.pathname + window.location.hash}`];
     if (tagKey) {
       getNPSDetailByTagKey(tagKey);
     }
     window.history
       ? ((h = window.history),
         (pfn = h.pushState),
         (h.pushState = function (l) {
           return 'function' == typeof h.onpushstate && h.onpushstate({ state: l }), pfn.apply(h, arguments);
         }),
         (window.onpopstate = window.history.onpushstate =
           function () {
             setTimeout(function () {
               const tagKey = pageMapper[`${window.location.pathname + window.location.hash}`];
               if (tagKey) {
                 getNPSDetailByTagKey(tagKey);
               }
             }, 0);
           }))
       : window.addEventListener('hashchange', function () {
           const tagKey = pageMapper[`${window.location.pathname + window.location.hash}`];
           if (tagKey) {
             getNPSDetailByTagKey(tagKey);
           }
         });
   };
 })(window);
 