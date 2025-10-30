module.exports = {
  env: {
    // this babel configuration is just for the jest tests
    test: {
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              node: "current",
            },
          },
        ],
      ],
    },
  },
};
