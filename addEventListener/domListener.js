import { getNPSDetailByTagKey } from './requestHandle';

(function () {
  function getAttr(tag, e) {
    return tag && tag.getAttribute ? tag.getAttribute(e) : '';
  }
  window.onload = function () {
    document.onclick = function (t) {
      if ((t = t || event).clientX || t.clientY || t.pageX || t.pageY) {
        for (
          var e = document, tag = t.srcElement || t.target, n = tag, tagKey = getAttr(tag, 'jc2mtag');
          !tagKey && ((tag = tag.parentNode), tag && 'BODY' != tag.nodeName);

        ) {
          tagKey = getAttr(tag, 'jc2mtag');
        }
      }
      if (tagKey) {
        getNPSDetailByTagKey(tagKey);
      }
    };
  };
})(window);
