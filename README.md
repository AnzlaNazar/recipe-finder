# Dishly — AI Prompt Guide

Two tiers:
- **CORE (stages 1–7)** — search, browse, MVVM structure, a real component with real error-handling edge cases.
- **STRETCH (stages 8–14)** — Firebase Auth, per-user favourites, protected routes, logout. 
---

## What this app actually does

**Platform:** web app. React SPA, runs in the browser via Vite's dev server (`npm run dev`), builds to static files (`npm run build`) that deploy to any static host. Not a mobile app — a mobile version (React Native, or wrapping this as an installable PWA) would be a separate build, not something this guide produces.

**Core functionality (done after stage 7):**
- Search recipes by name, live, via TheMealDB
- Home screen auto-loads 20 random recipes on every visit — different set each time
- Recipe cards: thumbnail, name, category, cuisine/area
- Loading and error states on every fetch

**Stretch functionality (done after stage 14):**
- Email/password registration and login (Firebase Auth)
- Save / remove favourite recipes, persisted per logged-in user (Firebase Realtime Database)
- Favourites page — protected, redirects to login if you're signed out
- Clicking "favourite" while signed out redirects you to sign in first
- Logout

---

## CORE

### 1. Project setup

**Initialize app**
> Initialize a new React application using Vite, React, and TypeScript.
> Use functional components only.
> Do not install any UI library.
> Do not add any recipe functionality yet.

**Clean Vite starter**
> Remove all default Vite content, images, styles, and demonstration code.
> Leave a minimal working React application with an empty App component.
> Do not create any additional components or functionality.

### 2. Header

**Create Header**
> Create a reusable Header component.
> The Header should contain:
> - a Home navigation link
> - a Favourites navigation link
> - a search input
> - a Search button
> Use React Router links for navigation.
> Only create and display the Header.
> Do not create the Home or Favourites screens yet.
> Do not connect the search input to any functionality.

**Style Header**
> please can you add styling to the header

### 3. Home MVVM structure

> Create the empty MVVM file structure for the Home screen.
> Create:
> src/pages/Home/HomeModel.ts
> src/pages/Home/useHomeViewModel.ts
> src/pages/Home/HomeView.tsx
> Requirements:
> - HomeModel.ts will later contain Home-specific data and business logic.
> - useHomeViewModel.ts will later contain React state and actions.
> - HomeView.tsx will later render the Home interface.
> Create only minimal placeholder exports so the application can compile.
> Do not add API requests, React state, or recipe UI.

### 4. TheMealDB service

**Empty service file**
> Create a services folder and an empty TheMealDB recipe service file:
> src/services/mealDbService.ts
> Add a short comment explaining that this file will contain communication with TheMealDB API.
> Do not implement the API request yet.

**Implement search**
> Implement the TheMealDB recipe search request inside:
> src/services/mealDbService.ts
> Create an exported async function:
> searchMeals(query: string): Promise<Meal[]>
> Requirements:
> - use TheMealDB API, base URL https://www.themealdb.com/api/json/v1/1/
> - this endpoint uses the shared free test key "1" already in the base URL — no API key env var needed
> - hit search.php?s={query}, encode the search query
> - use the Meal and MealDbSearchResponse types
> - TheMealDB returns { meals: null } when nothing matches — not an error, not a "success: false" flag. Handle that exact shape.
> - return the meals array as Meal[], or an empty array when meals is null
> - throw a readable error when the HTTP request itself fails
> Do not use React hooks.
> Do not use useEffect.
> Do not manage loading, error, or component state.

**Debug logs**
> okay add console logs just to double check if it works

### 5. Home model, view model, and view

**HomeModel**
> Implement the Home model inside:
> src/pages/Home/HomeModel.ts
> Import searchMeals from mealDbService.
> Create and export:
> getMeals(query: string): Promise<Meal[]>
> Responsibilities:
> - trim the query
> - validate that the query contains at least two characters
> - call searchMeals with the cleaned query
> - return the meal list
> Do not use React hooks.
> Do not use useState or useEffect.
> Do not call fetch directly.

**useHomeViewModel**
> Implement a custom hook inside:
> src/pages/Home/useHomeViewModel.ts
> Create and export:
> useHomeViewModel()
> Manage these properties using useState:
> - query
> - meals
> - loading
> - error
> Create a function:
> handleSearch()
> The function should:
> - set loading to true
> - clear the previous error
> - call getMeals from HomeModel using the current query
> - save the returned meal list in meals state
> - store a readable error if the request fails
> - set loading to false when finished
> Return:
> - query
> - setQuery
> - meals
> - loading
> - error
> - handleSearch
> Do not render JSX.
> Do not call fetch directly.
> Do not import mealDbService directly.

