# TaskFlow - Professional Task Management System

A stunning, modern, and professional React frontend for a Task Management System with smooth animations, beautiful UI, and exceptional UX.

## 🚀 Features

- **Modern UI/UX**: Beautiful glassmorphism design with dark mode as default
- **Smooth Animations**: Powered by Framer Motion for delightful interactions
- **Responsive Design**: Works perfectly on all devices (mobile, tablet, desktop)
- **Advanced Task Management**: Create, edit, delete, and track tasks with priority and status
- **Real-time Search & Filtering**: Instantly find tasks with debounced search
- **Dashboard Statistics**: Visualize your productivity with beautiful charts
- **Secure Authentication**: JWT-based authentication with protected routes
- **Performance Optimized**: Lazy loading, memoization, and virtualized lists

## 🛠️ Tech Stack

- **React 18+** with Hooks
- **React Router v6** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hook Form** for form handling
- **React Toastify** for notifications
- **Lucide React** for icons
- **Date-fns** for date formatting

## 🎨 Design Highlights

- **Glassmorphism UI**: Subtle backdrop blur effects
- **Dark Mode**: As default with optional light mode toggle
- **Gradient Accents**: Vibrant purple/blue gradients for CTAs
- **Micro-interactions**: Button ripples, card lifts on hover
- **Professional Typography**: Clean hierarchy with multiple font weights
- **Neumorphism Elements**: For input fields and cards

## 📁 Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Badge.jsx
│   │   ├── Loader.jsx
│   │   └── ...
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── Layout.jsx
│   ├── tasks/
│   │   ├── TaskCard.jsx
│   │   ├── TaskList.jsx
│   │   ├── TaskModal.jsx
│   │   ├── TaskStats.jsx
│   │   └── TaskFilters.jsx
│   └── auth/
│       ├── LoginForm.jsx
│       └── SignupForm.jsx
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   └── Profile.jsx
├── context/
│   ├── AuthContext.jsx
│   ├── TaskContext.jsx
│   └── ThemeContext.jsx
├── hooks/
│   ├── useApi.jsx
│   ├── useDebounce.jsx
│   └── useLocalStorage.jsx
├── utils/
│   ├── axios.js
│   ├── constants.js
│   └── helpers.js
├── App.jsx
└── main.jsx
```

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

## 🚀 Running the Application

- Development: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`

## 🌐 API Integration

The frontend connects to the backend API at `/api` endpoint. Make sure your backend server is running on the configured port (default: 5000).

## 🎯 Key Functionality

- **Authentication**: Secure login and registration
- **Task Management**: Create, update, delete, and track tasks
- **Filtering & Sorting**: Filter by status, priority, and sort tasks
- **Dashboard**: Visualize productivity metrics
- **Profile Management**: Update personal information and preferences

## 🎭 User Experience

- **Page Transitions**: Smooth animations between views
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: Friendly error messages and validation
- **Empty States**: Beautiful illustrations and guidance
- **Success Feedback**: Animated checkmarks and notifications

## 📱 Responsive Design

- Mobile-first approach
- Collapsible sidebar for smaller screens
- Touch-friendly controls
- Optimized layouts for all device sizes

## 🛡️ Security

- JWT token stored in localStorage
- Protected routes with authentication checks
- Secure API communication
- Input validation and sanitization

## 📈 Performance

- Code splitting by route
- Lazy loading of components
- Memoization with useMemo and useCallback
- Optimized rendering with virtualized lists

## 🎨 Customization

The design uses a consistent color palette and can be easily customized:

- Primary colors: Purple/Blue gradients
- Status colors: Red/Yellow/Green for different states
- Dark mode as default with optional light mode

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ using React, Tailwind CSS, and Framer Motion