import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Chip, Paper, List, ListItem, IconButton, Tooltip } from '@material-ui/core';
import { Add as AddIcon, Remove as RemoveIcon, ViewColumn as ViewColumnIcon, ViewStream as ViewStreamIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
  },
  fileList: {
    width: 300,
    borderRight: '1px solid #d0d7de',
    backgroundColor: '#f6f8fa',
    overflow: 'auto',
  },
  fileListItem: {
    padding: '8px 16px',
    borderBottom: '1px solid #d0d7de',
    '&:hover': {
      backgroundColor: '#ffffff',
    },
    cursor: 'pointer',
  },
  selectedFile: {
    backgroundColor: '#ffffff',
    borderLeft: '2px solid #0969da',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  fileContainer: {
    marginBottom: theme.spacing(3),
    '&:last-child': {
      marginBottom: 0,
    },
  },
  fileHeader: {
    padding: '8px 12px',
    backgroundColor: '#f6f8fa',
    borderBottom: '1px solid #d0d7de',
    borderTopLeftRadius: '6px',
    borderTopRightRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  fileName: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#24292f',
    flex: 1,
  },
  statsContainer: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  addChip: {
    backgroundColor: '#dafbe1',
    color: '#1a7f37',
    height: '20px',
    '& .MuiChip-icon': {
      color: '#1a7f37',
      marginLeft: '4px',
    },
  },
  removeChip: {
    backgroundColor: '#ffeef0',
    color: '#cf222e',
    height: '20px',
    '& .MuiChip-icon': {
      color: '#cf222e',
      marginLeft: '4px',
    },
  },
  diffContainer: {
    flex: 1,
    overflow: 'auto',
    backgroundColor: '#ffffff',
    fontFamily: 'SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace',
    fontSize: '12px',
    lineHeight: '20px',
    display: 'flex',
  },
  splitView: {
    width: '50%',
    borderRight: '1px solid #d0d7de',
    '&:last-child': {
      borderRight: 'none',
    },
  },
  numbersColumn: {
    position: 'sticky',
    left: 0,
    zIndex: 2,
    backgroundColor: '#f6f8fa',
    borderRight: '1px solid #d0d7de',
    width: '60px',
    display: 'flex',
    flexDirection: 'column',
  },
  contentColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  line: {
    display: 'flex',
    minHeight: '20px',
    backgroundColor: '#ffffff',
    '&:hover': {
      backgroundColor: '#f6f8fa',
    },
  },
  lineNumber: {
    color: '#6e7781',
    width: '35px',
    padding: '0 10px',
    textAlign: 'center',
    userSelect: 'none',
    borderRight: '1px solid #d0d7de',
    backgroundColor: '#f6f8fa',
    display: 'inline-block',
  },
  lineContent: {
    padding: '0 16px',
    flex: 1,
    whiteSpace: 'pre',
  },
  addedLine: {
    backgroundColor: '#e6ffec',
    '&:hover': {
      backgroundColor: '#d8f3dc',
    },
  },
  removedLine: {
    backgroundColor: '#ffebe9',
    '&:hover': {
      backgroundColor: '#ffddd9',
    },
  },
  contextLine: {
    color: '#57606a',
  },
}));

