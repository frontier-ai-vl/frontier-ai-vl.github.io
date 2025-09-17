// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initMindMap();
  initBenchmarkPieChart();
});

// 多层级数据结构
const benchmarkData = {
  name: "Main Categories",
  children: [
    {
      name: "General Perception",
      value: 75.141,
      color: "#3B82F6",
      children: [
        { 
          name: "General Perception", 
          value: 75.141, 
          children: [
            { name: "Detection / Grounding", value: 3.431 },
            { name: "Counting", value: 3.765 },
            { name: "Pointing / REC", value: 3.008 },
            { name: "Segmentation", value: 0.015 },
            { name: "Classification", value: 5.112 },
            { name: "OCR / Chart / Doc", value: 23.419 },
            { name: "Captioning", value: 6.087 },
            { name: "Image eval", value: 0.365 },
            { name: "Knowledge reasoning", value: 29.939 }
          ]
        }
      ]
    },
    {
      name: "Spatial & Temporal",
      value: 36.823,
      color: "#10B981",
      children: [
        { 
          name: "Spatial", 
          value: 25.514,
          children: [
            { name: "Multi-view corresponding", value: 0.138 },
            { name: "Environment", value: 8.498 },
            { name: "Plausibility", value: 0.086 },
            { name: "Affordance", value: 0.601 },
            { name: "Camera", value: 0.307 },
            { name: "Relationship", value: 11.523 },
            { name: "Measurement", value: 4.117 },
            { name: "Speed estimation", value: 0.244 }
          ]
        },
        { 
          name: "Temporal", 
          value: 11.309,
          children: [
            { name: "Action / Event", value: 5.674 },
            { name: "Trajectory reasoning", value: 3.041 },
            { name: "Future / Past reasoning", value: 2.364 },
            { name: "Causality", value: 0.230 }
          ]
        }
      ]
    },
    {
      name: "Physical Understanding",
      value: 11.228,
      color: "#8B5CF6",
      children: [
        { 
          name: "Intuitive Physics", 
          value: 2.482,
          children: [
            { name: "Electromagnetism", value: 1.355 },
            { name: "Thermodynamics", value: 1.035 },
            { name: "Anti-Physics", value: 0.092 }
          ]
        },
        { 
          name: "Embodied Reasoning", 
          value: 8.746,
          children: [
            { name: "Mechanics", value: 4.741 },
            { name: "Attributes", value: 2.424 },
            { name: "States", value: 1.381 },
            { name: "Object Permanence", value: 0.200 }
          ]
        }
      ]
    }
  ]
};

// 全局变量
let currentData = benchmarkData;
let pieChart = null;
let history = [];

// 生成随机颜色
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Initialize benchmark pie chart
function initBenchmarkPieChart() {
  const pieElement = document.getElementById('benchmark-pie-chart');
  if (!pieElement) return;
  
  // 设置全局 Chart.js 默认值以提高渲染质量
  Chart.defaults.font.family = "'Roboto', 'system-ui', '-apple-system', 'sans-serif'";
  Chart.defaults.color = '#1f2937';
  
  // 创建Canvas元素
  const canvas = document.createElement('canvas');
  canvas.id = 'pie-chart';
  
  // Handle high DPI displays for crisp rendering
  const dpr = window.devicePixelRatio || 1;
  
  // Set display size (css pixels)
  canvas.style.width = '720px';
  canvas.style.height = '420px';
  
  // Set actual size in memory (scaled up for high DPI)
  canvas.width = 720 * dpr;
  canvas.height = 420 * dpr;
  
  // Scale the drawing context to match device pixel ratio
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  
  pieElement.innerHTML = '';
  pieElement.appendChild(canvas);
  
  // 初始化图表
  updatePieChart();
  updateNavigationButtons();
  
  // 添加按钮事件监听器
  addButtonListeners();
  
  console.log('Benchmark pie chart initialized successfully');
}

// 更新饼图
function updatePieChart() {
  const canvas = document.getElementById('pie-chart');
  if (!canvas) return;
  
  if (pieChart) {
    pieChart.destroy();
  }
  
  // 准备图表数据
  const labels = currentData.children.map(item => item.name);
  const values = currentData.children.map(item => item.value);
  const colors = currentData.children.map(item => 
    item.color || getRandomColor()
  );
  
  // 自定义插件：在动画完成后绘制外部标签
  const externalLabelsPlugin = {
    id: 'externalLabels',
    afterDraw: function(chart) {
      addBenchmarkExternalLabels(canvas, chart, labels, values, colors);
    }
  };
  
  // 创建图表
  pieChart = new Chart(canvas, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 10
      }]
    },
    plugins: [externalLabelsPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      devicePixelRatio: 2, // 提高渲染清晰度
      layout: {
        padding: {
          left: 45,
          right: 45,
          top: 75,
          bottom: 60
        }
      },
      plugins: {
        legend: {
          display: false  // 隐藏图例
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
              return `${label}: ${value}K (${percentage}%)`;
            }
          }
        },
        datalabels: {
          display: false  // 禁用内部标签，使用外部标签
        }
      },
      animation: {
        animateScale: true,
        animateRotate: true,
        duration: 500,
        easing: 'easeOutQuart',
        onComplete: function() {
          // 动画完成后绘制外部标签
          setTimeout(() => {
            addBenchmarkExternalLabels(canvas, pieChart, labels, values, colors);
          }, 50);
        }
      },
      onClick: handleChartClick
    }
  });
}

// 添加通用评测集的外部标签和连接线
function addBenchmarkExternalLabels(canvas, chart, labels, values, colors) {
  const ctx = canvas.getContext('2d');
  const chartArea = chart.chartArea;
  const centerX = chartArea.left + (chartArea.right - chartArea.left) / 2;
  const centerY = chartArea.top + (chartArea.bottom - chartArea.top) / 2;
  const outerRadius = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top) / 2;
  
  // 计算总数据
  const total = values.reduce((a, b) => a + b, 0);
  
  // 设置字体以计算文本尺寸
  ctx.font = '13px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  
  // 预计算所有标签位置，避免重叠
  const labelPositions = [];
  let currentAngle = -Math.PI / 2; // 从顶部开始
  
  // 第一遍：计算所有标签的基本位置
  values.forEach((value, index) => {
    const percentage = (value / total) * 100;
    const sliceAngle = (value / total) * 2 * Math.PI;
    const midAngle = currentAngle + sliceAngle / 2;
    
    const labelText = `${labels[index]}: ${Math.round(percentage)}%`;
    const labelWidth = ctx.measureText(labelText).width + 10;
    const labelHeight = 20;
    
    const labelRadius = outerRadius + 25;  // 进一步减少标签距离，因为饼图又增大了20%
    const endX = centerX + Math.cos(midAngle) * labelRadius;
    const endY = centerY + Math.sin(midAngle) * labelRadius;
    
    let labelX, labelY;
    if (Math.cos(midAngle) >= 0) {
      labelX = endX + 5;
      labelY = endY - labelHeight / 2;
    } else {
      labelX = endX - labelWidth - 5;
      labelY = endY - labelHeight / 2;
    }
    
    labelPositions.push({
      index,
      midAngle,
      labelX,
      labelY,
      labelWidth,
      labelHeight,
      labelText,
      percentage,
      startX: centerX + Math.cos(midAngle) * outerRadius,
      startY: centerY + Math.sin(midAngle) * outerRadius,
      endX,
      endY
    });
    
    currentAngle += sliceAngle;
  });
  
  // 第二遍：调整重叠的标签位置
  for (let i = 0; i < labelPositions.length; i++) {
    for (let j = i + 1; j < labelPositions.length; j++) {
      const pos1 = labelPositions[i];
      const pos2 = labelPositions[j];
      
      // 检查是否重叠
      const overlap = !(pos1.labelX + pos1.labelWidth < pos2.labelX || 
                       pos2.labelX + pos2.labelWidth < pos1.labelX ||
                       pos1.labelY + pos1.labelHeight < pos2.labelY ||
                       pos2.labelY + pos2.labelHeight < pos1.labelY);
      
      if (overlap) {
        // 调整第二个标签的位置
        const offset = 25;
        if (pos2.midAngle > pos1.midAngle && pos2.midAngle - pos1.midAngle < Math.PI) {
          // 第二个标签在第一个的顺时针方向
          pos2.labelY = pos1.labelY + pos1.labelHeight + 5;
          // 延长引线
          pos2.labelRadius = outerRadius + 40 + (j - i) * 10;  // 配合增大20%的饼图
          pos2.endX = centerX + Math.cos(pos2.midAngle) * pos2.labelRadius;
          pos2.endY = centerY + Math.sin(pos2.midAngle) * pos2.labelRadius;
          if (Math.cos(pos2.midAngle) >= 0) {
            pos2.labelX = pos2.endX + 5;
          } else {
            pos2.labelX = pos2.endX - pos2.labelWidth - 5;
          }
        }
      }
    }
  }
  
  // 第三遍：绘制所有标签和连接线
  labelPositions.forEach((pos) => {
    // 绘制连接线
    ctx.strokeStyle = colors[pos.index];
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pos.startX, pos.startY);
    
    // 绘制折线
    const midX = pos.startX + (pos.endX - pos.startX) * 0.7;
    const midY = pos.startY + (pos.endY - pos.startY) * 0.7;
    ctx.lineTo(midX, midY);
    ctx.lineTo(pos.endX, pos.endY);
    
    // 水平延伸线
    const extendX = Math.cos(pos.midAngle) >= 0 ? pos.endX + 15 : pos.endX - 15;
    ctx.lineTo(extendX, pos.endY);
    ctx.stroke();
    
    // 绘制标签文字
    ctx.fillStyle = '#1f2937'; // 深灰色文字
    ctx.font = '13px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = Math.cos(pos.midAngle) >= 0 ? 'left' : 'right';
    ctx.textBaseline = 'middle';
    
    const textX = Math.cos(pos.midAngle) >= 0 ? extendX + 5 : extendX - 5;
    ctx.fillText(pos.labelText, textX, pos.endY);
  });
}

// 处理图表点击事件
function handleChartClick(event, elements) {
  if (elements.length > 0) {
    const index = elements[0].index;
    const selectedItem = currentData.children[index];
    
    // 如果有子类别，则进入下一级
    if (selectedItem.children && selectedItem.children.length > 0) {
      history.push(currentData);
      currentData = {
        name: selectedItem.name,
        children: selectedItem.children,
        parent: currentData,
        color: selectedItem.color
      };
      updatePieChart();
      updateNavigationButtons();
    }
  }
}

// 更新导航按钮状态
function updateNavigationButtons() {
  const backBtn = document.getElementById('back-btn');
  const currentLevelSpan = document.getElementById('current-level');
  
  if (backBtn) {
    backBtn.style.display = history.length > 0 ? 'inline-block' : 'none';
  }
  
  if (currentLevelSpan) {
    currentLevelSpan.textContent = `Current Level: ${currentData.name}`;
  }
}

