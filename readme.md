# DalJS :: Easy-Peasy Development

Use only HTML to create dynamic applications in a jiffy.

## Getting Started

[Download DalJS](https://github.com/dallas22ca/daljs/archive/master.zip) and open up `examples/basic.html` in your browser - then look at the source code!

## Todo
- Update straggling has_manys.
- Firebase it.

## Compiling & Minifying

1. `gem install uglifier`
2. `cd daljs`
3. `irb`
4. `daljs = Uglifier.compile( Dir.glob(["lib/dependencies/*", "lib/*"]).map{|f| File.directory?(f) ? nil : File.read(f)}.join("\n"), comments: :none)`
5. `File.open("dal.min.js", 'w') { |file| file.write(daljs) }`