const CodeDiffViewer = ({ fileChanges }) => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState(fileChanges[0]?.path);
  const [isSplitView, setIsSplitView] = useState(false);

  const findCommonLines = (oldLines, newLines) => {
    const lines = [];
    let oldIndex = 0;
    let newIndex = 0;
    let displayIndex = 1;

    while (oldIndex < oldLines.length || newIndex < newLines.length) {
      if (oldIndex < oldLines.length && newIndex < newLines.length) {
        if (oldLines[oldIndex] === newLines[newIndex]) {
          // Unchanged line
          lines.push({
            type: 'context',
            content: oldLines[oldIndex],
            displayIndex: displayIndex,
            oldLineNumber: oldIndex + 1,
            newLineNumber: newIndex + 1,
          });
          oldIndex++;
          newIndex++;
          displayIndex++;
        } else {
          // Line was changed
          lines.push({
            type: 'removed',
            content: oldLines[oldIndex],
            displayIndex: displayIndex,
            oldLineNumber: oldIndex + 1,
            newLineNumber: null,
          });
          oldIndex++;
          displayIndex++;

          lines.push({
            type: 'added',
            content: newLines[newIndex],
            displayIndex: displayIndex,
            oldLineNumber: null,
            newLineNumber: newIndex + 1,
          });
          newIndex++;
          displayIndex++;
        }
      } else if (oldIndex < oldLines.length) {
        // Remaining removed lines
        lines.push({
          type: 'removed',
          content: oldLines[oldIndex],
          displayIndex: displayIndex,
          oldLineNumber: oldIndex + 1,
          newLineNumber: null,
        });
        oldIndex++;
        displayIndex++;
      } else if (newIndex < newLines.length) {
        // Remaining added lines
        lines.push({
          type: 'added',
          content: newLines[newIndex],
          displayIndex: displayIndex,
          oldLineNumber: null,
          newLineNumber: newIndex + 1,
        });
        newIndex++;
        displayIndex++;
      }
    }
    return lines;
  };

  const renderDiffLines = (diffLines) => {
    return diffLines.map((line, i) => (
      <div
        key={i}
        className={`${classes.line} ${
          line.type === 'added'
            ? classes.addedLine
            : line.type === 'removed'
            ? classes.removedLine
            : ''
        }`}
      >
        <span className={classes.lineNumber}>
          {line.oldLineNumber || ' '} {line.newLineNumber || ' '}
        </span>
        <span className={`${classes.lineContent} ${line.type === 'context' ? classes.contextLine : ''}`}>
          {line.type === 'added'
            ? '+'
            : line.type === 'removed'
            ? '-'
            : ' '}
          {line.content}
        </span>
      </div>
    ));
  };

  const currentFile = fileChanges.find(f => f.path === selectedFile);

  return (
    <Box className={classes.root}>
      <Box className={classes.fileList}>
        <List disablePadding>
          {fileChanges.map((file) => (
            <ListItem
              key={file.path}
              className={`${classes.fileListItem} ${
                file.path === selectedFile ? classes.selectedFile : ''
              }`}
              onClick={() => setSelectedFile(file.path)}
            >
              <Box>
                <Typography variant="body2">{file.path}</Typography>
                <Box display="flex" gap={1} mt={0.5}>
                  <Typography variant="caption" color="textSecondary">
                    +{file.additions} -{file.deletions}
                  </Typography>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box className={classes.mainContent}>
        {currentFile && (
          <Paper className={classes.fileContainer}>
            <Box className={classes.fileHeader}>
              <Typography className={classes.fileName}>{currentFile.path}</Typography>
              <Box className={classes.statsContainer}>
                <Chip
                  icon={<AddIcon style={{ fontSize: 16 }} />}
                  label={`+${currentFile.additions}`}
                  className={classes.addChip}
                  size="small"
                />
                <Chip
                  icon={<RemoveIcon style={{ fontSize: 16 }} />}
                  label={`-${currentFile.deletions}`}
                  className={classes.removeChip}
                  size="small"
                />
                <Tooltip title={isSplitView ? "Unified View" : "Split View"}>
                  <IconButton size="small" onClick={() => setIsSplitView(!isSplitView)}>
                    {isSplitView ? <ViewStreamIcon /> : <ViewColumnIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Box className={classes.diffContainer}>
              {isSplitView ? (
                <>
                  <Box className={classes.splitView}>
                    {findCommonLines(
                      currentFile.oldContent.split('\n'),
                      currentFile.newContent.split('\n')
                    ).map((line, i) => (
                      <div
                        key={i}
                        className={`${classes.line} ${
                          line.type === 'removed' ? classes.removedLine : ''
                        }`}
                      >
                        <span className={classes.lineNumber}>
                          {line.displayIndex}
                        </span>
                        <span className={`${classes.lineContent} ${
                          line.type === 'context' ? classes.contextLine : ''
                        }`}>
                          {line.type === 'removed' ? '-' : ' '}
                          {line.type === 'removed' ? line.content : (line.oldLineNumber ? line.content : '')}
                        </span>
                      </div>
                    ))}
                  </Box>
                  <Box className={classes.splitView}>
                    {findCommonLines(
                      currentFile.oldContent.split('\n'),
                      currentFile.newContent.split('\n')
                    ).map((line, i) => (
                      <div
                        key={i}
                        className={`${classes.line} ${
                          line.type === 'added' ? classes.addedLine : ''
                        }`}
                      >
                        <span className={classes.lineNumber}>
                          {line.displayIndex}
                        </span>
                        <span className={`${classes.lineContent} ${
                          line.type === 'context' ? classes.contextLine : ''
                        }`}>
                          {line.type === 'added' ? '+' : ' '}
                          {line.type === 'added' ? line.content : (line.newLineNumber ? line.content : '')}
                        </span>
                      </div>
                    ))}
                  </Box>
                </>
              ) : (
                <Box flex={1}>
                  {renderDiffLines(findCommonLines(
                    currentFile.oldContent.split('\n'),
                    currentFile.newContent.split('\n')
                  ))}
                </Box>
              )}
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default CodeDiffViewer;
