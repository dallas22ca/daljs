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

Create a new text file on your desktop, call it index.html, and fill it with this:

```
<!DOCTYPE html>
<html>
  <head>
    <title>App</title>
    <script src="https://raw.github.com/dallas22ca/daljs/master/dal.min.js"></script>
  </head>
  <body>
    <form for="Contact">
      <input name="name" placeholder="Name" shortcut="f" refocus><br>
      <input name="birthday" placeholder="Birthday"><br>
      <input type="submit">
    </form>
    <ul collection="Contacts"></ul>
  </body>
</html>
```

Watch the magic happen!

## Todo
- Update straggling has_manys.
- Firebase it.
- URL support.

## Compiling & Minifying the Source File

1. `gem install uglifier`
2. `cd daljs`
3. `irb`
4. `require 'uglifier'`
5. `daljs = Uglifier.compile( Dir.glob(["lib/dependencies/*", "lib/*"]).map{|f| File.directory?(f) ? nil : File.read(f)}.join("\n"), comments: :none)`
6. `File.open("dal.min.js", 'w') { |file| file.write(daljs) }`