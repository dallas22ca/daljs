# DalJS :: Easy-Peasy Development

## What does DalJS do?

Create dynamic applications in a jiffy... without PHP, JS, Ruby, Python... just pure HTML.

For a little more detail, have a peek at the examples:
- [Basic](https://rawgithub.com/dallas22ca/daljs/master/examples/basic.html)
- [Edge (features in progress)](https://rawgithub.com/dallas22ca/daljs/master/examples/edge.html)

DalJS is not a JS library that you use... you just include it and then write HTML.

This means you can literally email someone an HTML file that contains a completely usable web app!

Our next step is to integrate with Firebase. This'll let us have real time data and a secure remote DB connection.

## How does it work?

When the page loads, DalJS examines your HTML, builds out DB tables and relationships, and compiles your app on the fly.

## How do I use it?

Create a new text file on your desktop, call it index.html, and fill it with this (also found at example/barebones.html):

```
<!DOCTYPE html>
<html>
  <head>
    <title>My App</title>
    <script src="https://raw.github.com/dallas22ca/daljs/master/dal.min.js"></script>
  </head>
  <body>
    <form for="Thing">
      <input name="body" placeholder="Body" refocus><br>
      <input type="submit">
    </form>
    <ul collection="Things"></ul>
  </body>
  <daltemplate name="Thing">
    <li>{{ body }}</li>
  </daltemplate>
</html>
```

Open your file in your favourite web browser and watch the magic happen!

Have a peek at your JS console to see a little more of what's going on behind the scenes.

## Documentation
- Visit [DalJS.org](http://daljs.org).

## Todo
- Update straggling has_manys.
- Firebase it.
- Validations.
- User login.
- URL support.

## How to Minify (for maintainers)

1. `gem install uglifier`
2. `cd daljs`
3. `irb`
4. `require 'uglifier'`
5. `daljs = Uglifier.compile( Dir.glob(["lib/dependencies/*", "lib/*"]).map{|f| File.directory?(f) ? nil : File.read(f)}.join("\n"), comments: :none)`
6. `File.open("dal.min.js", 'w') { |file| file.write(daljs) }`
7. `Update CDN if necessary.`