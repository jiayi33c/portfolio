# How to Make Your Portfolio Public

## Option 1: GitHub Pages (Free & Easy)

Since you already have a git repository, follow these steps:

### Step 1: Push your files to GitHub
```bash
git add .
git commit -m "Complete portfolio website"
git push origin main
```

### Step 2: Enable GitHub Pages
1. Go to your GitHub repository on github.com
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** (in the left sidebar)
4. Under **Source**, select **Deploy from a branch**
5. Choose **main** branch and **/ (root)** folder
6. Click **Save**
7. Wait a few minutes, then your site will be live at:
   `https://yourusername.github.io/portfolio`

## Option 2: Netlify (Free, Drag & Drop)

1. Go to [netlify.com](https://netlify.com)
2. Sign up/login (can use GitHub account)
3. Drag your entire `portfolio` folder onto the deploy area
4. Your site is instantly live! You'll get a URL like:
   `https://random-name.netlify.app`
5. You can rename it to something nicer in settings

## Option 3: Vercel (Free, Similar to Netlify)

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login (can use GitHub account)
3. Click **Add New Project**
4. Import your GitHub repository or upload the folder
5. Deploy! You'll get a URL like:
   `https://portfolio-xyz.vercel.app`

## Recommended: GitHub Pages
Since you're already using GitHub, this is the easiest option. Just push your files and enable Pages!

## Custom Domain (Optional)
All these services let you add a custom domain later (like `chenjiayi.com`) if you want.

