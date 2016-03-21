## Website Performance Optimization portfolio project

### Getting started

#### Re-produce Production Code
```
 $> npm install
 $> gulp
```

#### Part 1: Optimize PageSpeed Insights score for index.html

**Run**
Some useful tips to help you get started:

1. Check out the repository
1. To inspect the site on your phone, you can run a local server

  ```bash
  $> cd /path/to/your-project-folder/dist/
  $> python -m SimpleHTTPServer 8080
  ```

1. Open a browser and visit localhost:8080
1. Download and install [ngrok](https://ngrok.com/) to make your local server accessible remotely.

  ``` bash
  $> cd /path/to/your-project-folder/dist
  $> ngrok http 8080
  ```

1. Copy the public URL ngrok gives you and try running it through PageSpeed Insights!

**Optimization**

1. Using `async` to load js.
2. Inline css, move font link to bottom.
3. Minify html, css, js, images using gulp and gzip (cannot use in gh-page, comment in gulpefile).

#### Part 2: Optimize Frames per Second in pizza.html

**Run**

```
$> cd /path/to/your-project-folder/dist/views/
$> python -m SimpleHTTPServer 8080
```

Open a browser and visit localhost:8080/pizza.html

**Optimization**

1. Only show the mover items that will in window view.
2. Push the items to an array when the items are created, instead of querying items
3. Store left offset to `phaseArray` array for reuse(using %5).
4. using translateX and add `backface-visibility`, `will-change` to css
