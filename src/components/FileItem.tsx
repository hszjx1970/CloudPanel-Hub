import React, { useState, useRef, useEffect } from 'react';
import { FileItem, FileType } from '../types';
import { FolderIcon } from './icons/FolderIcon';
import { FileIcon } from './icons/FileIcon';

interface FileItemRowProps {
  file: FileItem;
  isSelected: boolean;
  onSelect?: React.Dispatch<React.SetStateAction<Set<string>>>;
  onManualRename?: (fileId: string, newName: string) => void;
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
  const { file, isSelected, onSelect, isSelectable, onFolderClick, isDraggable, onDragStart, onContextMenu, onManualRename, renamingFileId, onRenameEnd } = props;
  
  const [renameValue, setRenameValue] = useState(file.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const isRenaming = renamingFileId === file.id;

  useEffect(() => {
    if (isRenaming) {
      setRenameValue(file.name);
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isRenaming, file.name]);
  
  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelect) return;
    onSelect(prev => {
      const newSet = new Set(prev);
      e.target.checked ? newSet.add(file.id) : newSet.delete(file.id);
      return newSet;
    });
  };

  const handleDoubleClick = () => {
    if (file.type === FileType.Folder) onFolderClick(file);
  };
  
  const handleRenameSubmit = () => {
    if (isRenaming && onManualRename && renameValue.trim() && renameValue !== file.name) {
      onManualRename(file.id, renameValue.trim());
    }
    onRenameEnd();
  };

  return (
    <tr className={`bg-white border-b hover:bg-gray-50 transition-colors duration-150 ${isSelected ? 'bg-blue-50' : ''} ${isDraggable ? 'cursor-grab' : ''}`} onDoubleClick={handleDoubleClick} draggable={isDraggable} onDragStart={(e) => onDragStart(e, file)} onContextMenu={(e) => onContextMenu(e, file.id)}>
      <td className="w-4 p-4">
        {isSelectable && <input type="checkbox" className="w-4 h-4 text-brand-primary bg-gray-100 border-gray-300 rounded focus:ring-brand-primary" checked={isSelected} onChange={handleSelect} onClick={e => e.stopPropagation()} />}
      </td>
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center">
        {file.type === FileType.Folder ? <FolderIcon className="w-5 h-5 mr-3 text-yellow-500 flex-shrink-0" /> : <FileIcon className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" />}
        {isRenaming ? (
          <input ref={inputRef} type="text" value={renameValue} onChange={e => setRenameValue(e.target.value)} onBlur={handleRenameSubmit} onKeyDown={e => e.key === 'Enter' ? handleRenameSubmit() : e.key === 'Escape' && onRenameEnd()} className="text-sm p-1 border border-brand-primary rounded-md" onClick={e => e.stopPropagation()} />
        ) : (
          <span className="truncate">{file.name}</span>
        )}
      </th>
      <td className="px-6 py-4 hidden md:table-cell">{file.modified.toLocaleDateString()}</td>
      <td className="px-6 py-4 hidden sm:table-cell">{file.type === FileType.File ? formatBytes(file.size) : '--'}</td>
    </tr>
  );
};

export default FileItemRow;
