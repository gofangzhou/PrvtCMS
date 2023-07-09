Array.prototype.arrayToTree = function (idCode, pidCode, childCode, pidData) {
  let result = [];
  let map = {};
  let objState = (() => {
    function d() {}
    return new d();
  })();
  this.forEach((item) => {
    // 初始化
    const sid = item[idCode] || item.Id;
    const pid = item[pidCode] || item.ParentId;
    objState.__proto__[sid] = 1;
    map[sid] = Object.assign(item, map[sid] || {});
    if (pid !== pidData) {
      let parent = map[pid] || {};
      parent[childCode] || (parent[childCode] = []);
      parent[childCode].push(item);
      objState[pid] !== 1 && (objState[pid] = 0);
      objState[sid] === 0 && (objState[sid] = 1);
      map[pid] = parent;
    } else {
      objState[sid] = 1;
      result.push(map[sid]);
    }
  });
  Object.keys(objState).map((key) => {
    objState[key] === 0 && result.push.apply(result, map[key][childCode]);
  });
  return result;
};
Array.prototype.treeToTag = function (options) {
  options ||= {};
  return (function templateToTag(datas) {
    const tag = (datas || [])
      .map((item, index) => {
        options.id && (item.id = item[options.id]);
        options.title && (item.title = item[options.title] || "");
        options.title_view && (item.title_view = options.title_view(item));
        item.child_tag = templateToTag(
          item[options.child] || item.children || item.child
        );
        return options.template_node?.format(item) || "";
      })
      .join("");
    return options.template_box?.format({ child_tag: tag }) || "";
  })(this);
};

/**
 * 根据视图 nestableTreeData 修改原始数据。
 */
Array.prototype.dataModifyByTreeData = function (treeData, pid, someCallBack) {
  pid = pid || 0; // 准备 pid 的值，用于覆盖原始数据。
  treeData ||= []; // nestable 数据检测

  // 遍历当前层级所有节点数据
  treeData.forEach((item, itemIndex) => {
    // 遍历子节点数据
    this.dataModifyByTreeData(
      item.child || item.children,
      item.id,
      someCallBack
    );

    // 覆盖（修改）原始数据
    this.some((p, pIndex) => {
      return someCallBack(p, pIndex, item, itemIndex, pid);
    });
  });
};
