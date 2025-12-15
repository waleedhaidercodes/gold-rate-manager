Frontend Development Plan (ReactJS)
Phase 1: Project Setup
Initialize React project (Vite recommended)
Install dependencies:
axios
react-router-dom
state management (Context API or Redux Toolkit)
Setup environment variables:
Backend API base URL

Phase 2: Application Structure
Pages
Dashboard
Investments
Gold Rate Management
Rate History
Shared State
Current gold rate
Investment list
Rate history

Phase 3: Gold Rate Management UI
Add Rate Form
Inputs:
Rate per gram (integer)
Rate type (Intraday / Closing)
Time (auto-filled)
UI behavior:
Warn if adding closing rate twice
Indicate market hours

Phase 4: Rate History (Last 30 Days)
Views
Table view:
Date
Closing rate
Daily change
Percentage change
Optional chart:
30-day trend line
All formatting done from integer values.

Phase 5: Investment Management UI
Add Investment Form
Date picker
Buy rate per gram
Weight input
Unit dropdown (Gram / Tola)
Client-side validation
Investment List
Display:
Invested amount
Current value
Profit/loss
Sorting by:
Date
Profit

Phase 6: Dashboard & Calculations
Dashboard Metrics
Latest closing rate
Total invested
Current portfolio value
Net profit/loss
Calculation Strategy
Fetch closing rate once
Recalculate on:
New investment
Rate update

Phase 7: UX & Reliability
Color-coded profit/loss
Warning if no closing rate exists
Loading & error states
Mobile responsiveness

5. Deployment Plan
Backend
Deploy on Render / Railway / VPS
MongoDB Atlas for database
Environment-based configuration
Frontend
Deploy on Vercel / Netlify
Connect to backend via environment variable

6. Future Enhancements (No Rework Required)
Multi-user authentication
Alerts on target gold price
CSV/PDF export
Historical valuation by date
Advanced analytics and charts