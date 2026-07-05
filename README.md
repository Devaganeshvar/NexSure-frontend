# 🛡️ NexSure - Advanced Insurance Policy Management System

![NexSure Banner](https://img.shields.io/badge/NexSure-Insurance_Management-0f172a?style=for-the-badge)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)

## 📖 Project Overview
NexSure is a modern, responsive, and highly intuitive frontend web application designed to streamline the management of insurance policies. It provides distinct, feature-rich dashboards tailored to three distinct user roles: **Customers, Insurance Officers, and Administrators**. The platform ensures a seamless, transparent, and efficient process for purchasing policies, processing claims, managing users, and generating analytical reports.

## 🎯 Project Description & Objectives
The core objective of NexSure is to modernize the traditional, paper-heavy insurance workflow by bringing it into a secure digital environment.
- **For Customers**: Provide an easy-to-use portal to browse plans, calculate premiums, purchase policies via a streamlined wizard, and track active claims.
- **For Officers**: Offer a centralized dashboard to review and approve/reject claims, verify KYC documents, and monitor customer requests.
- **For Administrators**: Equip system admins with a high-level overview of business KPIs, user management, and system configurations.

## ✨ Key Features & Functionalities
- **Multi-Role Dashboards**: Specifically tailored interfaces for Customers, Officers, and Admins.
- **7-Step Policy Application Wizard**: A seamless, intuitive wizard guiding users from plan selection to payment and document upload without friction.
- **Real-Time Payment Integration**: Users can instantly pay premiums and overdue payments safely.
- **Dynamic Policy & Claim Tracking**: Real-time status badges for pending, approved, or rejected claims and policies.
- **Data-Rich Analytics**: Interactive charts and data tables for monitoring KPIs (claims processed, revenue generated, new signups).
- **Global Theme & Accessibility**: Built-in Light/Dark mode toggle and accessibility features.
- **Localization**: Built-in Google Translate integration (English & Tamil) linked to App Preferences.

## 🛠 Technologies Used
- **Core Structure**: HTML5
- **Styling**: Vanilla CSS3, Bootstrap 5.3, Font Awesome (Icons)
- **Logic & Interactivity**: JavaScript (ES6+), DOM Manipulation, Web Storage API
- **External Integrations**: Razorpay API, Google Calendar API, Google Translate API
- **Fonts**: Google Fonts (Inter, Playfair Display)

## 📁 Project Folder Structure
```text
NexSureFrontEnd/
├── .vs/                    # IDE Specific Files
├── assets/                 # Global assets
│   ├── css/                # Global stylesheets (e.g., admin.css, bootstrap.css)
│   ├── images/             # Static images, logos, and placeholders
│   └── js/                 # Global scripts (bootstrap.bundle.js, admin.js)
├── features/               # Feature-based modular directories
│   ├── auth/               # Login, Register, Forgot Password
│   ├── customer-dashboard/ # Main customer portal
│   ├── help-center/        # Support and contact pages
│   ├── payment/            # Payment gateway screens
│   ├── plan-listings/      # Browse available insurance plans
│   ├── policy-management/  # Claims, cancellations, and renewals
│   ├── policyholder-details/# 7-Step Application Wizard & Success flows
│   ├── profile/            # User settings, localization, and theme preferences
│   ├── reports/            # Data analytics and KPI reports
│   └── shared/             # Shared components (Navbars, integrations, mock DB)
└── README.md               # Project documentation
```

## 🚀 Installation & Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Devaganeshvar/NexSure-frontend.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd NexSure-frontend
   ```
3. **No Build Steps Required:**
   Since this is a static frontend application, there is no need to run `npm install` or configure a complex build pipeline.

## 💻 How to Run the Application
1. **Local File System**: Simply open the `features/auth/login.html` file in any modern web browser (Chrome, Edge, Firefox, Safari).
2. **Live Server (Recommended)**: For the best experience (and to prevent any CORS issues with local assets), use a local development server. 
   - If using **VS Code**, install the "Live Server" extension, right-click `features/auth/login.html`, and select "Open with Live Server".

## 🔑 Demo Credentials
Use the following credentials on the Login page to access the different roles and test the application workflows:

| Role | Email Address | Password | Description |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@imps.in` | `Admin@123` | Full access to system configurations, global reports, and user management. |
| **Officer** | `kavitha@imps.in` | `Deva@2005` | Access to verify KYC, approve/reject claims, and monitor policyholder activity. |
| **Customer** | `devaganeshvar@gmail.com` | `Deva@2005` | Standard user access to browse plans, buy policies, pay premiums, and file claims. |

## 🔄 Complete Application Workflow
1. **Authentication**: Users log in and are routed to their respective dashboard based on their role (`customer`, `officer`, or `admin`).
2. **Plan Discovery (Customer)**: Customers navigate to the Plans page, compare coverage, and select a policy.
3. **Application (Customer)**: The 7-Step Wizard collects personal details, health information, nominees, and processes payment.
4. **Verification (Officer)**: The Officer dashboard alerts the officer to new KYC submissions and applications for manual review.
5. **Claim Processing**: Customers file a claim → Officer reviews documentation → Claim is marked Approved/Rejected.
6. **Management & Oversight (Admin)**: Admins view high-level statistics and ensure the system operates smoothly.

## 🧩 Module-Wise Explanation
- **Landing Page**: Public-facing page explaining the benefits of NexSure with call-to-action buttons.
- **Customer Dashboard**: Displays active policies, pending payments, and recent claims.
- **Insurance Officer Dashboard**: Work queue for pending approvals, KYC verifications, and customer management.
- **Admin Dashboard**: System-wide analytics, bulk import tools, role management, and audit logs.
- **Help Center**: FAQs, contact forms, and support ticket tracking.
- **Payment Portal**: Dedicated page for handling overdue and renewal premiums securely.

## 👥 User-Wise Features and Permissions
- **Customer**: Can *Create* applications, *View* their own policies, *Update* their profile, *File* claims, and *Pay* premiums. Cannot see other users' data.
- **Insurance Officer**: Can *View* assigned customer applications, *Approve/Reject* claims and KYC, and *Generate* officer-level reports. Cannot modify system settings.
- **Admin**: Can *View* everything, *Manage* officers and customers, *Access* system backups, and *View* financial KPIs. 

## 🔌 External API Integrations
The application seamlessly integrates several external tools directly into the UI:
1. **Razorpay Integration**: 
   - **Where**: `features/payment/payments.html`
   - **Usage**: When a user clicks "Pay Now" or "Pay Premium", a mock Razorpay checkout modal appears. Upon success, the UI dynamically updates to "Paid" without reloading the page, preserving the workflow.
2. **Google Translate**:
   - **Where**: Configured via `features/profile/settings.html` (App Preferences) and injected globally via `features/shared/theme-manager.js`.
   - **Usage**: Users can select "English" or "Tamil" in their preferences. The selection sets a configuration cookie that automatically translates the entire application UI dynamically.
3. **Google Calendar**:
   - **Where**: `features/policy-management/my-policies.html` and `features/policyholder-details/success.html`.
   - **Usage**: Automatically generates "Add to Calendar" links for Policy Expiry dates and Next Premium Due dates, helping customers easily set reminders.

## 🧠 Business Logic and Application Flow
The frontend heavily utilizes JavaScript to simulate backend interactions:
- **Authentication Guard**: `auth-guard.js` checks `localStorage` for a valid user session. If unauthenticated, users are forced back to the login page.
- **Mock Database**: `mock-db.js` serves as an in-memory data store for claims, policies, and users to demonstrate functional tables and charts.
- **Dynamic Routing**: Role-based redirection upon successful login ensures users land on the correct dashboards.

## 📱 Responsive Design and Accessibility Features
- **Mobile-First Approach**: Built entirely on Bootstrap's grid system, ensuring flawless rendering on desktops, tablets, and smartphones.
- **Accessibility (a11y)**: Includes high-contrast text options, ARIA labels for screen readers, and keyboard navigation support (`focus-trap.js`).
- **Theming**: A robust global Light/Dark mode toggle that respects user OS preferences.

## 📸 Screenshots
*(Note: Replace placeholder image paths with actual screenshots once hosted)*

| Customer Dashboard | 7-Step Policy Wizard |
|:---:|:---:|
| ![Customer Dashboard](assets/images/placeholders/dashboard-preview.png) | ![Wizard](assets/images/placeholders/wizard-preview.png) |

| Officer Portal | Payment Integration |
|:---:|:---:|
| ![Officer](assets/images/placeholders/officer-preview.png) | ![Payment](assets/images/placeholders/payment-preview.png) |

## 🚧 Known Limitations
- The application is purely frontend-based. Data changes (like buying a policy or changing a password) will reset if `localStorage` is cleared or the browser is hard-refreshed, as there is no persistent backend database.
- The Razorpay payment modal runs in test/mock mode and does not process real transactions.

## 🔮 Future Enhancements
- Integration with a full Node.js/Express or .NET Core backend.
- Persistent PostgreSQL database for actual data retention.
- Real-time WebSockets for instant officer-to-customer chat support.
- PDF Generation for Policy Certificates directly from the browser.

---
*Built with ❤️ for a seamless insurance experience.*
