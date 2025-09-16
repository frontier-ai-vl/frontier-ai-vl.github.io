// footer.js - 页脚组件
class Footer {
  render() {
    const currentYear = new Date().getFullYear();
    
    const footerHTML = `
      <footer>
        <div class="container" style="display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap;">
          <div>© ${currentYear} Frontier-A1-VL Team</div>
          <div class="row">
            <a href="#">Contact Us</a>
          </div>
        </div>
      </footer>
    `;

    // 插入页脚HTML
    document.body.insertAdjacentHTML('beforeend', footerHTML);
  }
}

// 自动初始化页脚
document.addEventListener('DOMContentLoaded', function() {
  const footer = new Footer();
  footer.render();
});
