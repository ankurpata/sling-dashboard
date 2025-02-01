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
  diffContent: {
    flex: 1,
    overflow: 'auto',
    fontFamily: '"SF Mono", "Consolas", "Monaco", monospace',
    fontSize: '13px',
    lineHeight: '20px',
    padding: '0',
    backgroundColor: '#ffffff',
    tabSize: 2,
  },
  line: {
    display: 'flex',
    alignItems: 'stretch',
    minHeight: '20px',
    backgroundColor: '#ffffff',
    '&:hover': {
      backgroundColor: '#f6f8fa',
    },
  },
  lineNumber: {
    minWidth: '84px',
    color: '#6e7681',
    userSelect: 'none',
    display: 'flex',
    justifyContent: 'flex-end',
    borderRight: '1px solid #d0d7de',
    backgroundColor: '#f6f8fa',
    position: 'sticky',
    left: 0,
    '& span': {
      width: '40px',
      padding: '0 10px',
      textAlign: 'right',
      display: 'inline-block',
      fontSize: '12px',
      color: '#57606a',
      fontFamily: '"SF Mono", "Consolas", "Monaco", monospace',
      borderRight: '1px solid #d0d7de',
      '&:last-child': {
        borderRight: 'none',
      }
    }
  },
  lineContent: {
    flex: 1,
    color: '#24292f',
    padding: '0 16px',
    fontFamily: '"SF Mono", "Consolas", "Monaco", monospace',
    fontSize: '13px',
    whiteSpace: 'pre',
    display: 'flex',
    alignItems: 'center',
    '& pre': {
      margin: 0,
      whiteSpace: 'pre',
    }
  },
  addedLine: {
    '& $lineContent': {
      backgroundColor: '#e6ffec',
    },
    '& $lineNumber': {
      backgroundColor: '#f0fff4',
      borderRight: '1px solid #a6f0c6',
      '& span': {
        color: '#1a7f37',
      }
    },
  },
  removedLine: {
    '& $lineContent': {
      backgroundColor: '#ffebe9',
    },
    '& $lineNumber': {
      backgroundColor: '#fff5f5',
      borderRight: '1px solid #ffc9c9',
      '& span': {
        color: '#cf222e',
      }
    },
  },
  contextLine: {
    color: '#57606a',
  },
  codeMark: {
    display: 'inline-block',
    width: '16px',
    color: '#57606a',
    userSelect: 'none',
  },
  splitView: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    overflow: 'auto',
    height: '100%',
    '& > div': {
      borderRight: '1px solid #d0d7de',
      '&:last-child': {
        borderRight: 'none',
      },
    },
  },
  diffHeader: {
    padding: '8px 16px',
    borderBottom: '1px solid #d0d7de',
    backgroundColor: '#f6f8fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 1,
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
}));

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

  const organizeFiles = (files) => {
    // Group files by their root directory
    const filesByDir = files.reduce((acc, file) => {
      const parts = file.path.split('/');
      const rootDir = parts[0];
      if (!acc[rootDir]) {
        acc[rootDir] = [];
      }
      acc[rootDir].push(file);
      return acc;
    }, {});

    // Create root level items
    const rootItems = Object.entries(filesByDir).map(([dir, dirFiles]) => {
      // Create subdirectories first
      const subdirs = new Set(
        dirFiles
          .filter(f => f.path.split('/').length > 2)
          .map(f => f.path.split('/')[1])
      );

      const subdirItems = Array.from(subdirs).map(subdir => ({
        path: `${dir}/${subdir}`,
        isDirectory: true,
        children: dirFiles.filter(f => f.path.startsWith(`${dir}/${subdir}/`))
      }));

      return {
        path: dir,
        isDirectory: true,
        children: [
          ...subdirItems,
          ...dirFiles.filter(f => f.path.split('/').length === 2)
        ],
        additions: dirFiles.reduce((sum, f) => sum + (f.additions || 0), 0),
        deletions: dirFiles.reduce((sum, f) => sum + (f.deletions || 0), 0)
      };
    });

    return rootItems;
  };

  const getChildFiles = (file, allFiles, depth) => {
    if (!file.isDirectory) return [];
    
    if (depth === 0) {
      // For root level directories, show both subdirectories and files
      const prefix = file.path;
      return file.children.filter(f => {
        const parts = f.path.split('/');
        return parts.length === 2; // Direct children only
      });
    }

    // For nested directories
    const prefix = file.path;
    return allFiles.filter(f => {
      const parts = f.path.split('/');
      const parentPath = parts.slice(0, depth + 1).join('/');
      return f.path.startsWith(prefix) && parentPath === prefix;
    });
  };

  const FileTreeItem = ({
    file,
    depth = 0,
    selectedFile,
    onSelectFile,
    allFiles,
  }) => {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(true);
    const parts = file.path.split('/');
    const fileName = parts[depth];
    const isDirectory = file.isDirectory || parts.length > depth + 1;

    const handleClick = () => {
      if (isDirectory) {
        setExpanded(!expanded);
      } else {
        onSelectFile(file.path);
      }
    };

    const childFiles = getChildFiles(file, allFiles, depth);

    return (
      <>
        <div
          className={`${classes.fileItem} ${
            !isDirectory && file.path === selectedFile ? classes.selectedFile : ''
          }`}
          onClick={handleClick}
          style={{paddingLeft: `${depth * 16}px`}}>
          {isDirectory ? (
            <Box display='flex' alignItems='center'>
              <ChevronRightIcon
                className={`${classes.chevron} ${
                  expanded ? classes.chevronExpanded : ''
                }`}
              />
              <FolderIcon className={classes.folderIcon} />
            </Box>
          ) : (
            <FileIcon className={classes.fileIcon} />
          )}
          <Typography className={classes.fileName}>{fileName}</Typography>
          {!isDirectory && (
            <div className={classes.fileStats}>
              <Chip
                size='small'
                label={`+${file.additions || 0}`}
                className={classes.statChip}
                style={{backgroundColor: '#e6ffec', color: '#2cbe4e'}}
              />
              <Chip
                size='small'
                label={`-${file.deletions || 0}`}
                className={classes.statChip}
                style={{backgroundColor: '#ffebe9', color: '#cf222e'}}
              />
            </div>
          )}
        </div>
        {isDirectory && expanded && childFiles.length > 0 && (
          <div className={classes.nestedFiles}>
            {childFiles.map((childFile, index) => (
              <FileTreeItem
                key={`${childFile.path}-${index}`}
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
        {organizeFiles(filteredFiles()).map((file, index) => (
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
          <div className={classes.lineNumber}>
            <span></span>
            <span></span>
          </div>
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
        <div className={classes.lineNumber}>
          <span>{line.oldLineNumber || ' '}</span>
          <span>{line.newLineNumber || ' '}</span>
        </div>
        <div className={`${classes.lineContent} ${line.type === 'context' ? classes.contextLine : ''}`}>
          <span className={classes.codeMark}>
            {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
          </span>
          <pre>{line.content}</pre>
        </div>
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
