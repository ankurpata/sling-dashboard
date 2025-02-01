import React, {useState, useEffect, useMemo, useRef} from 'react';
import {makeStyles, styled} from '@material-ui/core/styles';
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
  ListItemText,
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
  ViewAgenda as ViewAgendaIcon,
} from '@material-ui/icons';
import {getFileChanges} from '../services/fileChangesService';
import {useProject} from '../context/ProjectContext';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  fileList: {
    width: 300,
    borderRight: '1px solid #d0d7de',
    overflow: 'auto',
    backgroundColor: '#f6f8fa',
  },
  searchContainer: {
    padding: theme.spacing(2),
    borderBottom: '1px solid #d0d7de',
  },
  searchInput: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#ffffff',
      borderRadius: '6px',
      border: '1px solid #d0d7de',
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
        border: '1px solid #d0d7de',
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
      },
      '&.Mui-focused': {
        border: '1px solid #d0d7de',
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
      },
      '& .MuiOutlinedInput-input': {
        padding: '8px 12px',
        fontSize: '14px',
        color: '#24292f',
        '&::placeholder': {
          color: '#57606a',
          opacity: 1,
        },
      },
    },
    '& .MuiInputAdornment-root': {
      color: '#57606a',
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
      backgroundColor: '#f6f8fa',
    },
  },
  selectedFile: {
    backgroundColor: '#ffffff',
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
    color: '#57606a',
    marginLeft: theme.spacing(1),
  },
  chevron: {
    fontSize: 16,
    color: '#57606a',
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
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  fileHeader: {
    padding: '8px 12px',
    backgroundColor: '#ffffff',
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
    backgroundColor: '#e6ffec',
    color: '#2cbe4e',
    height: '20px',
    '& .MuiChip-icon': {
      color: '#2cbe4e',
      marginLeft: '4px',
    },
  },
  removeChip: {
    backgroundColor: '#ffebe9',
    color: '#cf222e',
    height: '20px',
    '& .MuiChip-icon': {
      color: '#cf222e',
      marginLeft: '4px',
    },
  },
  diffContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    backgroundColor: '#ffffff',
  },
  splitView: {
    display: 'grid',
    overflow: 'auto',
    height: '100%',
    '& > div': {
      borderRight: '1px solid #d0d7de',
      '&:last-child': {
        borderRight: 'none',
      },
    },
  },
  diffContent: {
    flex: 1,
    overflow: 'auto',
    fontFamily: 'monospace',
    fontSize: '12px',
    lineHeight: '18px',
    padding: '0',
    backgroundColor: '#ffffff',
  },
  line: {
    display: 'flex',
    alignItems: 'center',
    minHeight: '18px',
    padding: '0 8px',
    whiteSpace: 'pre',
    '&:hover': {
      backgroundColor: '#f6f8fa',
    },
  },
  lineNumber: {
    width: '40px',
    color: '#6e7681',
    userSelect: 'none',
    textAlign: 'right',
    marginRight: '16px',
    fontSize: '12px',
  },
  lineContent: {
    flex: 1,
    color: '#24292f',
    fontSize: '12px',
  },
  addedLine: {
    backgroundColor: '#e6ffec',
    '& $lineContent': {
      color: '#24292f',
    },
    '& $lineNumber': {
      color: '#6e7681',
    },
  },
  removedLine: {
    backgroundColor: '#ffebe9',
    '& $lineContent': {
      color: '#24292f',
    },
    '& $lineNumber': {
      color: '#6e7681',
    },
  },
  contextLine: {
    color: '#57606a',
  },
  toolbar: {
    padding: '8px 12px',
    borderBottom: '1px solid #d0d7de',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  viewToggleGroup: {
    display: 'flex',
    gap: '4px',
    '& .MuiButtonBase-root': {
      padding: '4px',
      borderRadius: '4px',
      border: '1px solid #d0d7de',
      '&.active': {
        backgroundColor: '#f6f8fa',
      },
      '&:hover': {
        backgroundColor: '#f6f8fa',
      },
    },
  },
  viewToggle: {
    marginRight: '8px',
  },
  diffHeader: {
    padding: '8px 12px',
    borderBottom: '1px solid #d0d7de',
    backgroundColor: '#ffffff',
  },
}));

