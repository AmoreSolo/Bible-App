import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    const banner = document.createElement("div");
    banner.innerHTML = `
      <div style="
        position: fixed;
        bottom: 90px;
        left: 50%;
        transform: translateX(-50%);
        background: #0f172a;
        color: #f8fafc;
        border-radius: 12px;
        padding: 12px 20px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 6px 16px rgba(0,0,0,.4);
        z-index: 9999;
        text-align: center;
        line-height: 1.5;
      ">
        ✨ A new update is available. 
        <button id="reload-app" style="
          margin-left: 10px;
          background: #38bdf8;
          color: #0f172a;
          border: none;
          border-radius: 6px;
          padding: 6px 10px;
          cursor: pointer;
          font-weight: 600;
        ">Update</button>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById("reload-app").onclick = () => {
      updateSW(true);
      banner.remove();
    };
  },
  onOfflineReady() {
    const toast = document.createElement("div");
    toast.innerHTML = `
      <div style="
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #1e293b;
        color: #f8fafc;
        border-radius: 12px;
        padding: 12px 20px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,.4);
        z-index: 9998;
      ">
        ✅ Ready to work offline
        <button id="close-toast" style="
          margin-left: 10px;
          background: transparent;
          color: #38bdf8;
          border: none;
          cursor: pointer;
          font-weight: 600;
        ">Got it</button>
      </div>
    `;
    document.body.appendChild(toast);

    document.getElementById("close-toast").onclick = () => {
      toast.remove();
    };
  },
});
