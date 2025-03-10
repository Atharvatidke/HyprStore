# HyprStore

# HyprStore

HyprStore is a quick commerce application that allows users to browse groceries and electronics, add items to their cart, and complete their orders seamlessly.

## Prerequisites
Before you begin, ensure you have the following installed on your system:

- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)
- **Git**

## Installation Steps
Follow these steps to get the application running on your local machine:

### 1. Clone the Repository
First, create and navigate to a folder for the project:
```
mkdir HyprStore
cd HyprStore
```
Then, clone the repository:
```
git clone https://github.com/Atharvatidke/HyprStore.git .
```

### 2. Install Dependencies
You need to install dependencies for both the backend and frontend components:

- Install root-level dependencies (if any):
  ```sh
  npm install
  ```
- Install backend dependencies:
  ```sh
  cd backend
  npm install
  ```
- Install frontend dependencies:
  ```sh
  cd ../frontend
  npm install
  ```

### 3. Environment Setup
The necessary `.env` file is already included in the repository with MongoDB connection settings. No additional configuration is needed for the database connection.


### 4. Running the Application

#### Start the Backend Server
- Navigate to the backend folder (if you're not already there):
  ```
  cd backend
  ```
- Start the development server:
  ```
  npm run dev
  ```
- The backend server will run on: **http://localhost:5000**

#### Start the Frontend Server
- Open a new terminal window and navigate to the frontend folder:
  ```
  cd frontend
  ```
- Start the frontend development server:

  **npm start**

- The frontend will launch automatically in your default browser at: **http://localhost:3000**


## Using the Application
- Create a new account or log in with existing credentials.
- Add items to your cart.
- View your cart contents.
- Proceed to checkout and complete your order.

## Contributing
Contributions are welcome! If you'd like to contribute, please fork the repository and submit a pull request.

## License
This project is licensed under the [MIT License](LICENSE).