// 返回上一级
function goBack() {
  if (history.length > 0) {
    currentData = history.pop();
    updatePieChart();
    updateNavigationButtons();
  }
}

// Reset view
function resetView() {
  history = [];
  currentData = benchmarkData;
  updatePieChart();
  updateNavigationButtons();
}

// 添加按钮事件监听器
function addButtonListeners() {
  const backBtn = document.getElementById('back-btn');
  const resetBtn = document.getElementById('reset-btn');
  
  if (backBtn) {
    backBtn.addEventListener('click', goBack);
  }
  
  if (resetBtn) {
    resetBtn.addEventListener('click', resetView);
  }
}

// 创建Mermaid思维导图数据
function createMermaidMindMap() {
  return `
    graph LR
      A[Video Analysis Benchmark] --> B[Physics Understanding]
      A --> C[General Perception]
      A --> D[Spatial & Temporal]
      
      %% Physics分支 - 上方布局
      B --> B1[Intuitive Physics]
      B --> B2[Embodied Reasoning]
      
      B1 --> B1a[Electromagnetism]
      B1a --> B1a1[Explanation:   Understand laws of physics related to Electromagnetism, including Optics, Electricity, and Magnetism]
      B1 --> B1b[Thermodynamics]
      B1b --> B1b1[Explanation:   Understand laws of physics related to Thermodynamics, such as heat, temperature change, evaporation, etc.]
      B1 --> B1c[Anti-Physics]
      B1c --> B1c1[Explanation:   Understand situations that defy the laws of physics, such as anti-gravity, reverse of time, etc.]
      
      B2 --> B2a[Mechanics]
      B2a --> B2a1[Explanation:   Understand laws of physics related to Mechanics, including Statics, Kinematics, and Dynamics]
      B2 --> B2b[Attributes]
      B2b --> B2b1[Explanation:   Determine physical properties of an object, including semantic description, size, color, material, mass, etc.]
      B2 --> B2c[States]
      B2c --> B2c1[Explanation:   Determine the object state and understand the state change, e.g., ice changed to water]
      B2 --> B2d[Object Permanence]
      B2d --> B2d1[Explanation:   Understand object permanence, which properties can/cannot change in certain conditions]
      
      %% General Perception分支 - 中间布局，分两列
      C --> C1[Counting]
      C --> C2[Captioning]
      C --> C3[Detection / Grounding]
      C --> C4[Pointing / REC]
      C --> C5[Segmentation]
      C --> C6[Classification]
      C --> C7[OCR]
      C --> C8[Image eval]
      
      %% Spatial & Temporal分支 - 下方布局
      D --> D1[Spatial]
      D --> D2[Temporal]
      
      D1 --> D1a[Relationship]
      D1a --> D1a1[Explanation:   Spatial relationships between objects]
      D1 --> D1b[Multi-view]
      D1b --> D1b1[Explanation:   Multi-view corresponding and matching]
      D1 --> D1c[Environment]
      D1c --> D1c1[Explanation:   Traffic violations and parking]
      D1 --> D1d[Plausibility]
      D1d --> D1d1[Explanation:   Whether spatial relationships are valid]
      D1 --> D1e[Affordance]
      D1e --> D1e1[Explanation:   Understanding interactions between objects and subjects like humans, animals, robots]
      D1 --> D1f[Camera]
      D1f --> D1f1[Explanation:   Camera movement, angles/positions and scene transitions]
      D1 --> D1g[Measurement]
      D1g --> D1g1[Explanation:   Measurement and speed detection]
      
      D2 --> D2a[Action / Event]
      D2a --> D2a1[Explanation:   Summarizing events]
      D2 --> D2b[Trajectory]
      D2b --> D2b1[Explanation:   Trajectory reasoning and judgment]
      D2 --> D2c[Causality]
      D2c --> D2c1[Explanation:   Causal relationships between events]
      D2 --> D2d[Future / Past]
      D2d --> D2d1[Explanation:   Predicting future/analyzing historical event completion]
      
      %% Style definitions - different colors for different levels
      style A fill:#dc2626,stroke:#b91c1c,stroke-width:3px,color:#fff
      style B fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff
      style C fill:#059669,stroke:#047857,stroke-width:2px,color:#fff
      style D fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
      style B1 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style B2 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style D1 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style D2 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style C1 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style C2 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style C3 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style C4 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style C5 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style C6 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style C7 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style C8 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style B1a fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B1b fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B1c fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B2a fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B2b fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B2c fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B2d fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style D1a fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style D1b fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style D1c fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style D1d fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style D1e fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style D1f fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style D1g fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style D2a fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style D2b fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style D2c fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style D2d fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B1a1 fill:#94a3b8,stroke:#64748b,stroke-width:1px,color:#fff
      style B1b1 fill:#94a3b8,stroke:#64748b,stroke-width:1px,color:#fff
      style B1c1 fill:#94a3b8,stroke:#64748b,stroke-width:1px,color:#fff
      style B2a1 fill:#94a3b8,stroke:#64748b,stroke-width:1px,color:#fff
      style B2b1 fill:#94a3b8,stroke:#64748b,stroke-width:1px,color:#fff
      style B2c1 fill:#94a3b8,stroke:#64748b,stroke-width:1px,color:#fff
      style B2d1 fill:#94a3b8,stroke:#64748b,stroke-width:1px,color:#fff
      style D1a1 fill:#94a3b8,stroke:#64748b,stroke-width:1px,color:#fff
      style D1b1 fill:#94a3b8,stroke:#64748b,stroke-width:1px,color:#fff
      style D1c1 fill:#94a3b8,stroke:#64748b,stroke-width:1px,color:#fff
      style D1d1 fill:#94a3b8,stroke:#64748b,stroke-width:1px,color:#fff
      style D1e1 fill:#94a3b8,stroke:#64748b,stroke-width:1px,color:#fff
      style D1f1 fill:#94a3b8,stroke:#64748b,stroke-width:1px,color:#fff
      style D1g1 fill:#94a3b8,stroke:#64748b,stroke-width:1px,color:#fff
      style D2a1 fill:#94a3b8,stroke:#64748b,stroke-width:1px,color:#fff
      style D2b1 fill:#94a3b8,stroke:#64748b,stroke-width:1px,color:#fff
      style D2c1 fill:#94a3b8,stroke:#64748b,stroke-width:1px,color:#fff
      style D2d1 fill:#94a3b8,stroke:#64748b,stroke-width:1px,color:#fff
  `;
}

// 创建折叠版本的思维导图数据（隐藏叶子节点）
function createCollapsedMindMap() {
  return `
    graph LR
      A[Video Analysis Benchmark] --> B[Physics Understanding]
      A --> C[General Perception]
      A --> D[Spatial & Temporal]
      
      B --> B1[Intuitive Physics]
      B --> B2[Embodied Reasoning]
      
      C --> C1[Counting]
      C --> C2[Captioning]
      C --> C3[Detection / Grounding]
      C --> C4[Pointing / REC]
      C --> C5[Segmentation]
      C --> C6[Classification]
      C --> C7[OCR]
      C --> C8[Image eval]
      
      D --> D1[Spatial]
      D --> D2[Temporal]
      
      style A fill:#dc2626,stroke:#b91c1c,stroke-width:3px,color:#fff
      style B fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff
      style C fill:#059669,stroke:#047857,stroke-width:2px,color:#fff
      style D fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
      style B1 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style B2 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style D1 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style D2 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style C1 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style C2 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style C3 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style C4 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style C5 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style C6 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style C7 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style C8 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
  `;
}

