# **Warranty Management System**  

## **📌 Overview**  
The **Warranty Management System** is a web application designed to **track, manage, and process product warranty claims** efficiently. It includes **user authentication, role-based access control, product registration, claim submission, and account management**.

## 🚀 **Functions of the Application**  

### 🔑 **Authentication & User Management**  
- **User Registration:** New users can create an account with a username and password.  
- **User Login:** Authenticates users using JWT tokens and grants access to their specific data.  
- **User-Specific Data Access:** Ensures each user only sees and manages their own warranty claims.  
- **Logout:** Securely logs out the user by clearing authentication tokens.  
- **(Upcoming in V2) Email Authentication:** Users will be able to verify their accounts via email and reset their passwords if forgotten.  

### 📋 **Warranty Management**  
- **View Warranty Claims:** Displays all warranty claims submitted by the logged-in user in a structured table.  
- **Add New Warranty Claim:** Users can submit claims, specifying:  
  - **Part Number**  
  - **Description of Issue**  
  - **Quantity Affected**  
  - **Cause of Failure**  
- **Delete Warranty Claim:** Provides an option to remove warranty claims with a confirmation message.  
- **Search & Filter Claims:** Users can search claims based on multiple criteria using a dynamic filter button.  

### 🔍 **Product Registration & Search**  
- **Register a Product:** Users can submit product details such as:  
  - **Owner Information**  
  - **Dealer Details**  
  - **Purchase Date**  
  - **Product Usage Information**  
- **Search by Serial Number:** A dedicated search page allows users to look up product details by entering a serial number.  
- **Autocomplete Suggestions:** While typing a serial number, users will see suggestions from the database.  
- **Serial Number Normalization:** Serial numbers are stored with hyphens (e.g., `915-662-335`) but can be searched flexibly.  

### 📁 **File Upload & Attachments**  
- **Attach Files to Claims:** Users can upload supporting documents (e.g., receipts, images, PDFs) for their claims.  
- **(Upcoming in V2) File Management System:** A dedicated file storage and retrieval system for better file organization and access.  

### 🖥️ **UI & Navigation**  
- **Navigation Bar:**  
  - When logged in: Displays relevant links, search functionality, and a logout button.  
  - When logged out: Shows minimal UI with only login and registration options.  
- **Redirection Handling:**  
  - If a logged-in user tries to access login or registration, they are redirected to the home page.  
  - After submitting a claim, users see a success message, and the page refreshes after 3 seconds.  

### 🛠️ **Backend & API Handling**  
- **JWT Authentication:** Ensures secure login and user data protection using JSON Web Tokens.  
- **SQLite3 Database:** Stores warranty claims, product registrations, user credentials, and more.  
- **REST API Integration:**  
  - Fetches user-specific data securely.  
  - Handles CRUD operations for warranty claims and product registrations.  

### **🔹 UI & UX Enhancements**  
✔ **Modern & Professional Styling with CSS**  
✔ **Login & Registration Page Animation**  
✔ **Accordion Table for Claim Details**  
✔ **Navigation Bar with Dynamic Links Based on Login Status**  

## **🛠️ Tech Stack**  
- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js, Express.js, SQLite3  
- **Authentication:** JWT
---

### 🌟 **Planned Features for V2**  
- **📧 Email Authentication & Password Reset**  
  - Users will receive email verification links upon registration.  
  - Password reset functionality via email.  
- **📂 File Management System**  
  - Users can manage uploaded files, view history, and delete attachments.  
- **📊 Advanced Data Filtering & Analytics**  
  - More in-depth search, filtering, and reporting capabilities. 


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
