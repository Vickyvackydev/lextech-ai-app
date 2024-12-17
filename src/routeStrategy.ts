/** 
 * An array of routes that are accessible without authentication
 * These routes are not protected
 * @type {string[]}
 */

export const publicRoutes = [

    "/new-verification",
]





/** 
 * An array of routes that are accessible for authentication
 * These routes will redirect logged in users to "/"
 * @type {string[]}
 */

export const authRoutes =[
    "/sign-in",
    "/sign-up",
    "/error",
    "/forgot-password",
    "/create-new-password",
]





/** 
 * The prefix for API auth routes
 * These routes are used for API auth purposes
 * @type {string[]}
 */

export const apiAuthPrefix = "/api/auth"






/** 
 * The default route to redirect users to after login
 * These routes are used for API auth purposes
 * @type {string[]}
 */

export const DEFAULT_LOGIN_REDIRECT = "/"