// 创建部分折叠的思维导图数据
function createPartiallyCollapsedMindMap(collapsedNodes = []) {
  let mermaidCode = `
    graph LR
      A[Video Analysis Benchmark] --> B[Physics Understanding]
      A --> C[General Perception]
      A --> D[Spatial & Temporal]
  `;
  
  // General Perception分支 - 始终显示
  mermaidCode += `
      C --> C1[Counting]
      C --> C2[Captioning]
      C --> C3[Detection / Grounding]
      C --> C4[Pointing / REC]
      C --> C5[Segmentation]
      C --> C6[Classification]
      C --> C7[OCR]
      C --> C8[Image eval]
  `;
  
  // 根据折叠状态添加节点
  if (!collapsedNodes.includes('B1')) {
    mermaidCode += `
      B --> B1[Intuitive Physics]
      B1 --> B1a[Electromagnetism]
      B1a --> B1a1[Explanation:   Understand laws of physics related to Electromagnetism, including Optics, Electricity, and Magnetism]
      B1 --> B1b[Thermodynamics]
      B1b --> B1b1[Explanation:   Understand laws of physics related to Thermodynamics, such as heat, temperature change, evaporation, etc.]
      B1 --> B1c[Anti-Physics]
      B1c --> B1c1[Explanation:   Understand situations that defy the laws of physics, such as anti-gravity, reverse of time, etc.]
    `;
  } else {
    mermaidCode += `
      B --> B1[Intuitive Physics +]
    `;
  }
  
  if (!collapsedNodes.includes('B2')) {
    mermaidCode += `
      B --> B2[Embodied Reasoning]
      B2 --> B2a[Mechanics]
      B2a --> B2a1[Explanation:   Understand laws of physics related to Mechanics, including Statics, Kinematics, and Dynamics]
      B2 --> B2b[Attributes]
      B2b --> B2b1[Explanation:   Determine physical properties of an object, including semantic description, size, color, material, mass, etc.]
      B2 --> B2c[States]
      B2c --> B2c1[Explanation:   Determine the object state and understand the state change, e.g., ice changed to water]
      B2 --> B2d[Object Permanence]
      B2d --> B2d1[Explanation:   Understand object permanence, which properties can/cannot change in certain conditions]
    `;
  } else {
    mermaidCode += `
      B --> B2[Embodied Reasoning +]
    `;
  }
  
  if (!collapsedNodes.includes('D1')) {
    mermaidCode += `
      D --> D1[Spatial]
      D1 --> D1a[Relationship]
      D1a --> D1a1[Explanation:   Spatial relationships between objects]
      D1 --> D1b[Multi-view]
      D1b --> D1b1[Explanation:   Multi-view corresponding and matching]
      D1 --> D1c[Environment]
      D1c --> D1c1[Explanation:   Traffic violations and parking]
      D1 --> D1d[Plausibility]
      D1d --> D1d1[Explanation:   Whether spatial relationships are valid]
      D1 --> D1e[Affordance]
      D1e --> D1e1[Explanation:   Understanding interactions between objects and subjects like humans, animals, robots]
      D1 --> D1f[Camera]
      D1f --> D1f1[Explanation:   Camera movement, angles/positions and scene transitions]
      D1 --> D1g[Measurement]
      D1g --> D1g1[Explanation:   Measurement and speed detection]
    `;
  } else {
    mermaidCode += `
      D --> D1[Spatial +]
    `;
  }
  
  if (!collapsedNodes.includes('D2')) {
    mermaidCode += `
      D --> D2[Temporal]
      D2 --> D2a[Action / Event]
      D2a --> D2a1[Explanation:   Summarizing events]
      D2 --> D2b[Trajectory]
      D2b --> D2b1[Explanation:   Trajectory reasoning and judgment]
      D2 --> D2c[Causality]
      D2c --> D2c1[Explanation:   Causal relationships between events]
      D2 --> D2d[Future / Past]
      D2d --> D2d1[Explanation:   Predicting future/analyzing historical event completion]
    `;
  } else {
    mermaidCode += `
      D --> D2[Temporal +]
    `;
  }
  
  // 添加样式 - 动态生成所有节点的样式
  mermaidCode += `
      %% Style definitions - different colors for different levels
      style A fill:#dc2626,stroke:#b91c1c,stroke-width:3px,color:#fff
      style B fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff
      style C fill:#059669,stroke:#047857,stroke-width:2px,color:#fff
      style D fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
  `;
  
  // 第二层级节点 - 青色
  const level2Nodes = ['B1', 'B2', 'D1', 'D2', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'];
  level2Nodes.forEach(node => {
    if (mermaidCode.includes(node + '[')) {
      mermaidCode += `      style ${node} fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff\n`;
    }
  });
  
  // 第三层级节点 - 橙色
  const level3Nodes = ['B1a', 'B1b', 'B1c', 'B2a', 'B2b', 'B2c', 'B2d', 
                       'D1a', 'D1b', 'D1c', 'D1d', 'D1e', 'D1f', 'D1g',
                       'D2a', 'D2b', 'D2c', 'D2d'];
  level3Nodes.forEach(node => {
    if (mermaidCode.includes(node + '[')) {
      mermaidCode += `      style ${node} fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff\n`;
    }
  });
  
  // 第四层级节点（Note节点） - 灰色
  const level4Nodes = ['B1a1', 'B1b1', 'B1c1', 'B2a1', 'B2b1', 'B2c1', 'B2d1',
                       'D1a1', 'D1b1', 'D1c1', 'D1d1', 'D1e1', 'D1f1', 'D1g1',
                       'D2a1', 'D2b1', 'D2c1', 'D2d1'];
  level4Nodes.forEach(node => {
    if (mermaidCode.includes(node + '[')) {
      mermaidCode += `      style ${node} fill:#94a3b8,stroke:#64748b,stroke-width:1px,color:#fff\n`;
    }
  });
  
  return mermaidCode;
}

// 初始化Mermaid思维导图
var mindMapChart = null;

function initMindMap() {
  const container = document.getElementById('mindmap-container');
  if (!container) return;
  
  try {
    console.log('Initializing Mermaid mind map...');
    
    // 清空容器
    container.innerHTML = '';
    
    // 初始化Mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
        nodeSpacing: 50,
        rankSpacing: 80,
        padding: 10,
        diagramPadding: 10,
        subGraphTitleMargin: {
          top: 5,
          bottom: 5
        },
        rankdir: 'LR',
        align: 'UL'
      }
    });
    
    // 创建思维导图 - 默认使用折叠版本
    const mindMapData = createCollapsedMindMap();
    console.log('Mermaid data created (collapsed):', mindMapData);
    
    // 渲染思维导图
    mermaid.render('mindmap-svg-init', mindMapData).then(({ svg }) => {
      container.innerHTML = svg;
      console.log('Mermaid mind map rendered successfully');
      
      // 应用自定义样式
      applyCustomStyles();
      
      // 添加节点点击事件
      addNodeClickEvents();
      
      // Add mouse wheel zoom
      addWheelZoom();
      
      // 强制显示连线 - 多次检查确保连线可见
      setTimeout(() => {
        forceShowEdges();
        forceRoundedCorners();
      }, 100);
      
      setTimeout(() => {
        forceShowEdges();
        forceRoundedCorners();
      }, 300);
      
      setTimeout(() => {
        forceShowEdges();
        forceRoundedCorners();
        adjustNodeAlignment();
      }, 500);
      
      // 响应式调整
      window.addEventListener('resize', function() {
        if (container.innerHTML) {
          // 重新渲染以适应新尺寸
          mermaid.render('mindmap-svg-init', mindMapData).then(({ svg }) => {
            container.innerHTML = svg;
            applyCustomStyles();
            addNodeClickEvents();
            addWheelZoom();
          });
        }
      });
      
    }).catch(error => {
      console.error('Failed to render Mermaid mind map:', error);
      container.innerHTML = '<p style="color: red; text-align: center; padding: 20px;">Mind map rendering failed, please check console for error messages</p>';
    });
    
  } catch (error) {
    console.error('Failed to initialize Mermaid mind map:', error);
    container.innerHTML = '<p style="color: red; text-align: center; padding: 20px;">Mind map initialization failed, please check console for error messages</p>';
  }
}

// 应用自定义样式的函数
function applyCustomStyles() {
  // 创建或更新样式元素
  let style = document.getElementById('mindmap-custom-styles');
  if (!style) {
    style = document.createElement('style');
    style.id = 'mindmap-custom-styles';
    document.head.appendChild(style);
  }
  
  style.textContent = `
    /* 确保节点文本为白色 */
    #mindmap-container .nodeLabel,
    #mindmap-container .label,
    #mindmap-container text,
    #mindmap-container tspan,
    #mindmap-container foreignObject div,
    #mindmap-container foreignObject span,
    #mindmap-container foreignObject * {
      fill: white !important;
      color: white !important;
    }
    
    /* 节点背景样式 - 添加圆角 */
    #mindmap-container .node rect,
    #mindmap-container .node polygon,
    #mindmap-container .node circle,
    #mindmap-container .node ellipse {
      cursor: pointer !important;
      transition: all 0.3s ease !important;
      rx: 12px !important;
      ry: 12px !important;
      stroke-width: 2px !important;
    }
    
    /* 确保所有矩形节点都有圆角 */
    #mindmap-container rect {
      rx: 12px !important;
      ry: 12px !important;
    }
    
    /* 强制节点边框颜色 */
    #mindmap-container .node[id*="A"] rect { stroke: #b91c1c !important; stroke-width: 3px !important; }
    #mindmap-container .node[id*="B-"] rect,
    #mindmap-container .node[id*="flowchart-B-"] rect { stroke: #2563eb !important; }
    #mindmap-container .node[id*="C-"] rect,
    #mindmap-container .node[id*="flowchart-C-"] rect { stroke: #047857 !important; }
    #mindmap-container .node[id*="D-"] rect,
    #mindmap-container .node[id*="flowchart-D-"] rect { stroke: #7c3aed !important; }
    
    /* 第二层级节点边框 */
    #mindmap-container .node[id*="B1-"] rect,
    #mindmap-container .node[id*="B2-"] rect,
    #mindmap-container .node[id*="D1-"] rect,
    #mindmap-container .node[id*="D2-"] rect,
    #mindmap-container .node[id*="C1-"] rect,
    #mindmap-container .node[id*="C2-"] rect,
    #mindmap-container .node[id*="C3-"] rect,
    #mindmap-container .node[id*="C4-"] rect,
    #mindmap-container .node[id*="C5-"] rect,
    #mindmap-container .node[id*="C6-"] rect,
    #mindmap-container .node[id*="C7-"] rect,
    #mindmap-container .node[id*="C8-"] rect { stroke: #0891b2 !important; }
    
    /* 第三层级节点边框 - 排除Note节点 */
    #mindmap-container .node[id*="B1a"]:not([id*="B1a1"]) rect,
    #mindmap-container .node[id*="B1b"]:not([id*="B1b1"]) rect,
    #mindmap-container .node[id*="B1c"]:not([id*="B1c1"]) rect,
    #mindmap-container .node[id*="B2a"]:not([id*="B2a1"]) rect,
    #mindmap-container .node[id*="B2b"]:not([id*="B2b1"]) rect,
    #mindmap-container .node[id*="B2c"]:not([id*="B2c1"]) rect,
    #mindmap-container .node[id*="B2d"]:not([id*="B2d1"]) rect,
    #mindmap-container .node[id*="D1a"]:not([id*="D1a1"]) rect,
    #mindmap-container .node[id*="D1b"]:not([id*="D1b1"]) rect,
    #mindmap-container .node[id*="D1c"]:not([id*="D1c1"]) rect,
    #mindmap-container .node[id*="D1d"]:not([id*="D1d1"]) rect,
    #mindmap-container .node[id*="D1e"]:not([id*="D1e1"]) rect,
    #mindmap-container .node[id*="D1f"]:not([id*="D1f1"]) rect,
    #mindmap-container .node[id*="D1g"]:not([id*="D1g1"]) rect,
    #mindmap-container .node[id*="D2a"]:not([id*="D2a1"]) rect,
    #mindmap-container .node[id*="D2b"]:not([id*="D2b1"]) rect,
    #mindmap-container .node[id*="D2c"]:not([id*="D2c1"]) rect,
    #mindmap-container .node[id*="D2d"]:not([id*="D2d1"]) rect { stroke: #d97706 !important; }
    
    /* Note节点 - 统一灰色 */
    #mindmap-container .node[id*="a1-"] rect,
    #mindmap-container .node[id*="b1-"] rect,
    #mindmap-container .node[id*="c1-"] rect,
    #mindmap-container .node[id*="d1-"] rect,
    #mindmap-container .node[id*="a1"] rect,
    #mindmap-container .node[id*="b1"] rect,
    #mindmap-container .node[id*="c1"] rect,
    #mindmap-container .node[id*="d1"] rect,
    #mindmap-container .node[id*="e1"] rect,
    #mindmap-container .node[id*="f1"] rect,
    #mindmap-container .node[id*="g1"] rect,
    #mindmap-container .node[id*="D1e1"] rect,
    #mindmap-container .node[id*="D1f1"] rect,
    #mindmap-container .node[id*="D1g1"] rect { 
      fill: #94a3b8 !important; 
      stroke: #64748b !important; 
      stroke-width: 1px !important;
    }
    
    /* 节点悬停效果 */
    #mindmap-container .node:hover rect,
    #mindmap-container .node:hover polygon,
    #mindmap-container .node:hover circle,
    #mindmap-container .node:hover ellipse {
      filter: brightness(1.2) !important;
      stroke-width: 4px !important;
    }
    
    /* 确保连线可见 */
    #mindmap-container .edgePath,
    #mindmap-container .edgePath path,
    #mindmap-container .flowchart-link,
    #mindmap-container path[class*="edge"],
    #mindmap-container line[class*="edge"] {
      stroke: var(--primary-red) !important;
      stroke-width: 2px !important;
      fill: none !important;
      opacity: 1 !important;
      visibility: visible !important;
      display: block !important;
    }
    
    /* 连线标签样式 */
    #mindmap-container .edgeLabel,
    #mindmap-container .edgeLabel * {
      fill: var(--primary-red) !important;
      color: var(--primary-red) !important;
      background-color: white !important;
      padding: 2px 4px !important;
      border-radius: 4px !important;
    }
    
    /* SVG容器样式 */
    #mindmap-container svg {
      width: 100%;
      height: 100%;
      min-height: 900px;
    }
    
    /* 确保所有节点元素可见 */
    #mindmap-container .node,
    #mindmap-container .cluster,
    #mindmap-container .nodeLabel,
    #mindmap-container .edgePath {
      visibility: visible !important;
      opacity: 1 !important;
    }
    
    /* 注释节点特殊样式 - 统一灰色 */
    #mindmap-container .node[id*="a1"],
    #mindmap-container .node[id*="b1"],
    #mindmap-container .node[id*="c1"],
    #mindmap-container .node[id*="d1"] {
      opacity: 1 !important;
    }
    
    #mindmap-container .node[id*="a1"] rect,
    #mindmap-container .node[id*="b1"] rect,
    #mindmap-container .node[id*="c1"] rect,
    #mindmap-container .node[id*="d1"] rect {
      fill: #94a3b8 !important;
      stroke: #64748b !important;
      stroke-width: 1px !important;
    }
    
    /* 增强文本可读性 */
    #mindmap-container text {
      font-weight: 500 !important;
      text-shadow: 0 1px 2px rgba(0,0,0,0.5) !important;
    }
    
    /* 节点间距调整 */
    #mindmap-container .node {
      margin: 8px !important;
    }
    
    /* 防止文本被裁剪 */
    #mindmap-container foreignObject {
      overflow: visible !important;
    }
    
    #mindmap-container foreignObject div {
      overflow: visible !important;
      white-space: nowrap !important;
    }
  `;
  
  // 保存样式到 head
  document.head.appendChild(style);
  
  // 强制应用白色文本样式
  setTimeout(() => {
    forceWhiteText();
    forceShowEdges();
    forceRoundedCorners();
  }, 200);
  
  // 再次延迟应用，确保所有元素都被处理
  setTimeout(() => {
    forceWhiteText();
    forceShowEdges();
    forceRoundedCorners();
  }, 500);
}

