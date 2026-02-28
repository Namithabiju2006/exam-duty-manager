# 🎓 EXAM DUTY MANAGER


📝 Description

Exam Duty Manager is a web-based application designed to automate the allocation of examination invigilation and squad duties for teachers. It processes Excel input data to generate fair, balanced, and conflict-free duty schedules, providing both teacher-wise and date/session-wise reports for efficient exam management.

Project URL

https://dutygen.lovable.app/

🚀 Features

📂 Upload teacher and exam data via Excel files

⚡ Automatic duty allocation based on rules

⚖️ Equal distribution of duties among teachers

🚫 Only one duty assigned per teacher per day

👥 Separate handling for Squad and Invigilator roles

📊 Teacher-wise duty list generation

📅 Date & session-wise duty allocation sheet

📥 Export results as Excel or PDF
## ⚙️ How It Works

1. Upload teacher details Excel sheet
2. Upload exam schedule sheet
3. Click "Generate Duty Allocation"
4. System assigns duties fairly
5. Download reports

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

PROJECT SCREENSHOTS


<img width="1897" height="740" alt="01" src="https://github.com/user-attachments/assets/2814f82a-40e5-4cdf-a05b-7c5f82b69e28" />

<img width="1850" height="897" alt="02" src="https://github.com/user-attachments/assets/ab76e08b-0e42-42f8-8563-6f4a6c7183eb" />

<img width="1836" height="870" alt="03" src="https://github.com/user-attachments/assets/77e77957-2e08-4b11-9545-69f3e416cafe" />

<img width="1628" height="818" alt="04" src="https://github.com/user-attachments/assets/0cecdbcc-ac31-44b9-a26b-9bc50e7a63e2" />

<img width="905" height="806" alt="05" src="https://github.com/user-attachments/assets/dc087f9c-edc3-485f-acdb-7c00dbf28907" />



Installation & Setup

Prerequisites

- Node.js
- npm

Run Locally

git clone <YOUR_GIT_URL>
cd <PROJECT_NAME>
npm install
npm run dev

Technologies Used

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

📂 Project Structure

exam-duty-manager/
│
├── src/                # Main source code
│   ├── components/     # Reusable UI components
│   ├── pages/          # Application pages/screens
│   ├── utils/          # Helper functions (Excel parsing, duty logic)
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
│
├── public/             # Static assets
├── package.json        # Project dependencies
├── vite.config.ts      # Vite configuration
└── README.md           # Project documentation

👩‍💻 Author

Developed as an academic project for automating examination duty allocation in educational institutions.

📌 Future Enhancements

Admin login system

Manual duty editing

Conflict detection alerts

Email notifications for teachers