**HomeView**
> Implement the Home view inside:
> src/pages/Home/HomeView.tsx
> Requirements:
> - import and use useHomeViewModel
> - connect the Header's search input and button to this view model — we already have search in the Header, don't create a second input
> - call handleSearch when the Header's Search button is clicked or the form is submitted
> - display a loading message while loading is true
> - display the error message when error exists
> - render the meal list using .map()
> - display the meal name, category, area, and thumbnail
> Do not call fetch directly.
> Do not import HomeModel or mealDbService.
> Do not implement favourites yet.
> Do not create a reusable MealCard component yet.

**Initial random recipes**
> Create an initialMeals() function inside HomeModel.
> Requirements:
> - automatically fetch at least 20 meals when the Home screen opens
> - every application launch should display a different selection
> - generate the meal list by randomly selecting search keywords from a predefined seed list (for example: chicken, beef, pasta, rice, soup, cake, salad, fish, curry, pork, vegetarian, breakfast, dessert, seafood, lamb)
> - use Promise.all to execute requests in parallel
> - merge all results into a single array
> - remove duplicate meals using idMeal
> - shuffle the final array
> - return exactly 20 unique meals
> - keep all fetching logic inside HomeModel
> - use the existing mealDbService
> - do not use React hooks
> - do not call fetch directly

### 6. MealCard

> Create a reusable MealCard component.
> Create:
> src/components/MealCard/MealCard.tsx
> Requirements:
> - receive one Meal object through props
> - display:
>   - thumbnail (strMealThumb)
>   - name (strMeal)
>   - category (strCategory)
>   - area (strArea)
> - add a Favourite button, but do not connect it yet
> - use the shared Meal type
> - keep the component presentational
> - do not call APIs
> - do not use Firebase
> - do not manage the meal list
>
> Update HomeView to render MealCard using .map().

### 7. Home reload bugfix

> When I search a recipe and then click Home again, it still shows my search results instead of reloading random recipes. Debug this.

---
## STRETCH (Firebase, Auth, per-user favourites)

### 8. Favourites MVVM structure + Firebase

**Favourites MVVM structure**
> Create the empty MVVM file structure for the Favourites screen.
> Create:
> src/pages/Favourites/FavouritesModel.ts
> src/pages/Favourites/useFavouritesViewModel.ts
> src/pages/Favourites/FavouritesView.tsx
> Create only minimal placeholder exports so the application can compile.
> Do not add Firebase, state, meal cards, or other functionality.

**Configure Firebase**
> Create and configure Firebase for the application.
> Create:
> src/services/firebaseService.ts
> Requirements:
> - initialize Firebase using environment variables
> - export the Realtime Database instance, using getDatabase (not Firestore)
> - do not save or load any favourites yet
> - do not modify HomeView
> - do not add authentication

**Favourites service functions**
> Inside src/services/firebaseService.ts, add functions for managing favourite meals.
> Create:
> - addFavourite(meal: Meal): Promise<void>
> - removeFavourite(idMeal: string): Promise<void>
> - getFavourites(): Promise<Meal[]>
> Requirements:
> - use idMeal as the unique meal identifier
> - keep all Firebase communication inside this service
> - return typed data
> - throw readable errors when operations fail
> - do not use React hooks
> - do not update the UI yet

**FavouritesModel**
> Implement the Favourites model inside:
> src/pages/Favourites/FavouritesModel.ts
> Import the Firebase service functions.
> Create and export:
> - loadFavourites(): Promise<Meal[]>
> - saveFavourite(meal: Meal): Promise<void>
> - deleteFavourite(idMeal: string): Promise<void>
> Requirements:
> - act as a wrapper around firebaseService
> - do not call Firebase directly outside the service
> - do not use React hooks
> - do not manage loading or error state

**useFavouritesViewModel**
> Implement a custom hook inside:
> src/pages/Favourites/useFavouritesViewModel.ts
> Create and export:
> useFavouritesViewModel()
> Manage with useState:
> - favourites
> - loading
> - error
> Create functions:
> - loadMeals()
> - removeMeal(idMeal)
> Requirements:
> - use FavouritesModel only
> - load favourites when the screen opens
> - use useEffect for the initial load
> - update local state after a meal is removed
> - return all state and actions required by FavouritesView
> - do not render JSX
> - do not import firebaseService directly

