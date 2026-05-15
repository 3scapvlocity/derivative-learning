const rateBtn = document.getElementById("rateBtn");
const rateBox =
  document.getElementById("rateBox");

rateBtn.addEventListener(
  "click",
  function () {

    if (
      rateBox.style.display === "block"
    ) {

      rateBox.style.display = "none";

      rateBtn.textContent =
        "点击理解平均变化率";

    }
    else {

      rateBox.style.display = "block";

      rateBtn.textContent =
        "收起平均变化率解释";

    }

  }
);

// 获取主图 canvas
const ctx = document
  .getElementById("functionChart")
  .getContext("2d");

// 获取导函数 canvas
const derivativeCtx = document
  .getElementById("derivativeChart")
  .getContext("2d");


// 生成函数数据
function generateData() {

  let points = [];

  for (let x = -5; x <= 5; x += 0.1) {

    points.push({
      x: x,
      y: x * x
    });

  }

  return points;
}
// 生成导函数数据
function generateDerivativeData() {

  let points = [];

  for (let x = -5; x <= 5; x += 0.1) {

    points.push({
      x: x,
      y: 2 * x
    });

  }

  return points;
}

// 当前点
let currentX = 0;

// 当前 h
let currentH = 2;
let animation = null;

// 创建图表
const chart = new Chart(ctx, {

  type: "scatter",

  data: {

    datasets: [

      // 函数曲线
      {
        label: "y = x²",

        data: generateData(),

        showLine: true
      },

      // 当前点
      {
        label: "当前点",

        data: [{
          x: currentX,
          y: currentX * currentX
        }],

        pointRadius: 6
      },

      // 切线
      {
        label: "切线",

        data: [],

        showLine: true,

        pointRadius: 0
      },

      // 割线
      {
        label: "割线",

        data: [],

        showLine: true,

        pointRadius: 0
      }

    ]
  },

  options: {

    responsive: true,

    scales: {

      x: {
        type: "linear",
        position: "bottom"
      }

    }

  }

});
// 导函数图表
const derivativeChart =
  new Chart(derivativeCtx, {

    type: "scatter",

    data: {

      datasets: [

        // 导函数曲线
        {
          label: "y = 2x",

          data:
            generateDerivativeData(),

          showLine: true
        },

        // 当前导数点
        {
          label: "当前导数",

          data: [{
            x: currentX,
            y: 2 * currentX
          }],

          pointRadius: 6
        }

      ]
    },

    options: {

      responsive: true,

      scales: {

        x: {
          type: "linear",
          position: "bottom"
        }

      }

    }

  });

// 获取滑块
const pointSlider =
  document.getElementById("pointSlider");

// 获取 h 滑块
const hSlider =
  document.getElementById("hSlider");

// 获取文字区域
const slopeText =
  document.getElementById("slopeText");

const hText =
  document.getElementById("hText");
  const pointInfo =
  document.getElementById("pointInfo");

const derivativeInfo =
  document.getElementById("derivativeInfo");

const secantInfo =
  document.getElementById("secantInfo");

const meaningInfo =
  document.getElementById("meaningInfo");
  const playBtn =
  document.getElementById("playBtn");

const stopBtn =
  document.getElementById("stopBtn");

// 更新图像
function updatePoint(x) {

  // 更新当前点
  chart.data.datasets[1].data = [{
    x: x,
    y: x * x
  }];

  // 导数
  let slope = 2 * x;

  // ======================
  // 切线
  // ======================

  let tangentPoints = [];

  for (let t = x - 2; t <= x + 2; t += 0.1) {

    let y =
      slope * (t - x)
      + x * x;

    tangentPoints.push({
      x: t,
      y: y
    });

  }

  chart.data.datasets[2].data =
    tangentPoints;

  // ======================
  // 割线
  // ======================

  let secantSlope =
    (
      (x + currentH) * (x + currentH)
      - x * x
    ) / currentH;

  // 两个函数点
  let pointA = {
    x: x,
    y: x * x
  };

  let pointB = {
    x: x + currentH,
    y: (x + currentH) * (x + currentH)
  };

  // 更新割线
  chart.data.datasets[3].data = [
    pointA,
    pointB
  ];

  // 更新图表
  chart.update();
  // 更新导函数图像
derivativeChart.data.datasets[1].data = [{

  x: x,

  y: slope

}];

derivativeChart.update();

  // 更新文字
  slopeText.textContent =
    `当前 x = ${x} ，导数值 = ${slope}`;

  hText.textContent =
    `当前 h = ${currentH}`;
    pointInfo.textContent =
  `当前点：(${x.toFixed(2)}, ${(x*x).toFixed(2)})`;

derivativeInfo.textContent =
  `导数值：${slope.toFixed(2)}`;

secantInfo.textContent =
  `割线斜率：${secantSlope.toFixed(2)}`;
  if (slope > 3) {

  meaningInfo.textContent =
    "函数正在快速增长。";

}
else if (slope > 0) {

  meaningInfo.textContent =
    "函数正在缓慢增长。";

}
else if (slope === 0) {

  meaningInfo.textContent =
    "函数切线接近水平。";

}
else {

  meaningInfo.textContent =
    "函数正在减小。";

}

}

// 初始显示
updatePoint(currentX);

// 监听 x 滑块
pointSlider.addEventListener(
  "input",
  function () {

    currentX =
      parseFloat(pointSlider.value);

    updatePoint(currentX);

  }
);

// 监听 h 滑块
hSlider.addEventListener(
  "input",
  function () {

    currentH =
      parseFloat(hSlider.value);

    updatePoint(currentX);

  }
);
// 开始动画
playBtn.addEventListener(
  "click",
  function () {

    // 防止重复开启
    if (animation !== null) {
      return;
    }

    animation = setInterval(
      function () {

        currentX += 0.05;

        // 超出范围后回到左边
        if (currentX > 5) {

          currentX = -5;

        }

        // 更新滑块位置
        pointSlider.value = currentX;

        // 更新图像
        updatePoint(currentX);

      },
      30
    );

  }
);
// 暂停动画
stopBtn.addEventListener(
  "click",
  function () {

    clearInterval(animation);

    animation = null;

  }
);