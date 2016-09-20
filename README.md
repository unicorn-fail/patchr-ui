# patchr-ui

> A web-based UI for unicorn-fail/patchr.

```js
// Create a new patchr-ui instance (in global/window scope).
const patchr = new PatchrUi();

// Navigate to a patch in the reviewer modal.
patchr.navigate('http://example.com/file.patch');
```

## Development

Development of this module is pretty straight forward.

It is recommended that you have at least a basic understanding of [Node.js]
development best practices before continuing. If not, please read their official
documentation before continuing.

### Prerequisites 

- [Node.JS]
- [Yarn] (install the global CLI tool)
- [Grunt.js] (install the global CLI tool)
- [patchr] (located one level up `../patchr` and linked via yarn)

### Setup

Install the modules by running `yarn install` inside this cloned
repository. Note: this may take a while depending on your computer.

### Grunt commands

- `grunt` - Main grunt command will build the entire project
- `grunt watch` - Watches files and executes only the necessary tasks.

### Distribution

After everything is built, there will be a `dist` folder where the distribution
files (CSS and JS) will be located. These can be used in the browser.

[patchr]: https://github.com/unicorn-fail/patchr
[Node.js]: https://nodejs.org
[Grunt.js]: https://gruntjs.com/getting-started#installing-the-cli
[Yarn]: https://yarnpkg.com/getting-started/install#global-install