// 强制应用白色文本样式
function forceWhiteText() {
  const container = document.getElementById('mindmap-container');
  if (!container) return;
  
  // 查找所有可能的文本元素
  const selectors = [
    'text', 'tspan', '.label', '.nodeLabel', '.edgeLabel',
    'foreignObject', 'foreignObject *', 'div', 'span', 'p',
    '.flowchart-label', '.flowchart-nodeLabel', '.flowchart-edgeLabel'
  ];
  
  selectors.forEach(selector => {
    const elements = container.querySelectorAll(selector);
    elements.forEach(element => {
      // 设置样式属性
      element.style.fill = 'white';
      element.style.color = 'white';
      
      // 设置SVG属性
      element.setAttribute('fill', 'white');
      element.setAttribute('color', 'white');
      
      // 设置文本垂直居中属性
      if (element.tagName === 'text' || element.tagName === 'tspan') {
        element.setAttribute('text-anchor', 'middle');
        element.setAttribute('dominant-baseline', 'middle');
      }
      
      // 如果是foreignObject内的元素，设置其样式
      if (element.tagName === 'foreignObject' || element.closest('foreignObject')) {
        element.style.color = 'white';
        // 检查所有子元素
        const childElements = element.querySelectorAll('*');
        childElements.forEach(child => {
          child.style.color = 'white';
          child.style.fill = 'white';
        });
      }
    });
  });
  
  // 特别处理SVG text元素
  const svgTexts = container.querySelectorAll('svg text');
  svgTexts.forEach(text => {
    text.setAttribute('fill', 'white');
    text.style.fill = 'white';
    
    // 处理tspan子元素
    const tspans = text.querySelectorAll('tspan');
    tspans.forEach(tspan => {
      tspan.setAttribute('fill', 'white');
      tspan.style.fill = 'white';
    });
  });
  
  console.log('Force apply white text style completed');
}

// 强制显示所有连线
function forceShowEdges() {
  const container = document.getElementById('mindmap-container');
  if (!container) return;
  
  // 查找所有连线元素 - 更全面的选择器
  const edgeSelectors = [
    '.edgePath', '.edgePath path', 'svg .edgePath', 'svg .edgePath path',
    '.flowchart-link', 'path[class*="edge"]', 'g[class*="edge"]',
    'path[stroke]', 'line[stroke]'
  ];
  
  edgeSelectors.forEach(selector => {
    const elements = container.querySelectorAll(selector);
    elements.forEach(element => {
      element.style.display = 'block';
      element.style.opacity = '1';
      element.style.visibility = 'visible';
      element.style.strokeOpacity = '1';
      
      // 如果是path或line元素，确保stroke属性
      if (element.tagName === 'path' || element.tagName === 'line') {
        element.style.stroke = '#dc2626'; // 直接使用红色值而不是CSS变量
        element.style.strokeWidth = '2px';
        element.style.fill = 'none';
        element.setAttribute('stroke', '#dc2626');
        element.setAttribute('stroke-width', '2');
        element.setAttribute('fill', 'none');
      }
    });
  });
  
  // 查找所有g元素下的path
  const gElements = container.querySelectorAll('g');
  gElements.forEach(g => {
    if (g.classList.contains('edgePath') || g.id.includes('edge')) {
      g.style.display = 'block';
      g.style.opacity = '1';
      g.style.visibility = 'visible';
      
      const paths = g.querySelectorAll('path');
      paths.forEach(path => {
        path.style.display = 'block';
        path.style.opacity = '1';
        path.style.visibility = 'visible';
        path.style.stroke = '#dc2626';
        path.style.strokeWidth = '2px';
        path.style.fill = 'none';
        path.setAttribute('stroke', '#dc2626');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
      });
    }
  });
  
  // 处理所有defs中的marker（箭头）
  const markers = container.querySelectorAll('marker path');
  markers.forEach(marker => {
    marker.style.fill = '#dc2626';
    marker.style.stroke = '#dc2626';
    marker.setAttribute('fill', '#dc2626');
    marker.setAttribute('stroke', '#dc2626');
  });
  
  console.log('Force show all connections completed');
}

// 强制应用圆角到所有节点并设置边框颜色
function forceRoundedCorners() {
  const container = document.getElementById('mindmap-container');
  if (!container) return;
  
  // 查找所有节点
  const nodes = container.querySelectorAll('.node');
  nodes.forEach(node => {
    const rect = node.querySelector('rect');
    if (!rect) return;
    
    // 设置圆角
    rect.setAttribute('rx', '12');
    rect.setAttribute('ry', '12');
    rect.style.rx = '12px';
    rect.style.ry = '12px';
    
    // 根据节点ID设置边框颜色
    const nodeId = node.id || '';
    
    // 首先检查是否是Note节点 - 统一灰色（优先级最高）
    if (nodeId.includes('a1') || nodeId.includes('b1') || nodeId.includes('c1') || nodeId.includes('d1') || 
        nodeId.includes('e1') || nodeId.includes('f1') || nodeId.includes('g1') ||
        nodeId.includes('D1e1') || nodeId.includes('D1f1') || nodeId.includes('D1g1')) {
      rect.style.fill = '#94a3b8';
      rect.style.stroke = '#64748b';
      rect.style.strokeWidth = '1px';
      rect.setAttribute('fill', '#94a3b8');
      rect.setAttribute('stroke', '#64748b');
      rect.setAttribute('stroke-width', '1');
    }
    // 根节点 A
    else if (nodeId.includes('A')) {
      rect.style.stroke = '#b91c1c';
      rect.style.strokeWidth = '3px';
      rect.setAttribute('stroke', '#b91c1c');
      rect.setAttribute('stroke-width', '3');
    }
    // 第一层级节点
    else if (nodeId.includes('B-') && !nodeId.includes('B1') && !nodeId.includes('B2')) {
      rect.style.stroke = '#2563eb';
      rect.setAttribute('stroke', '#2563eb');
    }
    else if (nodeId.includes('C-') && !nodeId.includes('C1') && !nodeId.includes('C2') && !nodeId.includes('C3') && !nodeId.includes('C4') && !nodeId.includes('C5') && !nodeId.includes('C6') && !nodeId.includes('C7') && !nodeId.includes('C8')) {
      rect.style.stroke = '#047857';
      rect.setAttribute('stroke', '#047857');
    }
    else if (nodeId.includes('D-') && !nodeId.includes('D1') && !nodeId.includes('D2')) {
      rect.style.stroke = '#7c3aed';
      rect.setAttribute('stroke', '#7c3aed');
    }
    // 第二层级节点
    else if (nodeId.includes('B1-') || nodeId.includes('B2-') || nodeId.includes('D1-') || nodeId.includes('D2-') || 
             nodeId.includes('C1-') || nodeId.includes('C2-') || nodeId.includes('C3-') || nodeId.includes('C4-') || 
             nodeId.includes('C5-') || nodeId.includes('C6-') || nodeId.includes('C7-') || nodeId.includes('C8-')) {
      rect.style.stroke = '#0891b2';
      rect.setAttribute('stroke', '#0891b2');
    }
    // 第三层级节点（排除Note节点）
    else if ((nodeId.includes('B1a') || nodeId.includes('B1b') || nodeId.includes('B1c') || 
              nodeId.includes('B2a') || nodeId.includes('B2b') || nodeId.includes('B2c') || nodeId.includes('B2d') ||
              nodeId.includes('D1a') || nodeId.includes('D1b') || nodeId.includes('D1c') || nodeId.includes('D1d') || 
              nodeId.includes('D1e') || nodeId.includes('D1f') || nodeId.includes('D1g') ||
              nodeId.includes('D2a') || nodeId.includes('D2b') || nodeId.includes('D2c') || nodeId.includes('D2d')) &&
             !nodeId.includes('a1') && !nodeId.includes('b1') && !nodeId.includes('c1') && !nodeId.includes('d1')) {
      rect.style.stroke = '#d97706';
      rect.setAttribute('stroke', '#d97706');
    }
    
    // 确保边框宽度
    if (!rect.style.strokeWidth) {
      rect.style.strokeWidth = '2px';
      rect.setAttribute('stroke-width', '2');
    }
  });
  
  console.log('Force apply rounded corners and border colors completed, processed', nodes.length, 'nodes');
}

