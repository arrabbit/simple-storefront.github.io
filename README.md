# simple-storefront
A single-page store app (one index.html) with 5 views: Home, Category, Browse, Single Product, and Cart.

## Project Dependencies
- Tailwind CSS (v3)
- Node.js

## Setup Steps
1. Clone the repo and navigate to the repo folder in  a terminal.
2. Install Tailwind:
```
npm install
```
3. Start the CSS build (this will automatically rebuild with every save):
```
npx tailwindcss -o ./css/output.min.css --minify --watch
```
**Note:** leave the build running in the terminal and open a new terminal for any more git commands
4. `index.html` can now be opened with Live Server.

## Merge conflicts in output.min.css
Because `css/output.min.css` is rebuilt with every save, there may be Git merge conflicts. **Don't fix this conflict by hand.** Do this instead:
1. Rebuild the file to replace the conflicted version:
```
npx tailwindcss -o ./css/output.min.css --minify
```
2. Stage and commit the fixed file (this will finish the merge):
```
git add css/output.min.css
git commit
```
3. Push the finished merge to GitHub:
```
git push
```