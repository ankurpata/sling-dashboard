export const getDummyFileChanges = () => [
  {
    path: 'src/components/Button.js',
    oldContent: `import React from 'react';
import { Button as MuiButton } from '@material-ui/core';

const Button = ({ children, ...props }) => {
  return <MuiButton {...props}>{children}</MuiButton>;
};

export default Button;`,
    newContent: `import React from 'react';
import { Button as MuiButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: theme.spacing(1),
    textTransform: 'none',
    fontWeight: 500,
  },
}));

const Button = ({ children, ...props }) => {
  const classes = useStyles();
  return (
    <MuiButton className={classes.root} {...props}>
      {children}
    </MuiButton>
  );
};

export default Button;`,
    additions: 10,
    deletions: 5,
  },
  {
    path: 'src/components/TextField.js',
    oldContent: `import React from 'react';
import { TextField } from '@material-ui/core';

export default function CustomTextField(props) {
  return <TextField {...props} />;
}`,
    newContent: `import React from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.spacing(1),
    },
  },
}));

export default function CustomTextField(props) {
  const classes = useStyles();
  return <TextField className={classes.root} variant="outlined" {...props} />;
}`,
    additions: 8,
    deletions: 2,
  },
];
