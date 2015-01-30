# khan academy challenge framework
sahil gupta

### why esprima over acorn
- both parse javascript and get the job done
- both produce well-documented, beautiful ASTs
- both have optional 'loose mode' where tolerates errors
- acorn pros
 - by esprima's own [benchmarks](http://esprima.org/test/compare.html), acorn is mildly faster (_./p-speed.png_)
 - 30kb smaller
- esprima pros
 - compatible with modern firefox, chrome, ie8+
 - acorn incompatible with ie8 in js strict mode
   - determined with [jscc.info](http://jscc.info) (_./p-acorn.png_)

### current implementation
- provides feedback on 3 tests concurrently as user types
- can check for >1 frequency of whitelist keywords
- checks for white/blacklisted keywords in one pass through parse tree

### future implementation
- keep a persistent keyword list, to not update on every user input
- nonblocking javascript (perhaps with setTimeout())
- check that white/blacklist are mutually exclusive
- test-driven development
- make API more modular

### notes
- whitelist
  - empty, one, many
- blacklist
 - empty, one, many
- structure
 - empty, one, nest
- extra
 - nonblocking
 - code editor
