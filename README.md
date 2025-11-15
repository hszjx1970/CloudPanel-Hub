# Cloud Transfer Hub v2.0

<img src="./assets/icon.png" width="96" alt="Cloud Transfer Hub Icon">

A sophisticated desktop application, built with Electron, React, and Vite, designed to integrate and manage file transfers between various cloud storage services. This demonstration uses mock data to simulate connecting to accounts, managing files, and executing transfers, enhanced with AI-powered organizational features.

这是一个功能强大的桌面应用程序，使用 Electron, React 和 Vite 构建，旨在集成并管理不同云存储服务之间的文件传输。此演示版本使用模拟数据来展示连接账户、管理文件和执行传输等功能，并通过 AI 驱动的特性来增强文件整理体验。

---

## Key Features (主要特性)

*   **Native Desktop Experience (原生桌面体验)**: Runs as a standalone application on Windows, macOS, and Linux, thanks to Electron.
*   **Modern & Stable Tech Stack (现代化技术栈)**: Built with React 18, TypeScript, and Vite for a fast, reliable, and modern development experience.
*   **Multi-Cloud Integration (多云盘集成)**: Connects to a wide range of popular cloud services like Google Drive, Dropbox, Baidu Pan, and more. (目前使用模拟数据)
*   **Seamless File Transfer (无缝文件传输)**: Intuitive drag-and-drop or button-click interface to transfer files between any two connected accounts.
*   **Advanced Transfer Queue (高级传输队列)**: Full control over transfers with pause, resume, retry, and remove functionalities.
*   **Comprehensive File Management (完整文件管理)**: Full-fledged file explorer with support for creating folders, renaming, and deleting files via a context menu.
*   **AI-Powered Smart Organization (AI 智能整理)**: Utilizes the Gemini API to analyze files in a folder and suggest an intelligent organization plan.
*   **Local File System Integration (与本地文件系统集成)**: Upload files from your computer to any cloud drive, and download files from the cloud to your computer.
*   **Mobile Device Interconnection (移动设备互联)**: Automatically detects the local IP address to generate a QR code, allowing mobile devices on the same network to connect and control the application seamlessly.
*   **Bilingual & Responsive (双语 & 响应式)**: Easily switch between English and Chinese (中文).

---

## Build and Run as a Desktop App (构建并运行桌面应用)

Follow these steps to build and run the application on your computer.

### Prerequisites (先决条件)
*   [Node.js](https://nodejs.org/) (version 18 or newer is recommended) must be installed on your system.

### Step 1: Install Dependencies (安装依赖)
Open your terminal or command prompt, navigate to the project's root directory, and run:
```bash
npm install
```

### Step 2: Run in Development Mode (运行开发模式)
This project uses a two-terminal setup for the best development experience with live reloading for both the UI and the main Electron process.

**In your first terminal**, start the Vite development server for the user interface:
```bash
npm run dev
```
Wait for it to say the server is running.

**In your second terminal**, start the Electron application window:
```bash
npm run dev:electron
```
The application window will open, loading the interface from the Vite server. Any changes you make to the code will now automatically reload.

### Step 3: Package the Application (打包应用程序)
To create a distributable installer file (`.exe` for Windows, `.dmg` for macOS, etc.), run the following command:
```bash
npm run electron:package
```
This command first builds the React application for production and then packages it into a native installer using Electron Builder. After the process completes, you will find the installer package inside a new `release` folder in the project directory.

---
## Mobile App & Device Interconnection (手机 App 及设备互联)

This application can be controlled from your mobile phone when it's on the same Wi-Fi network as your computer. The "mobile app" is a PWA (Progressive Web App) that you can "install" onto your phone's home screen for a native-like experience.

### How to Connect (如何连接)

**Prerequisite**: Ensure your computer and mobile phone are connected to the **same Wi-Fi network**.

1.  **Run the Desktop App**: Start the Cloud Transfer Hub application on your computer.

2.  **Open the Connection Tool**: In the sidebar on the left, click the **"Connect Mobile Device"** button, which has a QR code icon.
    
3.  **Scan the QR Code**: A pop-up window will instantly appear with a unique QR code. The application automatically detects your computer's local network IP address, so no manual input is needed.

4.  **Access on Your Phone**:
    *   Open the camera app on your phone and scan the QR code on your computer screen.
    *   Your phone's browser will open the application's interface.
    *   For the best experience, use your browser's **"Add to Home Screen"** feature to install the app icon on your phone's home screen. You can now launch it just like any other app.

---

## Advanced Architecture: Cloud Server Deployment (高级架构：云服务器部署)

While this application is designed as a powerful local-first desktop tool, its architecture can be evolved into a true, multi-user cloud service by leveraging a cloud server. This unlocks true cross-device synchronization from anywhere in the world and server-side background transfers.

### Core Advantages (核心优势)
*   **True Cross-Device Sync**: Log in from any device (desktop, mobile, web) and see the exact same connected accounts and files.
*   **Server-Side Transfers**: Initiate a large transfer and close your computer. The transfer will continue to run on your server.
*   **Scalability**: The foundation for a multi-user SaaS (Software as a Service) product.

### Required Components (所需组件)
1.  **Backend Server (API)**: A Node.js server (e.g., using the Express.js framework) that handles user authentication (login/register), securely stores cloud service credentials (using OAuth 2.0), and acts as a proxy for all file operations.
2.  **Database**: A central database (e.g., PostgreSQL or MongoDB) to store user accounts and their encrypted cloud account credentials.
3.  **Frontend Clients**: The existing React application, adapted to communicate with your new backend API instead of the local mock service.

### Deployment Prerequisites (部署要求)
*   A cloud server (VPS) from a provider like AWS, Google Cloud, or DigitalOcean.
*   A registered domain name.
*   An SSL certificate for secure HTTPS communication.
*   A process manager (like PM2) to keep the backend service running.
