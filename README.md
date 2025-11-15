# Cloud Transfer Hub

A sophisticated desktop application, built with Electron and React, designed to integrate and manage file transfers between various cloud storage services. This demonstration uses mock data to simulate connecting to accounts, managing files, and executing transfers, enhanced with AI-powered organizational features.

这是一个功能强大的桌面应用程序，使用 Electron 和 React 构建，旨在集成并管理不同云存储服务之间的文件传输。此演示版本使用模拟数据来展示连接账户、管理文件和执行传输等功能，并通过 AI 驱动的特性来增强文件整理体验。

---

## Key Features (主要特性)

*   **Native Desktop Experience (原生桌面体验)**: Runs as a standalone application on Windows, macOS, and Linux, thanks to Electron.
*   **Automatic IP Detection (自动 IP 检测)**: For the "Connect Mobile Device" feature, the app automatically detects your local IP address—no manual entry required.
*   **Multi-Cloud Integration (多云盘集成)**: Connects to a wide range of popular cloud services like Google Drive, Dropbox, Baidu Pan, and more. (目前使用模拟数据)
*   **Seamless File Transfer (无缝文件传输)**: Intuitive drag-and-drop or button-click interface to transfer files between any two connected accounts.
*   **Advanced Transfer Queue (高级传输队列)**: Full control over transfers with pause, resume, retry, and remove functionalities.
*   **Comprehensive File Management (完整文件管理)**: Full-fledged file explorer with support for creating folders, renaming, and deleting files via a context menu.
*   **AI-Powered Smart Organization (AI 智能整理)**: Utilizes the Gemini API to analyze files in a folder and suggest an intelligent organization plan.
*   **Local File System Integration (与本地文件系统集成)**: Upload files from your computer to any cloud drive, and download files from the cloud to your computer.
*   **Bilingual & Responsive (双语 & 响应式)**: Easily switch between English and Chinese (中文). The UI is also responsive for different window sizes.

---

## Build and Run as a Desktop App (构建并运行桌面应用)

Follow these steps to build and run the application on your computer.

### Prerequisites (先决条件)
*   [Node.js](https://nodejs.org/) (which includes npm) must be installed on your system.

### Step 1: Install Dependencies (安装依赖)
Open your terminal or command prompt, navigate to the project's root directory (where the `package.json` file is located), and run:
```bash
npm install
```

### Step 2: Run in Development Mode (运行开发模式)
To run the application in a live development environment, use the following command. This will open the application window, often with developer tools enabled.
```bash
npm start
```

### Step 3: Package the Application (打包应用程序)
To create a distributable installer file (`.exe` for Windows, `.dmg` for macOS, etc.), run the following command:
```bash
npm run package
```
After the process completes, you will find the installer package inside a new `dist` folder in the project directory. You can now share and install this file like any other desktop application.

---

## Future Roadmap (未来路线图)

*   **Real API Integration**: Move from mock data to real cloud storage APIs using a secure backend server to handle OAuth 2.0 authentication and proxy requests.
*   **Backend Server for Sync**: Develop a backend to enable true cross-device data synchronization of connected accounts.
*   **Advanced Synchronization Tasks**: Implement features for scheduled, automatic folder synchronization between different cloud services.
