export const checkUsernameValidationSchema = {
  username: {
    notEmpty: {
      errorMessage: 'Username cannot be empty.',
    },
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage: 'Username must be between 5 and 32 characters long.',
    },
    isString: {
      errorMessage: 'Username must be a string.',
    },
  },
  displayName: {
    notEmpty: {
      errorMessage: 'Display name cannot be empty.',
    },
    isString: {
      errorMessage: 'Display name must be a string.',
    },
  },
  password: {
    notEmpty: {
      errorMessage: 'Password cannot be empty.',
    },
    isLength: {
      options: {
        min: 8,
      },
      errorMessage: 'Password must be at least 8 characters long.',
    },
  },
};

export const checkFilterValidationSchema = {
  filter: {
    notEmpty: {
      errorMessage: 'URL filter cannot be empty.',
    },
    isString: {
      errorMessage: 'URL filter must be a string.',
    },
  },
};