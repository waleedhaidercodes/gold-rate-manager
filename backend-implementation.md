Backend Development Plan (NodeJS + Express + MongoDB)
Phase 1: Project Initialization
Initialize NodeJS project
Install dependencies:
express
mongoose
dotenv
cors
Setup folder structure:
src/
  models/
  controllers/
  routes/
  services/
  middlewares/
  utils/


Configure environment variables:
MongoDB connection string
Server port

Phase 2: Database Schema Design
Gold Rate Schema

Fields:
ratePerGram (integer)
recordedAt (Date)
rateDate (normalized date)
type (INTRADAY, CLOSING)

Indexes:
(rateDate, type) unique for closing rates
recordedAt descending
Investment Schema

Fields:
purchaseDate
buyRatePerGram (integer)
weightInGrams (integer, milligrams)
originalWeight
originalUnit
timestamps

Pre-save hooks:
Convert unit → grams
Convert grams → milligrams

Phase 3: Core Business Logic
Rate normalization:
Derive rateDate from recordedAt

Closing rate enforcement:
Upsert by rateDate

Market hours validation:
Soft validation between 14:00–21:00
Integer-safe calculation utilities:
Invested amount
Current value
Profit/loss

Phase 4: API Layer
Gold Rate APIs
POST /api/gold-rate

Add intraday or closing rate
GET /api/gold-rate/current
Get latest closing rate
GET /api/gold-rate/history?days=30
Get last 30 days closing rates

Investment APIs
POST /api/investments
GET /api/investments
PUT /api/investments/:id
DELETE /api/investments/:id

Phase 5: Aggregation & Queries
30-day rate history query:
Filter by type = CLOSING
rateDate >= today − 30
Portfolio summary aggregation:
Total weight
Total invested
Current valuation

Phase 6: Validation & Error Handling
Input validation middleware
Centralized error handler
Meaningful API error responses
Graceful fallback when no closing rate exists

Phase 7: Backend Readiness
Enable CORS
Add logging (optional)
Prepare for future authentication support