// 调整节点层级对齐
function adjustNodeAlignment() {
  const container = document.getElementById('mindmap-container');
  if (!container) return;
  
  // 获取所有节点
  const nodes = container.querySelectorAll('.node');
  const nodePositions = [];
  
  // 收集所有节点的位置信息
  nodes.forEach(node => {
    const transform = node.getAttribute('transform') || '';
    const translateMatch = transform.match(/translate\(([^,]+),([^)]+)\)/);
    
    if (translateMatch) {
      const x = parseFloat(translateMatch[1]);
      const y = parseFloat(translateMatch[2]);
      nodePositions.push({ node, x, y });
    }
  });
  
  // 按x坐标排序，然后按层级分组
  nodePositions.sort((a, b) => a.x - b.x);
  
  // 使用更智能的层级检测
  const nodesByLevel = new Map();
  const tolerance = 50; // 50px容差范围内认为是同一层级
  
  nodePositions.forEach(({ node, x, y }) => {
    let assignedLevel = null;
    
    // 查找是否有相近的层级
    for (const [level, nodes] of nodesByLevel) {
      if (Math.abs(level - x) < tolerance) {
        assignedLevel = level;
        break;
      }
    }
    
    // 如果没有找到相近的层级，创建新层级
    if (assignedLevel === null) {
      assignedLevel = x;
      nodesByLevel.set(assignedLevel, []);
    }
    
    nodesByLevel.get(assignedLevel).push({ node, x, y });
  });
  
  // 对每个层级的节点进行垂直对齐
  nodesByLevel.forEach((nodes, level) => {
    if (nodes.length > 1) {
      // 计算该层级的平均x坐标
      const avgX = nodes.reduce((sum, n) => sum + n.x, 0) / nodes.length;
      
      // 取整到最近的10px
      const alignedX = Math.round(avgX / 10) * 10;
      
      // 对该层级的所有节点应用对齐的x坐标
      nodes.forEach(({ node, x, y }) => {
        const currentTransform = node.getAttribute('transform');
        if (currentTransform) {
          const newTransform = currentTransform.replace(
            /translate\([^)]+\)/, 
            `translate(${alignedX},${y})`
          );
          node.setAttribute('transform', newTransform);
        }
      });
    }
  });
  
  // 特别处理注释节点（ID包含数字1的节点）
  const noteNodes = container.querySelectorAll('.node[id*="1"]');
  noteNodes.forEach(node => {
    const id = node.id;
    // 查找对应的父节点
    const parentId = id.substring(0, id.length - 1);
    const parentNode = container.querySelector(`.node[id="${parentId}"]`);
    
    if (parentNode) {
      // 获取父节点的位置
      const parentTransform = parentNode.getAttribute('transform') || '';
      const parentMatch = parentTransform.match(/translate\(([^,]+),([^)]+)\)/);
      
      if (parentMatch) {
        const parentX = parseFloat(parentMatch[1]);
        const parentY = parseFloat(parentMatch[2]);
        
        // 将注释节点放在父节点右侧
        const noteX = parentX + 200; // 200px偏移
        const noteY = parentY;
        
        const currentTransform = node.getAttribute('transform') || '';
        const newTransform = currentTransform.replace(
          /translate\([^)]+\)/, 
          `translate(${noteX},${noteY})`
        );
        node.setAttribute('transform', newTransform);
      }
    }
  });
  
  // 确保同一层级节点的最小间距
  nodesByLevel.forEach((nodes, level) => {
    // 按y坐标排序
    nodes.sort((a, b) => a.y - b.y);
    
    // 确保最小间距
    const minSpacing = 80;
    for (let i = 1; i < nodes.length; i++) {
      const prevY = nodes[i - 1].y;
      const currentY = nodes[i].y;
      
      if (currentY - prevY < minSpacing) {
        // 调整当前节点的y坐标
        const newY = prevY + minSpacing;
        const { node, x } = nodes[i];
        
        const currentTransform = node.getAttribute('transform') || '';
        const newTransform = currentTransform.replace(
          /translate\([^)]+\)/, 
          `translate(${x},${newY})`
        );
        node.setAttribute('transform', newTransform);
        
        // 更新记录的y坐标
        nodes[i].y = newY;
      }
    }
  });
  
  // 最后，确保最左侧节点有适当的边距
  if (nodePositions.length > 0) {
    const minX = Math.min(...nodePositions.map(n => n.x));
    if (minX < 50) {
      const offsetX = 50 - minX;
      nodePositions.forEach(({ node, x, y }) => {
        const currentTransform = node.getAttribute('transform') || '';
        const newTransform = currentTransform.replace(
          /translate\([^)]+\)/, 
          `translate(${x + offsetX},${y})`
        );
        node.setAttribute('transform', newTransform);
      });
    }
  }
  
  console.log('Node level alignment adjustment completed, processed', nodesByLevel.size, 'levels');
}

// 全部展开函数 - 显示完整思维导图
function expandAll() {
  const container = document.getElementById('mindmap-container');
  if (container) {
    try {
      console.log('Expanding all nodes...');
      // 清空折叠状态
      collapsedNodes = [];
      // 渲染完整的思维导图
      const mindMapData = createMermaidMindMap();
      mermaid.render('mindmap-svg-expand', mindMapData).then(({ svg }) => {
        container.innerHTML = svg;
        applyCustomStyles();
        addNodeClickEvents();
        addWheelZoom();
        setTimeout(() => {
          forceShowEdges();
          forceRoundedCorners();
        }, 100);
        
        setTimeout(() => {
          forceShowEdges();
          forceRoundedCorners();
        }, 300);
        
        setTimeout(() => {
          forceShowEdges();
          forceRoundedCorners();
        }, 500);
        console.log('Mind map expanded successfully');
      }).catch(error => {
        console.error('Failed to expand mind map:', error);
      });
    } catch (error) {
      console.warn('Mermaid expandAll failed:', error);
    }
  }
}

// 全部折叠函数 - 只显示主要分支
function collapseAll() {
  const container = document.getElementById('mindmap-container');
  if (container) {
    try {
      console.log('Collapsing all nodes...');
      // 渲染折叠版本的思维导图
      const mindMapData = createCollapsedMindMap();
      mermaid.render('mindmap-svg-collapse', mindMapData).then(({ svg }) => {
        container.innerHTML = svg;
        applyCustomStyles();
        addNodeClickEvents();
        addWheelZoom();
        setTimeout(() => {
          forceShowEdges();
          forceRoundedCorners();
        }, 100);
        
        setTimeout(() => {
          forceShowEdges();
          forceRoundedCorners();
        }, 300);
        
        setTimeout(() => {
          forceShowEdges();
          forceRoundedCorners();
        }, 500);
        console.log('Mind map collapsed successfully');
      }).catch(error => {
        console.error('Failed to collapse mind map:', error);
      });
    } catch (error) {
      console.warn('Mermaid collapseAll failed:', error);
    }
  }
}

// 添加节点点击事件
function addNodeClickEvents() {
  const container = document.getElementById('mindmap-container');
  if (!container) return;
  
  // 为每个节点添加点击事件
  const nodes = container.querySelectorAll('.node');
  nodes.forEach(node => {
    node.addEventListener('click', function() {
      const nodeId = this.id;
      console.log('Node clicked:', nodeId);
      
      // 根据节点类型决定展开或折叠
      if (nodeId.includes('A') || nodeId.includes('B') || nodeId.includes('C') || nodeId.includes('D')) {
        // 主要分支节点被点击，展开到完整视图
        expandAll();
      } else if (nodeId.includes('B1') || nodeId.includes('B2') || nodeId.includes('D1') || nodeId.includes('D2')) {
        // 二级分支节点被点击，切换折叠/展开状态
        toggleNodeCollapse(nodeId);
      }
    });
  });
}

// 节点折叠状态管理
var collapsedNodes = [];

// 切换节点折叠状态
function toggleNodeCollapse(nodeId) {
  const index = collapsedNodes.indexOf(nodeId);
  if (index > -1) {
    // 展开节点
    collapsedNodes.splice(index, 1);
    console.log('Expand node:', nodeId);
  } else {
    // 折叠节点
    collapsedNodes.push(nodeId);
    console.log('Collapse node:', nodeId);
  }
  
  // 重新渲染思维导图
  renderMindMapWithCollapse();
}

// 渲染带折叠状态的思维导图
function renderMindMapWithCollapse() {
  const container = document.getElementById('mindmap-container');
  if (!container) return;
  
  try {
    // 创建部分折叠的思维导图数据
    const mindMapData = createPartiallyCollapsedMindMap(collapsedNodes);
    console.log('Render partially collapsed mind map, collapsed nodes:', collapsedNodes);
    
    // 渲染思维导图
    mermaid.render('mindmap-svg-collapse-toggle', mindMapData).then(({ svg }) => {
      container.innerHTML = svg;
      applyCustomStyles();
      addNodeClickEvents();
      addWheelZoom();
      setTimeout(() => {
        forceShowEdges();
        forceRoundedCorners();
      }, 100);
      console.log('Partially collapsed mind map rendered successfully');
    }).catch(error => {
      console.error('Failed to render partially collapsed mind map:', error);
    });
  } catch (error) {
    console.error('Failed to render mind map with collapse:', error);
  }
}

// Zoom functionality
var currentZoom = 1;
var zoomStep = 0.2;
var minZoom = 0.3;
var maxZoom = 3.0;

// 放大函数
function zoomIn() {
  if (currentZoom < maxZoom) {
    currentZoom += zoomStep;
    applyZoom();
    console.log('Zoomed in to:', currentZoom);
  }
}

// 缩小函数
function zoomOut() {
  if (currentZoom > minZoom) {
    currentZoom -= zoomStep;
    applyZoom();
    console.log('Zoomed out to:', currentZoom);
  }
}

// Reset zoom function
function resetZoom() {
  currentZoom = 1;
  resetDrag(); // 同时重置拖拽位置
  applyZoom();
  console.log('Zoom reset to:', currentZoom);
}

// Apply zoom
function applyZoom() {
  const container = document.getElementById('mindmap-container');
  if (!container) return;
  
  const svg = container.querySelector('svg');
  if (svg) {
    // Combine zoom and drag transformations
    svg.style.transform = `scale(${currentZoom}) translate(${currentTranslateX}px, ${currentTranslateY}px)`;
    svg.style.transformOrigin = 'center center';
    svg.style.transition = 'transform 0.3s ease';
    
    // Adjust container height to accommodate zoom
    const scaledHeight = 900 * currentZoom;
    container.style.height = `${scaledHeight}px`;
    container.style.overflow = 'auto';
  }
  
  // Update zoom indicator
  const zoomIndicator = document.getElementById('zoom-indicator');
  if (zoomIndicator) {
    zoomIndicator.textContent = `Zoom: ${Math.round(currentZoom * 100)}%`;
  }
}

// Add mouse wheel zoom
function addWheelZoom() {
  const container = document.getElementById('mindmap-container');
  if (!container) return;
  
  container.addEventListener('wheel', function(e) {
    // 阻止默认滚动行为
    e.preventDefault();
    
    // Determine zoom direction based on wheel direction
    if (e.deltaY < 0) {
      // 向上滚动，放大
      zoomIn();
    } else {
      // 向下滚动，缩小
      zoomOut();
    }
  }, { passive: false });
}

