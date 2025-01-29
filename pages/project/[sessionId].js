import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {Box, Button, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import PublishIcon from '@material-ui/icons/Publish';
import CanvasLayout from '../../modules/aiBuilder/components/CanvasLayout';
import Header from '../../modules/aiBuilder/components/Header';
import {getSession} from '../../modules/aiBuilder/services/sessionService';
import {useUser} from '../../modules/aiBuilder/context/UserContext';
import {useProject} from '../../modules/aiBuilder/context/ProjectContext';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100%',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  content: {
    flex: 1,
    overflow: 'auto',
    backgroundColor: '#1a1a1a',
    '& .MuiPaper-root': {
      backgroundColor: '#1a1a1a',
      // color: '#ffffff',
    },
    '& .MuiTypography-root': {
     },
    '& .MuiTab-root': {
       '&.Mui-selected': {
        color: '#059669',
      },
    },
    '& .MuiTabs-indicator': {
      backgroundColor: '#059669',
    },
    // Keep preview section white
    '& [class*="preview"]': {
      backgroundColor: '#ffffff',
      color: '#000000',
      '& .MuiTypography-root': {
        color: '#000000',
      },
    },
  },
  publishButton: {
    marginRight: theme.spacing(2),
    backgroundColor: '#059669',
    '&:hover': {
      backgroundColor: '#047857',
    },
  },
}));

const ProjectSession = () => {
  const classes = useStyles();
  const router = useRouter();
  const {sessionId} = router.query;
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const {user, fetchUserInfo} = useUser();
  const {currentProject, loadProjectById} = useProject();

  useEffect(() => {
    async function fetchSession() {
      if (sessionId) {
        try {
          const sessionData = await getSession(sessionId);
          const {
            session: {project, user, status, context},
          } = sessionData;

          // Load project and user data into their respective contexts
          await Promise.all([
            loadProjectById(project._id),
            fetchUserInfo(user._id),
          ]);

          setSession(sessionData);
        } catch (error) {
          console.error('Error fetching session:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box className={classes.root}>
      <Header isCanvasView={true}></Header>
      <Box className={classes.content}>
        <CanvasLayout
          initialResponse={session?.initialResponse}
          inputValue={session?.context?.prompt}
          searchId={session?.sessionId}
        />
      </Box>
    </Box>
  );
};

export default ProjectSession;
