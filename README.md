Exam Duty Manager
📝 Description

Exam Duty Manager is a web application that automatically assigns examination invigilation and squad duties to teachers using Excel input data.
The system ensures fair duty distribution, prevents scheduling conflicts, and generates organized reports for easy management.

🚀 Features

📂 Upload teacher and exam data via Excel files

⚡ Automatic duty allocation based on rules

⚖️ Equal distribution of duties among teachers

🚫 Only one duty assigned per teacher per day

👥 Separate handling for Squad and Invigilator roles

📊 Teacher-wise duty list generation

📅 Date & session-wise duty allocation sheet

📥 Export results as Excel or PDF

📥 Input Requirements

The system requires two Excel sheets:

1️⃣ Teacher Details Sheet

Must include:

Serial Number

Teacher Name

Department

Duty Type

"Squad" → Only squad duty

Others → Invigilator

2️⃣ Exam Duty Requirements Sheet

Must include:

Exam Date

Session (FN / AN)

Number of Invigilators Required

Number of Squad Members Required

📊 Output Generated

The system produces two reports:

✅ 1. Teacher-Wise Duty List

Each teacher appears once with all assigned duties listed.

Example:

1  Anitha  Maths    Invigilator   10-03(FN)  15-03(AN)  22-03(FN)
2  Biju    Physics  Squad         10-03(AN)  18-03(FN)
✅ 2. Date & Session-Wise Allocation

Shows which teachers are assigned for each exam session.

Example:

10-03-2026  FN  Invigilator  Anitha  Maths
10-03-2026  FN  Squad        Biju    Physics
⚙️ Installation & Setup
🔹 Prerequisites

Make sure you have installed:

Node.js

npm

🔹 Steps to Run Locally
# Clone the repository
git clone <YOUR_GIT_URL>

# Go to project folder
cd <PROJECT_NAME>

# Install dependencies
npm install

# Run development server
npm run dev
💻 Technologies Used

React

TypeScript

Vite

Tailwind CSS

shadcn-ui

SheetJS (for Excel processing)

🎯 Project Objective

This project aims to simplify exam duty management by:

Reducing manual scheduling work

Ensuring fair duty allocation

Preventing assignment conflicts

Providing clear and downloadable reports

👩‍💻 Author

Developed as an academic project for automating examination duty allocation in educational institutions.

📌 Future Enhancements

Admin login system

Manual duty editing

Conflict detection alerts

Email notifications for teachers