// 拖拽功能
var isDragging = false;
var dragStartX = 0;
var dragStartY = 0;
var currentTranslateX = 0;
var currentTranslateY = 0;
var dragEnabled = false;

// 切换拖拽模式
function toggleDrag() {
  dragEnabled = !dragEnabled;
  const dragButton = document.getElementById('drag-toggle');
  if (dragButton) {
    dragButton.textContent = dragEnabled ? 'Disable Drag' : 'Enable Drag';
    dragButton.style.backgroundColor = dragEnabled ? '#059669' : 'var(--primary-red)';
  }
  
  if (dragEnabled) {
    addDragEvents();
    console.log('Drag mode enabled');
  } else {
    removeDragEvents();
    console.log('Drag mode disabled');
  }
}

// 添加拖拽事件
function addDragEvents() {
  const container = document.getElementById('mindmap-container');
  if (!container) return;
  
  container.addEventListener('mousedown', startDrag);
  container.addEventListener('mousemove', drag);
  container.addEventListener('mouseup', endDrag);
  container.addEventListener('mouseleave', endDrag);
  
  // 设置鼠标样式
  container.style.cursor = 'grab';
}

// 移除拖拽事件
function removeDragEvents() {
  const container = document.getElementById('mindmap-container');
  if (!container) return;
  
  container.removeEventListener('mousedown', startDrag);
  container.removeEventListener('mousemove', drag);
  container.removeEventListener('mouseup', endDrag);
  container.removeEventListener('mouseleave', endDrag);
  
  // 恢复鼠标样式
  container.style.cursor = 'default';
}

// 开始拖拽
function startDrag(e) {
  if (!dragEnabled) return;
  
  isDragging = true;
  dragStartX = e.clientX - currentTranslateX;
  dragStartY = e.clientY - currentTranslateY;
  
  const container = document.getElementById('mindmap-container');
  if (container) {
    container.style.cursor = 'grabbing';
  }
  
  e.preventDefault();
}

// 拖拽中
function drag(e) {
  if (!isDragging || !dragEnabled) return;
  
  currentTranslateX = e.clientX - dragStartX;
  currentTranslateY = e.clientY - dragStartY;
  
  applyDragTransform();
  e.preventDefault();
}

// 结束拖拽
function endDrag() {
  if (!dragEnabled) return;
  
  isDragging = false;
  const container = document.getElementById('mindmap-container');
  if (container) {
    container.style.cursor = 'grab';
  }
}

// 应用拖拽变换
function applyDragTransform() {
  const container = document.getElementById('mindmap-container');
  if (!container) return;
  
  const svg = container.querySelector('svg');
  if (svg) {
    svg.style.transform = `scale(${currentZoom}) translate(${currentTranslateX}px, ${currentTranslateY}px)`;
    svg.style.transformOrigin = 'center center';
  }
}

// 重置拖拽位置
function resetDrag() {
  currentTranslateX = 0;
  currentTranslateY = 0;
  applyDragTransform();
}

// ===================== 行业评测集相关功能 =====================

// 创建行业评测集思维导图
function createIndustryBenchmarkMindmap() {
  return `
    graph LR
      A[行业场景数据<br/>总计: 3846] --> B[交通<br/>1899]
      A --> C[能源<br/>1947]
      
      %% Transportation
      B --> B1[交管<br/>1039]
      B --> B2[路面/山体异常<br/>580]
      B --> B3[桥梁<br/>280]
      
      %% Traffic subcategories
      B1 --> B1A[交通违停: 198]
      B1 --> B1B[占用应急车道: 56]
      B1 --> B1C[道路拥堵: 13]
      B1 --> B1D[逆行: 42]
      B1 --> B1E[占道施工: 46]
      B1 --> B1F[非机动车闯入: 60]
      B1 --> B1G[护栏损坏: 56]
      B1 --> B1H[人员检测: 100]
      B1 --> B1I[机动车检测: 100]
      B1 --> B1J[工程车检测: 100]
      B1 --> B1K[船只检测: 112]
      B1 --> B1L[车牌检测: 100]
      B1 --> B1M[路边护栏: 56]
      
      %% Road/Mountain Anomaly subcategories
      B2 --> B2A[路面抛洒物: 50]
      B2 --> B2B[路面裂缝: 81]
      B2 --> B2C[路面坑洼: 116]
      B2 --> B2D[路面积水: 116]
      B2 --> B2E[山体滑坡: 95]
      B2 --> B2F[边坡滑坡: 95]
      B2 --> B2G[雪糕筒: 27]
      
      %% Bridge subcategories
      B3 --> B3A[桥梁损伤: 100]
      B3 --> B3B[桥梁梁体: 60]
      B3 --> B3C[桥梁护栏: 60]
      B3 --> B3D[桥梁桥墩: 60]
      
      %% Energy
      C --> C1[管道<br/>271]
      C --> C2[井场<br/>1230]
      C --> C3[场站<br/>446]
      
      %% Pipeline subcategories
      C1 --> C1A[管道占压: 20]
      C1 --> C1B[沿线塌方: 15]
      C1 --> C1C[打孔盗油: 107]
      C1 --> C1D[管道漏油: 109]
      C1 --> C1E[管道裸露: 20]
      
      %% Well Site subcategories
      C2 --> C2A[井场盘根漏油: 100]
      C2 --> C2B[井场井口池漏油: 100]
      C2 --> C2C[井场驴头抽停: 100]
      C2 --> C2D[井场火焰检测: 116]
      C2 --> C2E[井场烟雾检测: 116]
      C2 --> C2F[井场人员侵入: 107]
      C2 --> C2G[井场车辆侵入: 107]
      C2 --> C2H[磕头机检测: 100]
      C2 --> C2I[驴头检测: 100]
      C2 --> C2J[磕头机减速箱: 100]
      C2 --> C2K[磕头机保温箱: 100]
      C2 --> C2L[储油罐检测: 25]
      
      %% Station subcategories
      C3 --> C3A[场站火焰检测: 116]
      C3 --> C3B[场站烟雾检测: 116]
      C3 --> C3C[场站人员侵入: 107]
      C3 --> C3D[场站车辆侵入: 107]
      
      %% Style Definitions - Color scheme consistent with Benchmark
      style A fill:#dc2626,stroke:#b91c1c,stroke-width:3px,color:#fff
      style B fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff
      style C fill:#059669,stroke:#047857,stroke-width:2px,color:#fff
      
      %% Secondary node styles
      style B1 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style B2 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style B3 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style C1 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style C2 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style C3 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      
      %% Tertiary node styles
      style B1A fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B1B fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B1C fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B1D fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B1E fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B1F fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B1G fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B1H fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B1I fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B1J fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B1K fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B1L fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B1M fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B2A fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B2B fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B2C fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B2D fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B2E fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B2F fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B2G fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B3A fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B3B fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B3C fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style B3D fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style C1A fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style C1B fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style C1C fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style C1D fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style C1E fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style C2A fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style C2B fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style C2C fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style C2D fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style C2E fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style C2F fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style C2G fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style C2H fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style C2I fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style C2J fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style C2K fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style C2L fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style C3A fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style C3B fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style C3C fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
      style C3D fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
  `;
}

// 创建折叠版本的行业思维导图
function createCollapsedIndustryMindmap() {
  return `
    graph LR
      A[行业场景数据<br/>总计: 3846] --> B[交通<br/>1899]
      A --> C[能源<br/>1947]
      
      B --> B1[交管<br/>1039]
      B --> B2[路面/山体异常<br/>580]
      B --> B3[桥梁<br/>280]
      
      C --> C1[管道<br/>271]
      C --> C2[井场<br/>1230]
      C --> C3[场站<br/>446]
      
      %% Style Definitions - Consistent with expanded version
      style A fill:#dc2626,stroke:#b91c1c,stroke-width:3px,color:#fff
      style B fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff
      style C fill:#059669,stroke:#047857,stroke-width:2px,color:#fff
      
      style B1 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style B2 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style B3 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style C1 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style C2 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
      style C3 fill:#06b6d4,stroke:#0891b2,stroke-width:2px,color:#fff
  `;
}

let isIndustryExpanded = false;  // Default to collapsed state
let currentIndustryZoom = 100;

// Initialize industry benchmark mind map
function initIndustryMindmap() {
  const container = document.getElementById('industry-mindmap-container');
  if (!container) return;
  
  const mindmapData = isIndustryExpanded ? createIndustryBenchmarkMindmap() : createCollapsedIndustryMindmap();
  
  mermaid.render('industry-mindmap-svg', mindmapData).then(({ svg }) => {
    container.innerHTML = svg;
    
          // Add zoom functionality
    const svgElement = container.querySelector('svg');
    if (svgElement) {
      svgElement.style.transition = 'transform 0.3s ease';
      
      // Mouse wheel zoom
      container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -10 : 10;
        currentIndustryZoom = Math.max(50, Math.min(200, currentIndustryZoom + delta));
        svgElement.style.transform = `scale(${currentIndustryZoom / 100})`;
        document.getElementById('industry-zoom-indicator').textContent = `缩放: ${currentIndustryZoom}%`;
      });
    }
  }).catch(error => {
    console.error('Failed to render industry mindmap:', error);
            container.innerHTML = '<p style="color: red; text-align: center; padding: 20px;">Failed to render mind map</p>';
  });
}

// Expand all
function expandIndustryAll() {
  isIndustryExpanded = true;
  initIndustryMindmap();
}

// Collapse all
function collapseIndustryAll() {
  isIndustryExpanded = false;
  initIndustryMindmap();
}

// Reset view
function resetIndustryZoom() {
  currentIndustryZoom = 100;
  const svgElement = document.querySelector('#industry-mindmap-container svg');
  if (svgElement) {
    svgElement.style.transform = 'scale(1)';
            document.getElementById('industry-zoom-indicator').textContent = '缩放: 100%';
  }
}

// Initialize industry benchmark mind map on page load
window.addEventListener('load', () => {
  setTimeout(() => {
    initIndustryMindmap();
    initIndustryEChartsPieChart();
  }, 200);
});

// ===================== Industry Benchmark ECharts Pie Chart =====================

