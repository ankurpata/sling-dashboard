import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { format } from 'date-fns';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1e1e1e',
    color: '#fff',
  },
  listItem: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
  },
  title: {
    color: '#fff',
    fontWeight: 500,
  },
  timestamp: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '0.8rem',
  },
  deleteButton: {
    color: 'rgba(255, 255, 255, 0.5)',
    '&:hover': {
      color: '#fff',
    },
  },
  emptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: 'rgba(255, 255, 255, 0.5)',
  },
}));

const History = ({ conversations = [], onConversationClick, onDeleteConversation }) => {
  const classes = useStyles();

  if (!conversations.length) {
    return (
      <Box className={classes.emptyState}>
        <Typography>No conversations yet</Typography>
      </Box>
    );
  }

  return (
    <List className={classes.root}>
      {conversations.map((conversation) => (
        <ListItem
          key={conversation.id}
          button
          className={classes.listItem}
          onClick={() => onConversationClick(conversation.id)}
        >
          <ListItemText
            primary={
              <Typography className={classes.title}>
                {conversation.title || 'Untitled Conversation'}
              </Typography>
            }
            secondary={
              <Typography className={classes.timestamp}>
                {format(new Date(conversation.timestamp), 'MMM d, h:mm a')}
              </Typography>
            }
          />
          <IconButton
            edge="end"
            className={classes.deleteButton}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteConversation(conversation.id);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
};

export default History;
