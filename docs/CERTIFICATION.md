# Certification System Documentation

This document outlines the architecture, issuance, and verification process for the VisualDS certification system at Computer Communications Development Institute (CCDI) Sorsogon.

## 1. Eligibility Criteria
A certificate is issued only when a student achieves 100% mastery of the curriculum. The system evaluates eligibility across three core pillars:

*   **Lessons**: All lecture modules and inline self-checks must be completed.
*   **Simulators**: Every interactive coding challenge (Arrays, Linked Lists, Stacks, Queues, and Trees) must be solved successfully.
*   **Assessments**: A passing score of **75% or higher** must be achieved on all module assessments.

## 2. Issuance Process
The issuance is dynamic and real-time:
1.  **Backend Tracking**: Every progress update (lesson completion, simulator success, assessment score) is persisted in the PostgreSQL database.
2.  **Eligibility Check**:
    *   **Internal**: When a user visits the `/certificate` page, the frontend calls `checkCertificateEligibility`, which aggregates data from the backend.
    *   **Public**: The backend provides a dedicated `GET /public/verify/{userId}` endpoint that re-calculates eligibility server-side to ensure authenticity.

## 3. Rendering & Aesthetics
The certificate is rendered using the **HTML5 Canvas API** to ensure high resolution and consistent layout across all devices.

*   **DPI Scaling**: The canvas is rendered at **3x scale** (3000x2100 pixels) to provide print-quality resolution (300 DPI equivalent) for the downloaded PNG.
*   **Branding**: Incorporates official CCDI Sorsogon typography and a dual-border design (Indigo and Gold).
*   **Client-Side Generation**: Rendering happens in the browser to allow for real-time inclusion of the student's full name and the current issuance date.

## 4. Tamper Protection
To prevent fraudulent certificate generation or modification, several layers of protection are implemented:

*   **Canvas Rendering**: Unlike HTML/CSS based certificates which can be easily edited via browser "Inspect Element," the canvas is a flat bitmap. Modifying the text would require advanced image editing.
*   **Server-Side Source of Truth**: The "Completed" state is never stored as a simple boolean that a user can flip. It is a **computed state** derived from hundreds of individual progress records in the database.
*   **Public Verification Hash**: Each certificate contains a unique QR code linked to the student's internal UUID.

## 5. QR Verification Workflow
The verification process allows third parties (e.g., employers) to validate a certificate's authenticity:

1.  **Scanning**: Scanning the QR code redirects the user to `https://visualds.vercel.app/verify/{userId}`.
2.  **Public Verification Route**: This route is publicly accessible and does not require a login.
3.  **Real-Time Validation**: The page calls the backend `public/verify` endpoint. The backend queries the database for that specific User ID and checks if they actually met the completion criteria.
4.  **Proof of Mastery**: If valid, the system displays an "Official Verified Certificate" badge alongside the student's name and progress details. If any criteria are not met, the verification fails, preventing the use of fake or incomplete certificates.