// Industry benchmark hierarchical data structure for ECharts
const industryEChartsData = [
  {
    value: 1899,
    name: '交通',
    itemStyle: { color: '#5B8FF9' },  // 蓝色系主色
    subcategories: [
      {
        name: '交管',
        value: 1039,
        color: '#5B8FF9',
        subcategories: [
          { name: '交通违停', value: 198, color: '#5B8FF9' },
          { name: '占用应急车道', value: 56, color: '#61DDAA' },
          { name: '道路拥堵', value: 13, color: '#65789B' },
          { name: '逆行', value: 42, color: '#F6BD16' },
          { name: '占道施工', value: 46, color: '#7262FD' },
          { name: '非机动车闯入', value: 60, color: '#78D3F8' },
          { name: '护栏损坏', value: 56, color: '#9661BC' },
          { name: '人员检测', value: 100, color: '#F6903D' },
          { name: '机动车检测', value: 100, color: '#008685' },
          { name: '工程车检测', value: 100, color: '#F08BB4' },
          { name: '船只检测', value: 112, color: '#FFB6C1' },
          { name: '车牌检测', value: 100, color: '#87CEEB' },
          { name: '路边护栏', value: 56, color: '#DDA0DD' }
        ]
      },
      {
        name: '路面/山体异常',
        value: 580,
        color: '#61DDAA',  // 青绿色
        subcategories: [
          { name: '路面抛洒物', value: 50, color: '#FFE4B5' },
          { name: '路面裂缝', value: 81, color: '#F4A460' },
          { name: '路面坑洼', value: 116, color: '#DEB887' },
          { name: '路面积水', value: 116, color: '#D2691E' },
          { name: '山体滑坡', value: 95, color: '#CD853F' },
          { name: '边坡滑坡', value: 95, color: '#BC8F8F' },
          { name: '雪糕筒', value: 27, color: '#F0E68C' }
        ]
      },
      {
        name: '桥梁',
        value: 280,
        color: '#7262FD',  // 紫色
        subcategories: [
          { name: '桥梁损伤', value: 100, color: '#E6E6FA' },
          { name: '桥梁梁体', value: 60, color: '#DDA0DD' },
          { name: '桥梁护栏', value: 60, color: '#DA70D6' },
          { name: '桥梁桥墩', value: 60, color: '#BA55D3' }
        ]
      }
    ]
  },
  {
    value: 1947,
    name: '能源',
    itemStyle: { color: '#F6BD16' },  // 金黄色主色
    subcategories: [
      {
        name: '管道',
        value: 271,
        color: '#F6903D',  // 橙色
        subcategories: [
          { name: '管道占压', value: 20, color: '#FFDAB9' },
          { name: '沿线塌方', value: 15, color: '#FFB6C1' },
          { name: '打孔盗油', value: 107, color: '#FFA07A' },
          { name: '管道漏油', value: 109, color: '#FA8072' },
          { name: '管道裸露', value: 20, color: '#F08080' }
        ]
      },
      {
        name: '井场',
        value: 690,
        color: '#008685',  // 深青色
        subcategories: [
          { name: '井场盘根漏油', value: 100, color: '#B0E0E6' },
          { name: '井场井口池漏油', value: 100, color: '#87CEEB' },
          { name: '井场驴头抽停', value: 100, color: '#87CEFA' },
          { name: '井场火焰检测', value: 116, color: '#00CED1' },
          { name: '井场烟雾检测', value: 116, color: '#48D1CC' },
          { name: '井场人员侵入', value: 107, color: '#40E0D0' },
          { name: '井场车辆侵入', value: 107, color: '#00BFFF' },
          { name: '磕头机检测', value: 100, color: '#5F9EA0' },
          { name: '驴头检测', value: 100, color: '#4682B4' },
          { name: '磕头机减速箱', value: 100, color: '#6495ED' },
          { name: '磕头机保温箱', value: 100, color: '#7B68EE' },
          { name: '储油罐检测', value: 25, color: '#6A5ACD' }
        ]
      },
      {
        name: '场站',
        value: 446,
        color: '#F08BB4',  // 粉红色
        subcategories: [
          { name: '场站火焰检测', value: 116, color: '#FFE4E1' },
          { name: '场站烟雾检测', value: 116, color: '#FFC0CB' },
          { name: '场站人员侵入', value: 107, color: '#FFB6C1' },
          { name: '场站车辆侵入', value: 107, color: '#FFA07A' }
        ]
      }
    ]
  }
];

// ECharts variables
let industryEChartsInstance = null;
let currentIndustryEChartsData = industryEChartsData;
let currentIndustryEChartsTitle = '行业评测集问题分布';
let currentIndustryEChartsCategory = null;

// Initialize industry ECharts pie chart
function initIndustryEChartsPieChart() {
  const chartDom = document.getElementById('industry-pie-chart');
  if (!chartDom) return;
  
  industryEChartsInstance = echarts.init(chartDom);
  updateIndustryEChartsChart();
  
  // Add click event
  industryEChartsInstance.on('click', function (params) {
    if (!currentIndustryEChartsCategory) {
      // Click main category, enter subcategory view
      const clickedCategory = industryEChartsData.find(item => item.name === params.name);
      if (clickedCategory && clickedCategory.subcategories) {
        currentIndustryEChartsCategory = params.name;
        currentIndustryEChartsTitle = `${params.name} - 子分类`;
        currentIndustryEChartsData = clickedCategory.subcategories.map(sub => ({
          value: sub.value,
          name: sub.name,
          itemStyle: { color: sub.color },
          subcategories: sub.subcategories
        }));
        updateIndustryEChartsChart();
      }
    } else {
      // Click subcategory, if has third level subcategories then enter third level view
      const parentCategory = industryEChartsData.find(item => item.name === currentIndustryEChartsCategory);
      if (parentCategory && parentCategory.subcategories) {
        const clickedSubcategory = parentCategory.subcategories.find(sub => sub.name === params.name);
        if (clickedSubcategory && clickedSubcategory.subcategories) {
          currentIndustryEChartsTitle = `${currentIndustryEChartsCategory} - ${params.name} - 详细分类`;
          currentIndustryEChartsData = clickedSubcategory.subcategories.map(sub => ({
            value: sub.value,
            name: sub.name,
            itemStyle: { color: sub.color }
          }));
          updateIndustryEChartsChart();
        }
      }
    }
  });
  
  // Add back button
  const backButton = document.createElement('button');
  backButton.innerHTML = '← 返回主视图';
  backButton.style.cssText = `
    padding: 8px 16px;
    background: var(--primary-red);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    display: none;
    margin-right: 10px;
    transition: all 0.2s ease;
  `;
  
  backButton.addEventListener('mouseenter', function() {
    this.style.background = '#dc2626';
    this.style.transform = 'translateY(-1px)';
  });
  
  backButton.addEventListener('mouseleave', function() {
    this.style.background = 'var(--primary-red)';
    this.style.transform = 'translateY(0)';
  });
  
  backButton.addEventListener('click', function() {
    if (currentIndustryEChartsTitle.includes(' - 详细分类')) {
      // From third level back to second level
      const parentCategory = industryEChartsData.find(item => item.name === currentIndustryEChartsCategory);
      if (parentCategory && parentCategory.subcategories) {
        currentIndustryEChartsTitle = `${currentIndustryEChartsCategory} - 子分类`;
        currentIndustryEChartsData = parentCategory.subcategories.map(sub => ({
          value: sub.value,
          name: sub.name,
          itemStyle: { color: sub.color },
          subcategories: sub.subcategories
        }));
        updateIndustryEChartsChart();
      }
    } else {
      // From second level back to main level
      currentIndustryEChartsCategory = null;
      currentIndustryEChartsTitle = '行业评测集问题分布';
      currentIndustryEChartsData = industryEChartsData;
      updateIndustryEChartsChart();
      backButton.style.display = 'none';
    }
  });

  // Add back button to chart container
  const chartContainer = chartDom.parentNode;
  const titleElement = chartContainer.querySelector('h4');
  if (titleElement) {
    chartContainer.insertBefore(backButton, titleElement);
  } else {
    chartContainer.insertBefore(backButton, chartContainer.firstChild);
  }

  // Listen for chart state changes, show/hide back button
  const originalSetOption = industryEChartsInstance.setOption;
  industryEChartsInstance.setOption = function(option) {
    const result = originalSetOption.call(this, option);
    if (currentIndustryEChartsCategory) {
      backButton.style.display = 'inline-block';
      // Update back button text
      if (currentIndustryEChartsTitle.includes(' - 详细分类')) {
        backButton.innerHTML = '← 返回子分类';
      } else {
        backButton.innerHTML = '← 返回主视图';
      }
    } else {
      backButton.style.display = 'none';
    }
    return result;
  };

  // Responsive adjustment
  window.addEventListener('resize', () => {
    industryEChartsInstance.resize();
  });
  
  console.log('Industry ECharts pie chart initialized successfully');
}

// Update industry ECharts chart
function updateIndustryEChartsChart() {
  if (!industryEChartsInstance) return;
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#e5e7eb',
      borderWidth: 1,
      textStyle: {
        color: '#1f2937'
      }
    },
    // Remove legend - directly show text next to percentages
    legend: {
      show: false
    },
    series: [
      {
        name: '行业评测集',
        type: 'pie',
        radius: '70%',
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}: {d}%',  // Show both name and percentage
          fontSize: 14,
          color: '#1f2937',
          fontWeight: '500'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold',
            color: '#1f2937'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        labelLine: {
          show: true,
          length: 20,
          length2: 15,
          smooth: true
        },
        data: currentIndustryEChartsData
      }
    ]
  };

  industryEChartsInstance.setOption(option);
}

// ===================== Legacy Industry Benchmark Pie Chart (Chart.js) =====================

