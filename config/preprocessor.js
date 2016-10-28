const tsc = require('typescript');

const { compilerOptions } = require( '../tsconfig.json' );
const { options } = tsc.convertCompilerOptionsFromJson( compilerOptions );

// Jest ( well Node ) doesn't support ES2015 modules so we have to override tsconfig
const testCompileOptions = Object.assign(
  {},
  options,
  { module: tsc.ModuleKind.CommonJS }
);

module.exports = {
  process(src, filename) {
    if (filename.endsWith('.ts') || filename.endsWith('.tsx')) {
      // compile by tsconfig
      return tsc.transpile(
        src,
        testCompileOptions,
        filename,
        []
      );
    }
    return src;
  },
};
