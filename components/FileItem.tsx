import React, { useState, useContext, useRef, useEffect } from 'react';
import { FileItem, FileType } from '../types';
import { FolderIcon } from './icons/FolderIcon';
import { FileIcon } from './icons/FileIcon';
import { LanguageContext } from '../contexts/LanguageContext';

interface FileItemRowProps {
  file: FileItem;
  isSelected: boolean;
  onSelect?: React.Dispatch<React.SetStateAction<Set<string>>>;
  onAiRename?: (fileId: string) => void;
  onManualRename?: (fileId: string, newName: string) => void;
  onDelete?: (fileIds: string[]) => void;
  isSelectable: boolean;
  onFolderClick: (file: FileItem) => void;
  isDraggable: boolean;
  onDragStart: (e: React.DragEvent, file: FileItem) => void;
  onContextMenu: (e: React.MouseEvent, fileId: string) => void;
  renamingFileId: string | null;
  onRenameEnd: () => void;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const FileItemRow: React.FC<FileItemRowProps> = (props) => {
  const { file, isSelected, onSelect, onAiRename, isSelectable, onFolderClick, isDraggable, onDragStart, onContextMenu, onManualRename, renamingFileId, onRenameEnd } = props;
  
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(file.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renamingFileId === file.id) {
      setIsRenaming(true);
    }
  }, [renamingFileId, file.id]);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
    }
  }, [isRenaming]);
  
  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelect) {
         onSelect(
            (prev) => {
                const newSet = new Set(prev);
                if (e.target.checked) {
                    newSet.add(file.id);
                } else {
                    newSet.delete(file.id);
                }
                return newSet;
            }
         );
    }
  };

  const handleAiRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAiRename) onAiRename(file.id);
  }

  const handleRowClick = (e: React.MouseEvent) => {
    // Prevent folder navigation when clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('input') || target.closest('button')) {
      return;
    }
    if (file.type === FileType.Folder) {
      onFolderClick(file);
    }
  }
  
  const handleRenameSubmit = () => {
    if (isRenaming) {
        if (onManualRename && renameValue.trim() && renameValue !== file.name) {
            onManualRename(file.id, renameValue.trim());
        }
        setIsRenaming(false);
        onRenameEnd();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRenameSubmit();
    if (e.key === 'Escape') {
        setRenameValue(file.name);
        setIsRenaming(false);
        onRenameEnd();
    }
  };


  return (
    <tr 
      className={`bg-white border-b hover:bg-gray-50 transition-colors duration-150 ${isSelected ? 'bg-blue-50' : ''} ${file.type === FileType.Folder ? 'cursor-pointer' : ''} ${isDraggable ? 'cursor-grab' : ''}`}
      onClick={handleRowClick}
      draggable={isDraggable}
      onDragStart={(e) => onDragStart(e, file)}
      onContextMenu={(e) => onContextMenu(e, file.id)}
    >
      <td className="w-4 p-4">
        {isSelectable && (
            <input
              type="checkbox"
              className="w-4 h-4 text-brand-primary bg-gray-100 border-gray-300 rounded focus:ring-brand-primary"
              checked={isSelected}
              onChange={handleSelect}
            />
        )}
      </td>
      <th scope="row" className={`px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center`}>
        {file.type === FileType.Folder ? <FolderIcon className="w-5 h-5 mr-3 text-yellow-500 flex-shrink-0" /> : <FileIcon className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" />}
        {isRenaming ? (
            <input
                ref={inputRef}
                type="text"
                value={renameValue}
                onChange={e => setRenameValue(e.target.value)}
                onBlur={handleRenameSubmit}
                onKeyDown={handleKeyDown}
                className="text-sm p-1 border border-brand-primary rounded-md"
                onClick={e => e.stopPropagation()}
            />
        ) : (
             <span className="truncate">{file.name}</span>
        )}
         {onAiRename && isSelectable && file.type === FileType.File && !isRenaming && (
          <button onClick={handleAiRenameClick} className="ml-2 p-1 rounded-full hover:bg-gray-200" title="AI Rename">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l.707-.707m2.828 9.9a5 5 0 117.072 0l-.707.707M6.343 7.657l-.707.707m12.728 0l.707-.707" /></svg>
          </button>
        )}
      </th>
      <td className="px-6 py-4 hidden md:table-cell">{file.modified.toLocaleDateString()}</td>
      <td className="px-6 py-4 hidden sm:table-cell">{file.type === FileType.File ? formatBytes(file.size) : '--'}</td>
    </tr>
  );
};

export default FileItemRow;