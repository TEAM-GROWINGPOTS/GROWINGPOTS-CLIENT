'use client';

import { Button } from '@shared/components/button/button';
import { Modal } from '@shared/components/modal/modal';
import { TextField } from '@shared/components/text-field/text-field';
import { useState } from 'react';

const NAME_MAX_LENGTH = 10;

interface FolderRenameFormProps {
  initialName: string;
  onSave: (name: string) => void;
}

const FolderRenameForm = ({ initialName, onSave }: FolderRenameFormProps) => {
  const [folderName, setFolderName] = useState(initialName);

  return (
    <>
      <TextField
        value={folderName}
        onChange={setFolderName}
        maxLength={NAME_MAX_LENGTH}
        placeholder="폴더 이름을 입력해 주세요"
        className="mt-32"
      />
      <Modal.Footer className="mt-60">
        <Button
          label="저장하기"
          mode="primary_solid"
          size="lg"
          disabled={folderName.trim() === ''}
          onClick={() => onSave(folderName.trim())}
          className="w-full justify-center"
        />
      </Modal.Footer>
    </>
  );
};

interface FolderRenameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName: string;
  onSave: (name: string) => void;
}

export const FolderRenameModal = ({ open, onOpenChange, initialName, onSave }: FolderRenameModalProps) => {
  const handleSave = (name: string) => {
    onSave(name);
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content className="w-480">
        <Modal.Header title="이름 편집" className="text-title-sb-24 text-gray-900" />
        <FolderRenameForm initialName={initialName} onSave={handleSave} />
      </Modal.Content>
    </Modal>
  );
};
