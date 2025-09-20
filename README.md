\# 📝 Simple Task Manager



> A lightweight, intuitive task management tool.



---



\## 🌟 Features



\- Add, edit, and delete tasks effortlessly.

\- Mark tasks as completed ✅ and distinguish them visually.

\- Search tasks in real time across all dates 🔍.

\- Organize tasks by date or reorder.

\- Minimal, distraction-free interface for maximum productivity.



---



\## 🛠 Tech Stack



\*\*Backend:\*\*  

\- Laravel 10+  

\- Laravel Sail for local development  

\- Laravel Sanctum for authentication  

\- Repository Pattern (encouraged for maintainability)  

\- Pest PHP for automated testing  



\*\*Frontend:\*\*  

\- NuxtJS 3+ with TypeScript  

\- Tailwind CSS for styling  

\- Pinia for state management  

\- Lucide icons for clean visuals  

\- PNPM package manager  



---



\## 📋 Acceptance Criteria



1\. \*\*Add Tasks\*\*: Enter a task statement → click "Add" → task appears immediately.  

2\. \*\*Toggle Completion\*\*: Mark a task done/undone; visually distinguish completed tasks.  

3\. \*\*View All Tasks\*\*: See all tasks for the selected date, including completed ones.  

4\. \*\*Edit Tasks\*\*: Click task title → update inline → save changes immediately.  

5\. \*\*Delete Tasks\*\*: Click delete icon → confirm → task removed permanently.  

6\. \*\*Search Tasks\*\*: Real-time filtering across all dates.  

7\. \*\*Date Navigation\*\*: Switch dates → task list refreshes automatically.  

8\. \*\*Reorder Tasks\*\*: Drag-and-drop tasks → order saved for next session.



---





\### Backend Setup



cd BackendTaskManagement

cp .env.example .env

composer install

./vendor/bin/sail up -d

./vendor/bin/sail artisan migrate



\### Frontend Setup



cd FrontendTaskManagement

pnpm install

pnpm dev







\## 🔧 Best Practices



\### Backend

\- \*\*Resourceful Endpoints \& Controllers\*\*: Ensure predictable routes and consistent payloads for all CRUD operations.  

\- \*\*Strict Validation\*\*: Validate all incoming data to prevent malformed or malicious requests.  

\- \*\*Consistent JSON Responses\*\*: Centralize transformations using `JsonResource` for uniform API responses.  

\- \*\*Authorization\*\*: Use policies to enforce fine-grained access control separate from controller logic.  

\- \*\*Automated Testing\*\*: Cover key workflows with Pest PHP to ensure reliability and prevent regressions.  

\- \*\*Code Style\*\*: Follow PSR-12 standards for readability, consistency, and maintainability.  



\### Frontend

\- \*\*TypeScript First\*\*: Write components and utilities in TypeScript to catch errors at compile time.  

\- \*\*Utility-First CSS\*\*: Use Tailwind CSS for clean, scalable, and maintainable styling.  

\- \*\*Modular Components\*\*: Build reusable, atomic Vue components following a clear directory structure.  

\- \*\*State Management\*\*: Use Pinia stores to manage shared state predictably and avoid prop drilling.  

\- \*\*Pixel-Perfect Design\*\*: Match designs precisely, including spacing, typography, and color usage.



