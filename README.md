Budget Bytes

Budget Bytes is a simple functional and well accessible financial tracker web application to help you stay on budget and track your finances easily. It was built with vanilla HTML, CSS, and JavaScript.

---

Live Demo

[View the live project here!](https://kellen-mutoni.github.io/finance-tracker/)

(Note: Replace the link above with your actual GitHub Pages URL after deployment.)

---

Key Features

-  Add & Delete Transactions: Easily adds new expenses and removes them from your list.
- Persistent Storage: All data is saved directly in your browser using `localStorage`, so your information is still there when you return.
- Modular Codebase: The JavaScript is organized into separate modules for state management (`state.js`), storage (`storage.js`), and UI manipulation (`ui.js`).
-  Responsive Design: The layout seamlessly transitions from a card-based view on mobile to a full table view on desktop.
-  Live Regex Search: Instantly filter transactions by typing a regular expression into the search bar. Matches are highlighted in real-time.
-  Data Sorting: On desktop view, click the table headers for "Date," "Description," or "Amount" to sort your data.
-  JSON Import & Export: Download all your transaction data to a `.json` file for backup, and import it back into the app at any time.
-  Accessibility: Includes a "Skip to Content" link for keyboard users and ARIA live regions to announce status updates to screen readers.

---

Regex Catalog

The live search bar accepts any valid JavaScript regular expression. Here are a few examples:

-  Simple Text Search:
    -   Pattern: `coffee`
    -   Result: Finds any transaction with the word "coffee" in its description, case-insensitively.
-  Keyword Alternatives:
    -   Pattern: `bus|transport`
    -   Result: Finds transactions containing either the word "bus" OR "transport".

---

Keyboard Navigation Guide

The application is fully navigable using only a keyboard:

-   `Tab`: Move focus to the next interactive element (links, buttons, inputs).
-   `Shift + Tab`: Move focus to the previous element.
-   `Enter`: Activate a focused button or link.
-   "Skip to Content" Link: The very first `Tab` on the page reveals a link to jump directly to the main content, bypassing the header.

---

How to Run Locally

1.  Clone the repository:
    ```bash
    git clone [https://github.com/kellen-mutoni/finance-tracker.git](https://github.com/kellen-mutoni/finance-tracker.git)
    ```
2.  Navigate to the project directory:
    ```bash
    cd finance-tracker
    ```
3.  Open the `index.html` file in your web browser.

---

Built by Ashley Kellen Mutoni.