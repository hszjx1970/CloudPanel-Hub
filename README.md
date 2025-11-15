<p align="center">
  <img src="assets/icon.png" width="128" alt="Cloud Transfer Hub Icon">
</p>

<h1 align="center">Cloud Transfer Hub</h1>

<p align="center">
  一个功能强大的桌面应用程序，使用 Electron 和 Vite 构建，旨在集成并管理不同云存储服务之间的文件传输，并通过 AI 驱动的特性来增强文件整理体验。
</p>

<p align="center">
  A sophisticated desktop application, built with Electron and Vite, designed to integrate and manage file transfers between various cloud storage services, enhanced with AI-powered organizational features.
</p>

---

## Key Features (主要特性)

*   **Native Desktop Experience (原生桌面体验)**: Runs as a standalone application on Windows, macOS, and Linux, thanks to Electron.
*   **Modern & Stable Tech Stack (现代化技术栈)**: Built with React, TypeScript, and Vite for a fast, reliable, and error-free development experience.
*   **One-Click Setup (一键安装)**: Uses simple `.bat` and `.sh` scripts to automate dependency installation and application startup.
*   **Multi-Cloud Integration (多云盘集成)**: Connects to a wide range of popular cloud services like Google Drive, Dropbox, Baidu Pan, and more. *(Currently uses mock data)*
*   **Seamless File Transfer (无缝文件传输)**: Intuitive drag-and-drop or button-click interface to transfer files between any two connected accounts.
*   **Advanced Transfer Queue (高级传输队列)**: Full control over transfers with pause, resume, retry, and remove functionalities.
*   **Comprehensive File Management (完整文件管理)**: Full-fledged file explorer with support for creating folders, renaming, and deleting files via a context menu.
*   **AI-Powered Smart Organization (AI 智能整理)**: Utilizes the Gemini API to analyze files in a folder and suggest an intelligent organization plan.
*   **Local File System Integration (与本地文件系统集成)**: Upload files from your computer to any cloud drive, and download files from the cloud to your computer.
*   **Mobile Device Interconnection (移动设备互联)**: Automatically detects the local IP address to generate a QR code, allowing mobile devices on the same network to connect and control the application seamlessly.
*   **Bilingual & Responsive (双语 & 响应式)**: Easily switch between English and Chinese (中文).

---

## One-Click Setup & Run (一键设置与运行)

This guide provides the simplest way to get the application running on your system, without needing to manually type commands.

### Prerequisites (先决条件)
*   [Node.js](https://nodejs.org/) (version 18 or newer is recommended) must be installed on your system. The setup script will check for this and provide guidance if it's missing.

### For Windows Users

1.  **Install Dependencies**: Double-click the `setup.bat` file. A command prompt will open, check for Node.js, install all necessary components, and then prompt you to press any key to close.
2.  **Run the Application**: Double-click the `run.bat` file. This will launch the application in development mode. Two windows will appear: a command prompt running the web server, and the application window itself.

### For macOS / Linux Users

1.  **Make Scripts Executable (First Time Only)**: Open your terminal, navigate to the project directory, and run `chmod +x setup.sh run.sh`. You only need to do this once.
2.  **Install Dependencies**: Run the command: `./setup.sh`. The script will check for Node.js and install all components.
3.  **Run the Application**: In the same terminal, run the command: `./run.sh`.

---

## Build for Production (打包发布)

To create a distributable installer file (`.exe` for Windows, `.dmg` for macOS, etc.), open your terminal or command prompt and run the following command:
```bash
npm run electron:package
```
After the process completes, you will find the installer package inside a new `release` folder in the project directory.

---
## Mobile App & Device Interconnection (手机 App 及设备互联)

This application can be controlled from your mobile phone when it's on the same Wi-Fi network as your computer. The "mobile app" is a PWA (Progressive Web App) that you can "install" onto your phone's home screen for a native-like experience.

### How to Connect (如何连接)

**Prerequisite**: Ensure your computer and mobile phone are connected to the **same Wi-Fi network**.

1.  **Run the Desktop App**: Start the Cloud Transfer Hub application on your computer using the `run.bat` or `run.sh` script.

2.  **Open the Connection Tool**: In the sidebar on the left, click the **"Connect Mobile Device"** button, which has a QR code icon.
    
3.  **Scan the QR Code**: A pop-up window will instantly appear with a unique QR code. The application automatically detects your computer's local network IP address, so no manual input is needed.

4.  **Access on Your Phone**:
    *   Open the camera app on your phone and scan the QR code on your computer screen.
    *   Your phone's browser will open the application's interface.
    *   For the best experience, use your browser's **"Add to Home Screen"** feature to install the app icon on your phone's home screen. You can now launch it just like any other app.

---

## Advanced Architecture: Cloud Server Deployment (高级架构：云服务器部署)

While this application is designed as a powerful local-first desktop tool, its architecture can be evolved into a true, multi-user cloud service by leveraging a **cloud server**. This unlocks true cross-device synchronization from anywhere in the world and server-side background transfers, transforming the personal tool into a global service.

### Core Advantages (核心优势)
*   **True Cross-Device Sync (真正的跨设备同步)**: Log in from any device (desktop, mobile, web) and see the exact same connected accounts and files. Your data is no longer tied to a single computer.
*   **Server-Side Transfers (服务器端后台传输)**: Initiate a large transfer and close your computer. The transfer will continue to run reliably on your cloud server.
*   **Scalability & Multi-User Support (可扩展性与多用户支持)**: The foundation for a multi-user SaaS (Software as a Service) product where you can offer this service to others.

### Required Components (所需组件)
1.  **Backend Server (API) (后端服务器)**: A server-side application that handles user authentication (login/register), securely encrypts and stores cloud service credentials (using OAuth 2.0), and acts as a central proxy for all file operations.
2.  **Database (数据库)**: A central database (e.g., PostgreSQL or MongoDB) to store user accounts and their encrypted cloud account credentials.
3.  **Frontend Clients (前端客户端)**: The existing React application, adapted to communicate with your new backend API instead of the local mock service.

### Technology Stack Recommendation (技术栈推荐)
*   **Backend**: Node.js with **Express.js** or **NestJS** (TypeScript)
*   **Database**: **PostgreSQL** (for structured data) or **MongoDB** (for flexibility)
*   **Authentication**: **JWT** (for user sessions) and **OAuth 2.0** (for connecting to third-party cloud APIs)

### Deployment Prerequisites (部署要求)
*   A cloud server (VPS) from a provider like AWS, Google Cloud, or DigitalOcean.
*   A registered domain name.
*   An SSL certificate for secure HTTPS communication.
*   A process manager (like PM2) to keep the backend service running.