// Industry benchmark hierarchical data structure
const industryBenchmarkData = {
  name: "行业评测集",
  children: [
    {
      name: "交通",
      value: 1899,
      color: "#3b82f6",
      children: [
        {
          name: "交管",
          value: 1039,
          color: "#3b82f6",
          children: [
            { name: "交通违停", value: 198, color: "#3b82f6" },
            { name: "占用应急车道", value: 56, color: "#60a5fa" },
            { name: "道路拥堵", value: 13, color: "#93c5fd" },
            { name: "逆行", value: 42, color: "#a5b4fc" },
            { name: "占道施工", value: 46, color: "#c7d2fe" },
            { name: "非机动车闯入", value: 60, color: "#06b6d4" },
            { name: "护栏损坏", value: 56, color: "#22d3ee" },
            { name: "人员检测", value: 100, color: "#059669" },
            { name: "机动车检测", value: 100, color: "#10b981" },
            { name: "工程车检测", value: 100, color: "#34d399" },
            { name: "船只检测", value: 112, color: "#f59e0b" },
            { name: "车牌检测", value: 100, color: "#ef4444" },
            { name: "路边护栏", value: 56, color: "#8b5cf6" }
          ]
        },
        {
          name: "路面/山体异常",
          value: 580,
          color: "#06b6d4",
          children: [
            { name: "路面抛洒物", value: 50, color: "#fde68a" },
            { name: "路面裂缝", value: 81, color: "#fcd34d" },
            { name: "路面坑洼", value: 116, color: "#fbbf24" },
            { name: "路面积水", value: 116, color: "#f59e0b" },
            { name: "山体滑坡", value: 95, color: "#ea580c" },
            { name: "边坡滑坡", value: 95, color: "#dc2626" },
            { name: "雪糕筒", value: 27, color: "#b91c1c" }
          ]
        },
        {
          name: "桥梁",
          value: 280,
          color: "#8b5cf6",
          children: [
            { name: "桥梁损伤", value: 100, color: "#d8b4fe" },
            { name: "桥梁梁体", value: 60, color: "#c084fc" },
            { name: "桥梁护栏", value: 60, color: "#a855f7" },
            { name: "桥梁桥墩", value: 60, color: "#9333ea" }
          ]
        }
      ]
    },
    {
      name: "能源",
      value: 1947,
      color: "#059669",
      children: [
        {
          name: "管道",
          value: 271,
          color: "#ef4444",
          children: [
            { name: "管道占压", value: 20, color: "#fecaca" },
            { name: "沿线塌方", value: 15, color: "#fca5a5" },
            { name: "打孔盗油", value: 107, color: "#f87171" },
            { name: "管道漏油", value: 109, color: "#ef4444" },
            { name: "管道裸露", value: 20, color: "#dc2626" }
          ]
        },
        {
          name: "井场",
          value: 690,
          color: "#059669",
          children: [
            { name: "井场盘根漏油", value: 100, color: "#86efac" },
            { name: "井场井口池漏油", value: 100, color: "#4ade80" },
            { name: "井场驴头抽停", value: 100, color: "#22c55e" },
            { name: "井场火焰检测", value: 116, color: "#16a34a" },
            { name: "井场烟雾检测", value: 116, color: "#15803d" },
            { name: "井场人员侵入", value: 107, color: "#14532d" },
            { name: "井场车辆侵入", value: 107, color: "#166534" },
            { name: "磕头机检测", value: 100, color: "#0f766e" },
            { name: "驴头检测", value: 100, color: "#115e59" },
            { name: "磕头机减速箱", value: 100, color: "#134e4a" },
            { name: "磕头机保温箱", value: 100, color: "#f59e0b" },
            { name: "储油罐检测", value: 25, color: "#ea580c" }
          ]
        },
        {
          name: "场站",
          value: 446,
          color: "#f59e0b",
          children: [
            { name: "场站火焰检测", value: 116, color: "#fed7aa" },
            { name: "场站烟雾检测", value: 116, color: "#fdba74" },
            { name: "场站人员侵入", value: 107, color: "#fb923c" },
            { name: "场站车辆侵入", value: 107, color: "#f97316" }
          ]
        }
      ]
    }
  ]
};

// Industry pie chart variables
let industryPieChart = null;
let currentIndustryData = industryBenchmarkData;
let industryHistory = [];

// Initialize industry pie chart
function initIndustryPieChart() {
  const pieElement = document.getElementById('industry-pie-chart');
  if (!pieElement) return;
  
  // Set global Chart.js defaults for better rendering quality
  Chart.defaults.font.family = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  Chart.defaults.color = '#1f2937';
  
  // Create Canvas element
  const canvas = document.createElement('canvas');
  canvas.id = 'industry-pie-chart-canvas';
  
  // Handle high DPI displays for crisp text
  const dpr = window.devicePixelRatio || 1;
  const rect = pieElement.getBoundingClientRect();
  
  // Set display size (css pixels) - 增大尺寸，减少上间距
  canvas.style.width = '600px';
  canvas.style.height = '550px';
  
  // Set actual size in memory (scaled up for high DPI)
  canvas.width = 600 * dpr;
  canvas.height = 550 * dpr;
  
  // Scale the drawing context to match device pixel ratio
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  
  pieElement.innerHTML = '';
  pieElement.appendChild(canvas);
  
  // Initialize chart
  updateIndustryPieChart();
  updateIndustryNavigationButtons();
  
  // Add button event listeners
  addIndustryButtonListeners();
  
  console.log('Industry pie chart initialized successfully');
}

// Update industry pie chart
function updateIndustryPieChart() {
  const canvas = document.getElementById('industry-pie-chart-canvas');
  if (!canvas) return;
  
  if (industryPieChart) {
    industryPieChart.destroy();
  }
  
  // Prepare chart data
  const labels = currentIndustryData.children.map(item => item.name);
  const values = currentIndustryData.children.map(item => item.value);
  const colors = currentIndustryData.children.map(item => 
    item.color || getRandomColor()
  );
  
  // 自定义插件：在动画完成后绘制外部标签
  const externalLabelsPlugin = {
    id: 'externalLabels',
    afterDraw: function(chart) {
      addExternalLabelsWithConnectors(canvas, chart, labels, values, colors);
    }
  };

  // Chart configuration for pie chart with connector lines
  const config = {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderColor: '#ffffff',
        borderWidth: 2
        // 去掉cutout属性，创建实心饼图
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        onComplete: function() {
          // 动画完成后绘制外部标签
          setTimeout(() => {
            addExternalLabelsWithConnectors(canvas, industryPieChart, labels, values, colors);
          }, 50);
        }
      },
      layout: {
        padding: {
          left: 120,
          right: 120,
          top: 30,
          bottom: 80
        }
      },
      plugins: {
        legend: {
          display: false // 隐藏图例，因为我们使用外部标签
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        },
        datalabels: {
          display: false // 隐藏内部标签，使用外部标签
        }
      },
      onClick: handleIndustryChartClick
    },
    plugins: [ChartDataLabels, externalLabelsPlugin]
  };
  
  // Create chart
  industryPieChart = new Chart(canvas, config);
}

// 添加外部标签和连接线
function addExternalLabelsWithConnectors(canvas, chart, labels, values, colors) {
  const ctx = canvas.getContext('2d');
  const chartArea = chart.chartArea;
  const centerX = chartArea.left + (chartArea.right - chartArea.left) / 2;
  const centerY = chartArea.top + (chartArea.bottom - chartArea.top) / 2;
  const outerRadius = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top) / 2;
  // 实心饼图不需要内半径
  
  // 计算总数据
  const total = values.reduce((a, b) => a + b, 0);
  
  // 设置字体以计算文本尺寸
  ctx.font = '12px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  
  // 预计算所有标签位置，避免重叠
  const labelPositions = [];
  let currentAngle = -Math.PI / 2; // 从顶部开始
  
  // 第一遍：计算所有标签的基本位置
  values.forEach((value, index) => {
    const percentage = (value / total) * 100;
    const sliceAngle = (value / total) * 2 * Math.PI;
    const midAngle = currentAngle + sliceAngle / 2;
    
    const labelText = `${labels[index]}\n${value} (${Math.round(percentage)}%)`;
    const labelLines = labelText.split('\n');
    const labelHeight = labelLines.length * 14 + 4; // 增加行高以适应更大的字体
    const labelWidth = Math.max(...labelLines.map(line => ctx.measureText(line).width)) + 8;
    
    const labelRadius = outerRadius + 40;
    const endX = centerX + Math.cos(midAngle) * labelRadius;
    const endY = centerY + Math.sin(midAngle) * labelRadius;
    
    let labelX, labelY;
    if (Math.cos(midAngle) >= 0) {
      labelX = endX + 5;
      labelY = endY - labelHeight / 2;
    } else {
      labelX = endX - labelWidth - 5;
      labelY = endY - labelHeight / 2;
    }
    
    labelPositions.push({
      index,
      midAngle,
      labelX,
      labelY,
      labelWidth,
      labelHeight,
      labelText,
      labelLines,
      startX: centerX + Math.cos(midAngle) * outerRadius,
      startY: centerY + Math.sin(midAngle) * outerRadius,
      endX,
      endY
    });
    
    currentAngle += sliceAngle;
  });
  
  // 第二遍：调整重叠的标签位置
  for (let i = 0; i < labelPositions.length; i++) {
    for (let j = i + 1; j < labelPositions.length; j++) {
      const pos1 = labelPositions[i];
      const pos2 = labelPositions[j];
      
      // 检查是否重叠
      const overlap = !(pos1.labelX + pos1.labelWidth < pos2.labelX || 
                       pos2.labelX + pos2.labelWidth < pos1.labelX ||
                       pos1.labelY + pos1.labelHeight < pos2.labelY ||
                       pos2.labelY + pos2.labelHeight < pos1.labelY);
      
      if (overlap) {
        // 调整第二个标签的位置
        const offset = 15;
        if (pos2.labelY < pos1.labelY) {
          pos2.labelY = pos1.labelY - pos2.labelHeight - offset;
        } else {
          pos2.labelY = pos1.labelY + pos1.labelHeight + offset;
        }
      }
    }
  }
  
  // 第三遍：绘制所有标签和连接线
  labelPositions.forEach((pos) => {
    // 绘制连接线
    ctx.strokeStyle = colors[pos.index];
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pos.startX, pos.startY);
    ctx.lineTo(pos.endX, pos.endY);
    ctx.stroke();
    
    // 不再绘制标签背景和边框
    
    // 绘制标签文字
    ctx.fillStyle = colors[pos.index]; // 标签颜色跟随饼图颜色
    ctx.font = '12px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    pos.labelLines.forEach((line, lineIndex) => {
      const textY = pos.labelY + 8 + lineIndex * 14; // 增加行间距以适应更大的字体
      ctx.fillText(line, pos.labelX + pos.labelWidth / 2, textY);
    });
  });
}

// Handle industry chart click event
function handleIndustryChartClick(event, elements) {
  if (elements.length > 0) {
    const index = elements[0].index;
    const selectedItem = currentIndustryData.children[index];
    
    // If has subcategories, go to next level
    if (selectedItem.children && selectedItem.children.length > 0) {
      industryHistory.push(currentIndustryData);
      currentIndustryData = {
        name: selectedItem.name,
        value: selectedItem.value,
        color: selectedItem.color,
        children: selectedItem.children
      };
      updateIndustryPieChart();
      updateIndustryNavigationButtons();
    }
  }
}

// Update industry navigation buttons
function updateIndustryNavigationButtons() {
  const backBtn = document.getElementById('industry-back-btn');
  const currentLevelSpan = document.getElementById('industry-current-level');
  
  if (backBtn) {
    backBtn.style.display = industryHistory.length > 0 ? 'inline-block' : 'none';
  }
  
  if (currentLevelSpan) {
    currentLevelSpan.textContent = `当前级别: ${currentIndustryData.name}`;
  }
}

// Go back in industry chart
function goBackIndustry() {
  if (industryHistory.length > 0) {
    currentIndustryData = industryHistory.pop();
    updateIndustryPieChart();
    updateIndustryNavigationButtons();
  }
}

// Reset industry chart view
function resetIndustryView() {
  industryHistory = [];
  currentIndustryData = industryBenchmarkData;
  updateIndustryPieChart();
  updateIndustryNavigationButtons();
}

// Add industry button event listeners
function addIndustryButtonListeners() {
  const backBtn = document.getElementById('industry-back-btn');
  const resetBtn = document.getElementById('industry-reset-btn');
  
  if (backBtn) {
    backBtn.addEventListener('click', goBackIndustry);
  }
  
  if (resetBtn) {
    resetBtn.addEventListener('click', resetIndustryView);
  }
}
