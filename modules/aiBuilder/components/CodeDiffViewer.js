import React, { useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Box, 
  Typography, 
  Chip, 
  Paper,
  TextField,
  InputAdornment,
  Collapse,
  Tooltip,
  IconButton,
  List,
  ListItem,
} from '@material-ui/core';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Search as SearchIcon,
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  InsertDriveFile as FileIcon,
  Folder as FolderIcon,
  ViewColumn as ViewColumnIcon,
  ViewStream as ViewStreamIcon,
} from '@material-ui/icons';

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
    display: 'flex',
    flexDirection: 'column',
  },
  searchContainer: {
    padding: theme.spacing(2),
    borderBottom: '1px solid #d0d7de',
  },
  searchInput: {
    '& .MuiOutlinedInput-root': {
      // backgroundColor: '#1c2128',
      borderRadius: '6px',
      border: '1px solid #424a53',
      transition: 'border-color 0.2s',
      '&:before, &:after': {
        display: 'none',
        border: 'none',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
        borderColor: 'transparent',
      },
      '&:hover': {
        border: '1px solid #525964',
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
      },
      '&.Mui-focused': {
        border: '1px solid #525964',
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
      },
    },
    '& .MuiOutlinedInput-input': {
      padding: '8px 12px',
      fontSize: '14px',
      color: '#1c2128',
      '&::placeholder': {
        color: '#7d8590',
        opacity: 1,
      },
    },
    '& .MuiInputAdornment-root': {
      color: '#7d8590',
      marginRight: '-4px', 
    },
  },
  noBorder: {
    border: 'none',
  },
  fileTree: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(1),
  },
  fileItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 8px',
    cursor: 'pointer',
    borderRadius: 4,
    '&:hover': {
      backgroundColor: '#ffffff',
    },
  },
  selectedFile: {
    // backgroundColor: '#ffffff',
    '&:hover': {
      backgroundColor: '#ffffff',
    },
  },
  fileIcon: {
    fontSize: 20,
    color: '#57606a',
    marginRight: theme.spacing(1),
  },
  folderIcon: {
    fontSize: 20,
    color: '#7d8590',
    marginLeft: theme.spacing(1),
  },
  chevron: {
    fontSize: 16,
    color: '#7d8590',
    transition: 'transform 0.2s',
  },
  chevronExpanded: {
    transform: 'rotate(90deg)',
  },
  fileName: {
    fontSize: '14px',
    color: '#24292f',
    flex: 1,
    marginLeft: theme.spacing(1),
  },
  fileStats: {
    display: 'flex',
    gap: 4,
    marginLeft: theme.spacing(1),
  },
  statChip: {
    height: 18,
    fontSize: '11px',
  },
  nestedFiles: {
    paddingLeft: theme.spacing(3),
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

const FileTreeItem = ({ file, depth = 0, selectedFile, onSelectFile, allFiles }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);
  const isDirectory = file.path.includes('/');
  const fileName = isDirectory ? file.path.split('/')[depth] : file.path;
  const hasChildren = isDirectory && depth < file.path.split('/').length - 1;

  const handleClick = () => {
    if (hasChildren) {
      setExpanded(!expanded);
    } else {
      onSelectFile(file.path);
    }
  };

  return (
    <>
      <div 
        className={`${classes.fileItem} ${!hasChildren && file.path === selectedFile ? classes.selectedFile : ''}`}
        onClick={handleClick}
        style={{ paddingLeft: `${depth * 16}px` }}
      >
        {hasChildren ? (
          <Box display="flex" alignItems="center">
            <ChevronRightIcon 
              className={`${classes.chevron} ${expanded ? classes.chevronExpanded : ''}`}
            />
            <FolderIcon className={classes.folderIcon} />
          </Box>
        ) : (
          <FileIcon className={classes.fileIcon} />
        )}
        <Typography className={classes.fileName}>{fileName}</Typography>
        {!hasChildren && (
          <div className={classes.fileStats}>
            <Chip
              size="small"
              label={`+${file.additions}`}
              className={classes.statChip}
              style={{ backgroundColor: '#dafbe1', color: '#1a7f37' }}
            />
            <Chip
              size="small"
              label={`-${file.deletions}`}
              className={classes.statChip}
              style={{ backgroundColor: '#ffeef0', color: '#cf222e' }}
            />
          </div>
        )}
      </div>
      {hasChildren && expanded && (
        <div className={classes.nestedFiles}>
          {allFiles
            .filter(f => f.path.startsWith(file.path.split('/').slice(0, depth + 1).join('/')))
            .map((childFile, index) => (
              <FileTreeItem
                key={index}
                file={childFile}
                depth={depth + 1}
                selectedFile={selectedFile}
                onSelectFile={onSelectFile}
                allFiles={allFiles}
              />
            ))}
        </div>
      )}
    </>
  );
};

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

const CodeDiffViewer = ({ fileChanges }) => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState(fileChanges[0]?.path);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSplitView, setIsSplitView] = useState(false);

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

  const filteredFiles = useMemo(() => {
    if (!searchQuery) return fileChanges;
    return fileChanges.filter(file => 
      file.path.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [fileChanges, searchQuery]);

  // Group files by directory
  const fileTree = useMemo(() => {
    const grouped = {};
    filteredFiles.forEach(file => {
      const parts = file.path.split('/');
      let current = grouped;
      parts.forEach((part, i) => {
        if (!current[part]) {
          current[part] = i === parts.length - 1 ? file : {};
        }
        current = current[part];
      });
    });
    return grouped;
  }, [filteredFiles]);

  const currentFile = fileChanges.find(f => f.path === selectedFile);

  return (
    <Box className={classes.root}>
      <Box className={classes.fileList}>
        <Box className={classes.searchContainer}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Filter changed files"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={classes.searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ fontSize: 20 }} />
                </InputAdornment>
              ),
              classes: {
                notchedOutline: classes.noBorder
              }
            }}
          />
        </Box>
        <Box className={classes.fileTree}>
          {filteredFiles.map((file, index) => (
            <FileTreeItem
              key={index}
              file={file}
              selectedFile={selectedFile}
              onSelectFile={setSelectedFile}
              allFiles={filteredFiles}
            />
          ))}
        </Box>
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
