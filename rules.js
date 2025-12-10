export const ecmaVersion = 2022;
export const OFF = 0;
export const WARN = 1;
export const ERROR = 2;

export const tsRules = {
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-unused-vars': [
    WARN,
    {
      args: 'after-used',
      ignoreRestSiblings: true,
      argsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
      destructuredArrayIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    },
  ],
  'array-callback-return': [
    WARN,
    {
      allowImplicit: false,
      checkForEach: false,
      allowVoid: false,
    },
  ],
  'constructor-super': [ERROR],
  'getter-return': [
    WARN,
    {
      allowImplicit: false,
    },
  ],
  'new-parens': [WARN],
  'no-array-constructor': [OFF],
  'no-caller': [ERROR],
  'no-cond-assign': [WARN, 'except-parens'],
  'no-const-assign': [ERROR],
  'no-control-regex': [WARN],
  'no-dupe-args': [WARN],
  'no-dupe-class-members': [OFF],
  'no-dupe-keys': [WARN],
  'no-duplicate-case': [WARN],
  'no-duplicate-imports': [
    OFF,
    {
      includeExports: false,
    },
  ],
  'no-empty-character-class': [WARN],
  'no-empty-pattern': [
    WARN,
    {
      allowObjectPatternsAsParameters: false,
    },
  ],
  'no-empty': [
    WARN,
    {
      allowEmptyCatch: true,
    },
  ],
  'no-eval': [
    ERROR,
    {
      allowIndirect: false,
    },
  ],
  'no-ex-assign': [WARN],
  'no-extend-native': [
    WARN,
    {
      exceptions: [],
    },
  ],
  'no-extra-bind': [WARN],
  'no-extra-boolean-cast': [WARN, {}],
  'no-extra-label': [WARN],
  'no-fallthrough': [
    WARN,
    {
      allowEmptyCase: false,
      reportUnusedFallthroughComment: false,
    },
  ],
  'no-func-assign': [WARN],
  'no-global-assign': [
    WARN,
    {
      exceptions: [],
    },
  ],
  'no-implied-eval': [WARN],
  'no-invalid-regexp': [WARN, {}],
  'no-label-var': [WARN],
  'no-labels': [
    WARN,
    {
      allowLoop: true,
      allowSwitch: false,
    },
  ],
  'no-lone-blocks': [WARN],
  'no-loop-func': [WARN],
  'no-mixed-operators': [
    WARN,
    {
      groups: [
        ['&', '|', '^', '~', '<<', '>>', '>>>'],
        ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
        ['&&', '||'],
        ['in', 'instanceof'],
      ],
      allowSamePrecedence: false,
    },
  ],
  'no-native-reassign': [WARN],
  'no-new-func': [WARN],
  'no-new-object': [WARN],
  'no-new-symbol': [WARN],
  'no-new-wrappers': [WARN],
  'no-octal': [WARN],
  'no-octal-escape': [ERROR],
  'no-redeclare': [
    OFF,
    {
      builtinGlobals: true,
    },
  ],
  'no-restricted-globals': [
    ERROR,
    'addEventListener',
    'blur',
    'close',
    'closed',
    'confirm',
    'defaultStatus',
    'defaultstatus',
    'event',
    'external',
    'find',
    'focus',
    'frameElement',
    'frames',
    'history',
    'innerHeight',
    'innerWidth',
    'length',
    'location',
    'locationbar',
    'menubar',
    'moveBy',
    'moveTo',
    'name',
    'onblur',
    'onerror',
    'onfocus',
    'onload',
    'onresize',
    'onunload',
    'open',
    'opener',
    'opera',
    'outerHeight',
    'outerWidth',
    'pageXOffset',
    'pageYOffset',
    'parent',
    'print',
    'removeEventListener',
    'resizeBy',
    'resizeTo',
    'screen',
    'screenLeft',
    'screenTop',
    'screenX',
    'screenY',
    'scroll',
    'scrollbars',
    'scrollBy',
    'scrollTo',
    'scrollX',
    'scrollY',
    'self',
    'status',
    'statusbar',
    'stop',
    'toolbar',
    'top',
  ],
  'no-restricted-properties': [ERROR],
  'no-restricted-syntax': [ERROR, 'WithStatement'],
  'no-script-url': [WARN],
  'no-self-assign': [
    WARN,
    {
      props: true,
    },
  ],
  'no-self-compare': [WARN],
  'no-sequences': [
    WARN,
    {
      allowInParentheses: true,
    },
  ],
  'no-shadow-restricted-names': [WARN],
  'no-sparse-arrays': [WARN],
  'no-template-curly-in-string': [WARN],
  'no-this-before-super': [WARN],
  'no-undef': [
    OFF,
    {
      typeof: false,
    },
  ],
  'no-unreachable': [WARN],
  'no-unsafe-negation': [
    ERROR,
    {
      enforceForOrderingRelations: false,
    },
  ],
  'no-unused-expressions': [
    OFF,
    {
      allowShortCircuit: true,
      allowTernary: true,
      allowTaggedTemplates: true,
      enforceForJSX: false,
    },
  ],
  'no-unused-labels': [WARN],
  'no-unused-vars': [
    OFF,
    {
      args: 'after-used',
      ignoreRestSiblings: true,
      argsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
      destructuredArrayIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    },
  ],
  'no-use-before-define': [
    OFF,
    {
      classes: false,
      functions: false,
      variables: false,
      allowNamedExports: false,
    },
  ],
  'no-useless-computed-key': [
    WARN,
    {
      enforceForClassMembers: true,
    },
  ],
  'no-useless-concat': [WARN],
  'no-useless-constructor': [OFF],
  'no-useless-escape': [WARN],
  'no-useless-rename': [
    WARN,
    {
      ignoreDestructuring: false,
      ignoreImport: false,
      ignoreExport: false,
    },
  ],
  'no-var': [OFF],
  'no-with': [WARN],
  'require-yield': [WARN],
  'use-isnan': [
    WARN,
    {
      enforceForIndexOf: false,
      enforceForSwitchCase: true,
    },
  ],
  'valid-typeof': [
    WARN,
    {
      requireStringLiterals: false,
    },
  ],
  '@typescript-eslint/consistent-type-assertions': [WARN],
  '@typescript-eslint/consistent-type-imports': [WARN],
  '@typescript-eslint/no-array-constructor': [WARN],
  '@typescript-eslint/no-use-before-define': [
    WARN,
    {
      functions: false,
      classes: false,
      variables: false,
      typedefs: false,
    },
  ],
  '@typescript-eslint/no-unused-expressions': [
    WARN,
    {
      allowShortCircuit: true,
      allowTaggedTemplates: true,
      allowTernary: true,
    },
  ],
};

export const reactRules = {
  'react/jsx-no-undef': [ERROR],
  'react/style-prop-object': [ERROR],
  'react/display-name': [OFF],
  'react/forbid-foreign-prop-types': [
    WARN,
    {
      allowInPropTypes: true,
    },
  ],
  'react/jsx-key': [WARN],
  'react/jsx-no-comment-textnodes': [WARN],
  'react/jsx-no-target-blank': [WARN],
  'react/jsx-pascal-case': [
    WARN,
    {
      allowNamespace: true,
    },
  ],
  'react/jsx-uses-vars': [WARN],
  'react/jsx-uses-react': [WARN],
  'react/no-danger-with-children': [WARN],
  'react/no-deprecated': [WARN],
  'react/no-direct-mutation-state': [WARN],
  'react/no-find-dom-node': [WARN],
  'react/no-is-mounted': [WARN],
  'react/no-render-return-value': [ERROR],
  'react/no-string-refs': [WARN],
  'react/no-typos': [WARN],
  'react/react-in-jsx-scope': [OFF],
  'react/require-render-return': [OFF],
  'react-hooks/exhaustive-deps': [WARN],
  'react-hooks/rules-of-hooks': [ERROR],
};
