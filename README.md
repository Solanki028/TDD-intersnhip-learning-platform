# 🎓 Internship Learning Platform (ILP)

A modern, full-stack Learning Management System (LMS) built to facilitate seamless interaction between Students, Mentors, and Administrators. This platform enables course creation, progress tracking, and certification, wrapped in a responsive and secure application.

![Project Preview](https://via.placeholder.com/800x400?text=Learning+Platform+Preview)

## 🚀 Key Features

### 👨‍🎓 For Students
*   **Course Enrollment**: Browse and enroll in various courses.
*   **Interactive Learning**: View video content and read chapters.
*   **Progress Tracking**: Visual progress bars and completion status.
*   **Certification**: Auto-generated PDF certificates upon 100% course completion.

### 👩‍🏫 For Mentors
*   **Course Management**: Create and structure courses with chapters.
*   **Student Monitoring**: View enrolled students and their progress.
*   **Content Control**: Edit or delete your own courses.
*   **Approval System**: New mentors require Admin approval to ensure quality.

### 🛡️ For Admins
*   **Dashboard Analytics**: View platform statistics (Users, Courses, Chapters).
*   **User Management**: View, delete, or deactivate users.
*   **Mentor Approval**: Review and approve "Pending" mentor accounts.
*   **Platform Control**: Edit or delete any course on the platform.
*   **Direct User Creation**: Add pre-approved Mentors or Students directly.

## 🛠️ Tech Stack

### Frontend
*   **Framework**: React.js (Vite)
*   **Styling**: Tailwind CSS, PostCSS
*   **Routing**: React Router DOM
*   **State**: Context API
*   **HTTP Client**: Axios

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (Mongoose)
*   **Authentication**: JWT (JSON Web Tokens) & Bcrypt
*   **Utilities**: PDFKit (Certificates), Cors, Dotenv

## ⚙️ Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
*   Node.js (v14 or higher)
*   MongoDB (Local or Atlas URI)
*   Git

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/project-name.git
    cd project-name
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    ```
    *   Create a `.env` file in the `backend` directory:
        ```env
        PORT=5000
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret_key
        CLIENT_URL=http://localhost:5173
        ```

3.  **Frontend Setup**
    ```bash
    cd ../frontend
    npm install
    ```
    *   Create a `.env` file in the `frontend` directory:
        ```env
        VITE_API_URL=http://localhost:5000
        ```

### 🏃‍♂️ Running the Project

1.  **Start Backend**
    ```bash
    # In terminal 1 (backend directory)
    npm run dev
    ```

2.  **Start Frontend**
    ```bash
    # In terminal 2 (frontend directory)
    npm run dev
    ```

3.  **Access the App**
    *   Open your browser and navigate to `http://localhost:5173`

## 🧪 Admin Credentials (Default)
If you have a seeded database, use:
*   **Email**: `admin@example.com`
*   **Password**: `admin123`
*(Note: Functionality to create an admin exists in the backend)*

## 📄 License
This project is licensed under the MIT License.
