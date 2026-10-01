# WasteLess

### Problem Statement:
Households often have unopened or unused food sitting in cupboards that eventually expires and gets thrown away, while local charities and food banks may simultaneously need those same items. There is often no simple way for people to know what nearby organisations need or whether the food they already have could be donated.

### Solution Statement:
Our application helps users track surplus food in their home and matches those items with the current needs of local food banks and charities. Users can see where their food could be donated, prioritise items approaching expiry, and arrange a suitable donation before the food is wasted.

## Overview MVP

- Sign up and Login Screens
- Digital Pantry: Allowing users to manually add food or by scanning a receipt to fill their pantry.
- A dashboard that shows Users long term usage, wastage and donation data analytics.
- A Donation page where users can easily see nearby food banks or charities with matching food requirements to their pantry.

### MVP Wireframe
<img width="1403" height="560" alt="Screenshot 2026-10-01 at 16 31 59" src="https://github.com/user-attachments/assets/8824d785-6e2b-4573-b0dd-2cc27825b289" />

## Getting Started

### Prerequisites (what you need for the app)

- Node.js
- NPM
- Docker desktop
  
### Installation Front end

1. Clone the repository
   
   - Inside your terminal: `git clone` and paste your SHH link.

2. Navigate to the project directory

    - `cd wastless-frontend`

3. Install dependencies
   
   - When inside the root folder.
   - `npm i`

4. Sorting out the IOS emmulator
   
   - Follow the below guide.
   - https://docs.expo.dev/get-started/set-up-your-environment/?mode=expo-go&platform=android&device=simulated

### Installation Back end

- Follow instructions in this repo.
- https://github.com/jtaiwo1/wasteless-backend#wasteless-backend

## Planning and Delivery

### Initial Project time management scope

#### 2 Week Project
2 Sprints

#### Realistically 7 Days of Coding.
Broken down into 4 hr AM and 3 hr PM chunks.

#### Week 1 Sprint 1
Friday 18th: Pitches / Business Case

Monday: AM: Start Coding / PM: Coding

Tuesday: AM: Coding / PM: Coding

Wednesday: AM: Coding / PM: Coding (Mid week mini retro)

Thursday: AM: Coding / PM: Coding

Friday: AM: Coding / PM: Team retro

#### Week 2 Sprint 2

Monday: AM: Coding / PM: Coding

Tuesday: AM: Coding / PM: Coding new Feature Freeze (Mid week mini retro)

Wednesday: AM: Bug fixing and Finalising Coding / PM: Coding Finished 

Thursday: AM: Presentation 1st Dry Run / PM: Implement Feedback

Friday: AM: Presentation 2nd Dry Run / PM: Real presentation 5th floor Stakeholders.

#### Daily Schedule

Morning AM:

9AM / 9:15AM: Group standup 10mins - 15mins

Rest of Morning Coding

12:30PM: Pre Lunch check in / code show and tell
Lunch 1PM

Afternoon PM:

2PM: Coding Sessions

4:30PM: End of day check in / code show and tell

End of day 5PM

### Stakeholder and Risk Analysis

<img width="456" height="444" alt="Screenshot 2026-10-01 at 16 44 14" src="https://github.com/user-attachments/assets/a3082f66-13d0-4b72-8536-3b810868f78c" />

<img width="829" height="443" alt="Screenshot 2026-10-01 at 16 44 24" src="https://github.com/user-attachments/assets/1be791a3-e43c-4393-b840-1e1ddd9cd7c2" />

### Kanban and User Stories

- As a shopper, I want to quickly scan item barcodes or upload receipts, so that my digital pantry updates automatically without manual typing.
- As a shopper, I want to receive alerts about expiring items that match nearby charity needs, so that I can donate them before they go to waste.
- As a shopper, I want to see a map or list of nearby organisations that need my excess food based on my postcode, so that i know exactly where my donations will make an impact.
- As a shopper, I want to easily log whether an item was used, donated or wasted, so that my dashboard metrics stay accurate.
- As a shopper, I want to view a dashboard showing my usage habits and the number of meals I’ve provided, so that I can feel motivated by my positive community impact.
- As a charity volunteer, I want donors to see our specific drop off guidelines, so that we only receive acceptable, safe and manageable food drop offs. (i.e. only dry goods, no fresh meat, drop off at the back of the church)
  
<img width="1400" height="574" alt="Screenshot 2026-10-01 at 16 44 50" src="https://github.com/user-attachments/assets/1c057c71-76fb-4d8b-944c-34c0145de2b0" />

## Test coverage

- We achieved around 93% line coverage averaged across the front and backend of the application, meaning the vast majority of executable lines were exercised by our automated tests.
- On the Front end a line coverage of 91%.

### Testing Tools:
- Jest (Unit and Service testing)
- React Native Testing Library (Screen and Interaction testing
- We focused on key user flows, API behaviour, error handling, state changes, and data-processing logic.

<img width="200" height="200" alt="image" src="https://github.com/user-attachments/assets/95e39206-fd1d-40b9-a1bb-e32a942faf65" />

## Future features

### Accessibility
- Making our app fully compatible for screen readers and other features.
- To ensure that people with visual, auditory and cognitive impairments can use the app.

### Improved Pantry
- Edit individual pantry items.
- Separate pantry screens.
- Receipt scanning using a persons phone camera.

### Improved Donations
- Enable peer-to-peer donations allowing you to donate to other users of the application as well as food banks.

### Digital receipts and supermarket integration
- Stepping away from physical receipts.
- Allowing users to input their digital receipts and supermarket app data.
