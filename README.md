# khan academy challenge framework
sahil gupta

### why esprima over acorn
- both parse javascript and get the job done
- both produce well-documented, beautiful ASTs
- both have optional 'loose mode' where tolerates errors
- acorn pros
 - by esprima's own benchmarks, acorn is trivially faster (./p-speed.png)
 - 30kb smaller
- esprima pros
 - compatible with modern firefox, chrome, ie8+
 - acorn incompatible with ie8 in js strict mode
   - determined with http://jscc.info (./p-acorn.png)

### specs
- whitelist
  - empty, one, many
- blacklist
 - empty, one, many
- structure
 - empty, one, nest
- extra
 - code editor
 - nonblocking