**FavouritesView**
> Implement the Favourites view inside:
> src/pages/Favourites/FavouritesView.tsx
> Requirements:
> - use useFavouritesViewModel
> - display a loading message while loading
> - display an error message when error exists
> - render favourites using MealCard and .map()
> - show a friendly empty message when there are no favourites
> - allow removing a meal from favourites
> - do not call Firebase directly
> - do not import FavouritesModel directly

**Connect Favourite button on Home**
> when i click the favourite button on a single meal card, nothing happens — it should add that meal as a favourite to the realtime database

### 9. Auth and database config update

> Install Firebase and update the existing Firebase configuration.
> Requirements:
> - initialize Firebase Authentication using getAuth
> - initialize Realtime Database using getDatabase
> - export auth and db
> - read Firebase configuration from Vite environment variables
> - use the modern modular Firebase SDK
> - do not add registration or login UI yet
> - do not add anything new regarding favourites logic yet
> Create or update:
> src/services/firebaseService.ts
> Also create an .env.example file containing placeholder Firebase environment variables.

### 10. Authentication

**authService**
> Create:
> src/services/authService.ts
> Implement and export these functions:
> - registerUser(email: string, password: string)
> - loginUser(email: string, password: string)
> - logoutUser()
> - subscribeToAuthChanges(callback)
> Requirements:
> - use Firebase Authentication
> - use createUserWithEmailAndPassword for registration
> - use signInWithEmailAndPassword for login
> - use signOut for logout
> - use onAuthStateChanged inside subscribeToAuthChanges
> - return typed Firebase User data where appropriate
> - convert Firebase errors into readable messages
> - do not use React hooks
> - do not use useState or useEffect
> - do not render JSX

**Auth MVVM structure**
> Create the MVVM file structure for authentication.
> Create:
> src/pages/Auth/AuthModel.ts
> src/pages/Auth/useAuthViewModel.ts
> src/pages/Auth/AuthView.tsx
> Requirements:
> - add minimal typed placeholder exports
> - ensure the application still compiles
> - do not implement registration or login yet
> - do not add routing yet

**AuthModel**
> Implement src/pages/Auth/AuthModel.ts.
> Import the authentication functions from authService.
> Create and export:
> - register(email: string, password: string)
> - login(email: string, password: string)
> - logout()
> Responsibilities:
> - trim and normalize the email address
> - validate that the email and password are not empty
> - validate that the password contains at least six characters
> - call the corresponding authService function
> - return the authenticated Firebase User
> Do not use React hooks.
> Do not call Firebase Authentication directly outside authService.
> Do not manage UI state.

**useAuthViewModel**
> Implement the useAuthViewModel custom hook inside:
> src/pages/Auth/useAuthViewModel.ts
> Manage these values using useState:
> - email
> - password
> - mode, which can be "login" or "register"
> - loading
> - error
> Create these functions:
> - handleSubmit()
> - toggleMode()
> Requirements:
> - handleSubmit should call AuthModel.login when mode is "login"
> - handleSubmit should call AuthModel.register when mode is "register"
> - clear previous errors before submitting
> - manage the loading state
> - store readable errors
> - clear the password after successful authentication
> - return all state and functions needed by AuthView
> - do not render JSX
> - do not call Firebase directly
> - do not import authService directly

**AuthView**
> Implement src/pages/Auth/AuthView.tsx.
> Requirements:
> - use useAuthViewModel
> - display either "Login" or "Create Account" based on the current mode
> - add a controlled email input
> - add a controlled password input
> - add a submit button
> - disable the submit button while loading
> - display readable validation or Firebase errors
> - add a button for switching between login and registration
> - submit the form using onSubmit
> - prevent the default browser form submission
> Do not call Firebase directly.
> Do not import AuthModel or authService.

**AuthContext**
> Create a global authentication context.
> Create:
> src/context/AuthContext.tsx
> Requirements:
> - use onAuthStateChanged through authService
> - store the current Firebase user
> - store an authLoading state while Firebase restores the session
> - expose:
>   - user
>   - authLoading
>   - logout
> - wrap the application with AuthProvider
> - unsubscribe from the authentication listener when the provider unmounts
> - show a loading state while authentication is being initialized
> - do not add favourites logic

