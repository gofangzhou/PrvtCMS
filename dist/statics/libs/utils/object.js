(function (window, undefined) {
  var RenJiAI = function () {};

  RenJiAI.prototype.checkDataType = function (data, dataType) {
    return Object.prototype.toString.call(data) === `[object ${dataType}]`;
  };

  RenJiAI.prototype.getChatMark = function (chatContent) {
    // 符号 行 列 分割正则
    const regToken =
      /(\s+|[,\.\|\\\/;\-_~]+|[^\x00-\xff\u4e00-\u9fa5]+|[\w\u4e00-\u9fa5]+)/gi;
    // 符号正则
    const regMarkToken = /(\s+|[,\.\|\\\/;\-_~]+|[^\x00-\xff\u4e00-\u9fa5]+)/i;

    // 可能的对话内容
    //const chatContent = `行政区域;人口数量。四川;1`;
    // token数组
    const contents = Array.from(chatContent.match(regToken) || []);

    // 符号计数 待定
    const markMap = {};
    contents.forEach((key) => {
      const status = regMarkToken.test(key);
      if (status) {
        markMap[key] = (markMap[key] || 0) + 1;
      }
    });

    const markKeys = Object.keys(markMap);
    const markLeng = markKeys.length;
    let markRow = "  ";
    let markCol = " ";

    // 一般只有行分割
    markLeng === 1 && (markRow = markKeys[0]);

    // 在一段话中，第一次出现的符号，一般认为是列分割
    // 在一段话中，第二次出现的符号，一般认为是行分割
    if (markLeng > 1) {
      const markColIndex = chatContent.indexOf(markKeys[0]);
      const markRowIndex = chatContent.indexOf(markKeys[1]);
      const markDifState = markColIndex > markRowIndex;
      markCol = markDifState ? markKeys[1] : markKeys[0];
      markRow = markDifState ? markKeys[0] : markKeys[1];
    }

    console.log(contents, "列分隔符", markCol, "行分隔符", markRow);
    return { markRow, markCol };
  };

  RenJiAI.prototype.textTitlesToTree = function (content, callback) {
    const contents = (content || "")
      .replace(/(^[\r\s\n]+|[\r\s\n]+$)/g, "")
      .split(/[\n\r]+/g);

    const model = { children: [] };

    (function next(datas, index, parentWhiteSpaceLen, parent) {
      for (; index > -1 && index < datas.length; index++) {
        const data = {};
        const element = datas[index];
        const whiteSpaceLen = (element.match(/^\s+/) || []).join("").length;
        const title = element.replace(/^\s+/, "");

        data.id = new Date().getTime() + "-" + index;
        data.title = title;
        data.children = [];

        if (parentWhiteSpaceLen < whiteSpaceLen) {
          index = next(
            datas,
            index,
            whiteSpaceLen,
            parent.children[parent.children.length - 1]
          );
          continue;
        }
        if (parentWhiteSpaceLen > whiteSpaceLen) {
          return index - 1;
        }

        callback(data, parentWhiteSpaceLen);
        (parentWhiteSpaceLen > 0) & parent.children.push(data);
      }
      return -2;
    })(contents, 0, 0, model);

    return model;
  };

  /**
   * 计算旋转角度的函数
   * @param {*} coordinates
   * @returns
   */
  RenJiAI.prototype.calculateRotationAngle = function (coordinates) {
    // 取前两个坐标作为基准向量
    const vector1 = {
      x:
        coordinates[coordinates.length - 3].x -
        coordinates[coordinates.length - 4].x,
      y:
        coordinates[coordinates.length - 3].y -
        coordinates[coordinates.length - 4].y,
    };

    // 取后两个坐标作为目标向量
    const vector2 = {
      x:
        coordinates[coordinates.length - 1].x -
        coordinates[coordinates.length - 2].x,
      y:
        coordinates[coordinates.length - 1].y -
        coordinates[coordinates.length - 2].y,
    };

    // 计算两个向量的夹角（弧度）
    const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
    const magnitude1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
    const magnitude2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);
    const angle = Math.acos(dotProduct / (magnitude1 * magnitude2));

    // 转换为角度并返回结果
    return (angle * 180) / Math.PI;
  };

  RenJiAI.prototype.calculateCircleCoordinates = function (
    centerX,
    centerY,
    radius,
    num
  ) {
    num = num || 1;
    var coordinates = [];

    for (var i = 0; i <= 360; ) {
      var angle = (i * Math.PI) / 180;
      var x = centerX + radius * Math.cos(angle);
      var y = centerY + radius * Math.sin(angle);
      coordinates.push({ x: x, y: y });

      i = i + num;
    }

    return coordinates;
  };

  RenJiAI.prototype.calculateEllipseCoordinates = function (h, k, a, b) {
    var coordinates = [];

    for (var theta = 0; theta <= 2 * Math.PI; theta += 0.01) {
      var x = h + a * Math.cos(theta);
      var y = k + b * Math.sin(theta);
      coordinates.push({ x: x, y: y });
    }

    return coordinates;
  }

  RenJiAI.prototype.setIntervalToDatas = function (options, callback, endBack) {
    let i = 0;
    const timer = setInterval(() => {
      if (i >= options.datas.length) {
        if (options.loop) {
          i = 0;
          endBack && endBack();
        } else {
          clearInterval(timer);
          endBack && endBack();
          return;
        }
      }
      callback(options.datas[i], i, options.datas);
      i++;
    }, options.time);
  };

  // 创建一个数组来跟踪按键的状态

  RenJiAI.prototype.setIntervalToKeyBoard = function (options, callback) {
    const activeKeys = [];
    // 监听"keydown"事件
    document.addEventListener("keydown", (event) => {
      // 检查按下的键是否已经在数组中
      if (!activeKeys.includes(event.key)) {
        // 将按下的键添加到数组中
        activeKeys.push(event.key);
      }
    });

    // 监听"keyup"事件
    document.addEventListener("keyup", (event) => {
      // 从数组中移除被释放的键
      const index = activeKeys.indexOf(event.key);
      if (index >= 0) {
        activeKeys.splice(index, 1);
      }
    });

    const timer = setInterval(() => {
      callback(activeKeys.join(","), timer);
    }, options.time);
  };

  var Canvas = function () {};
  var CanvasContext2D = function () {};
  CanvasContext2D.prototype.drawArc = function (context, x1, y1, x2, y2) {
    const centerX = (x2 + x1) / 2;
    const centerY = (y1 + y2) / 2;
    const d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const radius = d / 2;

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = "transparent";
    context.fill();
    context.lineWidth = 1;
    context.stroke();
    context.fillStyle = "#333";
    // context.closePath();
  };
  CanvasContext2D.prototype.drawEllipse = function (context, x1, y1, x2, y2) {
    const centerX = (x2 + x1) / 2;
    const centerY = (y1 + y2) / 2;
    const radiusX = Math.sqrt(Math.pow(x2 - x1, 2)) / 2;
    const radiusY = Math.sqrt(Math.pow(y2 - y1, 2)) / 2;
    const startAngle = 0;
    const endAngle = 2 * Math.PI;

    context.beginPath();
    context.ellipse(
      centerX,
      centerY,
      radiusX,
      radiusY,
      0,
      startAngle,
      endAngle
    );
    context.stroke();
  };
  CanvasContext2D.prototype.drawPoint = function (context, lineWidth, x, y) {
    context.beginPath();
    context.arc(x, y, lineWidth / 2, 0, Math.PI * 2);
    context.fill();
    context.closePath();
  };

  Canvas.prototype.context2D = new CanvasContext2D();
  RenJiAI.prototype.canvas = new Canvas();
  window.renjiai = new RenJiAI();
})(window);

// (() => {
//   const cache_code = JSON.parse(localStorage.getItem("cache_code"));
//   const editorCode = cache_code.codes.filter(
//     (p) => p.title == "code-editor"
//   )[0];
//   document.body.innerHTML = editorCode.code_html;
//   const style = document.createElement('style');
//   style.type = 'text/css';
//   style.innerHTML = editorCode.code_css
//   document.body.append(style);

//   const script = document.createElement('script');
//   style.type = 'text/javascript';
//   style.innerHTML = editorCode.code_js
//   document.body.append(script);
// })();
