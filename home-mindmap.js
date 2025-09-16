// Home page mind map functionality
document.addEventListener('DOMContentLoaded', function() {
  initHomeMindMap();
});

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

// 创建完整版本的思维导图数据
function createFullMindMap() {
  return `
    graph LR
      A[Video Analysis Benchmark] --> B[Physics Understanding]
      A --> C[General Perception]
      A --> D[Spatial & Temporal]
      
      %% Physics分支
      B --> B1[Intuitive Physics]
      B --> B2[Embodied Reasoning]
      
      B1 --> B1a[Electromagnetism]
      B1a --> B1a1[Explanation: Understand laws of physics related to Electromagnetism]
      B1 --> B1b[Thermodynamics]
      B1b --> B1b1[Explanation: Understand laws of physics related to Thermodynamics]
      B1 --> B1c[Anti-Physics]
      B1c --> B1c1[Explanation: Understand situations that defy the laws of physics]
      
      B2 --> B2a[Mechanics]
      B2a --> B2a1[Explanation: Understand laws of physics related to Mechanics]
      B2 --> B2b[Attributes]
      B2b --> B2b1[Explanation: Determine physical properties of an object]
      B2 --> B2c[States]
      B2c --> B2c1[Explanation: Determine the object state and understand the state change]
      B2 --> B2d[Object Permanence]
      B2d --> B2d1[Explanation: Understand object permanence]
      
      %% General Perception分支
      C --> C1[Counting]
      C --> C2[Captioning]
      C --> C3[Detection / Grounding]
      C --> C4[Pointing / REC]
      C --> C5[Segmentation]
      C --> C6[Classification]
      C --> C7[OCR]
      C --> C8[Image eval]
      
      %% Spatial & Temporal分支
      D --> D1[Spatial]
      D --> D2[Temporal]
      
      D1 --> D1a[Relationship]
      D1a --> D1a1[Explanation: Spatial relationships between objects]
      D1 --> D1b[Multi-view]
      D1b --> D1b1[Explanation: Multi-view corresponding and matching]
      D1 --> D1c[Environment]
      D1c --> D1c1[Explanation: Traffic violations and parking]
      D1 --> D1d[Plausibility]
      D1d --> D1d1[Explanation: Whether spatial relationships are valid]
      D1 --> D1e[Affordance]
      D1e --> D1e1[Explanation: Understanding interactions between objects and subjects]
      D1 --> D1f[Camera]
      D1f --> D1f1[Explanation: Camera movement, angles/positions and scene transitions]
      D1 --> D1g[Measurement]
      D1g --> D1g1[Explanation: Measurement and speed detection]
      
      D2 --> D2a[Action / Event]
      D2a --> D2a1[Explanation: Summarizing events]
      D2 --> D2b[Trajectory]
      D2b --> D2b1[Explanation: Trajectory reasoning and judgment]
      D2 --> D2c[Causality]
      D2c --> D2c1[Explanation: Causal relationships between events]
      D2 --> D2d[Future / Past]
      D2d --> D2d1[Explanation: Predicting future/analyzing historical event completion]
      
      %% Style definitions
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

// 全局变量
let currentZoom = 1;
let zoomStep = 0.2;
let minZoom = 0.3;
let maxZoom = 3.0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let currentTranslateX = 0;
let currentTranslateY = 0;
let dragEnabled = false;

// 初始化思维导图
function initHomeMindMap() {
  const container = document.getElementById('mindmap-container');
  if (!container) return;
  
  try {
    console.log('Initializing home mind map...');
    
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
        rankdir: 'LR',
        align: 'UL'
      }
    });
    
    // 默认显示折叠版本
    renderMindMap(createCollapsedMindMap());
    
    // 添加鼠标滚轮缩放
    addWheelZoom();
    
  } catch (error) {
    console.error('Failed to initialize home mind map:', error);
    container.innerHTML = '<p style="color: red; text-align: center; padding: 20px;">Mind map initialization failed</p>';
  }
}

// 渲染思维导图
function renderMindMap(mermaidData) {
  const container = document.getElementById('mindmap-container');
  if (!container) return;
  
  mermaid.render('home-mindmap-svg', mermaidData).then(({ svg }) => {
    container.innerHTML = svg;
    applyCustomStyles();
    addNodeClickEvents();
    
    // 强制显示连线和应用样式
    setTimeout(() => {
      forceShowEdges();
      forceRoundedCorners();
    }, 100);
    
    setTimeout(() => {
      forceShowEdges();
      forceRoundedCorners();
    }, 300);
    
  }).catch(error => {
    console.error('Failed to render mind map:', error);
    container.innerHTML = '<p style="color: red; text-align: center; padding: 20px;">Mind map rendering failed</p>';
  });
}

// 全部展开
function expandAll() {
  renderMindMap(createFullMindMap());
}

// 全部折叠
function collapseAll() {
  renderMindMap(createCollapsedMindMap());
}

// 缩放功能
function zoomIn() {
  if (currentZoom < maxZoom) {
    currentZoom += zoomStep;
    applyZoom();
  }
}

function zoomOut() {
  if (currentZoom > minZoom) {
    currentZoom -= zoomStep;
    applyZoom();
  }
}

function resetZoom() {
  currentZoom = 1;
  resetDrag();
  applyZoom();
}

function applyZoom() {
  const container = document.getElementById('mindmap-container');
  if (!container) return;
  
  const svg = container.querySelector('svg');
  if (svg) {
    svg.style.transform = `scale(${currentZoom}) translate(${currentTranslateX}px, ${currentTranslateY}px)`;
    svg.style.transformOrigin = 'center center';
    svg.style.transition = 'transform 0.3s ease';
  }
  
  // 更新缩放指示器
  const zoomIndicator = document.getElementById('zoom-indicator');
  if (zoomIndicator) {
    zoomIndicator.textContent = `Zoom: ${Math.round(currentZoom * 100)}%`;
  }
}

// 拖拽功能
function toggleDrag() {
  dragEnabled = !dragEnabled;
  const dragButton = document.getElementById('drag-toggle');
  if (dragButton) {
    dragButton.textContent = dragEnabled ? 'Disable Drag' : 'Enable Drag';
    dragButton.style.backgroundColor = dragEnabled ? '#059669' : 'var(--primary-red)';
  }
  
  if (dragEnabled) {
    addDragEvents();
  } else {
    removeDragEvents();
  }
}

function addDragEvents() {
  const container = document.getElementById('mindmap-container');
  if (!container) return;
  
  container.addEventListener('mousedown', startDrag);
  container.addEventListener('mousemove', drag);
  container.addEventListener('mouseup', endDrag);
  container.addEventListener('mouseleave', endDrag);
  container.style.cursor = 'grab';
}

function removeDragEvents() {
  const container = document.getElementById('mindmap-container');
  if (!container) return;
  
  container.removeEventListener('mousedown', startDrag);
  container.removeEventListener('mousemove', drag);
  container.removeEventListener('mouseup', endDrag);
  container.removeEventListener('mouseleave', endDrag);
  container.style.cursor = 'default';
}

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

function drag(e) {
  if (!isDragging || !dragEnabled) return;
  
  currentTranslateX = e.clientX - dragStartX;
  currentTranslateY = e.clientY - dragStartY;
  
  applyDragTransform();
  e.preventDefault();
}

function endDrag() {
  if (!dragEnabled) return;
  
  isDragging = false;
  const container = document.getElementById('mindmap-container');
  if (container) {
    container.style.cursor = 'grab';
  }
}

function applyDragTransform() {
  const container = document.getElementById('mindmap-container');
  if (!container) return;
  
  const svg = container.querySelector('svg');
  if (svg) {
    svg.style.transform = `scale(${currentZoom}) translate(${currentTranslateX}px, ${currentTranslateY}px)`;
    svg.style.transformOrigin = 'center center';
  }
}

function resetDrag() {
  currentTranslateX = 0;
  currentTranslateY = 0;
  applyDragTransform();
}

// 添加鼠标滚轮缩放
function addWheelZoom() {
  const container = document.getElementById('mindmap-container');
  if (!container) return;
  
  container.addEventListener('wheel', function(e) {
    e.preventDefault();
    
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  }, { passive: false });
}

// 应用自定义样式
function applyCustomStyles() {
  let style = document.getElementById('home-mindmap-custom-styles');
  if (!style) {
    style = document.createElement('style');
    style.id = 'home-mindmap-custom-styles';
    document.head.appendChild(style);
  }
  
  style.textContent = `
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
    
    #mindmap-container rect {
      rx: 12px !important;
      ry: 12px !important;
    }
    
    #mindmap-container .edgePath,
    #mindmap-container .edgePath path,
    #mindmap-container .flowchart-link,
    #mindmap-container path[class*="edge"],
    #mindmap-container line[class*="edge"] {
      stroke: #dc2626 !important;
      stroke-width: 2px !important;
      fill: none !important;
      opacity: 1 !important;
      visibility: visible !important;
      display: block !important;
    }
    
    #mindmap-container svg {
      width: 100%;
      height: 100%;
      min-height: 600px;
    }
    
    #mindmap-container .node:hover rect,
    #mindmap-container .node:hover polygon,
    #mindmap-container .node:hover circle,
    #mindmap-container .node:hover ellipse {
      filter: brightness(1.2) !important;
      stroke-width: 4px !important;
    }
  `;
}

// 强制显示连线
function forceShowEdges() {
  const container = document.getElementById('mindmap-container');
  if (!container) return;
  
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
      element.style.stroke = '#dc2626';
      element.style.strokeWidth = '2px';
      element.style.fill = 'none';
    });
  });
}

// 强制应用圆角
function forceRoundedCorners() {
  const container = document.getElementById('mindmap-container');
  if (!container) return;
  
  const nodes = container.querySelectorAll('.node');
  nodes.forEach(node => {
    const rect = node.querySelector('rect');
    if (rect) {
      rect.setAttribute('rx', '12');
      rect.setAttribute('ry', '12');
      rect.style.rx = '12px';
      rect.style.ry = '12px';
    }
  });
}

// 添加节点点击事件
function addNodeClickEvents() {
  const container = document.getElementById('mindmap-container');
  if (!container) return;
  
  const nodes = container.querySelectorAll('.node');
  nodes.forEach(node => {
    node.addEventListener('click', function() {
      const nodeId = this.id;
      console.log('Node clicked:', nodeId);
      
      // 根据节点类型决定展开或折叠
      if (nodeId.includes('A') || nodeId.includes('B') || nodeId.includes('C') || nodeId.includes('D')) {
        expandAll();
      } else if (nodeId.includes('B1') || nodeId.includes('B2') || nodeId.includes('D1') || nodeId.includes('D2')) {
        expandAll();
      }
    });
  });
}
