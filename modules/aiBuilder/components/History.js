import React from 'react';
import {
  List,
  ListItem,
  Typography,
  Box,
  makeStyles,
  Chip,
  IconButton,
} from '@material-ui/core';
import {formatDistanceToNow} from 'date-fns';
import HistoryIcon from '@material-ui/icons/History';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: theme.spacing(2),
  },
  title: {
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: theme.spacing(2),
    color: 'rgba(255, 255, 255, 0.9)',
  },
  listItem: {
    padding: theme.spacing(4),
    cursor: 'pointer',
    marginBottom: theme.spacing(2),
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
    display: 'flex',
    alignItems: 'center',
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
  currentChip: {
    backgroundColor: '#fff',
    color: '#000',
    height: '24px',
    fontSize: '12px',
    marginLeft: theme.spacing(1),
    fontWeight: 500,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  historyIcon: {
    color: 'rgba(255, 255, 255, 0.5)',
    width: 20,
    height: 20,
    marginRight: theme.spacing(1),
  },
}));

const History = ({
  conversations = [],
  onConversationClick,
  currentConversationId,
}) => {
  const classes = useStyles();
  const [showAll, setShowAll] = React.useState(false);

  const displayedConversations = showAll
    ? conversations
    : conversations.slice(0, 3);
  const remainingCount = conversations.length - 3;

  return (
    <Box className={classes.root}>
      <Typography className={classes.title}>Past Conversations</Typography>
      <List>
        {displayedConversations.map((conversation) => (
          <ListItem
            key={conversation.id}
            className={classes.listItem}
            onClick={() => onConversationClick(conversation.id)}>
            <Box>
              <Box className={classes.titleContainer}>
                <HistoryIcon className={classes.historyIcon} />
                <Box>
                  <Box style={{display: 'flex', alignItems: 'center'}}>
                    <Typography className={classes.conversationTitle}>
                      {conversation.title}
                    </Typography>
                    {conversation.id === currentConversationId && (
                      <Chip
                        label='Current'
                        size='small'
                        className={classes.currentChip}
                      />
                    )}
                  </Box>
                  <Typography className={classes.timestamp}>
                    {formatDistanceToNow(new Date(conversation.timestamp), {
                      addSuffix: true,
                    })}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </ListItem>
        ))}
        {!showAll && remainingCount > 0 && (
          <ListItem
            className={classes.showMore}
            onClick={() => setShowAll(true)}>
            <Typography>Show {remainingCount} more...</Typography>
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default History;
