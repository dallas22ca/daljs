# DalJS :: Easy-Peasy Development

Use only HTML to create dynamic applications in a jiffy.

## Getting Started

[Download DalJS](https://github.com/dallas22ca/daljs/archive/master.zip) and open up index.html in your browser.

## Todo
- Create has_many relationships and attach to objects when found via Dal.db.find().

## Compiling & Minifying

`gem install uglifier`
`cd daljs`
`irb`
`daljs = Uglifier.compile( Dir.glob(["lib/dependencies/*", "lib/*"]).map{|f| File.directory?(f) ? nil : File.read(f)}.join("\n"), comments: :none)`
`File.open("dal.min.js", 'w') { |file| file.write(daljs) }`