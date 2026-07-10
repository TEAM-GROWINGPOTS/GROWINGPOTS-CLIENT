'use client';

import { Button } from '@shared/components/button/button';
import { cn } from '@shared/utils/cn';

import { FolderItemMenu } from '../folder-item-menu/folder-item-menu';

const MAX_FOLDERS = 5;

interface Folder {
  id: string;
  name: string;
}

interface FolderListProps {
  folders: Folder[];
  selectedFolderId?: string;
  onSelectFolder?: (id: string) => void;
  onAddFolder: () => void;
  onRenameFolder: (id: string) => void;
  onDeleteFolder: (id: string) => void;
  className?: string;
}

export const FolderList = ({
  folders,
  selectedFolderId,
  onSelectFolder,
  onAddFolder,
  onRenameFolder,
  onDeleteFolder,
  className,
}: FolderListProps) => {
  return (
    <div className={cn('flex w-160 flex-col rounded-[6px] border border-gray-200 bg-white p-8', className)}>
      {folders.map(({ id, name }) => (
        <FolderItem
          key={id}
          id={id}
          name={name}
          isSelected={id === selectedFolderId}
          onSelect={onSelectFolder ? () => onSelectFolder(id) : undefined}
          onRename={() => onRenameFolder(id)}
          onDelete={() => onDeleteFolder(id)}
        />
      ))}
      <Button
        label="추가"
        size="sm"
        mode="primary_solid"
        disabled={folders.length >= MAX_FOLDERS}
        onClick={onAddFolder}
        className="mt-4 w-full justify-center"
      />
    </div>
  );
};

interface FolderItemProps {
  id: string;
  name: string;
  isSelected: boolean;
  onSelect?: () => void;
  onRename: () => void;
  onDelete: () => void;
}

const FolderItem = ({ name, isSelected, onSelect, onRename, onDelete }: FolderItemProps) => {
  return (
    <div
      className={cn(
        'group relative flex w-full items-center justify-between rounded-[6px] border border-white bg-white px-12 py-8 hover:bg-gray-50',
        isSelected && 'border-gray-50 bg-gray-50',
      )}
    >
      {onSelect ? (
        <button
          type="button"
          onClick={onSelect}
          className="text-body-m-14 min-w-0 flex-1 cursor-pointer truncate text-left text-gray-700"
          title={name}
        >
          {name}
        </button>
      ) : (
        <span title={name} className="text-body-m-14 min-w-0 flex-1 cursor-default truncate text-gray-700">
          {name}
        </span>
      )}
      <FolderItemMenu onRename={onRename} onDelete={onDelete} />
    </div>
  );
};
