# 🍣 THARA POS - Japanese Restaurant Point of Sale System
<img width="1920" height="1080" alt="Screenshot (381)" src="https://github.com/user-attachments/assets/2d173d81-0804-4158-8368-94417be7552f" />
> A modern, full-stack Point of Sale (POS) system designed for a Japanese restaurant. This project is a complete revamp of my sophomore year university project, rebuilt with modern web technologies, industry-standard security practices, and containerized database.

## Key Features

### Frontend (Cashier View)
* **Intuitive POS Interface:** Fast and easy-to-use product grid with category filtering.
* **Dynamic Cart Management:** Real-time calculation of totals, quantity updates, and automatic removal of zero-quantity items.
* **Order History:** View past transactions with a nested, expandable modal showing detailed order items.

### Backend (Admin View)
* **Role-Based Access Control (RBAC):** Secure routing and API protection distinguishing between `ROLE_CASHIER` and `ROLE_ADMIN` roles.
* **Menu Management (CRUD):** Add, edit, and delete products dynamically.
* **Multipart Image Upload:** Custom file handling to save product images locally outside the database for better performance.
* **State Availability:** Toggle products as "Available" or "Out of Stock" in real-time.

## Tech Stack

**Frontend:**
* React (Vite)
* Tailwind CSS for responsive and modern UI
* Axios for API communication

**Backend & Infrastructure:**
* Java Spring Boot 3
* Spring Security (JWT Authentication)
* Spring Data JPA (Hibernate)
* MySQL (Containerized via Docker)

---

## Getting Started (Local Development)

To run this project locally on your machine, follow these steps:

### 1. Prerequisites
* Java 17 or higher
* Node.js (v18+)
* Docker & Docker Compose

### 2. Database Setup (Using Docker)
This project uses a containerized MySQL database for easy setup.
1. Open a terminal in the project root directory.
2. Run the following command to start the database:
   ```bash
   docker-compose up -d
   ```
*The docker-compose.yml file will automatically create a database named jp_restaurant on port 3306*

### 3. Backend Setup
1. Open the <kbd>backend</kbd> folder in your IDE (IntelliJ/VS Code).
2. The database configuration in <kbd>src/main/resources/application.properties</kbd> is already set to connect to the Docker container:
    ```Properties
    spring.datasource.url=jdbc:mysql://localhost:3306/jp_restaurant?serverTimezone=UTC
    spring.datasource.username=root
    spring.datasource.password=root
    spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
    ```
3. Run the Spring Boot application. The server will start on http://localhost:8080

### 4. Frontend Setup
1. Navigate to the <kbd>frontend</kbd> directory.
2. Install dependencies:
    ```bash 
    npm install
    ```
3. Start the Vite development server:
    ```bash 
    npm run dev
    ```
4. Open your browser and visit http://localhost:5173

### Default Login Credentials
The system automatically generates default users on the first startup. You can use the following credentials to test the system:

**Admin Role (Full Access):**
* **Username:** `admin`
* **Password:** `admin123`

**Cashier Role (POS Access Only):**
* **Username:** `cashier`
* **Password:** `cashier123`

### Screenshots
Flow Dashboard
![Animation](https://github.com/user-attachments/assets/bc9a043c-40e6-4811-b7d7-ba949c1eab26)

POS Dashboard
<img width="1920" height="1080" alt="Screenshot (381)" src="https://github.com/user-attachments/assets/fd90dd1a-43ee-428b-8aee-f41cf7bdb708" />

Admin Dashboard
<img width="1920" height="1080" alt="Screenshot (382)" src="https://github.com/user-attachments/assets/b4fe8489-fcb6-4775-9421-af97c12000c7" />

Product Form Modal
<img width="1920" height="1080" alt="Screenshot (383)" src="https://github.com/user-attachments/assets/beff52ea-5247-4ceb-a492-c602d91d56e6" />

Login Page
<img width="1920" height="1080" alt="Screenshot (384)" src="https://github.com/user-attachments/assets/26a29a14-5ecc-4034-8175-e15fea310f83" />


### What I Learned
During the revamp of this project, I deeply explored:
* Resolving Hibernate's LazyInitializationException using JOIN FETCH and @Transactional.
* Implementing secure JWT authentication and RBAC in Spring Security.
* Handling multipart/form-data for image uploads via REST APIs.
* Building a clean, state-driven UI with React and Tailwind CSS.
* Using Docker to streamline local database environments.