**Move types**
> move types under /types

### 11. Routing and auth UX

**Protected routes**
> Update the application routing.
> Requirements:
> - add an /auth route that displays AuthView
> - allow HomeView to remain publicly accessible
> - protect the /favourites route
> - when an unauthenticated user opens /favourites, redirect them to /auth
> - when an authenticated user opens /auth, redirect them to /
> - preserve the Header on every page
> - use the user and authLoading values from AuthContext

**Unauthenticated favourite click**
> If I am unauthenticated and click the favourite button from the home page, redirect me to the favourites page.

**Move favourite click logic to view model**
> move this to viewModel
(referring to the unauthenticated favourite redirect logic sitting in HomeView)

### 12. Per-user favourites

> Update the existing favourites service so favourites are stored under the signed-in user's profile.
> Use this Realtime DB structure:
> users/{userId}/favourites/{idMeal}
> Update the existing functions so they receive userId:
> - addFavourite(userId: string, meal: Meal)
> - removeFavourite(userId: string, idMeal: string)
> - getFavourites(userId: string)
> Requirements:
> - use userId as the parent user node
> - use idMeal as the favourite node ID
> - preserve the existing function behaviour
> - do not use React hooks
> - do not access auth.currentUser inside the service
> - throw a readable error when userId is missing

### 13. Logout

> add a logout button and connect it to the logout function


### 14. Login & Sign-Up Form UI Improvement

**Purpose:**
>Improve the Login and Sign-Up forms so that the input fields and buttons are centered and visually consistent with the existing Dishly color palette, typography, spacing, and overall application design.

**Key requirements:**

* Center the authentication forms.
* Improve input field and button styling.
* Match the existing Dishly UI.
* Maintain the existing authentication functionality.
* Modify only the relevant files/components.

---

### 15. Dishly Header, Navigation Drawer & Theme Controls

**Purpose:**
>Redesign the application header/navigation structure while preserving all existing functionality.

**Key requirements:**

* Add the Dishly logo and application name.
* Add Home and Favourites navigation.
* Keep the search bar and Search button.
* Add a hamburger navigation drawer.
* Move Dark/Light mode control into the drawer.
* Show Login/Sign Up when logged out.
* Show Logout when logged in.
* Keep authentication options conditional.
* Maintain responsive behavior.
* Preserve existing Firebase, routing, search, and favourites functionality.

---

### 16. Header Layout Refinement

**Purpose:**
>Simplify the header after the initial navigation implementation.

**Key requirements:**

* Remove the separate Home icon from the header.
* Make the Dishly logo clickable and use it to navigate to Home.
* Keep the Favourites icon.
* Move the Favourites icon near the hamburger menu.
* Keep the hamburger menu and its existing functionality.
* Center the recipe search bar and Search button.
* Preserve all existing search, authentication, Firebase, routing, favourites, and theme functionality.
* Keep the layout responsive.

**Target header structure:**

`[Dishly Logo → Home]    [Search Bar + Search]    [Favourites] [Menu]`

---

### 17. Favourites Page Header Removal & Back-to-Home Navigation

**Purpose:**
>Create a cleaner, focused layout for the Favourites page.

**Key requirements:**

* Hide the global header/navbar on the Favourites page.
* Do not display the search bar, hamburger menu, Favourites icon, or authentication controls there.
* Keep the existing Favourites functionality unchanged.
* Add a simple "Back to Home" navigation.
* Use the existing routing/navigation logic.
* Do not create a separate routing system.

---

### 18. Recipe Not Found / Empty Search State

**Purpose:**
>Prevent the application from displaying a blank page when a recipe search returns no results.

**Key requirements:**

* If no recipes are returned, display a clear message such as:
  **"Recipe not found"**
* Optionally display supporting text explaining that the user can try another recipe name.
* Match the existing Dishly UI and color palette.
* Preserve normal search behavior when recipes are found.
* Preserve existing validation behavior.
* Distinguish "no recipe found" from an actual API/network error.
* Do not modify the MealDB integration or unrelated functionality.
* Ensure the empty state works in both Light and Dark modes.
* Verify that searching again for a valid recipe returns normal results.

---

### Development Workflow

GitHub Copilot was initially used for implementation. After its free AI credits were exhausted, Claude was used to continue development using the existing project source code and architecture. All subsequent prompts were focused on targeted fixes and improvements rather than rebuilding the application from scratch.