const FileTreeItem = ({
  file,
  depth = 0,
  selectedFile,
  onSelectFile,
  allFiles,
}) => {
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
        style={{paddingLeft: `${depth * 16}px`}}>
        {hasChildren ? (
          <Box display='flex' alignItems='center'>
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
              size='small'
              label={`+${file.additions}`}
              className={classes.statChip}
              style={{backgroundColor: '#e6ffec', color: '#2cbe4e'}}
            />
            <Chip
              size='small'
              label={`-${file.deletions}`}
              className={classes.statChip}
              style={{backgroundColor: '#ffebe9', color: '#cf222e'}}
            />
          </div>
        )}
      </div>
      {hasChildren && expanded && (
        <div className={classes.nestedFiles}>
          {allFiles
            .filter((f) =>
              f.path.startsWith(
                file.path
                  .split('/')
                  .slice(0, depth + 1)
                  .join('/'),
              ),
            )
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

const findCommonLines = (oldLines = [], newLines = []) => {
  // Handle undefined or null inputs
  if (!oldLines || !newLines) return [];

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

const CodeDiffViewer = ({fileChanges: initialFileChanges}) => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileChanges, setFileChanges] = useState(initialFileChanges || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('unified'); // unified, split-horizontal, split-vertical
  const {currentProject} = useProject();
  const leftScrollRef = useRef(null);
  const rightScrollRef = useRef(null);

  useEffect(() => {
    const fetchFileChanges = async () => {
      if (currentProject?._id) {
        try {
          const changes = await getFileChanges(currentProject._id);
          setFileChanges(changes);
        } catch (error) {
          console.error('Failed to fetch file changes:', error);
        }
      }
    };

    fetchFileChanges();
  }, []);

  useEffect(() => {
    const leftScroll = leftScrollRef.current;
    const rightScroll = rightScrollRef.current;

    if (leftScroll && rightScroll) {
      const syncScroll = (e) => {
        const target = e.target;
        const other = target === leftScroll ? rightScroll : leftScroll;
        other.scrollTop = target.scrollTop;
      };

      leftScroll.addEventListener('scroll', syncScroll);
      rightScroll.addEventListener('scroll', syncScroll);

      return () => {
        leftScroll.removeEventListener('scroll', syncScroll);
        rightScroll.removeEventListener('scroll', syncScroll);
      };
    }
  }, [viewMode]);

  const filteredFiles = () => {
    if (!searchQuery) return fileChanges;
    return fileChanges.filter((file) =>
      file.path.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  const currentFile = useMemo(() => {
    return fileChanges.find((file) => file.path === selectedFile);
  }, [fileChanges, selectedFile]);

  const handleFileSelect = (path) => {
    setSelectedFile(path);
  };

  const renderEmptyState = () => (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      height='100%'>
      <Typography variant='body1' color='textSecondary'>
        No file changes to display
      </Typography>
    </Box>
  );

  const renderFileList = () => (
    <Box className={classes.fileList}>
      <Box className={classes.searchContainer}>
        <TextField
          fullWidth
          size='small'
          variant='outlined'
          placeholder='Filter changed files'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={classes.searchInput}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon style={{fontSize: 20}} />
              </InputAdornment>
            ),
            classes: {
              notchedOutline: classes.noBorder,
            },
          }}
        />
      </Box>
      <Box className={classes.fileTree}>
        {filteredFiles().map((file, index) => (
          <FileTreeItem
            key={index}
            file={file}
            selectedFile={selectedFile}
            onSelectFile={handleFileSelect}
            allFiles={filteredFiles()}
          />
        ))}
      </Box>
    </Box>
  );

  const renderDiffLines = (diffLines = []) => {
    if (!diffLines || diffLines.length === 0) {
      return (
        <div className={classes.line}>
          <span className={classes.lineNumber}> </span>
          <span className={classes.lineContent}>No changes to display</span>
        </div>
      );
    }

    return diffLines.map((line, i) => (
      <div
        key={i}
        className={`${classes.line} ${
          line.type === 'added'
            ? classes.addedLine
            : line.type === 'removed'
              ? classes.removedLine
              : ''
        }`}>
        <span className={classes.lineNumber}>
          {line.oldLineNumber || ' '} {line.newLineNumber || ' '}
        </span>
        <span
          className={`${classes.lineContent} ${line.type === 'context' ? classes.contextLine : ''}`}>
          {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
          {line.content}
        </span>
      </div>
    ));
  };

  const renderViewToggle = () => (
    <Box className={classes.viewToggleGroup}>
      <IconButton
        onClick={() => setViewMode('unified')}
        className={viewMode === 'unified' ? 'active' : ''}
        title='Unified View'>
        <ViewStreamIcon />
      </IconButton>
      <IconButton
        onClick={() => setViewMode('split-horizontal')}
        className={viewMode === 'split-horizontal' ? 'active' : ''}
        title='Split Horizontal'>
        <ViewColumnIcon />
      </IconButton>
      <IconButton
        onClick={() => setViewMode('split-vertical')}
        className={viewMode === 'split-vertical' ? 'active' : ''}
        title='Split Vertical'>
        <ViewAgendaIcon />
      </IconButton>
    </Box>
  );

  const isSplitView = viewMode.startsWith('split-');
  const isVerticalSplit = viewMode === 'split-vertical';

  if (!fileChanges || fileChanges.length === 0) {
    return (
      <Box
        className={classes.root}
        style={{
          display: 'flex',
          justifyContent: 'center',
          height: '100%',
          alignItems: 'center',
        }}>
        {renderEmptyState()}
      </Box>
    );
  }

  return (
    <Box className={classes.root}>
      {renderFileList()}
      <Box className={classes.diffContainer}>
        <Box className={classes.toolbar}>{renderViewToggle()}</Box>
        {!currentFile ? (
          <Box p={2}>
            <Typography variant='body2' color='textSecondary'>
              Select a file to view changes
            </Typography>
          </Box>
        ) : isSplitView ? (
          <Box
            className={classes.splitView}
            style={{
              gridTemplateColumns: isVerticalSplit ? '1fr' : '1fr 1fr',
              gridTemplateRows: isVerticalSplit ? '1fr 1fr' : '1fr',
            }}>
            <Box className={classes.diffContent} ref={leftScrollRef}>
              {renderDiffLines(
                findCommonLines(
                  currentFile.oldContent?.split('\n') || [],
                  currentFile.newContent?.split('\n') || [],
                ).filter((line) => line.type !== 'added'),
              )}
            </Box>
            <Box className={classes.diffContent} ref={rightScrollRef}>
              {renderDiffLines(
                findCommonLines(
                  currentFile.oldContent?.split('\n') || [],
                  currentFile.newContent?.split('\n') || [],
                ).filter((line) => line.type !== 'removed'),
              )}
            </Box>
          </Box>
        ) : (
          <Box className={classes.diffContent}>
            {renderDiffLines(
              findCommonLines(
                currentFile.oldContent?.split('\n') || [],
                currentFile.newContent?.split('\n') || [],
              ),
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CodeDiffViewer;
