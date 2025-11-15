# Cloud Transfer Hub

A sophisticated web application designed to integrate and manage file transfers between various cloud storage services. This demonstration uses mock data to simulate connecting to accounts, managing files, and executing transfers, enhanced with AI-powered organizational features.

这是一个功能强大的网页应用，旨在集成并管理不同云存储服务之间的文件传输。此演示版本使用模拟数据来展示连接账户、管理文件和执行传输等功能，并通过 AI 驱动的特性来增强文件整理体验。

---

## Key Features (主要特性)

*   **Multi-Cloud Integration (多云盘集成)**: Connects to a wide range of popular cloud services like Google Drive, Dropbox, Baidu Pan, and more. (目前使用模拟数据)
*   **Seamless File Transfer (无缝文件传输)**: Intuitive drag-and-drop or button-click interface to transfer files between any two connected accounts.
*   **Advanced Transfer Queue (高级传输队列)**: Full control over transfers with pause, resume, retry, and remove functionalities.
*   **Comprehensive File Management (完整文件管理)**: Full-fledged file explorer with support for creating folders, renaming, and deleting files via a context menu.
*   **AI-Powered Smart Organization (AI 智能整理)**: Utilizes the Gemini API to analyze files in a folder and suggest an intelligent organization plan, which you can review and apply with a single click.
*   **Local File System Integration (与本地文件系统集成)**: Upload files from your computer to any cloud drive, and download files from the cloud to your computer.
*   **Bilingual Support (双语支持)**: Easily switch between English and Chinese (中文).
*   **Fully Responsive & Installable (PWA) (完全响应式 & 可安装)**: Works beautifully on both desktop and mobile. Can be "installed" as a Progressive Web App for a native-like experience on your desktop or phone's home screen.
*   **Persistent Local State (持久化本地状态)**: Remembers your connected accounts, behaving like a native desktop application.

## Technology Stack (技术栈)

*   **Frontend**: React, TypeScript, Tailwind CSS
*   **AI**: Google Gemini API
*   **PWA**: Service Worker, Web App Manifest
*   **Localization**: React Context API

## Setup & Installation (安装与设置)

This application is a PWA (Progressive Web App) and can be easily installed directly from your browser.

1.  **Open the Application**: Navigate to the application's URL in a modern browser like Google Chrome or Microsoft Edge.
2.  **Use the In-App Button**: In the sidebar (bottom-left), click the **"Install App"** button.
3.  **Confirm**: A browser pop-up will appear. Click "Install".
4.  The application will now be available on your desktop or Start Menu, running in its own window just like a native app.

## Usage Guide (使用说明)

### Desktop (电脑端)

1.  **Connect Accounts**: Use the sidebar to set a **Source** and **Destination** account. Use the `+ Add New Account` button to connect new services.
2.  **Transfer Files**:
    *   **Drag & Drop**: Drag files from the Source panel and drop them onto the Destination panel.
    *   **Button**: Check files in the Source panel and click the central blue arrow button.
3.  **Manage Files**: Right-click on a file in the Source panel to **Rename** or **Delete**. Use the buttons at the top of the file explorer to create new folders or manage selected files.
4.  **Smart Organize**: Click the **magic wand icon** in the Source panel's header to get an AI-generated organization plan for the current folder.
5.  **Upload/Download**: Use the **Upload** and **Download** buttons in the Source panel to transfer files between the cloud and your local computer.

### Mobile (手机端)

1.  **Add to Home Screen**: When you open the app in your mobile browser, you will be prompted to **"Add to Home Screen"**. This will install the app icon on your phone for easy access.
2.  **Navigate**: Click the **"hamburger" menu icon (☰)** in the top-left to open the account sidebar.
3.  **Select & Transfer**: Choose a Source and Destination. The panels will be stacked vertically. Select files in the Source panel and scroll down to tap the central blue arrow button.

## Advanced Usage: Remote Access (高级用法：远程访问)

You can access the application running on your desktop from your mobile device.

### 1. On the Same Wi-Fi Network (局域网访问)

The easiest way is to use the built-in **"Connect Mobile Device"** feature (QR code icon in the sidebar). This will open a modal where you can enter your computer's local IP address to generate a QR code. Scan it with your phone to connect instantly.

### 2. From Anywhere (Public Access via Cloudflare Tunnel)

For stable, secure access from any network, you can use a Cloudflare Tunnel. This is a free and robust way to expose your local application to the internet.

**Prerequisites:**
*   A free Cloudflare account.
*   A domain name managed through Cloudflare.

**Step 1: Install `cloudflared`**
Follow the official [Cloudflare documentation](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/installation/) to install the `cloudflared` command-line tool on the computer where the app is running.

**Step 2: Authenticate**
Run this command and follow the instructions to log into your Cloudflare account.
```bash
cloudflared tunnel login
```

**Step 3: Create a Tunnel**
Give your tunnel a memorable name.
```bash
cloudflared tunnel create cloud-transfer-hub
```
This will output a tunnel ID and create a credentials file. Keep this information safe.

**Step 4: Configure the Tunnel**
Create a configuration file named `config.yml` in the `~/.cloudflared/` directory. Paste the following content, replacing `<YOUR_TUNNEL_ID>` with the ID from the previous step.
```yaml
tunnel: <YOUR_TUNNEL_ID>
credentials-file: /path/to/your/credentials.json # Usually ~/.cloudflared/<tunnel-id>.json
ingress:
  # This rule points traffic from your public hostname to the local app
  - hostname: hub.your-domain.com
    service: http://localhost:5173 # Make sure the port matches your app's port
  # This is a catch-all rule to prevent leaking the tunnel's IP address
  - service: http_status:404
```
*   **Important**: Replace `hub.your-domain.com` with the actual public subdomain you want to use.
*   The `credentials-file` path should point to the `.json` file created in Step 3.

**Step 5: Route Traffic to the Tunnel**
Associate your chosen hostname with your tunnel.
```bash
cloudflared tunnel route dns cloud-transfer-hub hub.your-domain.com
```

**Step 6: Run the Tunnel**
Launch the tunnel. It will now proxy requests from your public hostname to your local application.
```bash
cloudflared tunnel run cloud-transfer-hub
```
You can now access your application from any device in the world by visiting `https://hub.your-domain.com`.

**Security Recommendation**: For enhanced security, consider adding a Zero Trust policy using [Cloudflare Access](https://www.cloudflare.com/products/zero-trust/access/) to require a login before anyone can reach your application.

## Future Roadmap (未来路线图)

*   **Real API Integration**: Move from mock data to real cloud storage APIs using a secure backend server to handle OAuth 2.0 authentication and proxy requests.
*   **Backend Server for Sync**: Develop a backend to enable true cross-device data synchronization of connected accounts.
*   **Advanced Synchronization Tasks**: Implement features for scheduled, automatic folder synchronization between different cloud services.
