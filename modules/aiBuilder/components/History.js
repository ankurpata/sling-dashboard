import React from 'react';
import {
  List,
  ListItem,
  Typography,
  Box,
  makeStyles,
} from '@material-ui/core';
import { formatDistanceToNow } from 'date-fns';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: theme.spacing(2),
  },
  title: {
    fontSize: '20px',
    fontWeight: 500,
    marginBottom: theme.spacing(2),
    color: 'rgba(255, 255, 255, 0.9)',
  },
  listItem: {
    padding: theme.spacing(2),
    cursor: 'pointer',
    marginBottom: theme.spacing(1),
    backgroundColor: '#2a2a2a',
    borderRadius: '12px',
    '&:hover': {
      backgroundColor: '#333333',
    },
  },
  conversationTitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  timestamp: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '12px',
    display: 'block',
    marginTop: theme.spacing(0.5),
  },
  showMore: {
    color: 'rgba(255, 255, 255, 0.5)',
    padding: theme.spacing(2),
    cursor: 'pointer',
    textAlign: 'left',
    '&:hover': {
      backgroundColor: '#2a2a2a',
      borderRadius: '12px',
    },
  },
}));

const History = ({ conversations = [], onConversationClick }) => {
  const classes = useStyles();
  const [showAll, setShowAll] = React.useState(false);
  
  const displayedConversations = showAll ? conversations : conversations.slice(0, 3);
  const remainingCount = conversations.length - 3;

  return (
    <Box className={classes.root}>
      <Typography className={classes.title}>Past Conversations</Typography>
      <List>
        {displayedConversations.map((conversation) => (
          <ListItem
            key={conversation.id}
            className={classes.listItem}
            onClick={() => onConversationClick(conversation.id)}
          >
            <Box>
              <Typography className={classes.conversationTitle}>
                {conversation.title}
              </Typography>
              <Typography className={classes.timestamp}>
                {formatDistanceToNow(new Date(conversation.timestamp), { addSuffix: true })}
              </Typography>
            </Box>
          </ListItem>
        ))}
        {!showAll && remainingCount > 0 && (
          <ListItem 
            className={classes.showMore}
            onClick={() => setShowAll(true)}
          >
            <Typography>
              Show {remainingCount} more...
            </Typography>
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default History;
