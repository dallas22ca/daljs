# DalJS :: Easy-Peasy Development

## What does DalJS do?

Create dynamic applications in a jiffy... without PHP, JS, Ruby, Python... just pure HTML.

For a little more detail, have a peek at the examples:
- [Basic](https://rawgithub.com/dallas22ca/daljs/master/examples/basic.html)
- [Edge (features in progress)](https://rawgithub.com/dallas22ca/daljs/master/examples/edge.html)

## If you're really serious...
Visit [DalJS.org](http://daljs.org).

## Todo
- Add localStorage.
- User login.
- Firebase it.
- Validations.
- URL support.

## How to Minify (for maintainers)

1. `gem install uglifier`
2. `cd daljs`
3. `irb`
4. `require 'uglifier'`
5. `daljs = Uglifier.compile( Dir.glob(["lib/dependencies/*", "lib/*"]).map{|f| File.directory?(f) ? nil : File.read(f)}.join("\n"), comments: :none)`
6. `File.open("dal.min.js", 'w') { |file| file.write(daljs) }`
7. `Update CDN if necessary.`