// navbar.js - 导航栏组件
class Navbar {
  constructor() {
    this.sections = ["home", "benchmark", "dataset", "model", "result", "our-team"];
    this.sectionNames = {
      "home": "Home",
      "benchmark": "Benchmark",
      "dataset": "Dataset", 
      "model": "Model",
      "result": "Result",
      "our-team": "Our Team"
    };
    this.pageUrls = {
      "home": "home.html",
      "benchmark": "benchmark.html",
      "dataset": "dataset.html",
      "model": "model.html", 
      "result": "result.html",
      "our-team": "team.html"
    };
  }

  getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'home.html';
    
    // 根据文件名找到对应的section
    for (const [section, url] of Object.entries(this.pageUrls)) {
      if (url === filename) {
        return section;
      }
    }
    return 'home';
  }

  render() {
    const currentPage = this.getCurrentPage();
    
    const navbarHTML = `
      <header>
        <div class="container nav">
          <div class="brand">
            <img src="./image.png" alt="Frontier-A1-VL Logo" style="width: 40px; height: 40px; margin-right: 12px;">
            <span style="font-weight: 700; font-size: 18px; color: var(--primary-red);">Frontier-A1-VL</span>
          </div>
          <nav class="tabs" id="tabs"></nav>
          <div class="row">
          </div>
        </div>
      </header>
    `;

    // 插入导航栏HTML
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);

    // 生成导航按钮
    const tabsEl = document.getElementById("tabs");
    this.sections.forEach(section => {
      const btn = document.createElement("button");
      btn.textContent = this.sectionNames[section];
      btn.className = section === currentPage ? "active" : "";
      btn.onclick = () => {
        if (this.pageUrls[section]) {
          window.location.href = this.pageUrls[section];
        }
      };
      tabsEl.appendChild(btn);
    });
  }
}

// 自动初始化导航栏
document.addEventListener('DOMContentLoaded', function() {
  const navbar = new Navbar();
  navbar.render();
});
