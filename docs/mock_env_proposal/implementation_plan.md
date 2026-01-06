# Implementation Plan - Meeting Room Reservation Mock & Env Guide

## Goal Description
Build a "Meeting Room Reservation System" mock application to demonstrate to a third party.
Simultaneously, establish a "Repository & Environment Configuration" guide that is easy for IT juniors to understand and use.

## User Review Required
- [ ] **Screen Flow**: Confirm the proposed screen transitions and layout.
- [ ] **Role Definition**: Confirm the roles (Applicant, Approver, Admin, Observer) are correctly mapped.

## Proposed Changes

### 1. Screen Composition (Japanese Interface)

#### Common
- **Login / Role Select**: Simple screen to switch between roles for demo purposes.

#### A. Applicant (Member/Employee) - Single Page Experience
- **Dashboard (Main View)**
    - **Header**: Simple user info & logout.
    - **Availability View**: Responsive Calendar (Calendar view on PC, List view on Mobile).
    - **FAB (Floating Action Button)**: "New Reservation" (Mobile only).
- **Reservation Action (Modal/Drawer)**
    - *Triggers*: Clicking a slot or FAB.
    - **UI**: Slide-up Drawer (Mobile) / Center Modal (PC).
    - **Content**: Form inputs. No page reload.
- **Reservation Detail (Modal/Drawer)**
    - *Triggers*: Clicking an existing reservation.
    - **Content**: Details, QR Code, Edit/Cancel buttons.

#### B. Approver (Manager) - Single Page Experience
- **Approver Dashboard**
    - **List View**: "Inbox" style list of pending requests.
- **Review Action (Modal/Drawer)**
    - *Triggers*: Clicking a pending item.
    - **Content**: Details + Approve/Reject buttons.
    - **Transition**: Returns to list immediately after action.

#### C. Observer (Monitoring)
- **Status Monitor**
    - Read-only view of the "Availability Calendar" and "Booking List".
    - Filter by Room or Date.

#### D. System Admin (Background)
- **Admin Dashboard**
    - **Audit Log**: Who did what and when.
    - **User Import**: Bulk CSV upload interface.

### 2. Mock Application Structure (Refined)
Initialize a new Next.js project with the following structure:
```text
/src
  /app          (Routes: /login, /dashboard, /reservation)
  /components
    /ui         (Buttons, Cards, Inputs - Atomic design elements)
    /features   (RoomCard, BookingForm - Complex components)
    /layout     (Header, Sidebar)
  /lib          (Mock data functions, utils)
  /types        (TypeScript interfaces)
```

#### Key Features to Mock
- **Login Page**: Visual only, any input works.
- **Dashboard**: View list of rooms and current availability (Mock data).
- **Reservation Modal**: Form to "book" a room (Updates local state/mock data).

### 3. Visual Design (Premium)
- Use a modern, clean palette (Soft grays, clear accent colors for availability).
- Responsive, interactive elements (Hover effects, smooth transitions).

## Verification Plan
### Automated Tests
- Run `npm run build` to ensure no type errors.
- Check easy startup: `npm run dev` should work immediately.

### Manual Verification
- Walkthrough the "Junior Guide" steps to verify clarity.
- Demonstrate the Mock App flow: Login -> Dashboard -> Book Room -> Success.

