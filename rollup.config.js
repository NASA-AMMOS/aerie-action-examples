import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    treeshake: true,
    input: 'out-tsc/index.js',
    output: {
      dir: 'dist'
    },
    plugins: [
      resolve(),  // this resolves imports from node_modules
    ],
  }
]
