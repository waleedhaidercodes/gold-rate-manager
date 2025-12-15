Below is a complete, end-to-end implementation plan for your Gold Investment Tracking Application, reflecting all confirmed decisions:
MongoDB persistence
Manual gold rate entry
Integer-only numeric storage
Multiple intraday rates
One authoritative daily closing rate
30-day closing-rate history
The plan is intentionally execution-oriented and can be followed step by step.

1. Overall Application Architecture
Technology Stack
Frontend: ReactJS
Backend: NodeJS + Express
Database: MongoDB (Mongoose ODM)

Data Rules:
Rates stored as integers (scaled currency)
Weights stored as integers (milligrams)
All calculations integer-safe

2. Data & Business Rules Summary
Gold Rate Rules
Market hours: 2:00 PM – 9:00 PM
Multiple rates allowed per day
Exactly one CLOSING rate per day
Closing rate represents the official rate for that date
Portfolio valuation always uses the latest available closing rate
Rate history view shows last 30 days of closing rates
Unit Conversions
1 Tola = 11.6638038 grams
Grams stored as milligrams (×1000)